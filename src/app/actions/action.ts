import { auth } from "@/auth"
import { users, accounts } from "@/lib/schema";
import { db } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { OAuth2Client } from 'google-auth-library';
import { google, gmail_v1 } from 'googleapis';

// Type definitions
interface User {
    id: string;
    email: string;
    name?: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface Account {
    accessToken: string | null;
    refreshToken: string | null;
}

interface EmailData {
    subject: string;
    from: string;
    body: string;
    id?: string;
    date?: string;
    to?: string;
    labels?: string[];
}

interface ApiResponse<T> {
    status: number;
    data: T;
}

interface GmailHeader {
    name?: string | null;
    value?: string | null;
}

// Utility function to safely get user from database
const getUserFromDB = async (email: string): Promise<User | undefined> => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return user as User;
}

// Utility function to get access and refresh tokens
const getAccessandRefreshToken = async (user_id: string): Promise<Account | undefined> => {
    const [account] = await db
        .select({
            accessToken: accounts.access_token,
            refreshToken: accounts.refresh_token,
        })
        .from(accounts)
        .where(eq(accounts.userId, user_id));
    return account;
}

// Helper function to extract email body from Gmail message payload
const extractEmailBody = (payload: gmail_v1.Schema$MessagePart | undefined): string => {
    if (!payload) return "";
    
    let body = "";
    if (payload.parts) {
        const part = payload.parts.find(p => p.mimeType === "text/plain");
        if (part?.body?.data) {
            body = Buffer.from(part.body.data, "base64").toString("utf-8");
        }
    } else if (payload.body?.data) {
        // Single part message
        body = Buffer.from(payload.body.data, "base64").toString("utf-8");
    }
    return body;
}

// Helper function to extract header value
const getHeaderValue = (headers: GmailHeader[], headerName: string): string => {
    return headers.find(header => header.name === headerName)?.value || "";
}

export async function getEmails(query: string): Promise<ApiResponse<EmailData[]>> {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error("User not authenticated");
        }

        const user = await getUserFromDB(session.user.email);
        if (!user) {
            throw new Error("User not found in database");
        }

        const account = await getAccessandRefreshToken(user.id);
        if (!account?.accessToken || !account?.refreshToken) {
            throw new Error("Account credentials not found");
        }

        const oauth2Client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });

        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.list({
            userId: "me",
            q: query,
            maxResults: 5
        });

        const messages = response.data.messages;

        if (!messages || messages.length === 0) {
            return {
                status: 200,
                data: [],
            };
        }

        const emails: EmailData[] = await Promise.all(
            messages.map(async (message): Promise<EmailData> => {
                const emailRes = await gmail.users.messages.get({
                    userId: "me",
                    id: message.id as string,
                    format: "full",
                });

                const payload = emailRes.data.payload;
                const headers: GmailHeader[] = payload?.headers || [];

                const subject = getHeaderValue(headers, "Subject") || "No Subject";
                const from = getHeaderValue(headers, "From") || "Unknown Sender";
                const date = getHeaderValue(headers, "Date");
                const to = getHeaderValue(headers, "To");
                const body = extractEmailBody(payload);

                return {
                    id: message.id || undefined,
                    subject,
                    from,
                    to: to || undefined,
                    date: date || undefined,
                    body,
                    labels: emailRes.data.labelIds || undefined,
                };
            })
        );

        return {
            status: 200,
            data: emails,
        };
    } catch (error) {
        console.error("Error fetching emails:", error);
        return {
            status: 500,
            data: [],
        };
    }
}

export async function sendEmail(
    to: string, 
    subject: string, 
    body: string
): Promise<ApiResponse<gmail_v1.Schema$Message>> {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error("User not authenticated");
        }

        const user = await getUserFromDB(session.user.email);
        if (!user) {
            throw new Error("User not found in database");
        }

        const account = await getAccessandRefreshToken(user.id);
        if (!account?.accessToken || !account?.refreshToken) {
            throw new Error("Account credentials not found");
        }

        const oauth2Client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });

        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const message = [
            `To: ${to}`,
            `Subject: ${subject}`,
            '',
            body
        ].join('\n');

        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage
            }
        });

        return {
            status: response.status || 200,
            data: response.data,
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            status: 500,
            data: {} as gmail_v1.Schema$Message,
        };
    }
}

export async function searchEmails(query: string): Promise<ApiResponse<gmail_v1.Schema$Message[]>> {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error("User not authenticated");
        }

        const user = await getUserFromDB(session.user.email);
        if (!user) {
            throw new Error("User not found in database");
        }

        const account = await getAccessandRefreshToken(user.id);
        if (!account?.accessToken || !account?.refreshToken) {
            throw new Error("Account credentials not found");
        }

        const oauth2Client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });

        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.list({
            userId: "me",
            q: query,
            maxResults: 5
        });

        const messages = response.data.messages;
        if (!messages || messages.length === 0) {
            return {
                status: 404,
                data: [],
            };
        }

        const emails = await Promise.all(
            messages.map(async (message) => {
                const email = await gmail.users.messages.get({
                    userId: "me",
                    id: message.id as string,
                });
                return email.data;
            })
        );

        return {
            status: 200,
            data: emails,
        };
    } catch (error) {
        console.error("Error searching emails:", error);
        return {
            status: 500,
            data: [],
        };
    }
}

// composeEmail is essentially the same as sendEmail, so we'll export it as an alias
export const composeEmail = sendEmail;

