"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DocumentViewer } from "@/components/document-viewer"

export function DocumentViewerTest() {
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  // Sample document
  const sampleDocument = {
    id: "doc1",
    name: "Sample Document.md",
    type: "markdown" as const,
    content:
      "# Sample Document\n\nThis is a sample document to test the document viewer functionality.\n\n## Features\n\n- View documents\n- Zoom in/out\n- Navigate between documents\n- Download documents",
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Document Viewer Test</h1>
      <p className="mb-4">Click the button below to open the document viewer:</p>

      <Button onClick={() => setIsViewerOpen(true)}>Open Document Viewer</Button>

      <DocumentViewer isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} document={sampleDocument} />
    </div>
  )
}
