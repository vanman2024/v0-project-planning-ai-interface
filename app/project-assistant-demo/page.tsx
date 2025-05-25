import { ProjectAssistant } from "@/components/project-assistant"

export default function ProjectAssistantDemo() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Project Assistant Demo</h1>
      <p className="text-muted-foreground mb-6">
        Experience the AI-powered project planning assistant that helps you define features, create tasks, and plan your
        project.
      </p>

      <div className="border rounded-lg overflow-hidden">
        <ProjectAssistant
          projectId="demo-project"
          projectName="E-commerce Platform"
          projectDescription="An online e-commerce platform that allows users to browse products, add items to cart, checkout, and track orders. The platform should include user authentication, product management, shopping cart functionality, payment processing, and order tracking."
        />
      </div>
    </div>
  )
}
