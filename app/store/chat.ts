import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/react-store'
import { Message, genAIResponse } from '../utils/ai'
import { 
  createConversation, 
  updateConversationTitle, 
  getConversations, 
  addMessage, 
  getMessagesForConversation, 
  deleteConversation,
  getPrompts
} from '../utils/db'

export interface Conversation {
  id: string
  title: string
  messages: Message[]
}

interface ChatState {
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
}

const initialState: ChatState = {
  conversations: [],
  currentConversationId: null,
  isLoading: false,
}

export const chatStore = new Store(initialState)

// Add store methods
chatStore.setState((state) => ({
  ...state,
  getCurrentConversation: () => {
    return state.conversations.find(c => c.id === state.currentConversationId)
  },
  getCurrentMessages: () => {
    const currentConversation = state.conversations.find(c => c.id === state.currentConversationId)
    return currentConversation?.messages || []
  }
}))

// Create actions
export const chatActions = {
  setConversations: (conversations: Conversation[]) => {
    chatStore.setState(state => ({ ...state, conversations }))
  },
  setCurrentConversationId: (id: string | null) => {
    chatStore.setState(state => ({ ...state, currentConversationId: id }))
  },
  setIsLoading: (isLoading: boolean) => {
    chatStore.setState(state => ({ ...state, isLoading }))
  },
  createNewChat: () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: []
    }

    createConversation(newConversation.id, newConversation.title)
    chatStore.setState(state => ({
      ...state,
      conversations: [...state.conversations, newConversation],
      currentConversationId: newConversation.id
    }))
  },
  deleteChat: (id: string) => {
    deleteConversation(id)
    chatStore.setState(state => ({
      ...state,
      conversations: state.conversations.filter(conv => conv.id !== id),
      currentConversationId: state.currentConversationId === id ? null : state.currentConversationId
    }))
  },
  clearAllChats: () => {
    chatStore.state.conversations.forEach(conv => {
      deleteConversation(conv.id)
    })
    chatStore.setState(state => ({
      ...state,
      conversations: [],
      currentConversationId: null
    }))
  },
  updateChatTitle: (id: string, title: string) => {
    updateConversationTitle(id, title)
    chatStore.setState(state => ({
      ...state,
      conversations: state.conversations.map(conv =>
        conv.id === id ? { ...conv, title } : conv
      )
    }))
  },
  loadConversations: () => {
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
    chatStore.setState(state => ({ ...state, conversations: conversationsWithMessages }))
  },
  sendMessage: async (input: string) => {
    if (!input.trim() || chatStore.state.isLoading) return

    chatStore.setState(state => ({ ...state, isLoading: true }))
    
    try {
      let conversationId = chatStore.state.currentConversationId

      // If no current conversation, create one
      if (!conversationId) {
        conversationId = Date.now().toString()
        const newConversation: Conversation = {
          id: conversationId,
          title: input.trim().slice(0, 30),
          messages: []
        }

        createConversation(conversationId, newConversation.title)
        chatStore.setState(state => ({
          ...state,
          conversations: [...state.conversations, newConversation],
          currentConversationId: conversationId
        }))
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input.trim(),
      }

      // Add user message
      addMessage({
        id: userMessage.id,
        conversation_id: conversationId,
        role: userMessage.role,
        content: userMessage.content
      })

      chatStore.setState(state => ({
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, userMessage] }
            : conv
        ),
      }))

      // Get active prompt
      let systemPrompt
      const prompts = getPrompts()
      const activePrompt = prompts.find(p => p.is_active)
      if (activePrompt) {
        systemPrompt = {
          value: activePrompt.content,
          enabled: true
        }
      }

      // Get AI response
      const currentConversation = chatStore.state.conversations.find(c => c.id === conversationId)
      const currentMessages = currentConversation?.messages || []
      const response = await genAIResponse({
        data: {
          messages: [...currentMessages, userMessage],
          systemPrompt
        }
      })

      if (!response.text?.trim()) {
        throw new Error('Received empty response from AI')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text
      }

      addMessage({
        id: assistantMessage.id,
        conversation_id: conversationId,
        role: assistantMessage.role,
        content: assistantMessage.content
      })

      chatStore.setState(state => ({
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, assistantMessage] }
            : conv
        )
      }))

    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
      }

      const conversationId = chatStore.state.currentConversationId!
      addMessage({
        id: errorMessage.id,
        conversation_id: conversationId,
        role: errorMessage.role,
        content: errorMessage.content
      })

      chatStore.setState(state => ({
        ...state,
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, errorMessage] }
            : conv
        )
      }))
    } finally {
      chatStore.setState(state => ({ ...state, isLoading: false }))
    }
  }
}

// Create hooks for accessing the store
export function useChatState<T>(selector: (state: ChatState) => T): T {
  return useStore(chatStore, selector)
}

export function useCurrentConversation() {
  return useChatState(state => state.conversations.find(c => c.id === state.currentConversationId))
}

export function useCurrentMessages() {
  const conversation = useCurrentConversation()
  return conversation?.messages || []
} 