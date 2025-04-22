import { createServerFn } from '@tanstack/react-start'  
import { Anthropic } from '@anthropic-ai/sdk'

import * as Sentry from '@sentry/react'
import * as SentryServer from '@sentry/node'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
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

// Non-streaming implementation
export const genAIResponse = createServerFn({ method: 'GET', response: 'raw' })
    .validator((d: { 
        messages: Message[], 
        systemPrompt?: { value: string, enabled: boolean },
        model?: string
    }) => d)
    .handler(async ({ data }) => {
      console.log(data)
        return await SentryServer.startSpan(
            { 
                name: "AI Response Generation",
                op: "ai.generate"
            },
            async () => {
                const anthropic = new Anthropic({
                    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
                });

                // Filter out error messages and empty messages
                const formattedMessages = data.messages
                    .filter(msg => msg.content.trim() !== '' && !msg.content.startsWith('Sorry, I encountered an error'))
                    .map(msg => ({
                        role: msg.role,
                        content: msg.content.trim()
                    }));

                if (formattedMessages.length === 0) {
                    return new Response(JSON.stringify({ error: 'No valid messages to send' }), {
                        headers: { 'Content-Type': 'application/json' },
                        status: 400
                    });
                }

                const systemPrompt = data.systemPrompt?.enabled 
                    ? `${DEFAULT_SYSTEM_PROMPT}\n\n${data.systemPrompt.value}`
                    : DEFAULT_SYSTEM_PROMPT;

                // Debug log to verify prompt layering
                console.log('System Prompt Configuration:', {
                    hasCustomPrompt: data.systemPrompt?.enabled,
                    customPromptValue: data.systemPrompt?.value,
                    finalPrompt: systemPrompt
                });

                try {
                    const response = await anthropic.messages.stream({
                        model: data.model || "claude-3-7-sonnet-20250219",
                        max_tokens: 4096,
                        system: systemPrompt,
                        messages: formattedMessages,
                    });

                    return new Response(response.toReadableStream())
                } catch (error) {
                    console.error('Error in genAIResponse:', error);
                    Sentry.captureException(error);
                    
                    const errorMessage = error instanceof Error 
                        ? (error.message.includes('rate limit') 
                            ? 'Rate limit exceeded. Please try again in a moment.'
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
