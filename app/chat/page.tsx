import { ChatInterface } from "@/components/chat/chat-interface"

export default function ChatPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Project Chat</h1>
      <ChatInterface />
    </div>
  )
}
