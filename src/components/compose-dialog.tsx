"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { sendEmail, replyToEmail, forwardEmail } from "@/app/actions/emails"

interface ComposeDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "compose" | "reply" | "forward"
  emailId?: string
  initialTo?: string
  initialSubject?: string
  initialBody?: string
}

export function ComposeDialog({
  isOpen,
  onClose,
  mode,
  emailId,
  initialTo = "",
  initialSubject = "",
  initialBody = "",
}: ComposeDialogProps) {
  const [to, setTo] = useState(initialTo)
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState(initialBody)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSend = async () => {
    if (!to && mode !== "reply") {
      setError("Recipient email is required")
      return
    }

    setIsSending(true)
    setError(null)

    try {
      if (mode === "reply" && emailId) {
        await replyToEmail(emailId, body)
      } else if (mode === "forward" && emailId) {
        await forwardEmail(emailId, to, body)
      } else {
        await sendEmail(to, subject, body)
      }

      // Reset form and close dialog
      setTo("")
      setSubject("")
      setBody("")
      onClose()
    } catch (err) {
      console.error("Failed to send email:", err)
      setError("Failed to send email. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const getTitle = () => {
    switch (mode) {
      case "reply":
        return "Reply to Email"
      case "forward":
        return "Forward Email"
      default:
        return "Compose Email"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {mode === "compose" && "Create a new email message"}
            {mode === "reply" && "Reply to this email"}
            {mode === "forward" && "Forward this email"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2 space-y-4">
          {(mode === "compose" || mode === "forward") && (
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
              />
            </div>
          )}

          {mode === "compose" && (
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
          )}

          <div className="space-y-2 flex-1">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              className="min-h-[200px] resize-none"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={isSending}>
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 