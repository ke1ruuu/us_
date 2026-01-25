"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    console.log("Login attempt for user:", username);

    if (!username || !password) {
        return { error: "Username and password are required" };
    }

    const supabase = createAdminClient();

    // We call our custom RPC function to verify credentials and create a session
    const { data, error } = await supabase.rpc("login_user", {
        p_username: username,
        p_password: password,
    });

    if (error) {
        console.error("Supabase RPC error:", error);
        return { error: `Server error: ${error.message}` };
    }

    if (!data || data.length === 0) {
        console.log("No data returned from login_user RPC for user:", username);
        return { error: "Invalid username or password" };
    }

    console.log("Login successful! RPC data:", data[0]);
    const { session_id } = data[0];

    const cookieStore = await cookies();
    cookieStore.set("session_id", session_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
    });

    redirect("/");
}

export async function logout() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (sessionId) {
        const supabase = createAdminClient();
        await supabase.from("sessions").delete().eq("id", sessionId);
    }

    cookieStore.delete("session_id");
    redirect("/login");
}
