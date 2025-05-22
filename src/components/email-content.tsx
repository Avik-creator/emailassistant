"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Star, Reply, Forward, Trash2 } from "lucide-react"
import { getEmailContent, deleteEmail } from "@/app/actions/emails"
import { ComposeDialog } from "./compose-dialog"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

interface EmailContentProps {
  emailId: string
  onClose: () => void
  onStarToggle: (emailId: string, starred: boolean) => void
}

interface EmailData {
  id: string
  subject: string
  from: string
  to: string
  date: string
  htmlBody: string
  plainTextBody: string
  labels: string[]
}

export function EmailContent({ emailId, onClose, onStarToggle }: EmailContentProps) {
  const [email, setEmail] = useState<EmailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [isForwardOpen, setIsForwardOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchEmailContent = async () => {
      try {
        setLoading(true)
        const emailData = await getEmailContent(emailId)
        setEmail(emailData)
        setError(null)
      } catch (err) {
        setError("Failed to fetch email content")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchEmailContent()
  }, [emailId])

  const handleDelete = async () => {
    try {
      await deleteEmail(emailId)
      onClose()
      router.refresh() // Refresh the email list
    } catch (err) {
      console.error("Failed to delete email:", err)
      // Could show an error message here
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#10151a]">
        <div className="text-center text-green-400">Loading email content...</div>
      </div>
    )
  }

  if (error || !email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#10151a]">
        <div className="text-center text-red-400">{error || "Failed to load email"}</div>
      </div>
    )
  }

  return (
    <Card className="flex-1 flex flex-col h-full bg-gradient-to-br from-green-950/80 to-[#10151a] border-green-900 shadow-lg text-green-100">
      {/* Email Header */}
      <div className="border-b border-green-900 p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold truncate flex-1 text-green-100">{email.subject}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onStarToggle(email.id, !email.labels.includes("STARRED"))}
              className="hover:bg-green-900/60"
            >
              <Star
                className={`h-5 w-5 ${email.labels.includes("STARRED") ? "fill-yellow-400 text-yellow-400" : "text-green-400"}`}
              />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-green-900/60">
              <X className="h-5 w-5 text-green-400" />
            </Button>
          </div>
        </div>
        <div className="space-y-1 text-sm text-green-400">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-green-300">From: </span>
              {email.from}
            </div>
            <div>{email.date}</div>
          </div>
          <div>
            <span className="font-medium text-green-300">To: </span>
            {email.to}
          </div>
        </div>
      </div>

      {/* Email Actions */}
      <div className="border-b border-green-900 p-4 bg-green-950/40">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setIsReplyOpen(true)} className="text-green-300 hover:bg-green-900/60">
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setIsForwardOpen(true)} className="text-green-300 hover:bg-green-900/60">
            <Forward className="h-4 w-4 mr-2" />
            Forward
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete} className="text-green-300 hover:bg-green-900/60">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 p-6 overflow-y-auto text-green-100">
        {email.htmlBody ? (
          <div dangerouslySetInnerHTML={{ __html: email.htmlBody }} />
        ) : (
          <pre className="whitespace-pre-wrap font-sans">{email.plainTextBody}</pre>
        )}
      </div>

      {/* Reply Dialog */}
      <ComposeDialog
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        mode="reply"
        emailId={email.id}
      />

      {/* Forward Dialog */}
      <ComposeDialog
        isOpen={isForwardOpen}
        onClose={() => setIsForwardOpen(false)}
        mode="forward"
        emailId={email.id}
        initialSubject={`Fwd: ${email.subject}`}
      />
    </Card>
  )
} 