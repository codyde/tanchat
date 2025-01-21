import Anthropic from '@anthropic-ai/sdk'
import { createServerFn } from '@tanstack/start'
import * as Sentry from '@sentry/react'

export interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
}

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export const genAIResponse = createServerFn({ method: 'GET' })
    .validator((d: { messages: Message[] }) => d)
    .handler(async ({ data }) => {
        const formattedMessages = data.messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        const response = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 8192,
            system: `You are TanChat, an AI assistant using Markdown for clear and structured responses. Format your responses following these guidelines:

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

Keep responses concise and well-structured. Use appropriate Markdown formatting to enhance readability and understanding.`,
            messages: formattedMessages,
        });

        const content = response.content[0];
        if (content.type === 'text') {
            Sentry.getCurrentScope().addAttachment({
                filename: "llm_response.txt",
                data: content.text,
            });
            return { text: content.text };
        }
        return { text: 'Error: Unexpected response type' };
    }); 