import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, useRef } from 'react'
import { PlusCircle, MessageCircle, ChevronLeft, ChevronRight, Trash2, X, Menu, Send, Settings, User, LogOut, Edit2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import { SettingsDialog } from '../components/SettingsDialog'
import { CodeBlock } from '../components/CodeBlock'
import { ModelSelector } from '../components/ModelSelector'
import { ReasoningConfig } from '../components/ReasoningConfig'
import { useAppState } from '../store/hooks'
import { store } from '../store/store'
import { generateChatTitle, chatAPI, type Message } from '../utils/ai'

// Elegant collapsed reasoning component like modern chat UIs
function CollapsedReasoning({ 
  messageId, 
  content, 
  isExpanded, 
  onToggle 
}: { 
  messageId: string
  content: string
  isExpanded: boolean
  onToggle: (messageId: string) => void
}) {
  if (!content.trim()) return null;

  return (
    <div className="max-w-3xl mx-auto w-full px-4">
      <div className="ml-12 mt-2">
        <button
          onClick={() => onToggle(messageId)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-xs group"
        >
          <span className="text-xs">💭</span>
          <span className="group-hover:underline">
            {isExpanded ? 'Hide reasoning' : 'View reasoning'}
          </span>
          <span className="transform transition-transform duration-200 text-[10px]">
            {isExpanded ? '▼' : '▶'}
          </span>
        </button>
        
        {isExpanded && (
          <div className="mt-3 bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
            <div className="px-3 py-2 bg-gray-700/30 border-b border-gray-600/30">
              <span className="text-gray-400 text-xs font-medium">Reasoning</span>
            </div>
            <div className="p-3">
              <div className="text-gray-300 text-sm">
                <ReactMarkdown
                  className="prose dark:prose-invert max-w-none prose-sm"
                  rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                  components={{
                    pre: ({ children, ...props }) => {
                      const child = children as React.ReactElement
                      if (child?.type === 'code') {
                        return (
                          <CodeBlock className={child.props.className}>
                            {child.props.children}
                          </CodeBlock>
                        )
                      }
                      return <pre {...props}>{children}</pre>
                    }
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Subtle thinking indicator component
function ThinkingIndicator() {
  return (
    <div className="py-6 bg-gradient-to-r from-orange-500/5 to-red-600/5">
      <div className="flex items-start gap-4 max-w-3xl mx-auto w-full px-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 mt-2 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
          AI
        </div>
        <div className="flex-1 min-w-0 pt-2">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="text-sm">thinking</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-gray-400 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 rounded-full bg-gray-400 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '200ms' }}></div>
              <div className="w-1 h-1 rounded-full bg-gray-400 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Home() {
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    addConversation,
    deleteConversation,
    updateConversationTitle,
    getCurrentConversation,
    getActivePrompt,
    getSelectedModel,
    getReasoningConfig
  } = useAppState()

  // Local state
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Simple manual chat implementation - no useChat hook
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isReasoning, setIsReasoning] = useState(false)
  const [reasoningContent, setReasoningContent] = useState('')
  const [completedReasoningByMessage, setCompletedReasoningByMessage] = useState<Record<string, string>>({})
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({})

  const toggleReasoning = (messageId: string) => {
    setExpandedReasoning(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Handle auto-resize
    const target = e.target
    target.style.height = 'auto'
    target.style.height = Math.min(target.scrollHeight, 200) + 'px'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    }

    setMessages(prev => [...(Array.isArray(prev) ? prev : []), userMessage])
    setInput('')
    setIsLoading(true)
    setIsReasoning(false)
    setReasoningContent('')

    try {
      const currentMessages = Array.isArray(messages) ? messages : [];
      console.log('About to call chatAPI...');
      const requestData = {
        messages: [...currentMessages, userMessage],
        selectedModel: getSelectedModel(store.state),
        systemPrompt: getActivePrompt(store.state) ? {
          value: getActivePrompt(store.state)?.content,
          enabled: true
        } : undefined,
        reasoningConfig: getReasoningConfig(store.state)
      };
      
      console.log('Request data:', requestData);
      // TanStack Start server functions require data to be wrapped in { data: ... }
      const response = await chatAPI({ data: requestData })

      console.log('chatAPI response:', response);
      console.log('Response type:', typeof response);
      console.log('Response has body:', !!response?.body);

      // Handle the streaming response
      if (response?.body && !response.bodyUsed) {
        console.log('Starting to read stream...');
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        
        let assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: ''
        }

        // Add assistant message once at the start
        setMessages(prev => [...(Array.isArray(prev) ? prev : []), assistantMessage])

        // Throttle reasoning updates to reduce spam
        let currentReasoningContent = '';
        let lastReasoningUpdate = 0;
        const REASONING_THROTTLE_MS = 200; // Update reasoning at most every 200ms

        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              console.log('Stream reading completed');
              break;
            }

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n').filter(line => line.trim())

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const jsonStr = line.slice(6) // Remove "data: " prefix
                  if (jsonStr === '[DONE]') {
                    console.log('Stream completed');
                    break;
                  }
                  const data = JSON.parse(jsonStr)
                  
                  if (data.type === 'reasoning-delta' && data.delta) {
                    // Accumulate reasoning content and show reasoning display
                    currentReasoningContent += data.delta;
                    setIsReasoning(true);
                    
                    // Throttle UI updates for reasoning
                    const now = Date.now();
                    if (now - lastReasoningUpdate > REASONING_THROTTLE_MS) {
                      setReasoningContent(currentReasoningContent.trim());
                      lastReasoningUpdate = now;
                    }
                  } else if (data.type === 'text-start') {
                    // Save reasoning content and hide active reasoning when actual text starts
                    if (currentReasoningContent.trim()) {
                      setCompletedReasoningByMessage(prev => ({
                        ...prev,
                        [assistantMessage.id]: currentReasoningContent.trim()
                      }));
                    }
                    setIsReasoning(false);
                    setReasoningContent('');
                    assistantMessage.content = ''
                    setMessages(prev => 
                      (Array.isArray(prev) ? prev : []).map(msg => 
                        msg.id === assistantMessage.id 
                          ? { ...msg, content: assistantMessage.content }
                          : msg
                      )
                    )
                  } else if (data.type === 'text-delta' && data.delta) {
                    // Append actual response text
                    assistantMessage.content += data.delta
                    setMessages(prev => 
                      (Array.isArray(prev) ? prev : []).map(msg => 
                        msg.id === assistantMessage.id 
                          ? { ...msg, content: assistantMessage.content }
                          : msg
                      )
                    )
                  }
                } catch (e) {
                  console.log('Parse error:', e);
                }
              }
            }
          }
        } catch (streamError) {
          console.error('Stream reading error:', streamError);
        }

        // After streaming completes, handle conversation storage
        if (assistantMessage.content.trim()) {
          // Create or update conversation
          const currentConversation = getCurrentConversation(store.state);
          if (!currentConversation) {
            // Create new conversation
            const newConversation = {
              id: Date.now().toString(),
              title: 'New Chat',
              messages: [...(Array.isArray(messages) ? messages : []), userMessage, assistantMessage]
            };
            
            addConversation(newConversation);
            
            // Generate title for the conversation using tool calls
            try {
              console.log('Attempting to generate title via tool calls for:', userMessage.content);
              const titleResponse = await generateChatTitle({ 
                data: {
                  conversation: {
                    userMessage: userMessage.content,
                    assistantResponse: assistantMessage.content.trim() || undefined
                  },
                  selectedModel: getSelectedModel(store.state)
                }
              });
              console.log('Tool-based title response received:', titleResponse);
              if (titleResponse?.title) {
                console.log('Setting tool-generated title to:', titleResponse.title);
                updateConversationTitle(newConversation.id, titleResponse.title);
              } else {
                console.log('No title in tool response, using fallback');
                const fallbackTitle = userMessage.content.trim().split(' ').slice(0, 4).join(' ');
                updateConversationTitle(newConversation.id, fallbackTitle || 'New Chat');
              }
            } catch (titleError) {
              console.error('Error generating title via tool calls:', titleError);
              // Fallback to first few words of user message
              const fallbackTitle = userMessage.content.trim().split(' ').slice(0, 4).join(' ');
              updateConversationTitle(newConversation.id, fallbackTitle || 'New Chat');
            }
          }
        }
      } else {
        console.error('No response body found or body already used');
        console.log('Body used:', response?.bodyUsed);
        console.log('Body exists:', !!response?.body);
      }
    } catch (error) {
      console.error('Chat error:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    } finally {
      setIsLoading(false)
      setIsReasoning(false)
      setReasoningContent('')
    }
  }

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, isReasoning, reasoningContent])

  const handleNewChat = () => {
    console.log('New Chat button clicked!')
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    }
    addConversation(newConversation)
    // Clear current messages and switch to new conversation
    setMessages([])
    setCurrentConversationId(newConversation.id)
  }

  const handleDeleteChat = (id: string) => {
    deleteConversation(id)
  }

  const handleUpdateChatTitle = (id: string, title: string) => {
    updateConversationTitle(id, title)
    setEditingChatId(null)
  }


  return (
    <div className="relative flex h-screen theme-bg-primary theme-transition">
      {/* Settings Button */}
      <div className="absolute top-5 right-5 z-50">
        <button
          onClick={() => {
            console.log('Settings button clicked!') 
            setIsSettingsOpen(true)
          }}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col w-64 theme-bg-surface theme-border border-r theme-transition">
        <div className="p-4 border-b theme-border theme-transition">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white theme-bg-accent rounded-lg hover:theme-bg-accent-hover theme-focus w-full justify-center theme-transition"
          >
            <PlusCircle className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-3 px-3 py-2 cursor-pointer hover:theme-bg-surface-hover theme-transition ${chat.id === currentConversationId ? 'theme-bg-surface-hover' : ''
                }`}
              onClick={() => setCurrentConversationId(chat.id)}
            >
              <MessageCircle className="w-4 h-4 theme-text-muted" />
              {editingChatId === chat.id ? (
                <input
                  type="text"
                  value={chat.title}
                  onChange={(e) => handleUpdateChatTitle(chat.id, e.target.value)}
                  onBlur={() => setEditingChatId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateChatTitle(chat.id, chat.title)
                    }
                  }}
                  className="flex-1 bg-transparent text-sm theme-text-primary focus:outline-none"
                  autoFocus
                />
              ) : (
                <span className="flex-1 text-sm theme-text-secondary truncate">
                  {chat.title}
                </span>
              )}
              <div className="hidden group-hover:flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingChatId(chat.id)
                  }}
                  className="p-1 theme-text-muted hover:theme-text-primary"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteChat(chat.id)
                  }}
                  className="p-1 theme-text-muted hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {messages.length > 0 ? (
          <>
            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto pb-32">
              <div className="max-w-3xl mx-auto w-full px-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`py-6 ${
                    message.role === 'assistant'
                      ? 'bg-gradient-to-r from-orange-500/5 to-red-600/5'
                      : 'bg-transparent'
                  }`}
                >
                  <div className="flex items-start gap-4 max-w-3xl mx-auto w-full">
                    {message.role === 'assistant' ? (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 mt-2 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
                        AI
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
                        Y
                      </div>
                    )}
                  <div className="flex-1 min-w-0">
                    {message.role === 'assistant' && !message.content.trim() && (isLoading || isReasoning) ? (
                      // Show thinking state within assistant message
                      <div className="pt-2">
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="text-sm">
                            {isReasoning ? 'reasoning' : 'thinking'}
                          </span>
                          <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-gray-400 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1 h-1 rounded-full bg-gray-400 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '200ms' }}></div>
                            <div className="w-1 h-1 rounded-full bg-gray-400 animate-[bounce_1.4s_infinite]" style={{ animationDelay: '400ms' }}></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ReactMarkdown
                        className="prose dark:prose-invert max-w-none"
                        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                        components={{
                          pre: ({ children, ...props }) => {
                            const child = children as React.ReactElement
                            if (child?.type === 'code') {
                              return (
                                <CodeBlock className={child.props.className}>
                                  {child.props.children}
                                </CodeBlock>
                              )
                            }
                            return <pre {...props}>{children}</pre>
                          }
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                    {message.role === 'assistant' && completedReasoningByMessage[message.id] && (
                      <div className="mt-3">
                        <button
                          onClick={() => toggleReasoning(message.id)}
                          className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-xs group"
                        >
                          <span className="text-xs">💭</span>
                          <span className="group-hover:underline">
                            {expandedReasoning[message.id] ? 'Hide reasoning' : 'View reasoning'}
                          </span>
                          <span className="transform transition-transform duration-200 text-[10px]">
                            {expandedReasoning[message.id] ? '▼' : '▶'}
                          </span>
                        </button>
                        
                        {expandedReasoning[message.id] && (
                          <div className="mt-3 bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
                            <div className="px-3 py-2 bg-gray-700/30 border-b border-gray-600/30">
                              <span className="text-gray-400 text-xs font-medium">Reasoning</span>
                            </div>
                            <div className="p-3">
                              <div className="text-gray-300 text-sm">
                                <ReactMarkdown
                                  className="prose dark:prose-invert max-w-none prose-sm"
                                  rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                                  components={{
                                    pre: ({ children, ...props }) => {
                                      const child = children as React.ReactElement
                                      if (child?.type === 'code') {
                                        return (
                                          <CodeBlock className={child.props.className}>
                                            {child.props.children}
                                          </CodeBlock>
                                        )
                                      }
                                      return <pre {...props}>{children}</pre>
                                    }
                                  }}
                                >
                                  {completedReasoningByMessage[message.id]}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              ))}
              </div>
            </div>

            {/* Input */}
            <div className="absolute bottom-0 right-0 left-64 theme-bg-primary/80 backdrop-blur-sm border-t theme-border theme-transition">
              <div className="max-w-3xl mx-auto w-full px-4 py-3">
                <div className="space-y-3">
                  {/* Chat Input Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="relative">
                      <textarea
                        value={input || ''}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit(e)
                          }
                        }}
                        placeholder="Type something clever (or don't, we won't judge)..."
                        className="w-full rounded-lg theme-border border theme-bg-surface pl-4 pr-12 py-3 text-sm theme-text-primary theme-placeholder theme-focus resize-none overflow-hidden shadow-lg theme-transition"
                        rows={1}
                        style={{ minHeight: '44px', maxHeight: '200px' }}
                      />
                      <button
                        type="submit"
                        disabled={!input?.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 disabled:opacity-50 focus:outline-none theme-text-primary"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                  
                  {/* Model Selector and Reasoning Config - Left Aligned Under Input */}
                  <div className="flex items-center gap-4">
                    <ModelSelector showAsButton={true} />
                    <ReasoningConfig />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-3xl mx-auto w-full">
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 text-transparent bg-clip-text uppercase">
                <span className="theme-text-primary">TanStack</span> Chat
              </h1>
              <p className="theme-text-muted mb-6 w-2/3 mx-auto text-lg">
                You can ask me about anything, I might or might not have a good answer, but you can still ask.
              </p>
              <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-xl space-y-4">
                  {/* Chat Input Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="relative">
                      <textarea
                        value={input || ''}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit(e)
                          }
                        }}
                        placeholder="Type something clever (or don't, we won't judge)..."
                        className="w-full rounded-lg theme-border border theme-bg-surface pl-4 pr-12 py-3 text-sm theme-text-primary theme-placeholder theme-focus resize-none overflow-hidden theme-transition"
                        rows={1}
                        style={{ minHeight: '44px', maxHeight: '200px' }}
                      />
                      <button
                        type="submit"
                        disabled={!input?.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 disabled:opacity-50 focus:outline-none theme-text-primary"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                  
                  {/* Model Selector and Reasoning Config - Left Aligned Under Input */}
                  <div className="flex items-center gap-4 justify-start">
                    <ModelSelector showAsButton={true} />
                    <ReasoningConfig />
                  </div>
                </div>
              </div>
          </div>
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home
})
