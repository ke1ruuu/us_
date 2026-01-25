import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
        // Spotify
        if (url.includes("spotify.com")) {
            const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
            const response = await fetch(oembedUrl);
            const data = await response.json();
            return NextResponse.json(data);
        }

        // YouTube
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
            const response = await fetch(oembedUrl);
            const data = await response.json();
            return NextResponse.json(data);
        }

        // Instagram
        if (url.includes("instagram.com")) {
            // Instagram OEmbed is a bit more restrictive, but let's try the public one
            const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`;
            const response = await fetch(oembedUrl);
            if (response.ok) {
                const data = await response.json();
                return NextResponse.json(data);
            }
        }

        // Generic fallback
        return NextResponse.json({
            title: "Link Preview",
            provider_name: new URL(url).hostname,
            url: url
        });
    } catch (error) {
        console.error("Error fetching link preview:", error);
        return NextResponse.json({ error: "Failed to fetch preview" }, { status: 500 });
    }
}
