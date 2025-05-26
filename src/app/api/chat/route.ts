import { createGroq } from "@ai-sdk/groq"
import { streamText, tool, ToolInvocation } from "ai"
import { auth } from "@/auth"
import { z } from "zod"
import { gmail_v1 } from 'googleapis'
import { sendEmail, getEmails, replyToEmail, deleteEmail, starEmail, unstarEmail, sendToTrash, unTrashEmail, getEmailLabelofSpecificEmail, searchEmails  } from "@/app/actions/action"


interface Message {
    role: 'user' | 'assistant';
    content: string;
    toolInvocations?: ToolInvocation[];
}

interface EmailHeader {
    name: string;
    value: string;
}


const groq = createGroq({
    apiKey: process.env.GROQ_API_KEY
})

export async function POST(req: Request) {
    const session = await auth()

    // Check if user is authenticated
    if (!session) {
        return new Response(JSON.stringify({ error: "Not authenticated" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        })
    }

    const { messages }: { messages: Message[] } = await req.json()

    // System prompt that defines the assistant's capabilities and knowledge
    const systemPrompt = `
    You are an email assistant that helps users manage their emails through natural language.
    You can help with the following tasks:
    1. Reading emails - You can summarize or read out emails from the user's inbox
    2. Sending emails - You can help draft and send emails to recipients
    3. Searching emails - You can help find emails based on criteria like sender, subject, or content
    4. Deleting emails - You can help delete emails from the user's inbox
    5. Replying to emails - You can help reply to emails from the user's inbox  
    6. Starring emails - You can help star emails from the user's inbox
    7. Unstarring emails - You can help unstar emails from the user's inbox
    8. Sending emails to trash - You can help send emails to trash from the user's inbox
    9. Untrashing emails - You can help untrash emails from the user's trash
    10. Getting the label of a specific email - You can help get the label of a specific email from the user's inbox
    11. Searching for emails - You can help search for emails from the user's inbox
    

    The user is authenticated with their Google account: ${session.user?.email || "Unknown user"}
    
    You have access to the user's email data through special functions.
    When responding to requests about emails, use the actual email data from the Gmail API.

    For reading emails, you need to summarize the mails when the user asks you to read them.
    For replying to emails, you need to ask for the recipient, subject, and content of the email.
    For deleting emails, you need to ask for the id of the email.   
    For sending emails, you need to ask for the recipient, subject, and content of the email.
    For searching emails, you need to ask for the criteria to search for.
    
    When the user wants to compose an email, help them by asking for the recipient, subject, and content.
    Then use the sendEmail function to send the email.
    
    Always be helpful, concise, and respectful of the user's privacy.
  `

    // Process the user's request and generate a response
    const result = streamText({
        model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        tools: {
            getAllEmails: tool({
                description: "Get all emails from the user's inbox",
                parameters: z.object({
                    query: z.string().optional(),
                }),
                execute: async ({ query }: { query?: string }) => {
                    const emails = await getEmails(query || '')

                    return `Here are summaries of your recent emails:

${emails.data.map((email: {from: string, subject: string, body: string}) => {
                        const from = email.from;
                        const subject = email.subject;
                        const body = email.body;

                        return `### 📧 Email from ${from}
**Subject:** ${subject}

**Summary:**
${body.length > 200 ? body.substring(0, 200) + '...' : body}

---`;
                    }).join('\n')}`;
                }
            }),
            sendEmail: tool({
                description: "Send an email",
                parameters: z.object({
                    to: z.string(),
                    subject: z.string(),
                    body: z.string(),
                }),
                execute: async ({ to, subject, body }) => {
                    const email = await sendEmail(to, subject, body)
                    if (email) {
                        return `Email sent successfully to ${to} with subject ${subject} and body ${body}`
                    } else {
                        return `Email not sent`
                    }
                }
            }),
            replyToEmail: tool({
                description: "Reply to an email",
                parameters: z.object({
                    id: z.string(),
                    to: z.string(),
                    subject: z.string(),
                    body: z.string(),
                }),
                execute: async ({ id, to, subject, body }) => {
                    const email = await replyToEmail(id, to, subject, body)
                    if (email) {
                        return `Email replied to successfully to ${to} with subject ${subject} and body ${body}`
                    } else {
                        return `Email not replied to`
                    }
                }
            }),
            deleteEmail: tool({
                description: "Delete an email",
                parameters: z.object({
                    id: z.string(),
                }),
                execute: async ({ id }) => {
                    const email = await deleteEmail(id)
                    if(email.status === 500)    {
                        return `Email not deleted`
                    }
                    return `Email deleted successfully`
                }
            }),
            starEmail: tool({
                description: "Star an email",
                parameters: z.object({
                    id: z.string(),
                }),
                execute: async ({ id }) => {
                    const email = await starEmail(id)
                    if (email.data) {
                        return `Email starred successfully`
                    } else {
                        return `Email not starred`
                    }
                }
            }),
            unstarEmail: tool({
                description: "Unstar an email",
                parameters: z.object({
                    id: z.string(),
                }),
                execute: async ({ id }) => {
                    const email = await unstarEmail(id) 
                    if (email) {
                        return `Email unstarred successfully`
                    } else {
                        return `Email not unstarred`
                    }
                }
            }),
            sendToTrash: tool({
                description: "Send an email to trash",
                parameters: z.object({
                    id: z.string(),
                }),
                execute: async ({ id }) => {
                    const email = await sendToTrash(id)
                    if (email) {
                        return `Email sent to trash successfully`
                    } else {
                        return `Email not sent to trash`
                    }
                }   
            }),
            unTrashEmail: tool({
                description: "Untrash an email",
                parameters: z.object({
                    id: z.string(),
                }), 
                execute: async ({ id }) => {
                    const email = await unTrashEmail(id)
                    if (email) {
                        return `Email untrashed successfully`
                    } else {
                        return `Email not untrashed`
                    }
                }
            }),
            getEmailLabelofSpecificEmail: tool({
                description: "Get the label of a specific email",
                parameters: z.object({
                    id: z.string(),
                }),
                execute: async ({ id }) => {
                    const email = await getEmailLabelofSpecificEmail(id)
                    if (email) {
                            return `Email label: ${email.data.labelIds}`
                    } else {
                        return `Email not found`
                    }
                }
            }),
            searchEmails: tool({
                description: "Search for emails",
                parameters: z.object({
                    query: z.string(),
                }),
                execute: async ({ query }) => {
                    const emails = await searchEmails(query)
                    return `Here are the emails that match your query: ${emails.data.map((email: gmail_v1.Schema$Message) => 
                        email.payload?.headers?.find(header => header.name === 'Subject')?.value).join(', ')}`
                }
            })      
        },
        maxSteps: 4
    })

    return result.toDataStreamResponse()
}
