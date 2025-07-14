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
import { genAIResponse, generateChatTitle, type Message } from '../utils/ai'
import * as Sentry from '@sentry/react'

function Home() {
  const {
    conversations,
    currentConversationId,
    isLoading,
    setCurrentConversationId,
    addConversation,
    deleteConversation,
    updateConversationTitle,
    addMessage,
    setLoading,
    getCurrentConversation,
    getActivePrompt,
    getSelectedModel,
    getReasoningConfig
  } = useAppState()

  const currentConversation = getCurrentConversation(store.state)
  const messages = currentConversation?.messages || []

  // Local state
  const [input, setInput] = useState('')
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [pendingMessages, setPendingMessages] = useState<Record<string, Message>>({})

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight
    }
  }

  // Scroll to bottom when messages change, loading state changes, or pending message updates
  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading, pendingMessages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()


    if (!input.trim() || isLoading) return

    return await Sentry.startSpan(
      {
        name: "Chat Message Submission",
        op: "chat.submit"
      },
      async () => {


        const currentInput = input
        setInput('') // Clear input early for better UX
        setLoading(true)

        try {
          let conversationId = currentConversationId

          // If no current conversation, create one
          if (!conversationId) {
            conversationId = Date.now().toString()
            const newConversation = {
              id: conversationId,
              title: 'New Chat', // Will be updated with AI-generated title
              messages: []
            }
            addConversation(newConversation)
          }

          const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user' as const,
            content: currentInput.trim(),
          }

          // Add user message
          addMessage(conversationId, userMessage)

          // Get active prompt
          const activePrompt = getActivePrompt(store.state)
          let systemPrompt
          if (activePrompt) {
            systemPrompt = {
              value: activePrompt.content,
              enabled: true
            }
          }

          // Get AI response
          const selectedModel = getSelectedModel(store.state)
          const reasoningConfig = getReasoningConfig(store.state)
          const response = await genAIResponse({
            data: {
              messages: [...messages, userMessage],
              systemPrompt,
              selectedModel,
              reasoningConfig
            }
          })



          const reader = response.body?.getReader()
          if (!reader) {
            throw new Error('No reader found in response')
          }

          const decoder = new TextDecoder()
          console.log(`🔍 Client: Starting to read stream for model: ${selectedModel}`);

          let done = false
          let newMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant' as const,
            content: '',
          }
          let chunkCount = 0;
          
          while (!done) {
            const { value, done: readerDone } = await reader.read()
            done = readerDone
            chunkCount++;
            
            console.log(`🔍 Client: Chunk ${chunkCount}:`, {
              done: readerDone,
              hasValue: !!value,
              valueLength: value?.length,
              valueType: typeof value
            });
            
            if (!done && value) {
              const textChunk = decoder.decode(value, { stream: true })
              console.log(`🔍 Client: Decoded text (${textChunk.length} chars):`, textChunk.slice(0, 100) + (textChunk.length > 100 ? '...' : ''));
              
              newMessage = {
                ...newMessage,
                content: newMessage.content + textChunk,
              }
              setPendingMessages(prev => ({ ...prev, [conversationId]: newMessage }))
            }
          }
          
          console.log(`🔍 Client: Stream finished. Total chunks: ${chunkCount}, Final content length: ${newMessage.content.length}`);

          setPendingMessages(prev => {
            const newPending = { ...prev }
            delete newPending[conversationId]
            return newPending
          })

          if (newMessage.content.trim()) {
            addMessage(conversationId, newMessage)
            
            // Generate AI title if conversation still has default title
            const currentConv = getCurrentConversation(store.state)
            if (currentConv && currentConv.title === 'New Chat') {
              try {
                const selectedModel = getSelectedModel(store.state)
                const titleResult = await generateChatTitle({
                  data: {
                    userMessage: currentInput,
                    selectedModel
                  }
                })
                
                if (titleResult.title) {
                  updateConversationTitle(conversationId, titleResult.title)
                }
              } catch (titleError) {
                console.warn('Failed to generate AI title, keeping default:', titleError)
              }
            }
          }
        } catch (error) {
          console.error('Error:', error)
          Sentry.captureException(error)
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant' as const,
            content: 'Sorry, I encountered an error processing your request.',
          }
          if (currentConversationId) {
            addMessage(currentConversationId, errorMessage)
          }
        } finally {
          setLoading(false)
        }
      }
    )
  }

  const handleNewChat = () => {
    const newConversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    }
    addConversation(newConversation)
  }

  const handleDeleteChat = (id: string) => {
    deleteConversation(id)
  }

  const handleUpdateChatTitle = (id: string, title: string) => {
    updateConversationTitle(id, title)
    setEditingChatId(null)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  return (
    <div className="relative flex h-screen theme-bg-primary theme-transition">
      {/* Settings Button */}
      <div className="absolute top-5 right-5 z-50">
        <button
          onClick={() => setIsSettingsOpen(true)}
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
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium theme-text-primary theme-bg-accent rounded-lg hover:theme-bg-accent-hover theme-focus w-full justify-center theme-transition"
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
        {currentConversationId ? (
          <>
            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto pb-32">
              <div className="max-w-3xl mx-auto w-full px-4">
              {[...messages, currentConversationId ? pendingMessages[currentConversationId] : null]
                  .filter((v) => v)
                  .map((message) => (
                    <div
                      key={message!.id}
                      className={`py-6 ${
                        message!.role === 'assistant'
                          ? 'bg-gradient-to-r from-orange-500/5 to-red-600/5'
                          : 'bg-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-4 max-w-3xl mx-auto w-full">
                        {message!.role === 'assistant' ? (
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 mt-2 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
                            AI
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
                            Y
                          </div>
                        )}
                      <div className="flex-1 min-w-0">
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
                          {message!.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="py-6 bg-gradient-to-r from-orange-500/5 to-red-600/5">
                    <div className="flex items-start gap-4 max-w-3xl mx-auto w-full">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-[spin_2s_linear_infinite]"></div>
                        <div className="absolute inset-[2px] rounded-lg theme-bg-primary flex items-center justify-center">
                          <div className="relative w-full h-full rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 animate-pulse"></div>
                            <span className="relative z-10 text-sm font-medium text-white">AI</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="theme-text-muted font-medium text-lg">Thinking</div>
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-orange-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: '200ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-orange-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: '400ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                        value={input}
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
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 theme-accent hover:theme-accent-hover disabled:theme-text-muted transition-colors focus:outline-none"
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
                        value={input}
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
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 theme-accent hover:theme-accent-hover disabled:theme-text-muted transition-colors focus:outline-none"
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
