import { themes, type Theme } from '../utils/themes'
import { useAppState } from '../store/hooks'

interface ThemePreviewProps {
  theme: Theme
  isSelected: boolean
  onSelect: () => void
}

function ThemePreview({ theme, isSelected, onSelect }: ThemePreviewProps) {
  return (
    <div
      className={`
        relative cursor-pointer rounded-lg p-4 border-2 transition-all duration-200
        ${isSelected 
          ? 'border-orange-500 ring-2 ring-orange-500/20' 
          : 'border-gray-600 hover:border-gray-500'
        }
      `}
      onClick={onSelect}
      style={{ backgroundColor: theme.colors.surface }}
    >
      {/* Theme preview content */}
      <div className="space-y-2">
        {/* Header bar */}
        <div 
          className="h-6 rounded flex items-center justify-between px-2"
          style={{ backgroundColor: theme.colors.background }}
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <div 
            className="text-xs font-medium px-2 py-1 rounded"
            style={{ 
              color: theme.colors.textPrimary,
              backgroundColor: theme.colors.accent 
            }}
          >
            {theme.name}
          </div>
        </div>
        
        {/* Chat messages preview */}
        <div className="space-y-1">
          <div 
            className="text-xs p-2 rounded max-w-24 ml-auto"
            style={{ 
              backgroundColor: theme.colors.userMessage,
              color: theme.colors.textPrimary 
            }}
          >
            Hello there!
          </div>
          <div 
            className="text-xs p-2 rounded max-w-32"
            style={{ 
              backgroundColor: theme.colors.aiMessage,
              color: theme.colors.textPrimary 
            }}
          >
            Hi! How can I help you today?
          </div>
        </div>
        
        {/* Code block preview */}
        <div 
          className="text-xs p-2 rounded font-mono"
          style={{ 
            backgroundColor: theme.colors.codeBlock,
            color: theme.colors.textSecondary 
          }}
        >
          console.log("Hello");
        </div>
      </div>
      
      {/* Theme name and description */}
      <div className="mt-3 text-center">
        <h4 
          className="text-sm font-medium"
          style={{ color: theme.colors.textPrimary }}
        >
          {theme.name}
        </h4>
        <p 
          className="text-xs mt-1"
          style={{ color: theme.colors.textMuted }}
        >
          {theme.description}
        </p>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export function ThemeSelector() {
  const { selectedTheme, setSelectedTheme } = useAppState()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white">
          Theme
        </label>
        <span className="text-xs text-gray-400">
          Choose your preferred theme
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme) => (
          <ThemePreview
            key={theme.id}
            theme={theme}
            isSelected={selectedTheme === theme.id}
            onSelect={() => setSelectedTheme(theme.id)}
          />
        ))}
      </div>
    </div>
  )
}