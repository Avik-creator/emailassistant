import { auth, signOut } from "@/auth"

import { users, accounts } from "@/lib/schema";
import { db } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';


const getUserFromDB = async (email: string) => {
    const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email as string));
    return user;
}

const getAccessandRefreshToken = async (user_id: string) => {
    const [account] = await db
    .select({
        accessToken: accounts.access_token,
        refreshToken: accounts.refresh_token,
    })
    .from(accounts)
    .where(eq(accounts.userId, user_id));
    return account;
}

export async function getEmails(query: string) {
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
      })

    try{
        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        })

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.list({
            userId: "me",
            q: query,
            maxResults: 10
        });

        const messages = response.data.messages;

        if (!messages) {
            throw new Error("No messages found");
        }

        const emails = await Promise.all(
            messages.map(async (message) => {
                const emailRes = await gmail.users.messages.get({
                    userId: "me",
                    id: message.id as string,
                    format: "full", // this gives full headers and body,
                    
                });
        
                const payload = emailRes.data.payload;
                const headers = payload?.headers || [];
        
                const subject = headers.find(header => header.name === "Subject")?.value || "No Subject";
                const from = headers.find(header => header.name === "From")?.value || "Unknown Sender";
        
                let body = "";
                if (payload?.parts) {
                    const part = payload.parts.find(p => p.mimeType === "text/plain");
                    if (part?.body?.data) {
                        body = Buffer.from(part.body.data, "base64").toString("utf-8");
                    }
                } else if (payload?.body?.data) {
                    // Single part message
                    body = Buffer.from(payload.body.data, "base64").toString("utf-8");
                }
        
                return { subject, from, body };
            })
        );

        return emails;
        
        
        
    }catch(error){
        console.error("Error fetching emails:", error);
        throw new Error("Error fetching emails");
    }
}

export async function sendEmail(to: string, subject: string, body: string) {
    const session = await auth();

    if (!session?.user) {
        throw new Error("User not found");
    }

    const user = await getUserFromDB(session.user.email as string);
    
    const account = await getAccessandRefreshToken(user.id);
    if (!account) {
        throw new Error("Account not found");
    }

    const oauth2Client = new OAuth2Client({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })

    try{
        oauth2Client.setCredentials({   
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        })

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const message = [
            `To: ${to}`,
            `Subject: ${subject}`,
            '',
            body
        ].join('\n');

        const encodedMessage = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage
            }
        });

        return response.data;
        
    }catch(error){
        console.error("Error sending email:", error);
        throw new Error("Error sending email");
    }
}

export async function searchEmails(query: string) {
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
        const response = await gmail.users.messages.list({
            userId: "me",
            q: query,
            maxResults: 10
        });

        const messages = response.data.messages;
        if (!messages) {
            return [];
        }

        const emails = await Promise.all(
            messages.map(async (message) => {
                const email = await gmail.users.messages.get({
                    userId: "me",
                    id: message.id as string,
                });
                return email;
            })
        );

        return emails;
    } catch (error) {
        console.error("Error searching emails:", error);
        throw new Error("Error searching emails");
    }
}

// composeEmail is essentially the same as sendEmail, so we'll export it as an alias
export const composeEmail = sendEmail;

export async function deleteEmail(id: string) {
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
    })

    try{
        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        })

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.delete({
            userId: "me",
            id: id,
        });
        
        return response.data;
    }catch(error){
        console.error("Error deleting email:", error);
        throw new Error("Error deleting email");
    }


}

export async function replyToEmail(id: string, to: string, subject: string, body: string) {
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

    // Construct the email message with proper headers
    const emailMessage = [
        `To: ${to}`,
        `Subject: ${subject}`,
        `In-Reply-To: ${id}`,
        `References: ${id}`,
        `Content-Type: text/plain; charset=utf-8`,
        '',
        body
    ].join('\n');

    // Encode the complete message
    const encodedMessage = Buffer.from(emailMessage)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

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
        const response = await gmail.users.messages.send({  
            userId: "me",
            requestBody: {
                raw: encodedMessage
            }
        }); 

        return response.data;
    } catch (error) {
        console.error("Error replying to email:", error);
        throw new Error("Error replying to email");
    }
}