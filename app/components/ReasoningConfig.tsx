import React from 'react'
import { Settings, Brain, FileText } from 'lucide-react'
import { useAppState } from '../store/hooks'

interface ReasoningConfigProps {
  className?: string
}

export function ReasoningConfig({ className = '' }: ReasoningConfigProps) {
  const { selectedModel, reasoningConfig, setReasoningEffort, setReasoningSummary } = useAppState()
  
  // Only show for reasoning models
  const isReasoningModel = selectedModel === 'o3-mini' || selectedModel.startsWith('o1-') || selectedModel === 'grok-3-mini'
  const isOpenAIReasoningModel = selectedModel === 'o3-mini' || selectedModel.startsWith('o1-')
  const isGrokReasoningModel = selectedModel === 'grok-3-mini'
  
  if (!isReasoningModel) {
    return null
  }

  const effortOptions = [
    { value: 'low', label: 'Low', description: 'Faster responses' },
    { value: 'medium', label: 'Medium', description: 'Balanced depth' },
    { value: 'high', label: 'High', description: 'Deeper reasoning' }
  ] as const

  const summaryOptions = [
    { value: 'none', label: 'None', description: 'No reasoning shown' },
    { value: 'auto', label: 'Auto', description: 'Condensed summary' },
    { value: 'detailed', label: 'Detailed', description: 'Full reasoning' }
  ] as const

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Reasoning Effort */}
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-gray-400" />
        <select
          value={reasoningConfig.reasoningEffort}
          onChange={(e) => setReasoningEffort(e.target.value as 'low' | 'medium' | 'high')}
          className="bg-gray-800/60 border border-gray-700/50 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-gray-600/50"
          title="Reasoning Effort"
        >
          {effortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reasoning Summary - Only for OpenAI models */}
      {isOpenAIReasoningModel && (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <select
            value={reasoningConfig.reasoningSummary}
            onChange={(e) => setReasoningSummary(e.target.value as 'auto' | 'detailed' | 'none')}
            className="bg-gray-800/60 border border-gray-700/50 rounded-md px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-gray-600/50"
            title="Reasoning Summary"
          >
            {summaryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Info indicator */}
      <div className="flex items-center">
        <Settings className="w-4 h-4 text-gray-500" title="Reasoning Configuration" />
      </div>
    </div>
  )
}