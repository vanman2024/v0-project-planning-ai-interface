"use client"
import { Button } from "@/components/ui/button"

interface MessageReactionsProps {
  reactions: string[]
  onAddReaction?: (reaction: string) => void
}

export function MessageReactions({ reactions, onAddReaction }: MessageReactionsProps) {
  // Group and count reactions
  const reactionCounts: Record<string, number> = {}
  reactions.forEach((reaction) => {
    reactionCounts[reaction] = (reactionCounts[reaction] || 0) + 1
  })

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(reactionCounts).map(([reaction, count]) => (
        <Button
          key={reaction}
          variant="outline"
          size="sm"
          className="h-6 px-2 text-xs rounded-full"
          onClick={() => onAddReaction?.(reaction)}
        >
          {reaction} {count}
        </Button>
      ))}
      <Button variant="outline" size="sm" className="h-6 w-6 p-0 rounded-full" onClick={() => {}}>
        +
      </Button>
    </div>
  )
}
