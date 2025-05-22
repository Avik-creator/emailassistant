"use server"

import { auth } from "@/auth"
import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'
import { getUserFromDB, getAccessandRefreshToken } from "./auth-helpers"

export type EmailCategory = "inbox" | "starred" | "sent" | "drafts" | "trash"

const LABEL_MAPPING = {
  inbox: "INBOX",
  starred: "STARRED",
  sent: "SENT",
  drafts: "DRAFT",
  trash: "TRASH"
}

export async function getEmailsByCategory(
  category: EmailCategory, 
  searchQuery?: string,
  page: number = 1,
  pageSize: number = 20,
  pageToken?: string | null
) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("User not found");
  }

  const user = await getUserFromDB(session.user.email as string);
  if (!user) {
    throw new Error("User not found");
  }

  const account = await getAccessandRefreshToken(user.id);
  if (!account) {
    throw new Error("Account not found");
  }

  const oauth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });

  try {
    oauth2Client.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    // Build the search query based on category
    let query = "";
    switch (category) {
      case "inbox":
        query = "in:inbox";
        break;
      case "starred":
        query = "is:starred";
        break;
      case "sent":
        query = "in:sent";
        break;
      case "drafts":
        query = "in:draft";
        break;
      case "trash":
        query = "in:trash";
        break;
    }

    // Enhance search query with Gmail search operators
    if (searchQuery) {
      const searchTerms = searchQuery.split(' ').filter(term => term.length > 0);
      const enhancedSearchTerms = searchTerms.map(term => {
        // Check if term is an email address
        if (term.includes('@')) {
          return `from:${term} OR to:${term}`;
        }
        // Check if term is a date
        if (term.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return `after:${term}`;
        }
        // Check if term is a file type
        if (term.startsWith('.')) {
          return `filename:${term}`;
        }
        // Check if term is a size
        if (term.match(/^\d+[kmg]b$/i)) {
          return `size:${term}`;
        }
        // Default to searching in subject and body
        return `subject:${term} OR body:${term}`;
      });
      
      query += ` (${enhancedSearchTerms.join(' AND ')})`;
    }

    const response = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: pageSize,
      pageToken: page > 1 && pageToken ? pageToken : undefined
    });

    const messages = response.data.messages;
    if (!messages) {
      return {
        emails: [],
        nextPageToken: null
      };
    }

    const emails = await Promise.all(
      messages.map(async (message) => {
        const email = await gmail.users.messages.get({
          userId: "me",
          id: message.id as string,
          format: "full"
        });

        const headers = email.data.payload?.headers || [];
        const subject = headers.find(h => h.name === "Subject")?.value || "No Subject";
        const from = headers.find(h => h.name === "From")?.value || "No Sender";
        const date = headers.find(h => h.name === "Date")?.value || "No Date";
        const snippet = email.data.snippet || "";
        const labels = email.data.labelIds || [];

        return {
          id: email.data.id || "",
          subject,
          from,
          date: new Date(date).toLocaleString(),
          snippet,
          isRead: !labels.includes("UNREAD"),
          isStarred: labels.includes("STARRED"),
        };
      })
    );

    return {
      emails,
      nextPageToken: response.data.nextPageToken || null
    };
  } catch (error) {
    console.error("Error fetching emails:", error);
    throw new Error("Error fetching emails");
  }
}

export async function toggleEmailStar(emailId: string, starred: boolean) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("User not found");
  }

  const user = await getUserFromDB(session.user.email as string);
  if (!user) {
    throw new Error("User not found");
  }

  const account = await getAccessandRefreshToken(user.id);
  if (!account) {
    throw new Error("Account not found");
  }

  const oauth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });

  try {
    oauth2Client.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    await gmail.users.messages.modify({
      userId: "me",
      id: emailId,
      requestBody: {
        addLabelIds: starred ? ["STARRED"] : [],
        removeLabelIds: !starred ? ["STARRED"] : [],
      },
    });

    return true;
  } catch (error) {
    console.error("Error toggling star:", error);
    throw new Error("Error toggling star");
  }
}

export async function markEmailAsRead(emailId: string, read: boolean) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("User not found");
  }

  const user = await getUserFromDB(session.user.email as string);
  if (!user) {
    throw new Error("User not found");
  }

  const account = await getAccessandRefreshToken(user.id);
  if (!account) {
    throw new Error("Account not found");
  }

  const oauth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });

  try {
    oauth2Client.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    await gmail.users.messages.modify({
      userId: "me",
      id: emailId,
      requestBody: {
        addLabelIds: read ? [] : ["UNREAD"],
        removeLabelIds: read ? ["UNREAD"] : [],
      },
    });

    return true;
  } catch (error) {
    console.error("Error marking as read:", error);
    throw new Error("Error marking as read");
  }
}

