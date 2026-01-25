import { cookies } from "next/headers";
import { createAdminClient } from "@/utils/supabase/admin";

export async function getSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId) {
        console.log("No session_id cookie found");
        return null;
    }

    const supabase = createAdminClient();

    const { data: sessionData, error: sessionError } = await supabase
        .from("sessions")
        .select("id, user_id, created_at")
        .eq("id", sessionId)
        .single();

    if (sessionError || !sessionData) {
        if (sessionError) console.error("Session fetch error:", sessionError);
        else console.log("No session found in DB for ID:", sessionId);
        return null;
    }

    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, username, display_name")
        .eq("id", sessionData.user_id)
        .single();

    if (userError || !userData) {
        if (userError) console.error("User fetch error:", userError);
        return null;
    }

    return {
        ...sessionData,
        users: userData
    };
}

export interface User {
    id: string;
    username: string;
    display_name: string;
}

export async function getCurrentUser() {
    const session = await getSession();
    if (!session || !session.users) return null;

    // Handle case where users might be an array or object depending on PostgREST version/types
    const user = Array.isArray(session.users) ? session.users[0] : session.users;
    return user as User;
}
