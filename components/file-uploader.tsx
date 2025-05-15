"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, X, FileText, ImageIcon, Code, File, FileJson, FileTextIcon as FileMarkdown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FileUploaderProps {
  files: File[]
  onUpdate: (files: File[]) => void
}

export function FileUploader({ files, onUpdate }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return

    const filesArray = Array.from(newFiles)
    console.log(`Processing ${filesArray.length} files for upload`)
    onUpdate([...files, ...filesArray])
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    onUpdate(newFiles)
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-6 w-6 text-blue-500" />
    if (file.type === "application/pdf") return <FileText className="h-6 w-6 text-red-500" />
    if (file.name.endsWith(".md") || file.name.endsWith(".markdown") || file.type === "text/markdown")
      return <FileMarkdown className="h-6 w-6 text-purple-500" />
    if (file.name.endsWith(".json") || file.type === "application/json")
      return <FileJson className="h-6 w-6 text-yellow-500" />
    if (
      file.name.endsWith(".js") ||
      file.name.endsWith(".ts") ||
      file.name.endsWith(".jsx") ||
      file.name.endsWith(".tsx")
    ) {
      return <Code className="h-6 w-6 text-green-500" />
    }
    return <File className="h-6 w-6 text-gray-500" />
  }

  const getFileTypeLabel = (file: File) => {
    if (file.type.startsWith("image/")) return "Image"
    if (file.type === "application/pdf") return "PDF"
    if (file.name.endsWith(".md") || file.name.endsWith(".markdown") || file.type === "text/markdown") return "Markdown"
    if (file.name.endsWith(".json") || file.type === "application/json") return "JSON"
    if (
      file.name.endsWith(".js") ||
      file.name.endsWith(".ts") ||
      file.name.endsWith(".jsx") ||
      file.name.endsWith(".tsx")
    ) {
      return "Code"
    }
    return "Document"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Files</CardTitle>
        <CardDescription>Upload requirements documents, mockups, code, or markdown files</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Drag and drop files here, or click to select files</p>
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            <Badge variant="outline">Images</Badge>
            <Badge variant="outline">PDFs</Badge>
            <Badge variant="outline">Markdown</Badge>
            <Badge variant="outline">JSON</Badge>
            <Badge variant="outline">Code</Badge>
          </div>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            Select Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Uploaded Files ({files.length})</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center">
                    {getFileIcon(file)}
                    <div className="ml-2">
                      <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {getFileTypeLabel(file)}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFile(index)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove {file.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
