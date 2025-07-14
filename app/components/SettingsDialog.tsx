import { useState } from 'react'
import { PlusCircle, Trash2, RotateCcw } from 'lucide-react'
import { useAppState, type Prompt } from '../store/hooks'
import { ThemeSelector } from './ThemeSelector'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [promptForm, setPromptForm] = useState({ name: '', content: '' })
  const [isAddingPrompt, setIsAddingPrompt] = useState(false)
  const { prompts, createPrompt, deletePrompt, setPromptActive, clearSettings } = useAppState()

  const handleAddPrompt = () => {
    if (!promptForm.name.trim() || !promptForm.content.trim()) return
    createPrompt(promptForm.name, promptForm.content)
    setPromptForm({ name: '', content: '' })
    setIsAddingPrompt(false)
  }

  const handleClose = () => {
    onClose()
    setIsAddingPrompt(false)
    setPromptForm({ name: '', content: '' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={(e) => {
      if (e.target === e.currentTarget) handleClose()
    }}>
      <div className="theme-bg-surface rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto theme-transition" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold theme-text-primary">Settings</h2>
            <button
              onClick={handleClose}
              className="theme-text-muted hover:theme-text-primary focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Theme Selection */}
            <ThemeSelector />
            
            {/* Prompts Management */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium theme-text-primary">
                  System Prompts
                </label>
                <button
                  onClick={() => setIsAddingPrompt(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Prompt
                </button>
              </div>

              {isAddingPrompt && (
                <div className="space-y-3 mb-4 p-3 bg-gray-700/50 rounded-lg">
                  <input
                    type="text"
                    value={promptForm.name}
                    onChange={(e) => setPromptForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Prompt name..."
                    className="w-full px-3 py-2 text-sm text-white bg-gray-700 rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <textarea
                    value={promptForm.content}
                    onChange={(e) => setPromptForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Enter prompt content..."
                    className="w-full h-32 px-3 py-2 text-sm text-white bg-gray-700 rounded-lg border border-gray-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsAddingPrompt(false)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white focus:outline-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddPrompt}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      Save Prompt
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {prompts.map((prompt) => (
                  <div key={prompt.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex-1 min-w-0 mr-4">
                      <h4 className="text-sm font-medium text-white truncate">{prompt.name}</h4>
                      <p className="text-xs text-gray-400 truncate">{prompt.content}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={prompt.is_active}
                          onChange={() => setPromptActive(prompt.id, !prompt.is_active)}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                      <button
                        onClick={() => deletePrompt(prompt.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400">
                Create and manage custom system prompts. Only one prompt can be active at a time.
              </p>
            </div>

            {/* Clear Settings Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Reset Settings
              </label>
              <div className="p-3 bg-gray-700/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-3">
                  Clear all saved settings including model selection and reasoning configuration. This will reset everything to defaults.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all settings? This cannot be undone.')) {
                      clearSettings()
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Clear All Settings
                </button>
              </div>
            </div>

          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
