import { createServerFn } from '@tanstack/react-start'  
import { streamText, generateText } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { createXai } from '@ai-sdk/xai'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  messages?: Message[]
  selectedModel?: string
  systemPrompt?: {
    enabled: boolean
    value: string
  }
  reasoningConfig?: {
    reasoningEffort?: 'low' | 'medium' | 'high'
    reasoningSummary?: 'none' | 'detailed'
  }
}

const DEFAULT_SYSTEM_PROMPT = `You are TanStack Chat, an AI assistant using Markdown for clear and structured responses. Format your responses following these guidelines:

1. Use headers for sections:
   # For main topics
   ## For subtopics
   ### For subsections

2. For lists and steps:
   - Use bullet points for unordered lists
   - Number steps when sequence matters
   
3. For code:
   - Use inline \`code\` for short snippets
   - Use triple backticks with language for blocks:
   \`\`\`python
   def example():
       return "like this"
   \`\`\`

4. For emphasis:
   - Use **bold** for important points
   - Use *italics* for emphasis
   - Use > for important quotes or callouts

5. For structured data:
   | Use | Tables |
   |-----|--------|
   | When | Needed |

6. Break up long responses with:
   - Clear section headers
   - Appropriate spacing between sections
   - Bullet points for better readability
   - Short, focused paragraphs

7. For technical content:
   - Always specify language for code blocks
   - Use inline \`code\` for technical terms
   - Include example usage where helpful

Keep responses concise and well-structured. Use appropriate Markdown formatting to enhance readability and understanding.`;

