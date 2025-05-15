"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Loader2, FileText, ListTree, Lightbulb, Zap, Check, Copy, Download } from "lucide-react"

interface AIContentAnalysisResult {
  summary: string
  keyInsights: string[]
  topics: { name: string; relevance: number }[]
  entities: { name: string; type: string; mentions: number }[]
  sentiment: {
    overall: "positive" | "neutral" | "negative"
    score: number
    aspects: { aspect: string; sentiment: "positive" | "neutral" | "negative" }[]
  }
  readability: {
    score: number
    level: "Easy" | "Medium" | "Difficult"
    stats: {
      words: number
      sentences: number
      paragraphs: number
      avgSentenceLength: number
      avgWordLength: number
    }
  }
  structuredData: Record<string, any>
  recommendations: string[]
}

interface AIContentAnalyzerProps {
  content: string
  onAnalysisComplete?: (result: AIContentAnalysisResult) => void
}

export function AIContentAnalyzer({ content, onAnalysisComplete }: AIContentAnalyzerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("summary")
  const [analysisResult, setAnalysisResult] = useState<AIContentAnalysisResult | null>(null)

  const handleAnalyze = () => {
    if (!content) return

    setIsAnalyzing(true)
    setProgress(0)

    // Simulate analysis process
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 5
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)

        // Generate mock analysis result
        const mockResult: AIContentAnalysisResult = {
          summary:
            "This content appears to be from a business website offering various services including consulting, product development, and digital marketing. The website presents the company as an established business with expertise in helping other businesses grow and succeed in competitive markets.",
          keyInsights: [
            "The company offers multiple service tiers with different pricing models",
            "The business was founded in 2010 and positions itself as experienced",
            "The website emphasizes team expertise and quality of service",
            "Contact information and call-to-actions are prominently featured",
            "The content is professionally written and targets business customers",
          ],
          topics: [
            { name: "Business Services", relevance: 0.92 },
            { name: "Consulting", relevance: 0.85 },
            { name: "Product Development", relevance: 0.78 },
            { name: "Digital Marketing", relevance: 0.72 },
            { name: "Customer Support", relevance: 0.65 },
          ],
          entities: [
            { name: "Strategic Consulting", type: "Service", mentions: 3 },
            { name: "Product Development", type: "Service", mentions: 2 },
            { name: "Digital Marketing", type: "Service", mentions: 2 },
            { name: "John Doe", type: "Person", mentions: 1 },
            { name: "Jane Smith", type: "Person", mentions: 1 },
          ],
          sentiment: {
            overall: "positive",
            score: 0.78,
            aspects: [
              { aspect: "Services", sentiment: "positive" },
              { aspect: "Team", sentiment: "positive" },
              { aspect: "Pricing", sentiment: "neutral" },
              { aspect: "Support", sentiment: "positive" },
            ],
          },
          readability: {
            score: 65,
            level: "Medium",
            stats: {
              words: 250,
              sentences: 15,
              paragraphs: 6,
              avgSentenceLength: 16.7,
              avgWordLength: 5.2,
            },
          },
          structuredData: {
            organization: {
              name: content.includes("domain") ? content.match(/Welcome to ([^.]+)/)?.[1] || "Company" : "Company",
              foundingDate: "2010",
              services: ["Strategic Consulting", "Product Development", "Digital Marketing", "Customer Support"],
              contactPoint: {
                type: "ContactPoint",
                email: content.match(/Email: ([^\n]+)/)?.[1] || "info@example.com",
                telephone: content.match(/Phone: ([^\n]+)/)?.[1] || "(555) 123-4567",
                address: content.match(/Address: ([^\n]+)/)?.[1] || "123 Business St, Tech City, TC 12345",
              },
            },
            offers: [
              {
                name: "Basic",
                description: "Essential features for small businesses",
                price: "$99/mo",
              },
              {
                name: "Pro",
                description: "Advanced features for growing businesses",
                price: "$199/mo",
              },
              {
                name: "Enterprise",
                description: "Complete solution for large organizations",
                price: "Contact us",
              },
            ],
          },
          recommendations: [
            "Add more specific case studies or success stories to build credibility",
            "Include testimonials from satisfied clients",
            "Expand the service descriptions with more specific benefits",
            "Add a FAQ section to address common customer questions",
            "Consider adding a blog section for content marketing",
          ],
        }

        setAnalysisResult(mockResult)
        setIsAnalyzing(false)

        if (onAnalysisComplete) {
          onAnalysisComplete(mockResult)
        }
      }
    }, 100)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Content Analyzer
        </CardTitle>
        <CardDescription>Analyze content with AI to extract insights and structured data</CardDescription>
      </CardHeader>
      <CardContent>
        {!analysisResult && !isAnalyzing ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Paste content to analyze or use the extracted website content"
              value={content}
              readOnly
              className="min-h-[200px]"
            />
            <Button onClick={handleAnalyze} disabled={!content}>
              <Bot className="mr-2 h-4 w-4" />
              Analyze Content
            </Button>
          </div>
        ) : isAnalyzing ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>Analyzing content...</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{progress}% complete</p>
              <div className="flex flex-wrap gap-2">
                {progress >= 20 && (
                  <Badge variant="outline" className="text-xs">
                    Extracting topics
                  </Badge>
                )}
                {progress >= 40 && (
                  <Badge variant="outline" className="text-xs">
                    Identifying entities
                  </Badge>
                )}
                {progress >= 60 && (
                  <Badge variant="outline" className="text-xs">
                    Analyzing sentiment
                  </Badge>
                )}
                {progress >= 80 && (
                  <Badge variant="outline" className="text-xs">
                    Generating insights
                  </Badge>
                )}
                {progress >= 90 && (
                  <Badge variant="outline" className="text-xs">
                    Creating recommendations
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="entities">Entities</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="structured">Structured</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Summary
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => copyToClipboard(analysisResult?.summary || "")}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy summary</span>
                    </Button>
                  </div>
                  <p className="text-sm">{analysisResult?.summary}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Key Insights
                  </h3>
                  <ul className="space-y-1">
                    {analysisResult?.keyInsights.map((insight, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Recommendations
                  </h3>
                  <ul className="space-y-1">
                    {analysisResult?.recommendations.map((recommendation, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="topics" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <ListTree className="h-4 w-4" />
                  Main Topics
                </h3>
                <div className="space-y-3">
                  {analysisResult?.topics.map((topic, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{topic.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(topic.relevance * 100)}% relevance
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${topic.relevance * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="entities" className="space-y-4 pt-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Identified Entities</h3>
                <div className="border rounded-md">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium bg-muted">Entity</th>
                        <th className="px-3 py-2 text-left text-xs font-medium bg-muted">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium bg-muted">Mentions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {analysisResult?.entities.map((entity, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 text-sm">{entity.name}</td>
                          <td className="px-3 py-2 text-sm">
                            <Badge variant="outline" className="font-normal">
                              {entity.type}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-sm">{entity.mentions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Overall Sentiment</h3>
                  <Badge
                    variant={
                      analysisResult?.sentiment.overall === "positive"
                        ? "success"
                        : analysisResult?.sentiment.overall === "negative"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {analysisResult?.sentiment.overall}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Negative</span>
                    <span className="text-xs text-muted-foreground">Positive</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(analysisResult?.sentiment.score || 0) * 100}%` }}
                    />
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    Score: {Math.round((analysisResult?.sentiment.score || 0) * 100)}%
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Aspect-Based Sentiment</h3>
                  <div className="space-y-3">
                    {analysisResult?.sentiment.aspects.map((aspect, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{aspect.aspect}</span>
                        <Badge
                          variant={
                            aspect.sentiment === "positive"
                              ? "success"
                              : aspect.sentiment === "negative"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {aspect.sentiment}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Readability</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Readability Score</span>
                      <Badge variant="outline">
                        {analysisResult?.readability.score}/100 ({analysisResult?.readability.level})
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">Words: {analysisResult?.readability.stats.words}</div>
                      <div className="text-sm">Sentences: {analysisResult?.readability.stats.sentences}</div>
                      <div className="text-sm">Paragraphs: {analysisResult?.readability.stats.paragraphs}</div>
                      <div className="text-sm">
                        Avg. Sentence: {analysisResult?.readability.stats.avgSentenceLength.toFixed(1)} words
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="structured" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Structured Data</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(JSON.stringify(analysisResult?.structuredData, null, 2))}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy JSON
                  </Button>
                </div>

                <ScrollArea className="h-[300px]">
                  <pre className="text-xs bg-muted p-3 rounded-md whitespace-pre-wrap">
                    {JSON.stringify(analysisResult?.structuredData, null, 2)}
                  </pre>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center">
          {analysisResult && (
            <Badge variant="outline" className="text-xs">
              <Check className="h-3 w-3 mr-1" />
              Analysis Complete
            </Badge>
          )}
        </div>
        {analysisResult && (
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Analysis
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
