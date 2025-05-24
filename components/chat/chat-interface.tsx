"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PlusCircle,
  Send,
  Hash,
  Search,
  Pin,
  Info,
  Pencil,
  UserPlus,
  MessageSquare,
  CheckSquare,
  Layers,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Maximize2,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// Add a document viewer modal for very long messages
// Add these imports at the top of the file (around line 20)
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

type AgentType = "project" | "task" | "feature" | "documentation" | "detail" | "planning"

interface Thread {
  id: string
  name: string
  agentType: AgentType
  projectId: string
  isPinned: boolean
  lastMessage: string
  lastMessageTime: string
}

interface Project {
  id: string
  name: string
}

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  agentType?: AgentType
  timestamp: string
  threadId?: string
  parentId?: string
  replyCount?: number
}

export function ChatInterface() {
  const [selectedProject, setSelectedProject] = useState<string>("project1")
  const [selectedThread, setSelectedThread] = useState<string>("thread1")
  const [searchValue, setSearchValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const threadMessagesEndRef = useRef<HTMLDivElement>(null)
  const [chatError, setChatError] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(280) // Default width in pixels
  const resizerRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Dialog states
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [newThreadName, setNewThreadName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newThreadType, setNewThreadType] = useState<AgentType>("project")
  const [createThreadName, setCreateThreadName] = useState("")
  const [isAgentSwitchDialogOpen, setIsAgentSwitchDialogOpen] = useState(false)
  const [newAgentType, setNewAgentType] = useState<AgentType>("project")

  // Add state for the document viewer
  // Add this with the other state declarations (around line 80)
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false)
  const [viewedDocument, setViewedDocument] = useState<{ title: string; content: string } | null>(null)

  // First, add a new state to track expanded message states
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({})

  // Add a "Scroll to Bottom" button that appears when not at the bottom
  // Add this state near the other state declarations (around line 80)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const threadScrollAreaRef = useRef<HTMLDivElement>(null)

  // Thread panel state
  const [threadPanelOpen, setThreadPanelOpen] = useState(false)
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null)
  const [threadInput, setThreadInput] = useState("")
  const [isThreadLoading, setIsThreadLoading] = useState(false)
  const [showThreadScrollToBottom, setShowThreadScrollToBottom] = useState(false)

  // Mock projects data
  const projectsData: Project[] = [
    { id: "project1", name: "E-commerce Platform" },
    { id: "project2", name: "Mobile Banking App" },
    { id: "project3", name: "Healthcare Portal" },
  ]

  // Mock threads data - in a real app, this would come from your backend
  const [threadsData, setThreadsData] = useState<Thread[]>([
    {
      id: "thread1",
      name: "General Discussion",
      agentType: "project",
      projectId: "project1",
      isPinned: true,
      lastMessage: "Let's discuss the overall project plan",
      lastMessageTime: "10:30 AM",
    },
    {
      id: "thread2",
      name: "User Authentication Feature Implementation",
      agentType: "feature",
      projectId: "project1",
      isPinned: true,
      lastMessage: "How should we implement the login system?",
      lastMessageTime: "Yesterday",
    },
    {
      id: "thread3",
      name: "Sprint Planning for Q2 Development Cycle",
      agentType: "planning",
      projectId: "project1",
      isPinned: false,
      lastMessage: "Let's plan the next two weeks",
      lastMessageTime: "Monday",
    },
    {
      id: "thread4",
      name: "Product Catalog Feature with Filtering and Sorting",
      agentType: "feature",
      projectId: "project1",
      isPinned: false,
      lastMessage: "How should we structure the product catalog?",
      lastMessageTime: "Tuesday",
    },
    {
      id: "thread5",
      name: "Shopping Cart Implementation with Real-time Updates",
      agentType: "feature",
      projectId: "project1",
      isPinned: false,
      lastMessage: "Let's discuss the shopping cart requirements",
      lastMessageTime: "Wednesday",
    },
    {
      id: "thread6",
      name: "Checkout Process with Multiple Payment Options",
      agentType: "feature",
      projectId: "project1",
      isPinned: false,
      lastMessage: "How should we handle the checkout flow?",
      lastMessageTime: "Thursday",
    },
    {
      id: "thread7",
      name: "Payment Integration with Stripe, PayPal and Apple Pay",
      agentType: "feature",
      projectId: "project1",
      isPinned: false,
      lastMessage: "Which payment gateways should we support?",
      lastMessageTime: "Friday",
    },
  ])

  // Get the current thread
  const currentThread = threadsData.find((thread) => thread.id === selectedThread)

  // Helper function to format the current time
  const formatTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Update a thread's last message
  const updateThreadLastMessage = (threadId: string, message: string, time: string) => {
    setThreadsData((prevThreads) =>
      prevThreads.map((thread) =>
        thread.id === threadId ? { ...thread, lastMessage: message, lastMessageTime: time } : thread,
      ),
    )
  }

  // Store messages by thread ID
  const [messagesByThread, setMessagesByThread] = useState<Record<string, Message[]>>({
    thread1: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "Hello! I'm your Project Assistant. How can I help you with your project today?",
        agentType: "project",
        timestamp: "10:00 AM",
      },
      {
        id: "msg1",
        role: "user",
        content: "I need help planning the architecture for our e-commerce platform.",
        timestamp: "10:05 AM",
      },
      {
        id: "msg2",
        role: "assistant",
        content:
          "I'd be happy to help with the architecture planning. Let's start by discussing the key components you'll need for your e-commerce platform:\n\n1. **Frontend**: User interface for customers to browse products, add to cart, and checkout\n2. **Backend API**: Services to handle product management, orders, user accounts, etc.\n3. **Database**: To store product information, user data, orders, etc.\n4. **Authentication**: User login, registration, and account management\n5. **Payment Processing**: Integration with payment gateways\n6. **Search & Filtering**: Functionality for users to find products\n7. **Admin Dashboard**: For managing products, orders, and users\n\nWhich of these areas would you like to explore first?",
        agentType: "project",
        timestamp: "10:07 AM",
        replyCount: 3,
      },
      {
        id: "msg3",
        role: "user",
        content: "Let's focus on the database design first. What would you recommend?",
        timestamp: "10:10 AM",
      },
      {
        id: "msg4",
        role: "assistant",
        content:
          "For an e-commerce platform, I recommend a combination of relational and potentially NoSQL databases depending on your specific needs. Here's a suggested database schema:\n\n**Core Tables:**\n\n1. **Users**\n   - user_id (PK)\n   - email\n   - password_hash\n   - first_name\n   - last_name\n   - created_at\n   - updated_at\n\n2. **Products**\n   - product_id (PK)\n   - name\n   - description\n   - price\n   - stock_quantity\n   - category_id (FK)\n   - created_at\n   - updated_at\n\n3. **Categories**\n   - category_id (PK)\n   - name\n   - parent_category_id (FK, self-referential)\n\n4. **Orders**\n   - order_id (PK)\n   - user_id (FK)\n   - status\n   - total_amount\n   - shipping_address_id (FK)\n   - payment_id (FK)\n   - created_at\n   - updated_at\n\n5. **Order_Items**\n   - order_item_id (PK)\n   - order_id (FK)\n   - product_id (FK)\n   - quantity\n   - price_at_time_of_purchase\n\n6. **Addresses**\n   - address_id (PK)\n   - user_id (FK)\n   - address_line_1\n   - address_line_2\n   - city\n   - state\n   - postal_code\n   - country\n   - is_default\n\n7. **Payments**\n   - payment_id (PK)\n   - order_id (FK)\n   - payment_method\n   - transaction_id\n   - amount\n   - status\n   - created_at\n\n8. **Reviews**\n   - review_id (PK)\n   - product_id (FK)\n   - user_id (FK)\n   - rating\n   - comment\n   - created_at\n\n**Additional Considerations:**\n\n- For product search, you might want to consider Elasticsearch for better search capabilities\n- For product recommendations, a graph database could be useful\n- For caching frequently accessed data, Redis would be beneficial\n\nWould you like me to elaborate on any specific part of this schema?",
        agentType: "project",
        timestamp: "10:15 AM",
        replyCount: 2,
      },
    ],
    thread2: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "Hello! I'm your Feature Agent. How can I help you define and plan features for your project?",
        agentType: "feature",
        timestamp: "Yesterday",
      },
    ],
    thread3: [
      {
        id: "welcome-message",
        role: "assistant",
        content: "Hello! I'm your Planning Agent. How can I help you with project planning and scheduling?",
        agentType: "planning",
        timestamp: "Monday",
      },
    ],
  })

  // Store threaded replies
  const [messageReplies, setMessageReplies] = useState<Record<string, Message[]>>({
    msg2: [
      {
        id: "reply1-msg2",
        role: "user",
        content: "Could you explain more about the frontend architecture?",
        parentId: "msg2",
        timestamp: "10:20 AM",
      },
      {
        id: "reply2-msg2",
        role: "assistant",
        content:
          "For the frontend of your e-commerce platform, I recommend a modern architecture with these components:\n\n**1. Framework/Library:**\n- React or Next.js would be excellent choices for building a dynamic, responsive e-commerce site\n- Next.js offers advantages with its server-side rendering capabilities, which are beneficial for SEO and performance\n\n**2. State Management:**\n- Redux or Context API for global state management\n- React Query for server state management and caching\n\n**3. Key Components:**\n- Product Listing Pages with filtering and sorting\n- Product Detail Pages\n- Shopping Cart\n- Checkout Process\n- User Account Management\n- Order History\n- Wishlist functionality\n\n**4. Performance Considerations:**\n- Implement code splitting to reduce initial load time\n- Use image optimization techniques\n- Implement lazy loading for images and components\n- Consider a CDN for static assets\n\n**5. Responsive Design:**\n- Mobile-first approach using Tailwind CSS or a similar framework\n- Ensure accessibility compliance\n\n**6. Testing:**\n- Jest and React Testing Library for unit and integration tests\n- Cypress for end-to-end testing\n\nWould you like me to elaborate on any specific aspect of the frontend architecture?",
        agentType: "project",
        parentId: "msg2",
        timestamp: "10:25 AM",
      },
      {
        id: "reply3-msg2",
        role: "user",
        content: "That's helpful. What about the backend API structure?",
        parentId: "msg2",
        timestamp: "10:30 AM",
      },
    ],
    msg4: [
      {
        id: "reply1-msg4",
        role: "user",
        content: "This is great. How would you handle product variants like different sizes and colors?",
        parentId: "msg4",
        timestamp: "10:20 AM",
      },
      {
        id: "reply2-msg4",
        role: "assistant",
        content:
          'Great question about product variants! Here\'s how I would handle different sizes, colors, and other variations:\n\n**Database Schema for Product Variants:**\n\n1. **Product_Variants Table**\n   - variant_id (PK)\n   - product_id (FK)\n   - sku (unique identifier)\n   - price (can differ from base product price)\n   - stock_quantity\n   - image_url (specific to this variant)\n   - created_at\n   - updated_at\n\n2. **Variant_Options Table**\n   - option_id (PK)\n   - name (e.g., "Size", "Color", "Material")\n\n3. **Variant_Option_Values Table**\n   - value_id (PK)\n   - option_id (FK)\n   - value (e.g., "Small", "Red", "Cotton")\n\n4. **Variant_Combinations Table**\n   - combination_id (PK)\n   - variant_id (FK)\n   - option_id (FK)\n   - value_id (FK)\n\n**Example:**\n- A t-shirt (product_id: 123) comes in 3 sizes (S, M, L) and 2 colors (Red, Blue)\n- This would create 6 variants in the Product_Variants table\n- The Variant_Options table would have "Size" and "Color"\n- The Variant_Option_Values table would have "S", "M", "L", "Red", and "Blue"\n- The Variant_Combinations table would link each variant to its specific combination of options\n\n**Frontend Considerations:**\n- Allow users to select options via dropdowns or swatches\n- Dynamically update price, availability, and images based on selected variants\n- Show which combinations are available/unavailable\n\n**Inventory Management:**\n- Track inventory at the variant level, not just the product level\n- Enable low stock alerts for specific variants\n\nThis approach gives you flexibility while maintaining data integrity. Would you like me to elaborate on any aspect of this variant system?',
        agentType: "project",
        parentId: "msg4",
        timestamp: "10:25 AM",
      },
    ],
  })

  // Get messages for the current thread
  const currentMessages = messagesByThread[selectedThread] || []

  // Get replies for the active message
  const activeMessageReplies = activeMessageId ? messageReplies[activeMessageId] || [] : []

  // Get the active message
  const activeMessage = activeMessageId
    ? currentMessages.find((message) => message.id === activeMessageId) || null
    : null

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showContext, setShowContext] = useState(false)
  const [currentAgentType, setCurrentAgentType] = useState<AgentType | null>(null)
  const [isResizing, setIsResizing] = useState(false)

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  // Handle thread input change
  const handleThreadInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThreadInput(e.target.value)
  }

  // Handle project change
  const handleProjectChange = (projectId: string) => {
    setSelectedProject(projectId)

    // Find a thread for this project
    const projectThread = threadsData.find((t) => t.projectId === projectId)
    if (projectThread) {
      setSelectedThread(projectThread.id)
    }
  }

  // Handle thread rename
  const handleRenameThread = () => {
    if (!newThreadName.trim() || !currentThread) return

    setThreadsData((prevThreads) =>
      prevThreads.map((thread) => (thread.id === selectedThread ? { ...thread, name: newThreadName } : thread)),
    )

    setIsRenameDialogOpen(false)
  }

  // Handle thread creation
  const handleCreateThread = () => {
    if (!createThreadName.trim()) return

    const newThreadId = `thread-${Date.now()}`
    const newThread: Thread = {
      id: newThreadId,
      name: createThreadName,
      agentType: newThreadType,
      projectId: selectedProject,
      isPinned: false,
      lastMessage: "Thread created",
      lastMessageTime: formatTime(),
    }

    setThreadsData((prevThreads) => [...prevThreads, newThread])

    // Add initial message for the new thread
    setMessagesByThread((prev) => ({
      ...prev,
      [newThreadId]: [
        {
          id: "welcome-message",
          role: "assistant",
          content: getWelcomeMessage(newThreadType),
          agentType: newThreadType,
          timestamp: formatTime(),
        },
      ],
    }))

    setSelectedThread(newThreadId)
    setIsCreateDialogOpen(false)
    setCreateThreadName("")
  }

  // Handle agent switch
  const handleSwitchAgent = () => {
    if (!currentThread || !newAgentType) return

    // Add a system message about the agent switch
    const switchMessage = {
      id: `switch-${Date.now()}`,
      role: "system" as const,
      content: `Switching to ${getAgentName(newAgentType)}`,
      timestamp: formatTime(),
    }

    // Add a welcome message from the new agent
    const welcomeMessage = {
      id: `welcome-${Date.now()}`,
      role: "assistant" as const,
      content: getWelcomeMessage(newAgentType),
      agentType: newAgentType,
      timestamp: formatTime(),
    }

    // Update messages for the current thread
    setMessagesByThread((prev) => ({
      ...prev,
      [selectedThread]: [...(prev[selectedThread] || []), switchMessage, welcomeMessage],
    }))

    // Update the thread's agent type
    setThreadsData((prevThreads) =>
      prevThreads.map((thread) => (thread.id === selectedThread ? { ...thread, agentType: newAgentType } : thread)),
    )

    setCurrentAgentType(newAgentType)
    setIsAgentSwitchDialogOpen(false)
  }

  // Handle invoking a specific agent for a single message
  const handleInvokeAgent = (agentType: AgentType) => {
    if (!currentThread) return

    setCurrentAgentType(agentType)

    // Add a system message about the agent invocation
    const invokeMessage = {
      id: `invoke-${Date.now()}`,
      role: "system" as const,
      content: `Invoking ${getAgentName(agentType)} for the next message`,
      timestamp: formatTime(),
    }

    // Update messages for the current thread
    setMessagesByThread((prev) => ({
      ...prev,
      [selectedThread]: [...(prev[selectedThread] || []), invokeMessage],
    }))
  }

  // Add a function to toggle message expansion
  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }))
  }

  // Add a function to open the document viewer
  // Add this with the other handler functions (around line 320)
  const openDocumentViewer = (message: Message) => {
    const title =
      message.role === "assistant"
        ? `${getAgentName(message.agentType || currentThread?.agentType || "project")}'s Message`
        : "Your Message"

    setViewedDocument({
      title,
      content: message.content,
    })
    setDocumentViewerOpen(true)
  }

  // Add a function to scroll to bottom
  // Add this with the other handler functions (around line 310)

  const openThreadPanel = (messageId: string) => {
    setActiveMessageId(messageId)
    setThreadPanelOpen(true)
  }

  // Close thread panel
  const closeThreadPanel = () => {
    setThreadPanelOpen(false)
    setActiveMessageId(null)
    setThreadInput("")
  }

  // Scroll to bottom of main chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Scroll to bottom of thread panel
  const scrollThreadToBottom = () => {
    threadMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || !currentThread) return

    // Determine which agent type to use for this message
    const messageAgentType = currentAgentType || currentThread.agentType

    // Add user message to the chat
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: formatTime(),
    }

    // Update messages for the current thread
    setMessagesByThread((prev) => ({
      ...prev,
      [selectedThread]: [...(prev[selectedThread] || []), userMessage],
    }))

    // Clear input and set loading state
    const userInput = input
    setInput("")
    setIsLoading(true)
    setChatError(null)

    try {
      // Make API request to our simplified endpoint
      const response = await fetch("/api/simple-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...(messagesByThread[selectedThread] || []), userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
          agentType: messageAgentType,
          projectName: projectsData.find((p) => p.id === selectedProject)?.name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || `Server responded with ${response.status}`)
      }

      // Add assistant message to the chat
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "I'm sorry, I couldn't generate a response.",
        agentType: messageAgentType,
        timestamp: formatTime(),
      }

      // Update messages for the current thread
      setMessagesByThread((prev) => ({
        ...prev,
        [selectedThread]: [...(prev[selectedThread] || []), assistantMessage],
      }))

      // Update thread's last message
      updateThreadLastMessage(selectedThread, userInput, formatTime())

      // Reset current agent type after the message
      setCurrentAgentType(null)
    } catch (error) {
      console.error("Error sending message:", error)
      setChatError(error instanceof Error ? error.message : "An error occurred while sending your message")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle thread reply submission
  const handleThreadReply = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!threadInput.trim() || !activeMessageId || !currentThread) return

    // Determine which agent type to use for this message
    const messageAgentType = currentAgentType || currentThread.agentType

    // Create the user reply
    const userReply: Message = {
      id: `reply-${Date.now()}`,
      role: "user",
      content: threadInput,
      parentId: activeMessageId,
      timestamp: formatTime(),
    }

    // Add the reply to the message replies
    setMessageReplies((prev) => ({
      ...prev,
      [activeMessageId]: [...(prev[activeMessageId] || []), userReply],
    }))

    // Update the reply count on the parent message
    setMessagesByThread((prev) => {
      const updatedMessages = prev[selectedThread].map((msg) => {
        if (msg.id === activeMessageId) {
          return {
            ...msg,
            replyCount: (msg.replyCount || 0) + 1,
          }
        }
        return msg
      })
      return {
        ...prev,
        [selectedThread]: updatedMessages,
      }
    })

    // Clear input and set loading state
    const userInput = threadInput
    setThreadInput("")
    setIsThreadLoading(true)

    try {
      // Get the parent message and all existing replies
      const parentMessage = currentMessages.find((msg) => msg.id === activeMessageId)
      const existingReplies = messageReplies[activeMessageId] || []

      // Create context for the AI that includes the parent message and thread
      const threadContext = [
        {
          role: "system",
          content: `You are responding in a threaded conversation. The parent message is: "${parentMessage?.content}". Please keep your response focused on this specific thread context.`,
        },
        {
          role: parentMessage?.role || "user",
          content: parentMessage?.content || "",
        },
        ...existingReplies.map((reply) => ({
          role: reply.role,
          content: reply.content,
        })),
        {
          role: "user",
          content: userInput,
        },
      ]

      // Make API request to our simplified endpoint
      const response = await fetch("/api/simple-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: threadContext,
          agentType: messageAgentType,
          projectName: projectsData.find((p) => p.id === selectedProject)?.name,
          isThreadReply: true,
          parentMessageId: activeMessageId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || `Server responded with ${response.status}`)
      }

      // Add assistant reply to the thread
      const assistantReply: Message = {
        id: `reply-${Date.now() + 1}`,
        role: "assistant",
        content: data.content || "I'm sorry, I couldn't generate a response.",
        agentType: messageAgentType,
        parentId: activeMessageId,
        timestamp: formatTime(),
      }

      // Update the message replies
      setMessageReplies((prev) => ({
        ...prev,
        [activeMessageId]: [...(prev[activeMessageId] || []), assistantReply],
      }))

      // Update the reply count on the parent message
      setMessagesByThread((prev) => {
        const updatedMessages = prev[selectedThread].map((msg) => {
          if (msg.id === activeMessageId) {
            return {
              ...msg,
              replyCount: (msg.replyCount || 0) + 1,
            }
          }
          return msg
        })
        return {
          ...prev,
          [selectedThread]: updatedMessages,
        }
      })

      // Reset current agent type after the message
      setCurrentAgentType(null)
    } catch (error) {
      console.error("Error sending thread reply:", error)
      setChatError(error instanceof Error ? error.message : "An error occurred while sending your reply")
    } finally {
      setIsThreadLoading(false)
    }
  }

  // Filter threads based on selected project and search value
  const filteredThreads = threadsData.filter(
    (thread) =>
      thread.projectId === selectedProject &&
      (searchValue === "" || thread.name.toLowerCase().includes(searchValue.toLowerCase())),
  )

  // Toggle pin status of a thread
  const togglePinThread = (threadId: string) => {
    setThreadsData((prevThreads) =>
      prevThreads.map((thread) => (thread.id === threadId ? { ...thread, isPinned: !thread.isPinned } : thread)),
    )
  }

  // Scroll to bottom of messages when new messages arrive
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  // }, [currentMessages])

  // Scroll to bottom of messages when new messages arrive or when a message is expanded
  useEffect(() => {
    if (messagesEndRef.current) {
      // Use a small timeout to ensure the DOM has updated
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [currentMessages, expandedMessages])

  // Scroll to bottom of thread messages when new replies arrive
  useEffect(() => {
    if (threadMessagesEndRef.current) {
      // Use a small timeout to ensure the DOM has updated
      const timer = setTimeout(() => {
        threadMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [activeMessageReplies])

  // Add a scroll event handler to detect when not at the bottom
  // Add this useEffect after the other useEffects (around line 410)

  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (!scrollArea) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea
      // Show button when not at bottom (with some threshold)
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
      setShowScrollToBottom(!isAtBottom)
    }

    scrollArea.addEventListener("scroll", handleScroll)
    return () => scrollArea.removeEventListener("scroll", handleScroll)
  }, [])

  // Add a scroll event handler to detect when not at the bottom of thread panel
  useEffect(() => {
    const scrollArea = threadScrollAreaRef.current
    if (!scrollArea) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea
      // Show button when not at bottom (with some threshold)
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
      setShowThreadScrollToBottom(!isAtBottom)
    }

    scrollArea.addEventListener("scroll", handleScroll)
    return () => scrollArea.removeEventListener("scroll", handleScroll)
  }, [])

  // Get color for agent type
  const getAgentColor = (agentType: AgentType): string => {
    const colors: Record<AgentType, string> = {
      project: "bg-blue-500",
      task: "bg-green-500",
      feature: "bg-purple-500",
      documentation: "bg-yellow-500",
      detail: "bg-red-500",
      planning: "bg-indigo-500",
    }
    return colors[agentType]
  }

  // Get name for agent type
  const getAgentName = (agentType: AgentType): string => {
    const names: Record<AgentType, string> = {
      project: "Project Assistant",
      task: "Task Agent",
      feature: "Feature Agent",
      documentation: "Documentation Agent",
      detail: "Detail Agent",
      planning: "Planning Agent",
    }
    return names[agentType]
  }

  // Get welcome message for agent type
  const getWelcomeMessage = (agentType: AgentType): string => {
    const messages: Record<AgentType, string> = {
      project: "Hello! I'm your Project Assistant. How can I help you with your project today?",
      task: "Hello! I'm your Task Agent. How can I help you organize and track tasks for your project?",
      feature: "Hello! I'm your Feature Agent. How can I help you define and plan features for your project?",
      documentation:
        "Hello! I'm your Documentation Agent. How can I help you create and manage documentation for your project?",
      detail: "Hello! I'm your Detail Agent. How can I help you define detailed requirements for your project?",
      planning: "Hello! I'm your Planning Agent. How can I help you with project planning and scheduling?",
    }
    return messages[agentType]
  }

  // Get icon for agent type
  const getAgentIcon = (agentType: AgentType) => {
    switch (agentType) {
      case "task":
        return <CheckSquare className="h-4 w-4" />
      case "feature":
        return <Layers className="h-4 w-4" />
      case "documentation":
        return <FileText className="h-4 w-4" />
      case "detail":
        return <Info className="h-4 w-4" />
      case "planning":
        return <Calendar className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  // Open rename dialog
  const openRenameDialog = () => {
    if (!currentThread) return
    setNewThreadName(currentThread.name)
    setIsRenameDialogOpen(true)
  }

  // Open create thread dialog
  const openCreateDialog = () => {
    setCreateThreadName("")
    setNewThreadType("project")
    setIsCreateDialogOpen(true)
  }

  // Open agent switch dialog
  const openAgentSwitchDialog = () => {
    if (!currentThread) return
    setNewAgentType(currentThread.agentType)
    setIsAgentSwitchDialogOpen(true)
  }

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Handle mouse down on resizer
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || sidebarCollapsed) return

      // Get container's left position
      const containerLeft = containerRef.current?.getBoundingClientRect().left || 0

      // Calculate new width based on mouse position relative to container
      const newWidth = Math.max(200, Math.min(500, e.clientX - containerLeft))

      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      // Set cursor for entire document during resize
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)

      // Reset cursor and user-select
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing, sidebarCollapsed])

  // Render a message with its content and actions
  const renderMessage = (message: Message, isThreadReply = false) => {
    // Determine if message is long (more than 300 characters)
    const isLongMessage = message.content.length > 300
    const isExpanded = expandedMessages[message.id] || false
    const displayContent = isLongMessage && !isExpanded ? message.content.substring(0, 300) + "..." : message.content

    // Check if this is the active message in the thread panel
    const isActiveMessage = message.id === activeMessageId

    return (
      <div
        key={message.id}
        className={`flex ${message.role === "user" ? "justify-end" : message.role === "system" ? "justify-center" : "justify-start"}`}
      >
        {message.role === "system" ? (
          <div className="bg-muted/50 text-muted-foreground text-xs py-1 px-3 rounded-full">{message.content}</div>
        ) : (
          <div
            className={`flex gap-3 max-w-[90%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"} ${
              isActiveMessage && !isThreadReply ? "bg-muted/50 p-2 rounded-lg" : ""
            }`}
          >
            {message.role === "assistant" && (
              <Avatar
                className={`h-8 w-8 ${getAgentColor(message.agentType || currentThread?.agentType || "project")}`}
              >
                <AvatarFallback>
                  {getAgentName(message.agentType || currentThread?.agentType || "project").charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {message.role === "assistant" ? (
                  <span className="text-xs font-medium">
                    {getAgentName(message.agentType || currentThread?.agentType || "project")}
                  </span>
                ) : (
                  <span className="text-xs font-medium">You</span>
                )}
                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
              </div>
              <div
                className={`rounded-lg p-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="text-sm whitespace-pre-line break-words">{displayContent}</div>

                {isLongMessage && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMessageExpansion(message.id)}
                    className="mt-2 text-xs h-7 px-2"
                  >
                    {isExpanded ? "Show Less" : "Show More"}
                  </Button>
                )}
                {isLongMessage && message.content.length > 1000 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDocumentViewer(message)}
                    className="mt-2 ml-2 text-xs h-7 px-2"
                  >
                    <Maximize2 className="h-3 w-3 mr-1" />
                    View Full
                  </Button>
                )}
              </div>

              {/* Message actions - only show in main chat, not in thread replies */}
              {!isThreadReply && (
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => openThreadPanel(message.id)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {message.replyCount
                      ? `${message.replyCount} ${message.replyCount === 1 ? "reply" : "replies"}`
                      : "Reply"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem>Copy text</DropdownMenuItem>
                      <DropdownMenuItem>Add to documentation</DropdownMenuItem>
                      <DropdownMenuItem>Create task from message</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="border rounded-lg overflow-hidden h-[calc(100vh-8rem)] flex relative">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        style={{ width: sidebarCollapsed ? 0 : sidebarWidth }}
        className={`${
          sidebarCollapsed ? "w-0 border-r-0" : "border-r"
        } bg-muted/30 flex flex-col overflow-hidden relative`}
      >
        {!sidebarCollapsed && (
          <>
            <div className="p-3 border-b">
              <Select value={selectedProject} onValueChange={handleProjectChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projectsData.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search threads"
                  className="pl-8"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="font-medium text-sm">Pinned</h3>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-1">
                {filteredThreads
                  .filter((t) => t.isPinned)
                  .map((thread) => (
                    <button
                      key={thread.id}
                      className={`w-full text-left p-2 rounded-md flex items-start gap-2 hover:bg-muted ${
                        selectedThread === thread.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedThread(thread.id)}
                    >
                      <div className={`mt-0.5 p-1 rounded-md ${getAgentColor(thread.agentType)} bg-opacity-20`}>
                        {getAgentIcon(thread.agentType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-medium text-sm truncate">{thread.name}</span>
                              </TooltipTrigger>
                              <TooltipContent side="right" align="start">
                                <p>{thread.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePinThread(thread.id)
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Pin className="h-3 w-3" />
                          </button>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="start">
                              <p>{thread.lastMessage}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </button>
                  ))}
              </div>

              <div className="flex items-center justify-between p-3 border-b border-t">
                <h3 className="font-medium text-sm">Threads</h3>
                <Button variant="ghost" size="icon" onClick={openCreateDialog}>
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-1">
                {filteredThreads
                  .filter((t) => !t.isPinned)
                  .map((thread) => (
                    <button
                      key={thread.id}
                      className={`w-full text-left p-2 rounded-md flex items-start gap-2 hover:bg-muted ${
                        selectedThread === thread.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedThread(thread.id)}
                    >
                      <div className={`mt-0.5 p-1 rounded-md ${getAgentColor(thread.agentType)} bg-opacity-20`}>
                        {getAgentIcon(thread.agentType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-medium text-sm truncate">{thread.name}</span>
                              </TooltipTrigger>
                              <TooltipContent side="right" align="start">
                                <p>{thread.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span className="text-xs text-muted-foreground">{thread.lastMessageTime}</span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="start">
                              <p>{thread.lastMessage}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </button>
                  ))}
              </div>
            </ScrollArea>
          </>
        )}
      </div>

      {/* Resizer */}
      {!sidebarCollapsed && (
        <div
          className={`w-2 hover:bg-primary/50 cursor-col-resize z-10 ${isResizing ? "bg-primary/50" : "bg-transparent"}`}
          onMouseDown={startResizing}
          style={{
            position: "absolute",
            left: `${sidebarWidth}px`,
            top: 0,
            bottom: 0,
            cursor: "col-resize",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-1 bg-border rounded-full"></div>
          </div>
        </div>
      )}

      {/* Sidebar toggle button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 left-3 h-6 w-6 rounded-full bg-muted z-10"
          onClick={toggleSidebar}
          style={{ left: sidebarCollapsed ? "8px" : `${sidebarWidth + 8}px` }}
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${threadPanelOpen ? "mr-[400px]" : ""}`}>
        {/* Chat Header */}
        <div className="border-b p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            <h2 className="font-medium">{currentThread?.name || "Select a thread"}</h2>
            {currentThread && (
              <div
                className={`px-2 py-0.5 rounded-full text-xs ${getAgentColor(currentThread.agentType)} bg-opacity-20`}
              >
                {getAgentName(currentThread.agentType)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {currentThread && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={openRenameDialog}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rename thread</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={openAgentSwitchDialog}>
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Switch agent</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowContext(!showContext)}
                    className={showContext ? "bg-muted" : ""}
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show/hide context panel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Messages */}
          <ScrollArea className={`flex-1 p-4 ${showContext ? "border-r" : ""}`} viewportRef={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {currentMessages && currentMessages.map((message) => renderMessage(message))}
              <div ref={messagesEndRef} />
              {showScrollToBottom && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="fixed bottom-20 right-8 z-10 rounded-full shadow-md"
                  onClick={scrollToBottom}
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Scroll to Bottom
                </Button>
              )}
            </div>
          </ScrollArea>

          {/* Context Panel */}
          {showContext && currentThread && (
            <div className="w-64 p-4 bg-muted/10">
              <h3 className="font-medium text-sm mb-3">Context</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Project</h4>
                  <p className="text-sm">{projectsData.find((p) => p.id === selectedProject)?.name}</p>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Thread</h4>
                  <p className="text-sm">{currentThread.name}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {getAgentName(currentThread.agentType)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Available Agents</h4>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-start text-xs h-7 ${currentAgentType === "project" ? "border-blue-500" : ""}`}
                      onClick={() => handleInvokeAgent("project")}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Project
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-start text-xs h-7 ${currentAgentType === "task" ? "border-green-500" : ""}`}
                      onClick={() => handleInvokeAgent("task")}
                    >
                      <CheckSquare className="h-3 w-3 mr-1" />
                      Tasks
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-start text-xs h-7 ${currentAgentType === "feature" ? "border-purple-500" : ""}`}
                      onClick={() => handleInvokeAgent("feature")}
                    >
                      <Layers className="h-3 w-3 mr-1" />
                      Features
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-start text-xs h-7 ${currentAgentType === "documentation" ? "border-yellow-500" : ""}`}
                      onClick={() => handleInvokeAgent("documentation")}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Docs
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-start text-xs h-7 ${currentAgentType === "detail" ? "border-red-500" : ""}`}
                      onClick={() => handleInvokeAgent("detail")}
                    >
                      <Info className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`justify-start text-xs h-7 ${currentAgentType === "planning" ? "border-indigo-500" : ""}`}
                      onClick={() => handleInvokeAgent("planning")}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Planning
                    </Button>
                  </div>
                  {currentAgentType && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Next message will be handled by the {getAgentName(currentAgentType)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error display */}
        {chatError && (
          <div className="p-3 mx-3 mb-3 bg-red-100 text-red-800 rounded-lg">
            <p className="font-medium">Error:</p>
            <p>{chatError}</p>
          </div>
        )}

        {/* Message Input */}
        <div className="p-3 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder={currentThread ? `Message ${currentThread.name}` : "Select a thread to start chatting"}
              value={input}
              onChange={handleInputChange}
              className="flex-1"
              disabled={!currentThread}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" disabled={!currentThread}>
                  <UserPlus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleInvokeAgent("project")}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Project Assistant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleInvokeAgent("task")}>
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Task Agent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleInvokeAgent("feature")}>
                  <Layers className="h-4 w-4 mr-2" />
                  Feature Agent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleInvokeAgent("documentation")}>
                  <FileText className="h-4 w-4 mr-2" />
                  Documentation Agent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleInvokeAgent("detail")}>
                  <Info className="h-4 w-4 mr-2" />
                  Detail Agent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleInvokeAgent("planning")}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Planning Agent
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button type="submit" size="icon" disabled={isLoading || !currentThread || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Thread Panel */}
      {threadPanelOpen && (
        <div className="absolute top-0 right-0 bottom-0 w-[400px] border-l bg-background flex flex-col">
          {/* Thread Panel Header */}
          <div className="border-b p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h2 className="font-medium">Thread</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={closeThreadPanel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Thread Content */}
          <ScrollArea className="flex-1 p-4" viewportRef={threadScrollAreaRef}>
            <div className="space-y-4 pb-4">
              {/* Original message */}
              {activeMessage && (
                <>
                  {renderMessage(activeMessage, true)}
                  <Separator className="my-4" />
                </>
              )}

              {/* Thread replies */}
              {activeMessageReplies.map((reply) => renderMessage(reply, true))}
              <div ref={threadMessagesEndRef} />
              {showThreadScrollToBottom && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="fixed bottom-20 right-8 z-10 rounded-full shadow-md"
                  onClick={scrollThreadToBottom}
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Scroll to Bottom
                </Button>
              )}
            </div>
          </ScrollArea>

          {/* Thread Input */}
          <div className="p-3 border-t">
            <form onSubmit={handleThreadReply} className="flex gap-2">
              <Input
                placeholder="Reply to thread..."
                value={threadInput}
                onChange={handleThreadInputChange}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isThreadLoading || !threadInput.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Rename Thread Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Thread</DialogTitle>
            <DialogDescription>Give your thread a new name that describes its purpose.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="thread-name">Thread Name</Label>
              <Input
                id="thread-name"
                value={newThreadName}
                onChange={(e) => setNewThreadName(e.target.value)}
                placeholder="Enter thread name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameThread}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Thread Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Thread</DialogTitle>
            <DialogDescription>Start a new conversation with a specific agent.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-thread-name">Thread Name</Label>
              <Input
                id="create-thread-name"
                value={createThreadName}
                onChange={(e) => setCreateThreadName(e.target.value)}
                placeholder="Enter thread name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agent-type">Agent Type</Label>
              <Select value={newThreadType} onValueChange={(value) => setNewThreadType(value as AgentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project">Project Assistant</SelectItem>
                  <SelectItem value="task">Task Agent</SelectItem>
                  <SelectItem value="feature">Feature Agent</SelectItem>
                  <SelectItem value="documentation">Documentation Agent</SelectItem>
                  <SelectItem value="detail">Detail Agent</SelectItem>
                  <SelectItem value="planning">Planning Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateThread}>Create Thread</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Switch Agent Dialog */}
      <Dialog open={isAgentSwitchDialogOpen} onOpenChange={setIsAgentSwitchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Agent</DialogTitle>
            <DialogDescription>Change the primary agent for this thread.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-agent-type">Agent Type</Label>
              <Select value={newAgentType} onValueChange={(value) => setNewAgentType(value as AgentType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="project">Project Assistant</SelectItem>
                  <SelectItem value="task">Task Agent</SelectItem>
                  <SelectItem value="feature">Feature Agent</SelectItem>
                  <SelectItem value="documentation">Documentation Agent</SelectItem>
                  <SelectItem value="detail">Detail Agent</SelectItem>
                  <SelectItem value="planning">Planning Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAgentSwitchDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSwitchAgent}>Switch Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Sheet */}
      <Sheet open={documentViewerOpen} onOpenChange={setDocumentViewerOpen}>
        <SheetContent className="w-[90%] sm:max-w-[600px] md:max-w-[800px]" side="right">
          <SheetHeader>
            <SheetTitle>{viewedDocument?.title || "Document"}</SheetTitle>
            <SheetDescription>Viewing the full content in a dedicated panel</SheetDescription>
          </SheetHeader>
          <div className="mt-6 overflow-y-auto max-h-[80vh]">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-line break-words">{viewedDocument?.content}</div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
