import initSqlJs, { Database } from 'sql.js'
import { useEffect, useState } from 'react'

let db: Database | null = null
let SQL: Awaited<ReturnType<typeof initSqlJs>> | null = null

export async function initDB() {
  if (!db) {
    if (!SQL) {
      SQL = await initSqlJs({
        locateFile: file => `/sql-wasm.wasm`
      })
    }
    
    // Try to load existing data from localStorage
    const savedData = localStorage.getItem('chatdb')
    if (savedData) {
      const buffer = base64ToArrayBuffer(savedData)
      db = new SQL.Database(new Uint8Array(buffer))
    } else {
      // Create a new database
      db = new SQL.Database()
      
      // Create tables if this is a new database
      db.run(`
        CREATE TABLE IF NOT EXISTS conversations (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (unixepoch())
        );

        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          conversation_id TEXT NOT NULL,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at INTEGER NOT NULL DEFAULT (unixepoch()),
          FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
        );
      `)
      // Save the initial empty database
      saveToLocalStorage()
    }
  }
  return db
}

// Hook to ensure DB is initialized
export function useDB() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    
    const initialize = async () => {
      try {
        await initDB()
        if (mounted) {
          setIsReady(true)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize database'))
          setIsReady(false)
        }
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [])

  return { isReady, error }
}

// Conversation operations
export function createConversation(id: string, title: string) {
  if (!db) throw new Error('Database not initialized')
  db.run('INSERT INTO conversations (id, title) VALUES (?, ?)', [id, title])
  saveToLocalStorage()
}

export function updateConversationTitle(id: string, title: string) {
  if (!db) throw new Error('Database not initialized')
  db.run('UPDATE conversations SET title = ? WHERE id = ?', [title, id])
  saveToLocalStorage()
}

export function getConversations(): DBConversation[] {
  if (!db) throw new Error('Database not initialized')
  const result = db.exec('SELECT * FROM conversations ORDER BY created_at DESC')
  if (result.length === 0) return []
  
  return result[0].values.map(row => ({
    id: row[0] as string,
    title: row[1] as string,
    created_at: row[2] as number
  }))
}

export function deleteConversation(id: string) {
  if (!db) throw new Error('Database not initialized')
  db.run('DELETE FROM conversations WHERE id = ?', [id])
  saveToLocalStorage()
}

// Message operations
export function addMessage(message: { id: string, conversation_id: string, role: string, content: string }) {
  if (!db) throw new Error('Database not initialized')
  db.run(
    'INSERT INTO messages (id, conversation_id, role, content) VALUES (?, ?, ?, ?)',
    [message.id, message.conversation_id, message.role, message.content]
  )
  saveToLocalStorage()
}

export function getMessagesForConversation(conversationId: string): DBMessage[] {
  if (!db) throw new Error('Database not initialized')
  const result = db.exec(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
    [conversationId]
  )
  if (result.length === 0) return []
  
  return result[0].values.map(row => ({
    id: row[0] as string,
    conversation_id: row[1] as string,
    role: row[2] as string,
    content: row[3] as string,
    created_at: row[4] as number
  }))
}

// Persistence helpers
function saveToLocalStorage() {
  if (!db) return
  const data = db.export()
  localStorage.setItem('chatdb', arrayBufferToBase64(data))
}

// Helper functions for converting ArrayBuffer to/from Base64
function arrayBufferToBase64(buffer: Uint8Array) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

function base64ToArrayBuffer(base64: string) {
  const binaryString = window.atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

export type DBConversation = {
  id: string
  title: string
  created_at: number
}

export type DBMessage = {
  id: string
  conversation_id: string
  role: string
  content: string
  created_at: number
} 