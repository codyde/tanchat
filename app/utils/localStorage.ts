import type { ReasoningConfig } from '../store/store'

interface PersistedSettings {
  selectedModel?: string
  reasoningConfig?: ReasoningConfig
  selectedTheme?: string
}

const STORAGE_KEY = 'tanchat-settings'

export const loadSettings = (): PersistedSettings => {
  if (typeof window === 'undefined') {
    return {} // Server-side rendering
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return {}
    
    const parsed = JSON.parse(stored)
    
    // Validate the structure to ensure it matches our expected types
    const settings: PersistedSettings = {}
    
    if (typeof parsed.selectedModel === 'string') {
      settings.selectedModel = parsed.selectedModel
    }
    
    if (typeof parsed.selectedTheme === 'string') {
      settings.selectedTheme = parsed.selectedTheme
    }
    
    if (parsed.reasoningConfig && typeof parsed.reasoningConfig === 'object') {
      const config = parsed.reasoningConfig
      if (
        ['low', 'medium', 'high'].includes(config.reasoningEffort) &&
        ['auto', 'detailed', 'none'].includes(config.reasoningSummary)
      ) {
        settings.reasoningConfig = config
      }
    }
    
    return settings
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error)
    return {}
  }
}

export const saveSettings = (settings: PersistedSettings): void => {
  if (typeof window === 'undefined') {
    return // Server-side rendering
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error)
  }
}

export const clearSettings = (): void => {
  if (typeof window === 'undefined') {
    return // Server-side rendering
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear settings from localStorage:', error)
  }
}

// Helper to save specific setting
export const saveSelectedModel = (modelId: string): void => {
  const current = loadSettings()
  saveSettings({ ...current, selectedModel: modelId })
}

export const saveReasoningConfig = (config: ReasoningConfig): void => {
  const current = loadSettings()
  saveSettings({ ...current, reasoningConfig: config })
}

export const saveSelectedTheme = (themeId: string): void => {
  const current = loadSettings()
  saveSettings({ ...current, selectedTheme: themeId })
}