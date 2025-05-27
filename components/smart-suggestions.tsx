import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, TrendingUp, Users, AlertTriangle } from "lucide-react"

interface Suggestion {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  action: string
  priority: "high" | "medium" | "low"
}

export function SmartSuggestions() {
  const suggestions: Suggestion[] = [
    {
      id: "1",
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      title: "Move 'User Testing' up",
      description: "It's blocking 3 other tasks that can't start until testing is done",
      action: "Reschedule",
      priority: "high",
    },
    {
      id: "2",
      icon: <Users className="w-5 h-5 text-blue-500" />,
      title: "John finished early",
      description: "He could help Sarah with the 'Design Review' task",
      action: "Reassign",
      priority: "medium",
    },
    {
      id: "3",
      icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      title: "You're ahead of schedule!",
      description: "Consider starting the next phase early to maintain momentum",
      action: "View Next Phase",
      priority: "low",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50 dark:bg-red-950"
      case "medium":
        return "border-yellow-200 bg-yellow-50 dark:bg-yellow-950"
      case "low":
        return "border-green-200 bg-green-50 dark:bg-green-950"
      default:
        return ""
    }
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`p-4 rounded-lg border-2 ${getPriorityColor(suggestion.priority)} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{suggestion.icon}</div>
              <div className="flex-1 space-y-2">
                <h4 className="font-medium">{suggestion.title}</h4>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                <Button size="sm" variant="outline">
                  {suggestion.action}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
