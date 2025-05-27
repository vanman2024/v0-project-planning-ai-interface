import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, TrendingUp, Users, Calendar } from "lucide-react"

interface HealthInsight {
  icon: React.ReactNode
  message: string
  type: "success" | "warning" | "info"
}

export function ProjectHealthScore() {
  const healthScore = 85
  const insights: HealthInsight[] = [
    {
      icon: <TrendingUp className="w-4 h-4" />,
      message: "Your project is on track! 🎉 3 tasks need attention this week.",
      type: "success",
    },
    {
      icon: <Users className="w-4 h-4" />,
      message: "Sarah has too much on her plate - consider reassigning some tasks.",
      type: "warning",
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      message: "At this pace, you'll finish 3 days early! 🚀",
      type: "info",
    },
  ]

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getHealthEmoji = (score: number) => {
    if (score >= 80) return "😊"
    if (score >= 60) return "😐"
    return "😟"
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-medium">Project Health</span>
          <span className={`text-3xl ${getHealthColor(healthScore)}`}>{getHealthEmoji(healthScore)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Overall Score</span>
            <span className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>{healthScore}%</span>
          </div>
          <Progress value={healthScore} className="h-3" />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            AI Insights
          </h4>
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg flex items-start gap-3 ${
                insight.type === "success"
                  ? "bg-green-50 dark:bg-green-950"
                  : insight.type === "warning"
                    ? "bg-yellow-50 dark:bg-yellow-950"
                    : "bg-blue-50 dark:bg-blue-950"
              }`}
            >
              <div
                className={`mt-0.5 ${
                  insight.type === "success"
                    ? "text-green-600"
                    : insight.type === "warning"
                      ? "text-yellow-600"
                      : "text-blue-600"
                }`}
              >
                {insight.icon}
              </div>
              <p className="text-sm">{insight.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
