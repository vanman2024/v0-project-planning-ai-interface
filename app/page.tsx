import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Project Planning AI Interface</h1>

        <div className="flex justify-center mb-8">
          <Link href="/notification-demo">
            <Button>View Notification System Demo</Button>
          </Link>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Click the button above to see the notification system demo.</p>
        </div>
      </div>
    </div>
  )
}
