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
import { Paperclip } from "lucide-react"

interface ComposeEmailProps {
  isOpen: boolean
  onClose: () => void
  onSend: (email: { to: string; subject: string; body: string }) => void
  initialTo?: string
  initialSubject?: string
  initialBody?: string
}

export function ComposeEmail({
  isOpen,
  onClose,
  onSend,
  initialTo = "",
  initialSubject = "",
  initialBody = "",
}: ComposeEmailProps) {
  const [to, setTo] = useState(initialTo)
  const [subject, setSubject] = useState(initialSubject)
  const [body, setBody] = useState(initialBody)
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!to) return

    setIsSending(true)

    try {
      await onSend({ to, subject, body })
      // Reset form and close dialog
      setTo("")
      setSubject("")
      setBody("")
      onClose()
    } catch (error) {
      console.error("Failed to send email:", error)
      // Handle error (could show an error message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Compose Email</DialogTitle>
          <DialogDescription>Create a new email message</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input id="to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
            />
          </div>

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
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" type="button">
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={!to || isSending}>
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
