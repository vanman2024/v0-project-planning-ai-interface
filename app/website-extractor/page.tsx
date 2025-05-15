"use client"

import { WebsiteContentExtractor } from "@/components/website-content-extractor"

export default function WebsiteExtractorPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Website Content Extractor</h1>
        <p className="text-muted-foreground">Extract and analyze content from any website with AI-powered insights</p>
      </div>

      <WebsiteContentExtractor />
    </div>
  )
}
