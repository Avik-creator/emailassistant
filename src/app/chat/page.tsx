"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useChat } from "ai/react"
import { useSession, signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, ArrowLeft, Send, LogOut, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMobile } from "@/lib/use-mobile"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Card } from "@/components/ui/card"

export default function ChatPage() {
  const { data: session, status } = useSession()
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    maxSteps: 4
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-white">Loading...</h2>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-black">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-white">Please sign in with your Google account first</h2>
          <Button onClick={() => signIn("google", { callbackUrl: "/chat" })}>Sign in with Google</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-neutral-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-neutral-900">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold ml-2 text-white">Email Assistant</h1>
        </div>
        <div className="flex items-center gap-2">
          {session?.user?.image && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name || "User"} />
              <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          )}
          <Link href="/email">
            <Button variant="outline" size={isMobile ? "icon" : "default"} className="border-neutral-800 bg-black text-white hover:bg-neutral-900">
              <Mail className="h-5 w-5" />
              {!isMobile && <span className="ml-2">Email View</span>}
            </Button>
          </Link>
          <Link href="/api/auth/signout">
            <Button variant="ghost" size="icon" className="text-neutral-300 hover:bg-neutral-900">
              <LogOut className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-black">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`flex items-start gap-4 mb-4 ${msg.role === "user" ? "" : "justify-end"}`}
            >
              {msg.role === "user" ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="bg-blue-900 rounded-lg p-3 text-sm text-blue-100 max-w-[70%]">
                   {msg.content}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-neutral-800 rounded-lg p-3 text-sm text-neutral-200 max-w-[70%]">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4 text-neutral-200" />
                  </div>
                </>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="bg-black border-t border-neutral-800 p-4 flex gap-2">
        <Input
          className="flex-1 bg-neutral-900 text-white border-neutral-800 placeholder:text-neutral-500 focus:ring-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-800 text-white hover:bg-blue-700">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}