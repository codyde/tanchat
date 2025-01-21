import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { genAIResponse, type Message } from '../utils/ai'
import { createConversation, updateConversationTitle, getConversations, addMessage, getMessagesForConversation, deleteConversation, type DBConversation, type DBMessage, useDB } from '../utils/db'
import { PlusCircle, MessageCircle, ChevronLeft, ChevronRight, Trash2, X, Menu, Send } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeHighlight from 'rehype-highlight'

interface Conversation {
  id: string
  title: string
  messages: Message[]
}

export const Route = createFileRoute('/chat')({
  component: ChatRoute,
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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 mt-2 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
          AI
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-gray-400">
            Thinking{dots}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatRoute() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const { isReady: isDBReady, error: dbError } = useDB()

  // Load conversations from database
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
    } catch (error) {
      console.error('Error loading conversations:', error)
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
    e.preventDefault()
    if (!input.trim() || isLoading || !isDBReady) return

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

        const aiResponse = await genAIResponse({ 
          data: { messages: [userMessage] } 
        });
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse.text
        };

        // Add assistant message to database
        addMessage({
          id: assistantMessage.id,
          conversation_id: newConversationId,
          role: assistantMessage.role,
          content: assistantMessage.content
        });

        setConversations(prev => prev.map(conv => 
          conv.id === newConversationId 
            ? { ...conv, messages: [userMessage, assistantMessage] }
            : conv
        ));
      } catch (error) {
        console.error('Error:', error);
        // Create error message and include the user's original message
        const messages: Message[] = [
          {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
          },
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Sorry, I encountered an error processing your request.',
          }
        ];

        try {
          messages.forEach(msg => {
            addMessage({
              id: msg.id,
              conversation_id: newConversationId,
              role: msg.role,
              content: msg.content
            });
          });

          setConversations(prev => prev.map(conv => 
            conv.id === newConversationId 
              ? { ...conv, messages }
              : conv
          ));
        } catch (dbError) {
          console.error('Error saving error message:', dbError);
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Handle existing conversation case
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    try {
      // Update conversation title if this is the first message
      if (messages.length === 0) {
        const newTitle = input.trim().slice(0, 30)
        updateConversationTitle(currentConversationId, newTitle)
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, title: newTitle } 
            : conv
        ))
      }

      // Add user message to database
      addMessage({
        id: userMessage.id,
        conversation_id: currentConversationId,
        role: userMessage.role,
        content: userMessage.content
      })

      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [...conv.messages, userMessage] }
          : conv
      ))
      setInput('')
      setIsLoading(true)

      const aiResponse = await genAIResponse({ 
        data: { messages: [...messages, userMessage] } 
      })
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.text
      }

      // Add assistant message to database
      addMessage({
        id: assistantMessage.id,
        conversation_id: currentConversationId,
        role: assistantMessage.role,
        content: assistantMessage.content
      })

      setConversations(prev => prev.map(conv => 
        conv.id === currentConversationId 
          ? { ...conv, messages: [...conv.messages, assistantMessage] }
          : conv
      ))

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
      }

      try {
        // Add error message to database
        addMessage({
          id: errorMessage.id,
          conversation_id: currentConversationId,
          role: errorMessage.role,
          content: errorMessage.content
        })

        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? { ...conv, messages: [...conv.messages, errorMessage] }
            : conv
        ))
      } catch (dbError) {
        console.error('Error saving error message:', dbError)
      }
    } finally {
      setIsLoading(false)
    }
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
    <div className="relative flex h-[calc(100vh-3.5rem)] bg-gray-900">
      {/* Sidebar */}
      <div 
        className={`fixed md:relative inset-y-0 left-0 z-50 ${
          isSidebarExpanded ? 'w-64' : 'w-16'
        } bg-gray-800/80 backdrop-blur-sm transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
                <button
                  onClick={() => setCurrentConversationId(conv.id)}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    currentConversationId === conv.id
                      ? 'bg-gradient-to-r from-orange-500/10 to-red-600/10 text-white'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  } flex items-center gap-3`}
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  {isSidebarExpanded && (
                    <span className="truncate">{conv.title}</span>
                  )}
                </button>
                {isSidebarExpanded && (
                  <button
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar Footer */}
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

      {/* Mobile sidebar toggle */}
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
      <div className={`flex-1 flex flex-col transition-all duration-300 relative ${
        isSidebarExpanded ? 'md:ml-0' : 'md:ml-0'
      }`}>
        {currentConversationId ? (
          <>
            <div className="flex-1 overflow-y-auto pb-24">
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
                      <div className={`w-8 h-8 rounded-lg ${
                        message.role === 'assistant' 
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 mt-2'
                          : 'bg-gray-700'
                        } flex items-center justify-center text-sm font-medium text-white flex-shrink-0`}>
                        {message.role === 'user' ? 'Y' : 'AI'}
                      </div>
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
                {isLoading && <LoadingMessage />}
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