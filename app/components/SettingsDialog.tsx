import { useState, useEffect, useRef } from 'react'
import { useDB, getPrompts, createPrompt, deletePrompt, setPromptActive, getUserSetting, setUserSetting, type DBPrompt } from '../utils/db'
import { PlusCircle, Trash2, User } from 'lucide-react'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  onAvatarChange?: (avatarUrl: string) => void
}

export function SettingsDialog({ isOpen, onClose, onAvatarChange }: SettingsDialogProps) {
  const [prompts, setPrompts] = useState<DBPrompt[]>([])
  const [promptForm, setPromptForm] = useState({ name: '', content: '' })
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isAddingPrompt, setIsAddingPrompt] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isReady } = useDB()

  useEffect(() => {
    if (isOpen && isReady) {
      try {
        // Load prompts
        const loadedPrompts = getPrompts()
        setPrompts(loadedPrompts)

        // Load avatar
        const avatar = getUserSetting('avatar')
        if (avatar) {
          setAvatarUrl(avatar)
        }
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [isOpen, isReady])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setUserSetting('avatar', base64String)
        setAvatarUrl(base64String)
        onAvatarChange?.(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddPrompt = () => {
    if (!promptForm.name.trim() || !promptForm.content.trim()) return
    
    const id = Date.now().toString()
    createPrompt(id, promptForm.name, promptForm.content)
    setPrompts(getPrompts())
    setPromptForm({ name: '', content: '' })
    setIsAddingPrompt(false)
  }

  const handleDeletePrompt = (id: string) => {
    deletePrompt(id)
    setPrompts(getPrompts())
  }

  const handleSetActivePrompt = (id: string, currentlyActive: boolean) => {
    setPromptActive(id, !currentlyActive)
    setPrompts(getPrompts())
  }

  const handleSave = () => {
    onClose()
  }

  const handleClose = () => {
    onClose()
    // Reset the form when closing
    setIsAddingPrompt(false)
    setPromptForm({ name: '', content: '' })
  }

  const handleResetDatabase = () => {
    if (window.confirm('This will reset your database and clear all conversations. Are you sure?')) {
      localStorage.removeItem('chatdb')
      window.location.reload()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={(e) => {
      if (e.target === e.currentTarget) handleClose()
    }}>
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">Settings</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                User Avatar
              </label>
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden"
                  style={avatarUrl ? { backgroundImage: `url(${avatarUrl})`, backgroundSize: 'cover' } : undefined}
                >
                  {!avatarUrl && <User className="w-8 h-8 text-gray-400" />}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  Upload Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-gray-400">
                Upload a profile picture to personalize your chat experience.
              </p>
            </div>

            {/* Prompts Management */}
            <div className="space-y-2 border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-white">
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
                          onChange={() => handleSetActivePrompt(prompt.id, prompt.is_active)}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                      <button
                        onClick={() => handleDeletePrompt(prompt.id)}
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

            <div className="border-t border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-white mb-2">Database Management</h3>
              <button
                onClick={handleResetDatabase}
                className="px-4 py-2 text-sm font-medium text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors focus:outline-none"
              >
                Reset Database
              </button>
              <p className="text-xs text-gray-400 mt-1">
                This will clear all conversations and settings. Use this if you encounter database issues.
              </p>
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
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
