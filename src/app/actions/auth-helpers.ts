"use server"

import { db } from "@/lib/schema";
import { users, accounts } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const getUserFromDB = async (email: string) => {
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return user;
}

export const getAccessandRefreshToken = async (user_id: string) => {
    const [account] = await db
        .select({
            accessToken: accounts.access_token,
            refreshToken: accounts.refresh_token,
        })
        .from(accounts)
        .where(eq(accounts.userId, user_id));
    return account;
} 