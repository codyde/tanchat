import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAppState } from '../store/hooks'

interface Model {
  id: string
  name: string
  provider: string
}

const AVAILABLE_MODELS: Model[] = [
  { 
    id: 'claude-sonnet-4-20250514', 
    name: 'Claude Sonnet 4', 
    provider: 'Anthropic'
  },
  { 
    id: 'o3-mini', 
    name: 'o3-mini', 
    provider: 'OpenAI'
  },
  { 
    id: 'grok-4', 
    name: 'Grok 4', 
    provider: 'xAI'
  },
  { 
    id: 'grok-3-mini', 
    name: 'Grok 3 Mini (Reasoning)', 
    provider: 'xAI'
  }
]

interface ModelSelectorProps {
  showAsButton?: boolean
  className?: string
}

export function ModelSelector({ showAsButton = false, className = '' }: ModelSelectorProps) {
  const { selectedModel, setSelectedModel } = useAppState()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentModel = AVAILABLE_MODELS.find(model => model.id === selectedModel) || AVAILABLE_MODELS[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId)
    setIsOpen(false)
  }

  if (showAsButton) {
    return (
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none"
        >
          <span>{currentModel.name}</span>
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute bottom-full mb-2 left-0 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl overflow-hidden z-50 min-w-[160px]">
            {AVAILABLE_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-800/50 transition-colors duration-150 ${
                  selectedModel === model.id ? 'bg-gray-800/30 text-white' : 'text-gray-300'
                }`}
              >
                <div className="font-medium">{model.name}</div>
                <div className="text-xs text-gray-500">{model.provider}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Original full dropdown for other uses
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 text-sm bg-gray-800/60 hover:bg-gray-700/60 rounded-lg border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 w-full"
      >
        <div className="flex-1 text-left">
          <div className="font-medium text-white">{currentModel.name}</div>
          <div className="text-xs text-gray-400">{currentModel.provider}</div>
        </div>
        
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-2xl overflow-hidden">
          {AVAILABLE_MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => handleModelSelect(model.id)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-800/50 transition-colors duration-150 border-b border-gray-700/30 last:border-b-0 ${
                selectedModel === model.id ? 'bg-gray-800/30' : ''
              }`}
            >
              <div className="font-medium text-white text-sm">{model.name}</div>
              <div className="text-xs text-gray-400">{model.provider}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}