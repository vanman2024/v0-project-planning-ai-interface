"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, CheckCircle2, FolderKanban, MessageSquare, CheckSquare, Sparkles } from "lucide-react"

interface OnboardingTourProps {
  onComplete: () => void
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Project Planner! 👋",
      description: "Let me show you around your new AI-powered project management workspace.",
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <p>This platform helps you plan, organize, and manage projects with the help of AI assistants.</p>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-950">
              <CardContent className="p-4">
                <FolderKanban className="w-8 h-8 text-blue-600 mb-2" />
                <p className="font-medium">Smart Projects</p>
                <p className="text-sm text-muted-foreground">AI-enhanced project planning</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-950">
              <CardContent className="p-4">
                <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
                <p className="font-medium">AI Assistants</p>
                <p className="text-sm text-muted-foreground">Get help from specialized agents</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "Create Your First Project 🚀",
      description: "Start by creating a project with our guided wizard.",
      icon: FolderKanban,
      content: (
        <div className="space-y-4">
          <p>Our AI-powered wizard will help you:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Define clear project goals and objectives</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Import existing resources and documentation</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Set up your team and timeline</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
              <span>Get personalized AI recommendations</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Meet Your AI Assistants 🤖",
      description: "Specialized agents are here to help with every aspect of your project.",
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <p>Chat with different AI agents for specific help:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium">Project Assistant</p>
                <p className="text-sm text-muted-foreground">General guidance and coordination</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <CheckSquare className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Task Agent</p>
                <p className="text-sm text-muted-foreground">Organize and prioritize your work</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "You're All Set! 🎉",
      description: "Ready to start building amazing projects?",
      icon: CheckCircle2,
      content: (
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <p className="text-lg">You're ready to create your first project!</p>
          <p className="text-muted-foreground">
            Click "Get Started" to begin, or explore the interface at your own pace.
          </p>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const currentStepData = steps[currentStep]
  const StepIcon = currentStepData.icon

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <StepIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>{currentStepData.title}</CardTitle>
              <CardDescription>{currentStepData.description}</CardDescription>
            </div>
          </div>
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
        </CardHeader>
        <CardContent>
          {currentStepData.content}
          <div className="mt-6 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <Button onClick={handleNext}>
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Get Started
                  <CheckCircle2 className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