export async function deleteEmail(id: string): Promise<ApiResponse<string>> {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error("User not authenticated");
        }

        const user = await getUserFromDB(session.user.email);
        if (!user) {
            throw new Error("User not found in database");
        }

        const account = await getAccessandRefreshToken(user.id);
        if (!account?.accessToken || !account?.refreshToken) {
            throw new Error("Account credentials not found");
        }

        const oauth2Client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });

        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.delete({
            userId: "me",
            id: id,
        });

        return {
            status: response.status || 200,
            data: "Email deleted successfully"
        };
    } catch (error) {
        console.error("Error deleting email:", error);
        return {
            status: 500,
            data: "Error deleting email"
        };
    }
}

export async function replyToEmail(
    id: string, 
    to: string, 
    subject: string, 
    body: string
): Promise<ApiResponse<gmail_v1.Schema$Message>> {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error("User not authenticated");
        }

        const user = await getUserFromDB(session.user.email);
        if (!user) {
            throw new Error("User not found in database");
        }

        const account = await getAccessandRefreshToken(user.id);
        if (!account?.accessToken || !account?.refreshToken) {
            throw new Error("Account credentials not found");
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

        return {
            status: response.status || 200,
            data: response.data,
        };
    } catch (error) {
        console.error("Error replying to email:", error);
        return {
            status: 500,
            data: {} as gmail_v1.Schema$Message,
        };
    }
}

export async function starEmail(id: string): Promise<ApiResponse<gmail_v1.Schema$Message>> {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error("User not authenticated");
        }

        const user = await getUserFromDB(session.user.email);
        if (!user) {
            throw new Error("User not found in database");
        }

        const account = await getAccessandRefreshToken(user.id);
        if (!account?.accessToken || !account?.refreshToken) {
            throw new Error("Account credentials not found");
        }

        const oauth2Client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });

        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.modify({
            userId: "me",
            id: id,
            requestBody: {
                addLabelIds: ["STARRED"],
            }
        });

        return {
            status: response.status || 200,
            data: response.data,
        };
    } catch (error) {
        console.error("Error starring email:", error);
        return {
            status: 500,
            data: {} as gmail_v1.Schema$Message,
        };
    }
}

export async function unstarEmail(id: string): Promise<ApiResponse<gmail_v1.Schema$Message>> {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error("User not authenticated");
        }

        const user = await getUserFromDB(session.user.email);
        if (!user) {
            throw new Error("User not found in database");
        }

        const account = await getAccessandRefreshToken(user.id);
        if (!account?.accessToken || !account?.refreshToken) {
            throw new Error("Account credentials not found");
        }

        const oauth2Client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });

        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.modify({
            userId: "me",
            id: id,
            requestBody: {
                removeLabelIds: ["STARRED"],
            }
        });

        return {
            status: response.status || 200,
            data: response.data,
        };
    } catch (error) {
        console.error("Error unstarring email:", error);
        return {
            status: 500,
            data: {} as gmail_v1.Schema$Message,
        };
    }
}

export async function getEmailLabelofSpecificEmail(id: string): Promise<ApiResponse<gmail_v1.Schema$Message>> {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error("User not authenticated");
        }

        const user = await getUserFromDB(session.user.email);
        if (!user) {
            throw new Error("User not found in database");
        }

        const account = await getAccessandRefreshToken(user.id);
        if (!account?.accessToken || !account?.refreshToken) {
            throw new Error("Account credentials not found");
        }

        const oauth2Client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });

        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.get({
            userId: "me",
            id: id,
        });

        return {
            status: response.status || 200,
            data: response.data,
        };
    } catch (error) {
        console.error("Error getting email label of specific email:", error);
        return {
            status: 500,
            data: {} as gmail_v1.Schema$Message,
        };
    }
}

export async function sendToTrash(id: string): Promise<ApiResponse<gmail_v1.Schema$Message>> {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error("User not authenticated");
        }

        const user = await getUserFromDB(session.user.email);
        if (!user) {
            throw new Error("User not found in database");
        }

        const account = await getAccessandRefreshToken(user.id);
        if (!account?.accessToken || !account?.refreshToken) {
            throw new Error("Account credentials not found");
        }

        const oauth2Client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });

        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.trash({
            userId: "me",
            id: id,
        });

        return {
            status: response.status || 200,
            data: response.data,
        };
    } catch (error) {
        console.error("Error sending email to trash:", error);
        return {
            status: 500,
            data: {} as gmail_v1.Schema$Message,
        };
    }
}

export async function unTrashEmail(id: string): Promise<ApiResponse<gmail_v1.Schema$Message>> {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            throw new Error("User not authenticated");
        }

        const user = await getUserFromDB(session.user.email);
        if (!user) {
            throw new Error("User not found in database");
        }

        const account = await getAccessandRefreshToken(user.id);
        if (!account?.accessToken || !account?.refreshToken) {
            throw new Error("Account credentials not found");
        }

        const oauth2Client = new OAuth2Client({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        });

        oauth2Client.setCredentials({
            access_token: account.accessToken,
            refresh_token: account.refreshToken,
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.untrash({
            userId: "me",
            id: id,
        });

        return {
            status: response.status || 200,
            data: response.data,
        };
    } catch (error) {
        console.error("Error untrashing email:", error);
        return {
            status: 500,
            data: {} as gmail_v1.Schema$Message,
        };
    }
}