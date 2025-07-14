import { Store } from '@tanstack/store'
import type { Message } from '../utils/ai'
import { loadSettings, saveSelectedModel, saveReasoningConfig, saveSelectedTheme } from '../utils/localStorage'
import { defaultTheme } from '../utils/themes'

// Types
export interface Prompt {
  id: string
  name: string
  content: string
  is_active: boolean
  created_at: number
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
}

export interface AIModel {
  id: string
  name: string
  provider: string
}

export interface ReasoningConfig {
  reasoningEffort: 'low' | 'medium' | 'high'
  reasoningSummary: 'auto' | 'detailed' | 'none'
}

export interface State {
  prompts: Prompt[]
  conversations: Conversation[]
  currentConversationId: string | null
  isLoading: boolean
  selectedModel: string
  reasoningConfig: ReasoningConfig
  selectedTheme: string
}

// Load persisted settings
const persistedSettings = loadSettings()

const initialState: State = {
  prompts: [],
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  selectedModel: persistedSettings.selectedModel || 'grok-4',
  reasoningConfig: persistedSettings.reasoningConfig || {
    reasoningEffort: 'medium',
    reasoningSummary: 'none'
  },
  selectedTheme: persistedSettings.selectedTheme || defaultTheme.id
}

export const store = new Store<State>(initialState)

export const actions = {
  // Prompt actions
  createPrompt: (name: string, content: string) => {
    const id = Date.now().toString()
    store.setState(state => {
      const updatedPrompts = state.prompts.map(p => ({ ...p, is_active: false }))
      return {
        ...state,
        prompts: [
          ...updatedPrompts,
          {
            id,
            name,
            content,
            is_active: true,
            created_at: Date.now()
          }
        ]
      }
    })
  },

  deletePrompt: (id: string) => {
    store.setState(state => ({
      ...state,
      prompts: state.prompts.filter(p => p.id !== id)
    }))
  },

  setPromptActive: (id: string, shouldActivate: boolean) => {
    store.setState(state => ({
      ...state,
      prompts: state.prompts.map(p => ({
        ...p,
        is_active: p.id === id ? shouldActivate : false
      }))
    }))
  },

  // Chat actions
  setConversations: (conversations: Conversation[]) => {
    store.setState(state => ({ ...state, conversations }))
  },

  setCurrentConversationId: (id: string | null) => {
    store.setState(state => ({ ...state, currentConversationId: id }))
  },

  addConversation: (conversation: Conversation) => {
    store.setState(state => ({
      ...state,
      conversations: [...state.conversations, conversation],
      currentConversationId: conversation.id
    }))
  },

  updateConversationTitle: (id: string, title: string) => {
    store.setState(state => ({
      ...state,
      conversations: state.conversations.map(conv =>
        conv.id === id ? { ...conv, title } : conv
      )
    }))
  },

  deleteConversation: (id: string) => {
    store.setState(state => ({
      ...state,
      conversations: state.conversations.filter(conv => conv.id !== id),
      currentConversationId: state.currentConversationId === id ? null : state.currentConversationId
    }))
  },

  addMessage: (conversationId: string, message: Message) => {
    store.setState(state => ({
      ...state,
      conversations: state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
    }))
  },

  setLoading: (isLoading: boolean) => {
    store.setState(state => ({ ...state, isLoading }))
  },

  setSelectedModel: (modelId: string) => {
    store.setState(state => ({ ...state, selectedModel: modelId }))
    saveSelectedModel(modelId) // Persist to localStorage
  },

  // Reasoning config actions
  setReasoningConfig: (config: ReasoningConfig) => {
    store.setState(state => ({ ...state, reasoningConfig: config }))
    saveReasoningConfig(config) // Persist to localStorage
  },

  setReasoningEffort: (effort: 'low' | 'medium' | 'high') => {
    store.setState(state => {
      const newConfig = { ...state.reasoningConfig, reasoningEffort: effort }
      saveReasoningConfig(newConfig) // Persist to localStorage
      return { ...state, reasoningConfig: newConfig }
    })
  },

  setReasoningSummary: (summary: 'auto' | 'detailed' | 'none') => {
    store.setState(state => {
      const newConfig = { ...state.reasoningConfig, reasoningSummary: summary }
      saveReasoningConfig(newConfig) // Persist to localStorage
      return { ...state, reasoningConfig: newConfig }
    })
  },

  // Theme actions
  setSelectedTheme: (themeId: string) => {
    store.setState(state => ({ ...state, selectedTheme: themeId }))
    saveSelectedTheme(themeId) // Persist to localStorage
  },

  // Clear settings action
  clearSettings: () => {
    store.setState(state => ({
      ...state,
      selectedModel: 'grok-4',
      reasoningConfig: {
        reasoningEffort: 'medium',
        reasoningSummary: 'none'
      },
      selectedTheme: defaultTheme.id
    }))
    // Clear from localStorage
    const { clearSettings } = require('../utils/localStorage')
    clearSettings()
  }
}

// Selectors
export const selectors = {
  getActivePrompt: (state: State) => state.prompts.find(p => p.is_active),
  getCurrentConversation: (state: State) => 
    state.conversations.find(c => c.id === state.currentConversationId),
  getPrompts: (state: State) => state.prompts,
  getConversations: (state: State) => state.conversations,
  getCurrentConversationId: (state: State) => state.currentConversationId,
  getIsLoading: (state: State) => state.isLoading,
  getSelectedModel: (state: State) => state.selectedModel,
  getReasoningConfig: (state: State) => state.reasoningConfig,
  getReasoningEffort: (state: State) => state.reasoningConfig.reasoningEffort,
  getReasoningSummary: (state: State) => state.reasoningConfig.reasoningSummary,
  getSelectedTheme: (state: State) => state.selectedTheme
} 