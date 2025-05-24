"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle } from "lucide-react"
import { parseMarkdown } from "@/utils/markdown"

export type SuggestionOption = {
  id: string
  title: string
  description: string
}

export type FeatureGroup = {
  id: string
  title: string
  options: SuggestionOption[]
}

export type MessageContentProps = {
  content: string
  suggestions?: SuggestionOption[]
  featureGroups?: FeatureGroup[]
  onSuggestionSelect?: (suggestion: SuggestionOption) => void
  onFeatureSelect?: (featureId: string, selected: boolean) => void
  selectedFeatures?: string[]
  clarifyingQuestions?: string[]
  onAnswerQuestion?: (question: string, answer: string) => void
}

export function MessageContent({
  content,
  suggestions,
  featureGroups,
  onSuggestionSelect,
  onFeatureSelect,
  selectedFeatures = [],
  clarifyingQuestions,
  onAnswerQuestion,
}: MessageContentProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [answerInputs, setAnswerInputs] = useState<Record<string, string>>({})

  const handleAnswerQuestion = (question: string) => {
    if (answerInputs[question] && onAnswerQuestion) {
      onAnswerQuestion(question, answerInputs[question])
      setAnswers({
        ...answers,
        [question]: answerInputs[question],
      })
      setAnswerInputs({
        ...answerInputs,
        [question]: "",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="prose prose-sm max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{
          __html: parseMarkdown(content),
        }}
      />

      {suggestions && suggestions.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-sm font-medium">Suggested actions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.id}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionSelect && onSuggestionSelect(suggestion)}
                className="text-xs"
              >
                {suggestion.title}
              </Button>
            ))}
          </div>
        </div>
      )}

      {featureGroups && featureGroups.length > 0 && (
        <div className="mt-3 space-y-4 bg-muted/50 p-3 rounded-md">
          <p className="text-sm font-medium">Suggested features:</p>
          {featureGroups.map((group) => (
            <div key={group.id} className="space-y-2">
              <p className="text-sm font-medium">{group.title}</p>
              <div className="space-y-2">
                {group.options.map((option) => {
                  const isSelected = selectedFeatures.includes(option.id)
                  return (
                    <div
                      key={option.id}
                      className={`flex items-start gap-2 p-2 rounded-md cursor-pointer hover:bg-muted ${
                        isSelected ? "bg-muted" : ""
                      }`}
                      onClick={() => onFeatureSelect && onFeatureSelect(option.id, !isSelected)}
                    >
                      <div className="mt-0.5">
                        {isSelected ? (
                          <CheckCircle className="h-4 w-4 text-primary" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{option.title}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Badge variant="outline" className="text-xs">
              {selectedFeatures.length} features selected
            </Badge>
          </div>
        </div>
      )}

      {clarifyingQuestions && clarifyingQuestions.length > 0 && (
        <div className="mt-3 space-y-3">
          {clarifyingQuestions.map((question) => (
            <div key={question} className="space-y-2">
              {answers[question] ? (
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">{question}</p>
                  <p className="text-sm mt-1">{answers[question]}</p>
                </div>
              ) : (
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">{question}</p>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Your answer..."
                      value={answerInputs[question] || ""}
                      onChange={(e) =>
                        setAnswerInputs({
                          ...answerInputs,
                          [question]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAnswerQuestion(question)
                        }
                      }}
                    />
                    <Button size="sm" onClick={() => handleAnswerQuestion(question)} disabled={!answerInputs[question]}>
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
