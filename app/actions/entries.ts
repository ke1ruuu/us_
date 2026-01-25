"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { getCurrentUser } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function createEntry(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) {
        return { error: "Not authenticated" };
    }

    const content = formData.get("content") as string;
    const type = (formData.get("type") as string) || "note";
    const imageUrlField = formData.get("image_url") as string;
    const imageFile = formData.get("image") as File;
    const linkDataField = formData.get("link_data") as string;

    let finalImageUrl = imageUrlField;
    let linkData = null;
    if (linkDataField) {
        try {
            linkData = JSON.parse(linkDataField);
        } catch (e) {
            console.error("Failed to parse link_data", e);
        }
    }

    const supabase = createAdminClient();

    if (imageFile && imageFile.size > 0) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("moments")
            .upload(filePath, imageFile, {
                contentType: imageFile.type,
            });

        if (uploadError) {
            console.error("Error uploading image:", uploadError);
            return { error: "Failed to upload image" };
        }

        const { data: { publicUrl } } = supabase.storage
            .from("moments")
            .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
    }

    if (!content && !finalImageUrl) {
        return { error: "Content is required" };
    }

    const { data, error } = await supabase.from("entries").insert({
        author_id: user.id,
        type,
        content,
        image_url: finalImageUrl,
        link_data: linkData
    });

    if (error) {
        console.error("Error creating entry:", error);
        return { error: error.message };
    }

    revalidatePath("/feed");
    revalidatePath("/notes");
    return { success: true };
}

export async function deleteEntry(id: string) {
    const user = await getCurrentUser();
    if (!user) return { error: "Not authenticated" };

    const supabase = createAdminClient();
    const { error } = await supabase.from("entries").delete().eq("id", id).eq("author_id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/");
    return { success: true };
}

export async function getEntries() {
    const user = await getCurrentUser();
    if (!user) return [];

    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("entries")
        .select(`
      *,
      author:users (
        id,
        username,
        display_name
      )
    `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching entries:", error);
        return [];
    }

    return data;
}
