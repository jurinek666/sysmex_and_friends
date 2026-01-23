import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const maxDuration = 300; // 5 minutes
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();

  // 1. Fetch all records from the 'Post' table where 'publishedAt' is not null.
  // We assume 'publishedAt' being set means the post is published.
  const { data: posts, error } = await supabase
    .from("Post")
    .select("id, title, content")
    .not("publishedAt", "is", null);

  if (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!posts || posts.length === 0) {
    return NextResponse.json({ message: "No published posts found." });
  }

  // 2. Parse the 'content' field to extract all external hyperlinks.
  const urlMap = new Map<string, { title: string; id: string }[]>();
  // Match [text](url) where url starts with http/https
  const regex = /\[.*?\]\((https?:\/\/[^\s)]+)\)/g;

  for (const post of posts) {
    if (!post.content) continue;

    const matches = post.content.matchAll(regex);
    for (const match of matches) {
      const url = match[1];
      if (!urlMap.has(url)) {
        urlMap.set(url, []);
      }
      const entries = urlMap.get(url)!;
      // Avoid duplicate post entries for the same URL
      if (!entries.some((e) => e.id === post.id)) {
        entries.push({ title: post.title, id: post.id });
      }
    }
  }

  const uniqueUrls = Array.from(urlMap.keys());
  const brokenLinks: { url: string; posts: { title: string; id: string }[]; status: number | string }[] = [];

  // 3. Check each unique URL in batches.
  const BATCH_SIZE = 10;
  for (let i = 0; i < uniqueUrls.length; i += BATCH_SIZE) {
    const batch = uniqueUrls.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (url) => {
        try {
          // Lightweight HTTP HEAD request with 5s timeout
          const response = await fetch(url, {
            method: "HEAD",
            signal: AbortSignal.timeout(5000),
            headers: {
              "User-Agent": "LinkMedic/1.0",
            },
          });

          // 4. If 404 or 500 status code, add to broken links.
          // We ignore 405 Method Not Allowed as some servers block HEAD.
          if (response.status === 404 || response.status >= 500) {
            brokenLinks.push({
              url,
              posts: urlMap.get(url)!,
              status: response.status,
            });
          }
        } catch (err: unknown) {
          let errorMessage = "Error";
          if (err instanceof Error) {
            errorMessage = err.name === "TimeoutError" || err.name === "AbortError" ? "Timeout" : err.message;
          }

          // We treat timeouts/network errors as potentially broken or slow links
          brokenLinks.push({
            url,
            posts: urlMap.get(url)!,
            status: errorMessage,
          });
        }
      })
    );
  }

  // 5. If broken links are found, send a summary notification to Discord.
  if (brokenLinks.length > 0) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (webhookUrl) {
      let messageContent = "**🚑 Link Medic Report: Broken Links Found**\n\n";

      for (const link of brokenLinks) {
        const postTitles = link.posts.map((p) => p.title).join(", ");
        const line = `- **${link.status}**: <${link.url}> in *${postTitles}*\n`;

        // Discord limit check (approximate)
        if (messageContent.length + line.length > 1900) {
          messageContent += "\n...(truncated)...";
          break;
        }
        messageContent += line;
      }

      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: messageContent }),
        });
      } catch (webhookError) {
        console.error("Failed to send Discord notification:", webhookError);
      }
    } else {
      console.warn("Broken links found but DISCORD_WEBHOOK_URL is not set.");
    }
  }

  return NextResponse.json({
    checked: uniqueUrls.length,
    broken: brokenLinks.length,
    details: brokenLinks,
  });
}