// TanStack Start server function for chat - WITH streaming
export const chatAPI = createServerFn({ 
  method: 'POST',
  response: 'raw'
})
  .validator<ChatRequest>((d) => {
    console.log('Validator received:', JSON.stringify(d, null, 2));
    return d;
  })
  .handler(async ({ data }) => {
    try {
      console.log('Handler received data:', JSON.stringify(data, null, 2));
      console.log('Data type:', typeof data);
      console.log('Data keys:', data ? Object.keys(data) : 'null');

      const requestData = data as ChatRequest;

      // Ensure we always have valid data with proper defaults
      const messages = Array.isArray(requestData?.messages) ? requestData.messages : [];
      const selectedModel = requestData?.selectedModel || 'claude-sonnet-4-20250514';
      const systemPrompt = requestData?.systemPrompt;
      const reasoningConfig = requestData?.reasoningConfig;

      console.log('Processed data:', { messages, selectedModel, systemPrompt, reasoningConfig });

      // Validate messages array - ensure each message has required properties
      const validMessages = messages?.filter ? messages.filter(msg => 
        msg && 
        typeof msg === 'object' && 
        typeof msg.role === 'string' && 
        typeof msg.content === 'string'
      ) : [];

      console.log('Valid messages:', validMessages);

      const systemPromptText = systemPrompt?.enabled 
        ? `${DEFAULT_SYSTEM_PROMPT}\n\n${systemPrompt.value}`
        : DEFAULT_SYSTEM_PROMPT;

      // Ensure we have a valid array before converting
      const safeMessages = Array.isArray(validMessages) ? validMessages : [];
      console.log('Safe messages before conversion:', safeMessages);

      // Convert messages to model format - extra safety check
      if (!Array.isArray(safeMessages)) {
        throw new Error('Messages must be an array');
      }

      // Additional validation - ensure messages have proper structure for AI SDK
      const structuredMessages = safeMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      console.log('Structured messages for AI SDK:', structuredMessages);

      // AI SDK v5 now automatically converts messages, so we can pass them directly
      // const modelMessages = convertToModelMessages(structuredMessages);
      const modelMessages = structuredMessages;

    // Create provider instances
    console.log('Creating providers...');
    const xaiApiKey = import.meta.env.VITE_XAI_API_KEY;
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

    console.log('API Keys present:', {
      xai: !!xaiApiKey,
      openai: !!openaiApiKey,
      anthropic: !!anthropicApiKey
    });

    const xaiProvider = createXai({
      apiKey: xaiApiKey || ''
    });

    const openaiProvider = createOpenAI({
      apiKey: openaiApiKey || ''
    });

    const anthropicProvider = createAnthropic({
      apiKey: anthropicApiKey || ''
    });

    // Route to appropriate provider
    let result;
    
    if (selectedModel.startsWith('grok-')) {
      // XAI Grok models - only grok-3-mini supports reasoning effort
      console.log('Using XAI provider for model:', selectedModel);
      
      if (!xaiApiKey) {
        throw new Error('XAI API key is not configured');
      }

      const streamOptions = {
        model: xaiProvider(selectedModel),
        experimental_telemetry: {
          isEnabled: true,
          functionId: "chat-tool-calling"
        },
        system: systemPromptText,
        messages: modelMessages,
        maxTokens: 4096,
      };

      // Only add reasoning effort for grok-3-mini (grok-4 doesn't support it)
      if (selectedModel === 'grok-3-mini' && reasoningConfig?.reasoningEffort) {
        // XAI only supports 'low' and 'high', map 'medium' to 'high'
        const validEffort = reasoningConfig.reasoningEffort === 'medium' ? 'high' : reasoningConfig.reasoningEffort;
        console.log('Adding reasoning effort for grok-3-mini:', validEffort);
        
        if (validEffort === 'low' || validEffort === 'high') {
          streamOptions.providerOptions = {
            xai: {
              reasoningEffort: validEffort
            }
          };
        } else {
          console.log('Invalid reasoning effort value:', validEffort, 'skipping provider options');
        }
      }

      console.log('Stream options:', JSON.stringify(streamOptions, null, 2));
      console.log('About to call streamText...');
      
      result = await streamText(streamOptions);
      console.log('streamText completed successfully');

    } else if (selectedModel.startsWith('o1-') || selectedModel === 'o3-mini') {
      // OpenAI models with reasoning support
      result = await streamText({
        model: openaiProvider(selectedModel),
        experimental_telemetry: {
          isEnabled: true,
          functionId: "chat-tool-calling"
        },
        system: systemPromptText,
        messages: modelMessages,
        ...(reasoningConfig && {
          experimental_providerMetadata: {
            ...(reasoningConfig.reasoningEffort && {
              reasoning_effort: reasoningConfig.reasoningEffort
            }),
            ...(reasoningConfig.reasoningSummary && reasoningConfig.reasoningSummary !== 'none' && {
              include_reasoning: reasoningConfig.reasoningSummary === 'detailed'
            })
          }
        })
      });

    } else {
      // Anthropic Claude models (default) - use Claude Sonnet 4 only
      result = await streamText({
        model: anthropicProvider(selectedModel),
        experimental_telemetry: {
          isEnabled: true,
          functionId: "chat-tool-calling"
        },
        system: systemPromptText,
        messages: modelMessages,
      });
    }

    console.log('Converting result to UI stream response...');
    const response = result.toUIMessageStreamResponse();
    console.log('Response created successfully');
    return response;
    } catch (error) {
      console.error('Chat API error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      throw error;
    }
  })

// AI-powered chat title generation using tool calls with AI SDK v5
export const generateChatTitle = createServerFn({ method: 'POST' })
    .validator((d: { 
        conversation?: { userMessage: string; assistantResponse?: string },
        selectedModel?: string
    }) => d)
    .handler(async ({ data }) => {
        try {
            const selectedModel = data.selectedModel || 'claude-sonnet-4-20250514';
            const conversation = data.conversation;
            
            // Validate input
            if (!conversation?.userMessage?.trim()) {
                return { title: 'New Chat' };
            }

            // Create provider instances
            const xaiProvider = createXai({
                apiKey: import.meta.env.VITE_XAI_API_KEY || ''
            });

            const openaiProvider = createOpenAI({
                apiKey: import.meta.env.VITE_OPENAI_API_KEY || ''
            });

            const anthropicProvider = createAnthropic({
                apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || ''
            });

            // Define the title generation tool
            const generateTitleTool = {
                name: 'generate_chat_title',
                description: 'Generate a concise, descriptive title for a chat conversation',
                parameters: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            description: 'A short, descriptive title (3-6 words) that captures the main topic or purpose of the conversation'
                        }
                    },
                    required: ['title']
                }
            };

            // Create messages for the conversation
            const messages = [
                {
                    role: 'user',
                    content: conversation.userMessage
                }
            ];

            if (conversation.assistantResponse) {
                messages.push({
                    role: 'assistant', 
                    content: conversation.assistantResponse
                });
            }

            let result;

            if (selectedModel.startsWith('grok-')) {
                // XAI Grok models with tool calling
                const generateOptions = {
                    model: xaiProvider(selectedModel),
                    messages,
                    tools: [generateTitleTool],
                    toolChoice: 'required',
                    maxTokens: 100,
                    temperature: 0.3,
                };

                result = await generateText(generateOptions);

            } else if (selectedModel.startsWith('o1-') || selectedModel === 'o3-mini') {
                // OpenAI models with tool calling
                result = await generateText({
                    model: openaiProvider(selectedModel),
                    messages,
                    tools: [generateTitleTool],
                    toolChoice: 'required',
                    maxTokens: 100,
                    temperature: 0.3,
                });

            } else {
                // Anthropic Claude models with tool calling
                result = await generateText({
                    model: anthropicProvider(selectedModel),
                    messages,
                    tools: [generateTitleTool],
                    toolChoice: 'required',
                    maxTokens: 100,
                    temperature: 0.3,
                });
            }

            // Extract title from tool call result
            const toolCall = result.toolCalls?.[0];
            if (toolCall?.args?.title) {
                return { title: toolCall.args.title };
            }

            // Fallback if tool call didn't work
            throw new Error('No tool call result');
            
        } catch (error) {
            console.error('Error generating chat title via tool calls:', error);
            // Fallback to first few words if AI generation fails
            const userMessage = data.conversation?.userMessage || '';
            const words = userMessage.trim().split(' ');
            const fallbackTitle = words.slice(0, 4).join(' ');
            return { title: fallbackTitle.length > 2 ? fallbackTitle : 'New Chat' };
        }
    });