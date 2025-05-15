import { MainChatInterface } from "@/components/main-chat-interface"
import { UnifiedChatProvider } from "@/contexts/unified-chat-context"

export default function ChatPage() {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Project Chat</h1>
      <UnifiedChatProvider>
        <MainChatInterface />
      </UnifiedChatProvider>
    </div>
  )
}
