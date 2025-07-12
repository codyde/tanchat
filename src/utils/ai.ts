import { createServerFn } from '@tanstack/react-start'  
import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

import * as Sentry from '@sentry/react'
import * as SentryServer from '@sentry/node'
import type { AIProvider } from '../store/store'

// Updated Message interface for AI SDK v5
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

// Convert our Message format to AI SDK ModelMessage format
const convertToModelMessage = (message: Message) => ({
  role: message.role,
  content: message.content
})

// Provider and model detection
const getProviderFromModel = (modelId: string): AIProvider => {
  if (modelId.startsWith('o3') || modelId.includes('gpt')) {
    return 'openai'
  }
  return 'anthropic'
}

const getModelInstance = (modelId: string, provider: AIProvider) => {
  switch (provider) {
    case 'openai':
      return openai(modelId)
    case 'anthropic':
    default:
      return anthropic(modelId)
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
   |-----|---------|
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

// AI SDK v5 streaming implementation with multi-provider support
export const genAIResponse = createServerFn({ method: 'GET', response: 'raw' })
    .validator((d: { 
        messages: Message[], 
        systemPrompt?: { value: string, enabled: boolean },
        model?: string,
        provider?: AIProvider
    }) => d)
    .handler(async ({ data }) => {
        console.log('AI Request Data:', data)
        return await SentryServer.startSpan(
            { 
                name: "AI Response Generation",
                op: "ai.generate"
            },
            async () => {
                // Filter out error messages and empty messages
                const filteredMessages = data.messages
                    .filter(msg => msg.content.trim() !== '' && !msg.content.startsWith('Sorry, I encountered an error'))

                if (filteredMessages.length === 0) {
                    return new Response(JSON.stringify({ error: 'No valid messages to send' }), {
                        headers: { 'Content-Type': 'application/json' },
                        status: 400
                    });
                }

                // Convert to AI SDK v5 ModelMessage format
                const modelMessages = filteredMessages.map(convertToModelMessage)

                const systemPrompt = data.systemPrompt?.enabled 
                    ? `${DEFAULT_SYSTEM_PROMPT}\n\n${data.systemPrompt.value}`
                    : DEFAULT_SYSTEM_PROMPT;

                // Determine provider and model
                const modelId = data.model || "claude-4-sonnet-20250514"
                const provider = data.provider || getProviderFromModel(modelId)
                const modelInstance = getModelInstance(modelId, provider)

                console.log('AI Configuration:', {
                    modelId,
                    provider,
                    hasCustomPrompt: data.systemPrompt?.enabled,
                    messageCount: modelMessages.length
                });

                try {
                    console.log('Making streamText request for model:', modelId)
                    
                    // AI SDK v5 streamText with multi-provider support
                    const result = await streamText({
                        model: modelInstance,
                        system: systemPrompt,
                        messages: modelMessages,
                        maxOutputTokens: 4096, // AI SDK v5 parameter
                        temperature: 0.7
                    });

                    console.log('StreamText result obtained:', {
                        hasResult: !!result,
                        modelId: modelId,
                        resultType: typeof result,
                        availableMethods: Object.getOwnPropertyNames(result).filter(name => typeof result[name] === 'function'),
                        resultKeys: Object.keys(result),
                        hasSymbolAsyncIterator: !!result[Symbol.asyncIterator],
                        baseStreamType: typeof result.baseStream,
                        outputType: typeof result.output
                    })

                    // Handle AI SDK v5 canary streaming with promises
                    let response
                    
                    if (typeof result.toDataStreamResponse === 'function') {
                        response = result.toDataStreamResponse()
                    } else {
                        // AI SDK v5 canary.24 - use promises approach
                        console.log('Using AI SDK v5 canary promises approach')
                        const stream = new ReadableStream({
                            async start(controller) {
                                try {
                                    // Wait for the AI response to complete
                                    const output = await result.output
                                    
                                    if (typeof output === 'string' && output.length > 0) {
                                        // Send complete response as single chunk
                                        controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(output)}\n`))
                                    } else {
                                        // No output, send generic error
                                        controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify("Sorry, I encountered an error processing your request.")}\n`))
                                    }
                                    
                                    controller.close()
                                } catch (error) {
                                    console.error('Stream creation error:', error)
                                    // Send error message to client
                                    controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify("Sorry, I encountered an error processing your request.")}\n`))
                                    controller.close()
                                }
                            }
                        })
                        
                        response = new Response(stream, {
                            headers: {
                                'Content-Type': 'text/plain; charset=utf-8',
                                'x-vercel-ai-data-stream': 'v1',
                                'Cache-Control': 'no-cache'
                            }
                        })
                    }

                    console.log('DataStream response created:', {
                        status: response.status,
                        statusText: response.statusText,
                        headers: Object.fromEntries(response.headers.entries()),
                        hasBody: !!response.body
                    })

                    return response
                } catch (error) {
                    console.error('Error in genAIResponse:', error);
                    console.error('Error details:', {
                        name: error?.constructor?.name,
                        message: error?.message,
                        status: error?.status,
                        code: error?.code,
                        modelId: modelId,
                        provider: provider
                    });
                    
                    Sentry.captureException(error);
                    
                    const errorMessage = error instanceof Error 
                        ? (error.message.includes('rate limit') 
                            ? 'Rate limit exceeded. Please try again in a moment.'
                            : error.message.includes('API key')
                            ? 'API key configuration error. Please check your environment variables.'
                            : error.message.includes('access') || error.message.includes('tier')
                            ? `Access denied to model ${modelId}. This may require higher API tier access.`
                            : error.message.includes('not found') || error.message.includes('404')
                            ? `Model ${modelId} not found. Please verify the model ID is correct.`
                            : error.message)
                        : 'Failed to get AI response';
                        
                    return new Response(JSON.stringify({ error: errorMessage }), {
                        headers: { 'Content-Type': 'application/json' },
                        status: 500
                    });
                }
            }
        );
    });
