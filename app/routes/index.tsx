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

interface Conversation {
  id: string
  title: string
  messages: Message[]
}

export const Route = createFileRoute('/')({
  component: Home,
})

function LoadingMessage() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-6 bg-gradient-to-r from-orange-500/5 to-red-600/5">
      <div className="flex items-start gap-4 max-w-3xl mx-auto w-full">
        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 mt-2 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 animate-pulse"></div>
          <span className="relative z-10">AI</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-gray-400 font-medium">Thinking</div>
            <div className="flex gap-1">
              <div className={`w-1.5 h-1.5 rounded-full bg-orange-500 ${dots.length >= 1 ? 'animate-bounce' : 'opacity-30'}`} style={{ animationDelay: '0ms' }}></div>
              <div className={`w-1.5 h-1.5 rounded-full bg-orange-500 ${dots.length >= 2 ? 'animate-bounce' : 'opacity-30'}`} style={{ animationDelay: '150ms' }}></div>
              <div className={`w-1.5 h-1.5 rounded-full bg-orange-500 ${dots.length >= 3 ? 'animate-bounce' : 'opacity-30'}`} style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const { isReady: isDBReady, error: dbError } = useDB()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)

  // Load conversations and user settings from database
  useEffect(() => {
    if (!isDBReady) return

    try {
      const dbConversations = getConversations()
      const conversationsWithMessages = dbConversations.map((conv) => {
        const messages = getMessagesForConversation(conv.id)
        return {
          id: conv.id,
          title: conv.title,
          messages: messages.map(msg => ({
            id: msg.id,
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          }))
        }
      })
      setConversations(conversationsWithMessages)

      // Load avatar
      const avatar = getUserSetting('avatar')
      if (avatar) {
        setAvatarUrl(avatar)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }, [isDBReady])

  const currentConversation = conversations.find(c => c.id === currentConversationId)
  const messages = currentConversation?.messages || []

  const createNewChat = () => {
    if (!isDBReady) return

    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    }

    try {
      createConversation(newConversation.id, newConversation.title)
      setConversations(prev => [...prev, newConversation])
      setCurrentConversationId(newConversation.id)
    } catch (error) {
      console.error('Error creating new chat:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !isDBReady) return;

    // If no current conversation, create one
    if (!currentConversationId) {
      const newConversationId = Date.now().toString();
      const newConversation: Conversation = {
        id: newConversationId,
        title: 'New Chat',
        messages: []
      };

      try {
        createConversation(newConversation.id, newConversation.title);
        setConversations(prev => [...prev, newConversation]);
        setCurrentConversationId(newConversationId);

        // Continue with the message submission for the new conversation
        const userMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: input.trim(),
        };

        // Update conversation title with first message
        const newTitle = input.trim().slice(0, 30);
        updateConversationTitle(newConversationId, newTitle);

        // Add user message to database
        addMessage({
          id: userMessage.id,
          conversation_id: newConversationId,
          role: userMessage.role,
          content: userMessage.content
        });

        setConversations(prev => prev.map(conv =>
          conv.id === newConversationId
            ? { ...conv, title: newTitle, messages: [userMessage] }
            : conv
        ));
        setInput('');
        setIsLoading(true);

        // Get active prompt
        let systemPrompt;
        try {
          const prompts = getPrompts();
          const activePrompt = prompts.find(p => p.is_active);
          if (activePrompt) {
            systemPrompt = {
              value: activePrompt.content,
              enabled: true
            };
          }
        } catch (error) {
          console.error('Error getting settings:', error);
        }

        // Create a temporary message for the response
        const tempMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: ''
        };

        try {
          console.log('Sending messages:', [...messages, userMessage]);
          const response = await genAIResponse({
            data: {
              messages: messages.concat(userMessage),
              systemPrompt: systemPrompt
            }
          });

          if (!response.text?.trim()) {
            throw new Error('Received empty response from AI');
          }

          tempMessage.content = response.text;

          addMessage({
            id: tempMessage.id,
            conversation_id: newConversationId,
            role: tempMessage.role,
            content: tempMessage.content
          });

          setConversations(prev => prev.map(conv =>
            conv.id === newConversationId
              ? { ...conv, messages: [...conv.messages, tempMessage] }
              : conv
          ));
        } catch (error) {
          console.error('Error getting response:', error);
          tempMessage.content = 'Sorry, I encountered an error processing your request.';

          addMessage({
            id: tempMessage.id,
            conversation_id: newConversationId,
            role: tempMessage.role,
            content: tempMessage.content
          });

          setConversations(prev => prev.map(conv =>
            conv.id === newConversationId
              ? { ...conv, messages: [...conv.messages, tempMessage] }
              : conv
          ));
        }
      } catch (error) {
        console.error('Error:', error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request.',
        };

        try {
          addMessage({
            id: errorMessage.id,
            conversation_id: newConversationId,
            role: errorMessage.role,
            content: errorMessage.content
          });

          setConversations(prev => prev.map(conv =>
            conv.id === newConversationId
              ? { ...conv, messages: [...conv.messages, errorMessage] }
              : conv
          ));
        } catch (dbError) {
          console.error('Error saving error message:', dbError);
        }
      }
      setIsLoading(false);
      return;
    }

    // Handle existing conversation case
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    try {
      // Add user message to database
      addMessage({
        id: userMessage.id,
        conversation_id: currentConversationId,
        role: userMessage.role,
        content: userMessage.content
      });

      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId
          ? { ...conv, messages: [...conv.messages, userMessage] }
          : conv
      ));
      setInput('');
      setIsLoading(true);

      // Get active prompt
      let systemPrompt;
      try {
        const prompts = getPrompts();
        const activePrompt = prompts.find(p => p.is_active);
        if (activePrompt) {
          systemPrompt = {
            value: activePrompt.content,
            enabled: true
          };
        }
      } catch (error) {
        console.error('Error getting settings:', error);
      }

      // Create a temporary message for the response
      const tempMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: ''
      };

      try {
        console.log('Sending messages:', [...messages, userMessage]);
        const response = await genAIResponse({
          data: {
            messages: messages.concat(userMessage),
            systemPrompt: systemPrompt
          }
        });

        if (!response.text?.trim()) {
          throw new Error('Received empty response from AI');
        }

        tempMessage.content = response.text;

        addMessage({
          id: tempMessage.id,
          conversation_id: currentConversationId,
          role: tempMessage.role,
          content: tempMessage.content
        });

        setConversations(prev => prev.map(conv =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, tempMessage] }
            : conv
        ));
      } catch (error) {
        console.error('Error getting response:', error);
        tempMessage.content = 'Sorry, I encountered an error processing your request.';

        addMessage({
          id: tempMessage.id,
          conversation_id: currentConversationId,
          role: tempMessage.role,
          content: tempMessage.content
        });

        setConversations(prev => prev.map(conv =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, tempMessage] }
            : conv
        ));
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
      };

      try {
        addMessage({
          id: errorMessage.id,
          conversation_id: currentConversationId,
          role: errorMessage.role,
          content: errorMessage.content
        });

        setConversations(prev => prev.map(conv =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, errorMessage] }
            : conv
        ));
      } catch (dbError) {
        console.error('Error saving error message:', dbError);
      }
    }
    setIsLoading(false);
  }

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isDBReady) return

    try {
      deleteConversation(id)
      setConversations(prev => prev.filter(conv => conv.id !== id))
      if (currentConversationId === id) {
        setCurrentConversationId(null)
      }
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const clearAllChats = () => {
    if (!isDBReady || !window.confirm('Are you sure you want to clear all chats? This cannot be undone.')) return

    try {
      conversations.forEach(conv => {
        deleteConversation(conv.id)
      })
      setConversations([])
      setCurrentConversationId(null)
    } catch (error) {
      console.error('Error clearing chats:', error)
    }
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
          style={avatarUrl ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: 'cover' } : undefined}
        >
          {!avatarUrl && <User className="w-5 h-5" />}
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
        onAvatarChange={setAvatarUrl}
      />

      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-50 ${isSidebarExpanded ? 'w-64' : 'w-16'
          } bg-gray-800/80 backdrop-blur-sm transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-all duration-300 ease-in-out md:translate-x-0 border-r border-orange-500/10`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header with Toggle */}
          <div className="p-4 flex items-center justify-between">
            {isSidebarExpanded ? (
              <>
                <button
                  onClick={createNewChat}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Chat</span>
                </button>
                <button
                  onClick={() => setIsSidebarExpanded(false)}
                  className="ml-2 p-1.5 rounded-lg text-gray-400 hover:text-orange-500 focus:outline-none"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSidebarExpanded(true)}
                className="w-full p-1.5 rounded-lg text-gray-400 hover:text-orange-500 focus:outline-none flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
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
                  onClick={() => setCurrentConversationId(conv.id)}
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  {isSidebarExpanded && (
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      {editingChatId === conv.id ? (
                        <input
                          type="text"
                          value={conv.title}
                          onChange={(e) => {
                            updateConversationTitle(conv.id, e.target.value)
                            setConversations(prev => prev.map(c => 
                              c.id === conv.id ? { ...c, title: e.target.value } : c
                            ))
                          }}
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
                            title="Rename chat"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {isSidebarExpanded && (
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {isSidebarExpanded && conversations.length > 0 && (
            <div className="p-4 border-t border-orange-500/10">
              <button
                onClick={clearAllChats}
                className="w-full px-4 py-2 text-sm font-medium text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Chats
              </button>
            </div>
          )}
        </div>
      </div>

    
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed bottom-4 left-4 z-50 p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-lg"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Main chat area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 relative ${isSidebarExpanded ? 'md:ml-0' : 'md:ml-0'
        }`}>
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
                        <div 
                          className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center text-sm font-medium text-white flex-shrink-0 overflow-hidden"
                          style={avatarUrl ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: 'cover' } : undefined}
                        >
                          {!avatarUrl && 'Y'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <ReactMarkdown
                          className="prose dark:prose-invert"
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
                    <div className="flex items-center gap-4 max-w-3xl mx-auto w-full">
                      <div className="relative w-8 h-8 flex-shrink-0">
                        {/* Spinning gradient ring */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 animate-[spin_2s_linear_infinite]"></div>
                        {/* Inner content */}
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
                {messages.length === 0 && !isLoading && (
                  <div className="text-center py-20">
                    <h2 className="text-6xl font-semibold mb-2 bg-gradient-to-r from-orange-500 to-red-600 text-transparent bg-clip-text">Ready to Chat?</h2>
                    <p className="text-gray-400 text-xl">
                      Start a conversation below. Don't worry, our AI is mostly harmless... mostly 😈
                    </p>
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
                      onChange={(e) => setInput(e.target.value)}
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
                    onChange={(e) => setInput(e.target.value)}
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