export async function getEmailContent(emailId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("User not found");
  }

  const user = await getUserFromDB(session.user.email as string);
  if (!user) {
    throw new Error("User not found");
  }

  const account = await getAccessandRefreshToken(user.id);
  if (!account) {
    throw new Error("Account not found");
  }

  const oauth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });

  try {
    oauth2Client.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    const email = await gmail.users.messages.get({
      userId: "me",
      id: emailId,
      format: "full"
    });

    const payload = email.data.payload;
    const headers = payload?.headers || [];
    
    // Extract email headers
    const subject = headers.find(h => h.name === "Subject")?.value || "No Subject";
    const from = headers.find(h => h.name === "From")?.value || "No Sender";
    const to = headers.find(h => h.name === "To")?.value || "No Recipient";
    const date = headers.find(h => h.name === "Date")?.value || "No Date";
    
    // Extract email body (handle both HTML and plain text)
    let htmlBody = "";
    let plainTextBody = "";

    if (payload?.parts) {
      // Multipart message
      for (const part of payload.parts) {
        if (part.mimeType === "text/html" && part.body?.data) {
          htmlBody = Buffer.from(part.body.data, "base64").toString("utf-8");
        } else if (part.mimeType === "text/plain" && part.body?.data) {
          plainTextBody = Buffer.from(part.body.data, "base64").toString("utf-8");
        }
      }
    } else if (payload?.body?.data) {
      // Single part message
      const data = Buffer.from(payload.body.data, "base64").toString("utf-8");
      if (payload.mimeType === "text/html") {
        htmlBody = data;
      } else {
        plainTextBody = data;
      }
    }

    return {
      id: email.data.id || "",
      subject,
      from,
      to,
      date: new Date(date).toLocaleString(),
      htmlBody,
      plainTextBody,
      labels: email.data.labelIds || [],
    };
  } catch (error) {
    console.error("Error fetching email content:", error);
    throw new Error("Error fetching email content");
  }
}

export async function deleteEmail(emailId: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("User not found");
  }

  const user = await getUserFromDB(session.user.email as string);
  if (!user) {
    throw new Error("User not found");
  }

  const account = await getAccessandRefreshToken(user.id);
  if (!account) {
    throw new Error("Account not found");
  }

  const oauth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });

  try {
    oauth2Client.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    await gmail.users.messages.trash({
      userId: "me",
      id: emailId,
    });

    return true;
  } catch (error) {
    console.error("Error deleting email:", error);
    throw new Error("Error deleting email");
  }
}

export async function sendEmail(to: string, subject: string, body: string, threadId?: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("User not found");
  }

  const user = await getUserFromDB(session.user.email as string);
  if (!user) {
    throw new Error("User not found");
  }

  const account = await getAccessandRefreshToken(user.id);
  if (!account) {
    throw new Error("Account not found");
  }

  const oauth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });

  try {
    oauth2Client.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Create email content
    const emailLines = [
      `From: ${session.user.email}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body
    ];

    const email = emailLines.join('\r\n').trim();
    const encodedMessage = Buffer.from(email).toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Send the email
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
        threadId: threadId // Include threadId for replies
      }
    });

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
}

export async function replyToEmail(emailId: string, body: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("User not found");
  }

  // Get the original email to extract necessary information
  const originalEmail = await getEmailContent(emailId);
  
  // Create reply subject
  const subject = originalEmail.subject.startsWith('Re:') 
    ? originalEmail.subject 
    : `Re: ${originalEmail.subject}`;

  // Extract the sender's email from the "From" field
  const fromMatch = originalEmail.from.match(/<(.+?)>/) || [null, originalEmail.from];
  const replyTo = fromMatch[1];

  // Send the reply
  return sendEmail(replyTo, subject, body, emailId);
}

export async function forwardEmail(emailId: string, to: string, additionalComment: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("User not found");
  }

  // Get the original email
  const originalEmail = await getEmailContent(emailId);

  // Create forward subject
  const subject = originalEmail.subject.startsWith('Fwd:') 
    ? originalEmail.subject 
    : `Fwd: ${originalEmail.subject}`;

  // Create forward body
  const forwardBody = `
    ${additionalComment}
    <br><br>
    ---------- Forwarded message ----------<br>
    From: ${originalEmail.from}<br>
    Date: ${originalEmail.date}<br>
    Subject: ${originalEmail.subject}<br>
    To: ${originalEmail.to}<br>
    <br>
    ${originalEmail.htmlBody || originalEmail.plainTextBody}
  `;

  // Send the forwarded email
  return sendEmail(to, subject, forwardBody);
} 