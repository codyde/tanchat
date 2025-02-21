import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { genAIResponse, type Message } from '../utils/ai'
import { createConversation, updateConversationTitle, getConversations, addMessage, getMessagesForConversation, deleteConversation, type DBConversation, type DBMessage, useDB, getPrompts, getUserSetting, getSetting } from '../utils/db'
import { PlusCircle, MessageCircle, ChevronLeft, ChevronRight, Trash2, X, Menu, Send, Settings, User, LogOut, Edit2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'
import { SettingsDialog } from '../components/SettingsDialog'
import { useChatState, chatActions } from '../store/chat'

interface Conversation {
  id: string
  title: string
  messages: Message[]
}

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { isReady: isDBReady, error: dbError } = useDB()
  const conversations = useChatState(state => state.conversations)
  const currentConversationId = useChatState(state => state.currentConversationId)
  const isLoading = useChatState(state => state.isLoading)
  const currentConversation = useChatState(state => state.conversations.find(c => c.id === state.currentConversationId))
  const messages = currentConversation?.messages || []
  
  // Local state
  const [input, setInput] = useState('')
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Load conversations from database
  useEffect(() => {
    if (!isDBReady) return

    try {
      chatActions.loadConversations()
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [isDBReady])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !isDBReady) return
    
    const currentInput = input
    setInput('') // Clear input early for better UX
    await chatActions.sendMessage(currentInput)
  }

  // Update textarea value handler
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  // Show error state if database failed to initialize
  if (dbError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 text-red-500">Database Error</h2>
          <p className="text-gray-400">
            Failed to initialize the database. Please try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  // Show loading state while database is initializing
  if (!isDBReady) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 text-white">Loading...</h2>
          <p className="text-gray-400">
            Initializing your slightly unstable database... 🔧
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen bg-gray-900">
      {/* Avatar Dropdown */}
      <div className="absolute top-5 right-5 z-50">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-500 overflow-hidden"
        >
          {!currentConversation && <User className="w-5 h-5" />}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu">
              <button
                onClick={() => {
                  setIsSettingsOpen(true)
                  setIsDropdownOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                role="menuitem"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={() => {
                  // Handle logout
                  setIsDropdownOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                role="menuitem"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Sidebar */}
      <div className="w-64 bg-gray-800/80 backdrop-blur-sm border-r border-orange-500/10">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4">
            <button
              onClick={chatActions.createNewChat}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="group relative"
              >
                <div 
                  className={`flex items-center gap-3 w-full px-4 py-2 text-left text-sm ${
                    currentConversationId === conv.id
                      ? 'bg-gradient-to-r from-orange-500/10 to-red-600/10 text-white'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                  onClick={() => chatActions.setCurrentConversationId(conv.id)}
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    {editingChatId === conv.id ? (
                      <input
                        type="text"
                        value={conv.title}
                        onChange={(e) => chatActions.updateChatTitle(conv.id, e.target.value)}
                        onBlur={() => setEditingChatId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingChatId(null)
                          }
                        }}
                        className="w-full bg-gray-700 border-none focus:outline-none focus:ring-1 focus:ring-orange-500 rounded px-1"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <>
                        <span className="truncate flex-1">{conv.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingChatId(conv.id)
                          }}
                          className="p-1 text-gray-400 hover:text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      chatActions.deleteChat(conv.id)
                    }}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {conversations.length > 0 && (
            <div className="p-4 border-t border-orange-500/10">
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all chats? This cannot be undone.')) {
                    chatActions.clearAllChats()
                  }
                }}
                className="w-full px-4 py-2 text-sm font-medium text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Chats
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col transition-all duration-300 relative">
        {currentConversationId ? (
          <>
            <div className="flex-1 overflow-y-auto pb-24">
              <div className="max-w-3xl mx-auto w-full px-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`py-6 ${message.role === 'assistant'
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
                        <ReactMarkdown
                          className="prose dark:prose-invert max-w-none"
                          rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                        >
                          {message.content}
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
                        <div className="absolute inset-[2px] rounded-lg bg-gray-900 flex items-center justify-center">
                          <div className="relative w-full h-full rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 animate-pulse"></div>
                            <span className="relative z-10 text-sm font-medium text-white">AI</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="text-gray-400 font-medium text-lg">Thinking</div>
                          <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: '200ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-[bounce_0.8s_infinite]" style={{ animationDelay: '400ms' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gray-900/80 backdrop-blur-sm border-t border-orange-500/10">
              <div className="max-w-3xl mx-auto w-full px-4 py-3">
                <form onSubmit={handleSubmit}>
                  <div className="relative">
                    <textarea
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Type something clever (or don't, we won't judge)..."
                      className="w-full rounded-lg border border-orange-500/20 bg-gray-800/50 pl-4 pr-12 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent resize-none overflow-hidden"
                      disabled={isLoading}
                      rows={1}
                      style={{ minHeight: '44px', maxHeight: '200px' }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = 'auto';
                        target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e as any);
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-orange-500 hover:text-orange-400 disabled:text-gray-500 transition-colors focus:outline-none"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center max-w-3xl mx-auto w-full">
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 text-transparent bg-clip-text uppercase">
                <span className="text-white">TanStack</span> Chat
              </h1>
              <p className="text-gray-400 mb-6 w-2/3 mx-auto text-lg">
                You can ask me about anything, I might or might not have a good answer, but you can still ask.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="relative max-w-xl mx-auto">
                  <textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type something clever (or don't, we won't judge)..."
                    className="w-full rounded-lg border border-orange-500/20 bg-gray-800/50 pl-4 pr-12 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent resize-none overflow-hidden"
                    disabled={isLoading}
                    rows={1}
                    style={{ minHeight: '88px', maxHeight: '200px' }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-orange-500 hover:text-orange-400 disabled:text-gray-500 transition-colors focus:outline-none"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
