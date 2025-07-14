import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAppState } from '../store/hooks'
import { getTheme, type Theme } from '../utils/themes'

interface ThemeContextType {
  theme: Theme
  setTheme: (themeId: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { selectedTheme, setSelectedTheme } = useAppState()
  const theme = getTheme(selectedTheme)

  useEffect(() => {
    // Apply theme as CSS custom properties to the document root
    const root = document.documentElement
    
    // Set CSS custom properties for the theme
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })
    
    // Set the background color on the body
    document.body.style.backgroundColor = theme.colors.background
    document.body.style.color = theme.colors.textPrimary
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setSelectedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}