"use client"

import { useState, useCallback } from "react"

interface ResizerProps {
  direction: "horizontal" | "vertical"
  onResize: (delta: number) => void
}

export function Resizer({ direction, onResize }: ResizerProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
    document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize"

    const handleMouseMove = (e: MouseEvent) => {
      const delta = direction === "horizontal" ? e.movementX : e.movementY
      onResize(delta)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ""
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [direction, onResize])

  return (
    <div
      className={`flex-shrink-0 ${
        direction === "horizontal" ? "w-1 hover:w-1 cursor-col-resize" : "h-1 hover:h-1 cursor-row-resize"
      } bg-transparent hover:bg-accent transition-all ${isDragging ? "bg-primary" : ""}`}
      onMouseDown={handleMouseDown}
    />
  )
}
