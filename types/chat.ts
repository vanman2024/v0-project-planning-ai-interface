export interface ChatMessage {
  id: string
  threadId: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
    isBot?: boolean
  }
  timestamp: Date
  read: boolean
}

export interface ChatThread {
  id: string
  name: string
  description?: string
  icon?: string
  unreadCount: number
  lastActivity?: Date
  participants: {
    id: string
    name: string
    avatar?: string
    isBot?: boolean
  }[]
  pinned?: boolean
}
