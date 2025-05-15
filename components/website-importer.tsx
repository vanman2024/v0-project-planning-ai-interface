"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Globe, X, Check, AlertCircle, Loader2, Eye, LinkIcon, ImageIcon, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Update the WebsiteLink interface to include more detailed extraction data
interface WebsiteLink {
  url: string
  title?: string
  status: "pending" | "imported" | "error" | "analyzing" | "extracting"
  description?: string
  tags?: string[]
  extractedContent?: {
    title?: string
    description?: string
    headings?: string[]
    links?: { text: string; url: string }[]
    images?: { alt: string; src: string }[]
    text?: string
    metadata?: Record<string, string>
    tables?: { headers: string[]; rows: string[][] }[]
    extractionDate?: string
    extractionProgress?: number
  }
}

// Update the WebsiteImporter component to include extraction options
interface WebsiteImporterProps {
  links: WebsiteLink[]
  onUpdate: (links: WebsiteLink[]) => void
}

export function WebsiteImporter({ links, onUpdate }: WebsiteImporterProps) {
  const [linkInput, setLinkInput] = useState("")
  const [bulkLinks, setBulkLinks] = useState("")
  const [showBulkInput, setShowBulkInput] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState("")
  const [extractionOptions, setExtractionOptions] = useState({
    extractText: true,
    extractImages: true,
    extractLinks: true,
    extractTables: true,
    extractMetadata: true,
  })
  const [showExtractionOptions, setShowExtractionOptions] = useState(false)
  const [selectedLink, setSelectedLink] = useState<WebsiteLink | null>(null)
  const [showExtractedContent, setShowExtractedContent] = useState(false)

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch (e) {
      return false
    }
  }

  // Update the handleImport function to include more detailed extraction
  const handleImport = () => {
    // Validate URL format
    if (!validateUrl(linkInput)) {
      setError("Please enter a valid URL")
      return
    }

    // Check if already imported
    if (links.some((link) => link.url === linkInput)) {
      setError("This website has already been imported")
      return
    }

    setError("")
    setIsImporting(true)

    // Simulate import and analysis process
    const newLink: WebsiteLink = {
      url: linkInput,
      status: "analyzing",
    }

    onUpdate([...links, newLink])

    // Simulate website analysis with more detailed steps
    setTimeout(() => {
      // Update to extracting status
      onUpdate(
        links.map((link) =>
          link.url === linkInput
            ? {
                ...link,
                status: "extracting",
                title: `Extracting: ${linkInput.replace(/^https?:\/\//, "").split("/")[0]}`,
                extractedContent: {
                  extractionProgress: 0,
                },
              }
            : link,
        ),
      )

      // Simulate progressive extraction
      let progress = 0
      const extractionInterval = setInterval(() => {
        progress += 20

        if (progress <= 100) {
          onUpdate(
            links.map((link) =>
              link.url === linkInput
                ? {
                    ...link,
                    status: "extracting",
                    extractedContent: {
                      ...link.extractedContent,
                      extractionProgress: progress,
                    },
                  }
                : link,
            ),
          )
        } else {
          clearInterval(extractionInterval)

          // Complete extraction with detailed content
          const domain = linkInput.replace(/^https?:\/\//, "").split("/")[0]
          onUpdate(
            links.map((link) =>
              link.url === linkInput
                ? {
                    ...link,
                    status: "imported",
                    title: `Website: ${domain}`,
                    description: "Content extracted from website. AI analysis complete.",
                    tags: ["auto-extracted", "website"],
                    extractedContent: {
                      title: `${domain} - Homepage`,
                      description: `This is the main page of ${domain} containing information about their products and services.`,
                      headings: ["Welcome to " + domain, "Our Services", "About Us", "Contact Information"],
                      links: [
                        { text: "Products", url: `https://${domain}/products` },
                        { text: "Services", url: `https://${domain}/services` },
                        { text: "About", url: `https://${domain}/about` },
                        { text: "Contact", url: `https://${domain}/contact` },
                      ],
                      images: [
                        { alt: "Logo", src: `https://${domain}/logo.png` },
                        { alt: "Hero Image", src: `https://${domain}/hero.jpg` },
                      ],
                      text: `Welcome to ${domain}. We provide innovative solutions for businesses of all sizes. Our team of experts is dedicated to delivering high-quality products and services to meet your needs. Contact us today to learn more about how we can help your business grow.`,
                      metadata: {
                        Author: "The " + domain + " Team",
                        Description: "Official website of " + domain,
                        Keywords: "business, services, solutions, " + domain,
                        Published: new Date().toLocaleDateString(),
                      },
                      tables: [
                        {
                          headers: ["Service", "Description", "Price"],
                          rows: [
                            ["Basic", "Essential features for small businesses", "$99/mo"],
                            ["Pro", "Advanced features for growing businesses", "$199/mo"],
                            ["Enterprise", "Complete solution for large organizations", "Contact us"],
                          ],
                        },
                      ],
                      extractionDate: new Date().toISOString(),
                      extractionProgress: 100,
                    },
                  }
                : link,
            ),
          )

          setLinkInput("")
          setIsImporting(false)
        }
      }, 500)
    }, 1000)
  }

  const handleBulkImport = () => {
    if (!bulkLinks.trim()) {
      setError("Please enter at least one URL")
      return
    }

    setError("")
    setIsImporting(true)

    // Parse URLs from textarea (one per line)
    const urls = bulkLinks
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url && validateUrl(url))
      .filter((url) => !links.some((link) => link.url === url))

    if (urls.length === 0) {
      setError("No valid URLs found or all URLs already imported")
      setIsImporting(false)
      return
    }

    // Create new link objects
    const newLinks = urls.map((url) => ({
      url,
      status: "analyzing" as const,
    }))

    onUpdate([...links, ...newLinks])

    // Simulate website analysis for each URL
    setTimeout(() => {
      onUpdate(
        links.map((link) => {
          if (newLinks.some((newLink) => newLink.url === link.url)) {
            return {
              ...link,
              status: "imported",
              title: `Website: ${link.url.replace(/^https?:\/\//, "").split("/")[0]}`,
              description: "Content extracted from website. AI analysis complete.",
              tags: ["auto-extracted", "website", "bulk-import"],
            }
          }
          return link
        }),
      )

      setBulkLinks("")
      setShowBulkInput(false)
      setIsImporting(false)
    }, 3000)
  }

  const removeLink = (url: string) => {
    onUpdate(links.filter((link) => link.url !== url))
  }

  // Update the analyzeWithAI function to use the Sparkles icon
  const analyzeWithAI = (url: string) => {
    // Update status to analyzing
    onUpdate(links.map((link) => (link.url === url ? { ...link, status: "analyzing" } : link)))

    // Simulate AI analysis
    setTimeout(() => {
      onUpdate(
        links.map((link) =>
          link.url === url
            ? {
                ...link,
                status: "imported",
                description: "Enhanced analysis complete. AI has extracted structured data from this website.",
                tags: [...(link.tags || []), "ai-enhanced"],
              }
            : link,
        ),
      )
    }, 2500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "imported":
        return <Check className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "analyzing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Globe className="h-4 w-4 text-blue-500" />
    }
  }

  // Add a function to view extracted content
  const viewExtractedContent = (link: WebsiteLink) => {
    setSelectedLink(link)
    setShowExtractedContent(true)
  }

  // Update the UI to include extraction options and content preview
  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Websites</CardTitle>
        <CardDescription>Import content from websites for AI analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!showBulkInput ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="https://example.com"
                  value={linkInput}
                  onChange={(e) => {
                    setLinkInput(e.target.value)
                    setError("")
                  }}
                />
                <Button onClick={handleImport} disabled={isImporting || !linkInput}>
                  {isImporting ? "Importing..." : "Import"}
                </Button>
              </div>
              <div className="flex justify-between">
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2">
                  <Button
                    variant="link"
                    className="text-sm p-0 h-auto"
                    onClick={() => setShowExtractionOptions(!showExtractionOptions)}
                  >
                    {showExtractionOptions ? "Hide extraction options" : "Show extraction options"}
                  </Button>
                  <Button variant="link" className="text-sm p-0 h-auto" onClick={() => setShowBulkInput(true)}>
                    Import multiple URLs
                  </Button>
                </div>
              </div>

              {showExtractionOptions && (
                <div className="p-3 border rounded-md bg-muted/30 space-y-2">
                  <h3 className="text-sm font-medium">Extraction Options</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="extractText"
                        checked={extractionOptions.extractText}
                        onCheckedChange={(checked) =>
                          setExtractionOptions({ ...extractionOptions, extractText: !!checked })
                        }
                      />
                      <label htmlFor="extractText" className="text-sm">
                        Extract Text
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="extractImages"
                        checked={extractionOptions.extractImages}
                        onCheckedChange={(checked) =>
                          setExtractionOptions({ ...extractionOptions, extractImages: !!checked })
                        }
                      />
                      <label htmlFor="extractImages" className="text-sm">
                        Extract Images
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="extractLinks"
                        checked={extractionOptions.extractLinks}
                        onCheckedChange={(checked) =>
                          setExtractionOptions({ ...extractionOptions, extractLinks: !!checked })
                        }
                      />
                      <label htmlFor="extractLinks" className="text-sm">
                        Extract Links
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="extractTables"
                        checked={extractionOptions.extractTables}
                        onCheckedChange={(checked) =>
                          setExtractionOptions({ ...extractionOptions, extractTables: !!checked })
                        }
                      />
                      <label htmlFor="extractTables" className="text-sm">
                        Extract Tables
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="extractMetadata"
                        checked={extractionOptions.extractMetadata}
                        onCheckedChange={(checked) =>
                          setExtractionOptions({ ...extractionOptions, extractMetadata: !!checked })
                        }
                      />
                      <label htmlFor="extractMetadata" className="text-sm">
                        Extract Metadata
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Textarea
                placeholder="Enter URLs (one per line)&#10;https://example.com&#10;https://another-site.com"
                value={bulkLinks}
                onChange={(e) => {
                  setBulkLinks(e.target.value)
                  setError("")
                }}
                rows={4}
              />
              <div className="flex justify-between">
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowBulkInput(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBulkImport} disabled={isImporting || !bulkLinks.trim()}>
                    {isImporting ? "Importing..." : "Import All"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {links.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Imported Websites ({links.length})</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {links.map((link) => (
                  <div key={link.url} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center flex-1 min-w-0">
                      {getStatusIcon(link.status)}
                      <div className="ml-2 min-w-0">
                        <p className="text-sm font-medium">{link.title || link.url}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">{link.url}</p>

                        {link.status === "extracting" && link.extractedContent?.extractionProgress !== undefined && (
                          <div className="w-full mt-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Extracting content...</span>
                              <span>{link.extractedContent.extractionProgress}%</span>
                            </div>
                            <Progress value={link.extractedContent.extractionProgress} className="h-1" />
                          </div>
                        )}

                        {link.tags && link.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {link.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {link.status === "imported" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => viewExtractedContent(link)}
                          className="h-7 w-7 p-0"
                          title="View Extracted Content"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {link.status !== "analyzing" && link.status !== "extracting" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => analyzeWithAI(link.url)}
                          className="h-7 w-7 p-0"
                          title="Enhance with AI"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeLink(link.url)}
                        className="h-7 w-7 p-0"
                        title="Remove"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Extracted Content Dialog */}
      <Dialog open={showExtractedContent} onOpenChange={setShowExtractedContent}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Extracted Content</DialogTitle>
          </DialogHeader>

          {selectedLink && selectedLink.extractedContent && (
            <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{selectedLink.extractedContent.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Extracted on {new Date(selectedLink.extractedContent.extractionDate || "").toLocaleString()}
                </p>
                <p>{selectedLink.extractedContent.description}</p>
              </div>

              {selectedLink.extractedContent.metadata &&
                Object.keys(selectedLink.extractedContent.metadata).length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-md font-medium">Metadata</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {Object.entries(selectedLink.extractedContent.metadata).map(([key, value]) => (
                          <div key={key} className="col-span-1">
                            <dt className="text-xs font-medium text-muted-foreground">{key}</dt>
                            <dd className="text-sm">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                )}

              {selectedLink.extractedContent.headings && selectedLink.extractedContent.headings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-md font-medium">Page Structure</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedLink.extractedContent.headings.map((heading, i) => (
                      <li key={i} className="text-sm">
                        {heading}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedLink.extractedContent.text && (
                <div className="space-y-2">
                  <h4 className="text-md font-medium">Extracted Text</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm whitespace-pre-line">{selectedLink.extractedContent.text}</p>
                  </div>
                </div>
              )}

              {selectedLink.extractedContent.links && selectedLink.extractedContent.links.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-md font-medium">Links</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedLink.extractedContent.links.map((link, i) => (
                      <div key={i} className="flex items-center gap-1 text-sm">
                        <LinkIcon className="h-3 w-3 text-muted-foreground" />
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline truncate"
                        >
                          {link.text}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLink.extractedContent.images && selectedLink.extractedContent.images.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-md font-medium">Images</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedLink.extractedContent.images.map((image, i) => (
                      <div key={i} className="border rounded-md p-2 text-center">
                        <div className="bg-muted h-20 flex items-center justify-center rounded-md mb-1">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-xs truncate">{image.alt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedLink.extractedContent.tables && selectedLink.extractedContent.tables.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-md font-medium">Tables</h4>
                  {selectedLink.extractedContent.tables.map((table, tableIndex) => (
                    <div key={tableIndex} className="border rounded-md overflow-x-auto">
                      <table className="min-w-full divide-y divide-border">
                        <thead>
                          <tr>
                            {table.headers.map((header, i) => (
                              <th key={i} className="px-3 py-2 text-left text-xs font-medium bg-muted">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {table.rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2 text-xs">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex justify-between">
                <Button variant="outline" onClick={() => analyzeWithAI(selectedLink.url)}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze with AI
                </Button>
                <Button onClick={() => setShowExtractedContent(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
