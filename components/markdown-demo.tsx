"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MarkdownPreview } from "./markdown-preview"

const SAMPLE_MARKDOWN = `# Markdown Preview Demo

## Introduction
This is a demonstration of the markdown preview functionality. You can edit this content in the editor tab and see the preview in real-time.

## Features

### Text Formatting
You can use **bold text** or *italic text* to emphasize important points.

### Lists
Unordered list:
- Item 1
- Item 2
- Item 3

Ordered list:
1. First item
2. Second item
3. Third item

### Task Lists
- [ ] Incomplete task
- [x] Completed task

### Code Blocks
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

Inline code: \`const x = 42;\`

### Blockquotes
> This is a blockquote. It can be used to highlight important information or quotes.

### Links
[Visit GitHub](https://github.com)

---

## Project Requirements

### User Authentication
- Users should be able to register with email/password
- Login functionality with remember me option
- Password reset flow
- Email verification
- Profile management

### Product Catalog
- Product listing with pagination
- Product details view
- Product search with filters
- Product categories and tags
- Product reviews and ratings
`

export function MarkdownDemo() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN)
  const [activeTab, setActiveTab] = useState<"preview" | "editor">("preview")

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Markdown Editor & Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "preview" | "editor")}>
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="m-0">
            <MarkdownPreview content={markdown} fileName="example.md" />
          </TabsContent>

          <TabsContent value="editor" className="m-0">
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[500px] font-mono text-sm"
              placeholder="Enter markdown content here..."
            />
            <div className="flex justify-end mt-4">
              <Button onClick={() => setActiveTab("preview")}>Preview</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
