export interface Theme {
  id: string
  name: string
  description: string
  colors: {
    // Background colors
    background: string
    surface: string
    surfaceHover: string
    
    // Text colors
    textPrimary: string
    textSecondary: string
    textMuted: string
    
    // Accent colors
    accent: string
    accentHover: string
    
    // Border colors
    border: string
    borderHover: string
    
    // Status colors
    success: string
    warning: string
    error: string
    
    // Chat specific
    userMessage: string
    aiMessage: string
    codeBlock: string
  }
}

export const themes: Theme[] = [
  {
    id: 'dark',
    name: 'Dark',
    description: 'Classic dark theme with gray tones',
    colors: {
      background: '#0f0f0f',
      surface: '#1a1a1a',
      surfaceHover: '#2a2a2a',
      textPrimary: '#ffffff',
      textSecondary: '#d1d5db',
      textMuted: '#9ca3af',
      accent: '#3b82f6',
      accentHover: '#2563eb',
      border: '#374151',
      borderHover: '#4b5563',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      userMessage: '#1e40af',
      aiMessage: '#1a1a1a',
      codeBlock: '#111827'
    }
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Clean light theme with subtle shadows',
    colors: {
      background: '#ffffff',
      surface: '#f9fafb',
      surfaceHover: '#f3f4f6',
      textPrimary: '#111827',
      textSecondary: '#374151',
      textMuted: '#6b7280',
      accent: '#3b82f6',
      accentHover: '#2563eb',
      border: '#e5e7eb',
      borderHover: '#d1d5db',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      userMessage: '#dbeafe',
      aiMessage: '#f9fafb',
      codeBlock: '#f3f4f6'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Calming blue-green theme inspired by the sea',
    colors: {
      background: '#0c1821',
      surface: '#1a2332',
      surfaceHover: '#243447',
      textPrimary: '#f0f9ff',
      textSecondary: '#bae6fd',
      textMuted: '#7dd3fc',
      accent: '#06b6d4',
      accentHover: '#0891b2',
      border: '#164e63',
      borderHover: '#0e7490',
      success: '#14b8a6',
      warning: '#f59e0b',
      error: '#ef4444',
      userMessage: '#0c4a6e',
      aiMessage: '#1a2332',
      codeBlock: '#0f172a'
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green theme with earthy tones',
    colors: {
      background: '#0f1611',
      surface: '#1a2e1a',
      surfaceHover: '#2a3f2a',
      textPrimary: '#f7fee7',
      textSecondary: '#d9f99d',
      textMuted: '#bef264',
      accent: '#22c55e',
      accentHover: '#16a34a',
      border: '#365314',
      borderHover: '#4d7c0f',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      userMessage: '#14532d',
      aiMessage: '#1a2e1a',
      codeBlock: '#0f172a'
    }
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and red theme like a sunset',
    colors: {
      background: '#1c0f0a',
      surface: '#2c1810',
      surfaceHover: '#3c2415',
      textPrimary: '#fff7ed',
      textSecondary: '#fed7aa',
      textMuted: '#fdba74',
      accent: '#f97316',
      accentHover: '#ea580c',
      border: '#9a3412',
      borderHover: '#c2410c',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      userMessage: '#9a3412',
      aiMessage: '#2c1810',
      codeBlock: '#1c1917'
    }
  },
  {
    id: 'lavender',
    name: 'Lavender',
    description: 'Soft purple theme with elegant aesthetics',
    colors: {
      background: '#1a0f1a',
      surface: '#2a1829',
      surfaceHover: '#3a2139',
      textPrimary: '#faf5ff',
      textSecondary: '#e9d5ff',
      textMuted: '#d8b4fe',
      accent: '#a855f7',
      accentHover: '#9333ea',
      border: '#6b21a8',
      borderHover: '#7e22ce',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      userMessage: '#581c87',
      aiMessage: '#2a1829',
      codeBlock: '#1e1b4b'
    }
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Sentry-inspired dark theme with purple and orange',
    colors: {
      background: '#1a1621',
      surface: '#2a2139',
      surfaceHover: '#3a2f4a',
      textPrimary: '#f8fafc',
      textSecondary: '#e2e8f0',
      textMuted: '#cbd5e1',
      accent: '#f97316',
      accentHover: '#ea580c',
      border: '#4c1d95',
      borderHover: '#5b21b6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      userMessage: '#7c2d12',
      aiMessage: '#2a2139',
      codeBlock: '#1e1b4b'
    }
  }
]

export const getTheme = (themeId: string): Theme => {
  return themes.find(theme => theme.id === themeId) || themes[0]
}

export const defaultTheme = themes[0]