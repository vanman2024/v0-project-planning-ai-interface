"use client"

import { Button } from "@/components/ui/button"
import { MessageSquare, Smile, Bookmark, Share, MoreHorizontal } from "lucide-react"

interface MessageUtilityBarProps {
  className?: string
  onReply?: () => void
  onReact?: () => void
  onBookmark?: () => void
  onShare?: () => void
  onMore?: () => void
}

export function MessageUtilityBar({
  className = "",
  onReply,
  onReact,
  onBookmark,
  onShare,
  onMore,
}: MessageUtilityBarProps) {
  return (
    <div className={`flex items-center gap-1 mt-1 ${className}`}>
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onReply}>
        <MessageSquare className="h-3.5 w-3.5" />
        <span className="sr-only">Reply in thread</span>
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onReact}>
        <Smile className="h-3.5 w-3.5" />
        <span className="sr-only">Add reaction</span>
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onBookmark}>
        <Bookmark className="h-3.5 w-3.5" />
        <span className="sr-only">Save message</span>
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onShare}>
        <Share className="h-3.5 w-3.5" />
        <span className="sr-only">Share message</span>
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={onMore}>
        <MoreHorizontal className="h-3.5 w-3.5" />
        <span className="sr-only">More options</span>
      </Button>
    </div>
  )
}
