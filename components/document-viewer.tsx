"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, ChevronRight, Download, Maximize2, ZoomIn, ZoomOut } from "lucide-react"

export type DocumentFile = {
  id: string
  name: string
  type: "image" | "pdf" | "text" | "code" | "markdown" | "spreadsheet"
  content?: string
  url?: string
  language?: string
}

interface DocumentViewerProps {
  isOpen: boolean
  onClose: () => void
  document: DocumentFile | null
  documents: DocumentFile[]
  currentIndex: number
  onNavigate: (index: number) => void
}

export function DocumentViewer({
  isOpen,
  onClose,
  document,
  documents,
  currentIndex,
  onNavigate,
}: DocumentViewerProps) {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const activeDoc = document || (documents.length > 0 ? documents[currentIndex] : null)

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleDownload = () => {
    if (!activeDoc) return

    if (activeDoc.url) {
      // For files with URLs, create a download link
      const a = document.createElement("a")
      a.href = activeDoc.url
      a.download = activeDoc.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else if (activeDoc.content) {
      // For text content, create a blob and download
      const blob = new Blob([activeDoc.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = activeDoc.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false)
        })
      }
    }
  }

  const renderDocumentContent = () => {
    if (!activeDoc) return null

    switch (activeDoc.type) {
      case "image":
        return (
          <div className="flex items-center justify-center h-full">
            <img
              src={activeDoc.url || "/placeholder.svg"}
              alt={activeDoc.name}
              style={{ transform: `scale(${zoomLevel})`, maxWidth: "100%", transition: "transform 0.2s" }}
              className="max-h-[70vh]"
            />
          </div>
        )
      case "pdf":
        return (
          <div className="text-center p-8">
            <p className="mb-4">PDF preview is not available due to security restrictions.</p>
            <Button variant="outline" onClick={handleDownload} className="mt-4">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        )
      case "text":
      case "markdown":
      case "code":
        return (
          <ScrollArea className="h-[70vh] w-full">
            <pre
              className="p-4 whitespace-pre-wrap break-words bg-muted rounded-md"
              style={{ fontSize: `${Math.max(100 * zoomLevel, 75)}%` }}
            >
              {activeDoc.content || "File content preview is not available."}
            </pre>
          </ScrollArea>
        )
      case "spreadsheet":
        return (
          <div className="text-center p-8">
            <p>Spreadsheet preview not available.</p>
            {activeDoc.url && (
              <Button variant="outline" onClick={handleDownload} className="mt-4">
                <Download className="h-4 w-4 mr-2" />
                Download Spreadsheet
              </Button>
            )}
          </div>
        )
      default:
        return <div>Unsupported file type</div>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>{activeDoc?.name || "Document Viewer"}</DialogTitle>
          <DialogDescription>
            {documents.length > 1 && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm">
                  Document {currentIndex + 1} of {documents.length}
                </span>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoomLevel <= 0.5}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm">{Math.round(zoomLevel * 100)}%</span>
            <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoomLevel >= 3}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {documents.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onNavigate(Math.min(documents.length - 1, currentIndex + 1))}
                  disabled={currentIndex === documents.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="outline" size="icon" onClick={toggleFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-background">{renderDocumentContent()}</div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
