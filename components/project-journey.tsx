import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, MapPin, Rocket, Search, Hammer, TestTube } from "lucide-react"

interface JourneyStage {
  name: string
  friendlyName: string
  icon: React.ReactNode
  status: "completed" | "current" | "upcoming"
  progress?: number
}

export function ProjectJourney() {
  const stages: JourneyStage[] = [
    {
      name: "planning",
      friendlyName: "Planning",
      icon: <Search className="w-5 h-5" />,
      status: "completed",
    },
    {
      name: "research",
      friendlyName: "Research",
      icon: <MapPin className="w-5 h-5" />,
      status: "completed",
    },
    {
      name: "build",
      friendlyName: "Building",
      icon: <Hammer className="w-5 h-5" />,
      status: "current",
      progress: 65,
    },
    {
      name: "test",
      friendlyName: "Testing",
      icon: <TestTube className="w-5 h-5" />,
      status: "upcoming",
    },
    {
      name: "launch",
      friendlyName: "Launch",
      icon: <Rocket className="w-5 h-5" />,
      status: "upcoming",
    },
  ]

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Your Project Journey 🗺️</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Progress line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
              style={{ width: "45%" }}
            />
          </div>

          {/* Stages */}
          <div className="relative flex justify-between">
            {stages.map((stage, index) => (
              <div key={stage.name} className="flex flex-col items-center">
                <div
                  className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${
                    stage.status === "completed"
                      ? "bg-green-500 text-white"
                      : stage.status === "current"
                        ? "bg-blue-500 text-white animate-pulse"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                  }
                  transition-all duration-300 hover:scale-110
                `}
                >
                  {stage.status === "completed" ? <CheckCircle2 className="w-6 h-6" /> : stage.icon}
                </div>

                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      stage.status === "current" ? "text-blue-600 dark:text-blue-400" : ""
                    }`}
                  >
                    {stage.friendlyName}
                  </p>
                  {stage.status === "current" && stage.progress && (
                    <p className="text-xs text-muted-foreground mt-1">{stage.progress}% done</p>
                  )}
                </div>

                {stage.status === "current" && (
                  <div className="absolute -bottom-8 text-sm font-medium text-blue-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    You are here
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
