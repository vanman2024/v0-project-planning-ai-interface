"use client"

import { useState } from "react"
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface DocumentFile {
  id: string
  name: string
  type: "pdf" | "image" | "text" | "code" | "markdown" | "spreadsheet"
  url?: string
  content?: string
  language?: string // For code files
  preview?: string // For image thumbnails
}

interface DocumentViewerProps {
  isOpen: boolean
  onClose: () => void
  document: DocumentFile | null
  documents?: DocumentFile[] // For multi-document viewing
  currentIndex?: number
  onNavigate?: (index: number) => void
}

export function DocumentViewer({
  isOpen,
  onClose,
  document,
  documents = [],
  currentIndex = 0,
  onNavigate,
}: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // If we have a documents array and a currentIndex, use that document
  const currentDocument = documents.length > 0 ? documents[currentIndex] : document
  const hasMultipleDocuments = documents.length > 1

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))

  const handleFullscreen = () => {
    if (document?.type === "image" && document.url) {
      const img = new Image()
      img.src = document.url
      const newWindow = window.open("")
      if (newWindow) {
        newWindow.document.write(img.outerHTML)
      }
    } else {
      setIsFullscreen(!isFullscreen)
    }
  }

  const handlePrevious = () => {
    if (onNavigate && currentIndex > 0) {
      onNavigate(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (onNavigate && currentIndex < documents.length - 1) {
      onNavigate(currentIndex + 1)
    }
  }

  const handleDownload = () => {
    if (currentDocument?.url) {
      const link = document.createElement("a")
      link.href = currentDocument.url
      link.download = currentDocument.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (!currentDocument) return null

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        className={`${isFullscreen ? "w-screen h-screen max-w-none p-0" : "w-[90%] sm:max-w-[700px] md:max-w-[900px]"}`}
        side="right"
      >
        {!isFullscreen && (
          <SheetHeader className="mb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="truncate">{currentDocument.name}</SheetTitle>
              <div className="flex items-center gap-2">
                {hasMultipleDocuments && (
                  <div className="flex items-center mr-2">
                    <Button variant="outline" size="icon" onClick={handlePrevious} disabled={currentIndex === 0}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="mx-2 text-sm">
                      {currentIndex + 1} / {documents.length}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNext}
                      disabled={currentIndex === documents.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs w-12 text-center">{zoom}%</span>
                <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoom >= 200}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleFullscreen}>
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" onClick={handleDownload} disabled={!currentDocument.url}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>
        )}

        <div className={`${isFullscreen ? "h-full" : "h-[calc(100vh-10rem)]"} overflow-hidden`}>
          <ScrollArea className="h-full">
            <div className="p-4" style={{ zoom: `${zoom}%` }}>
              {renderDocumentContent(currentDocument)}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function renderDocumentContent(document: DocumentFile) {
  switch (document.type) {
    case "image":
      return document.url ? (
        <div className="flex justify-center">
          <img src={document.url || "/placeholder.svg"} alt={document.name} className="max-w-full object-contain" />
        </div>
      ) : (
        <div className="text-center text-muted-foreground">Image preview not available</div>
      )

    case "pdf":
      return document.url ? (
        <iframe src={`${document.url}#toolbar=0`} className="w-full h-[calc(100vh-12rem)]" title={document.name} />
      ) : (
        <div className="text-center text-muted-foreground">PDF preview not available</div>
      )

    case "text":
    case "markdown":
      return (
        <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">
          {document.content || "No content available"}
        </div>
      )

    case "code":
      return (
        <div className="font-mono text-sm bg-muted p-4 rounded-md overflow-x-auto">
          <pre>{document.content || "No content available"}</pre>
        </div>
      )

    case "spreadsheet":
      return (
        <div className="text-center p-8">
          <p className="mb-4 text-muted-foreground">Spreadsheet preview not available</p>
          {document.url && <Button onClick={() => window.open(document.url, "_blank")}>Open Spreadsheet</Button>}
        </div>
      )

    default:
      return <div className="text-center text-muted-foreground">Preview not available for this file type</div>
  }
}
