import type React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NotificationSystem } from "./notification-system"

interface Props extends React.HTMLAttributes<HTMLElement> {}

export function SiteHeader({ className }: Props) {
  return (
    <div className={cn("border-b", className)}>
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
            >
              <Icons.menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetHeader>
              <SheetTitle>Acme</SheetTitle>
              <SheetDescription>Feel free to look around.</SheetDescription>
            </SheetHeader>
            <MainNav className="mt-6" />
            <div className="p-4 border-t">
              <div className="flex items-center gap-3">
                <NotificationSystem />
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40&query=user" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Jane Doe</p>
                  <p className="text-xs text-muted-foreground">jane@example.com</p>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-4 flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">Acme</span>
        </Link>
        <MainNav className="mx-6 hidden lg:flex" />
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=40&width=40&query=user" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuSeparator />
              <div className="p-4 border-t">
                <div className="flex items-center gap-3">
                  <NotificationSystem />
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40&query=user" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Jane Doe</p>
                    <p className="text-xs text-muted-foreground">jane@example.com</p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
