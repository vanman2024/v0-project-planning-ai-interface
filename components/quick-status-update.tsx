"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smile, Meh, Frown, Sparkles, Users, Calendar } from "lucide-react"
import { useState } from "react"

interface QuickUpdateProps {
  taskName: string
  onStatusUpdate: (status: "on-track" | "need-help" | "stuck") => void
}

export function QuickStatusUpdate({ taskName, onStatusUpdate }: QuickUpdateProps) {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [showFollowUp, setShowFollowUp] = useState(false)

  const handleStatusClick = (status: "on-track" | "need-help" | "stuck") => {
    setSelectedStatus(status)
    onStatusUpdate(status)
    if (status !== "on-track") {
      setShowFollowUp(true)
    }
  }

  return (
    <Card className="border-2 hover:shadow-lg transition-all">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Quick Update
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-3">
          <p className="text-lg">
            How's the <span className="font-semibold">"{taskName}"</span> going?
          </p>

          <div className="flex gap-3 justify-center">
            <Button
              variant={selectedStatus === "on-track" ? "default" : "outline"}
              size="lg"
              onClick={() => handleStatusClick("on-track")}
              className="flex flex-col gap-2 h-auto py-4 px-6"
            >
              <Smile className="w-8 h-8 text-green-500" />
              <span>On Track</span>
            </Button>

            <Button
              variant={selectedStatus === "need-help" ? "default" : "outline"}
              size="lg"
              onClick={() => handleStatusClick("need-help")}
              className="flex flex-col gap-2 h-auto py-4 px-6"
            >
              <Meh className="w-8 h-8 text-yellow-500" />
              <span>Need Help</span>
            </Button>

            <Button
              variant={selectedStatus === "stuck" ? "default" : "outline"}
              size="lg"
              onClick={() => handleStatusClick("stuck")}
              className="flex flex-col gap-2 h-auto py-4 px-6"
            >
              <Frown className="w-8 h-8 text-red-500" />
              <span>Stuck</span>
            </Button>
          </div>
        </div>

        {showFollowUp && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-3">
            <p className="text-sm font-medium">We'll help you out! 🤝</p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Notify team for help
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Reschedule dependent tasks
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
