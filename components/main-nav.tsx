import Link from "next/link"
import { cn } from "@/lib/utils"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Home
      </Link>
      <Link href="/projects" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Projects
      </Link>
      <Link href="/tasks" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Tasks
      </Link>
      <Link href="/chat" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Chat
      </Link>
    </nav>
  )
}
