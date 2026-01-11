import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const maxDuration = 300; // Allow 5 minutes for many links

export async function GET() {
  // Optional: Check for authorization (e.g., CRON_SECRET)
  // const authHeader = request.headers.get('authorization');
  // if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  const supabase = await createClient();

  // 1. Fetch all records from the 'Post' table where 'published' is true.
  const { data: posts, error } = await supabase
    .from("Post")
    .select("id, title, content")
    .eq("published", true);

  if (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!posts || posts.length === 0) {
    return NextResponse.json({ message: "No published posts found." });
  }

  // 2. Parse the 'content' field to extract all external hyperlinks.
  // Map unique URLs to the posts that contain them.
  const urlMap = new Map<string, { title: string; id: string }[]>();
  const regex = /\[.*?\]\((https?:\/\/[^\s)]+)\)/g;

  for (const post of posts) {
    if (!post.content) continue;

    const matches = post.content.matchAll(regex);
    for (const match of matches) {
      const url = match[1];
      if (!urlMap.has(url)) {
        urlMap.set(url, []);
      }
      // Avoid duplicate post entries for the same URL
      const entries = urlMap.get(url)!;
      if (!entries.some((e) => e.id === post.id)) {
        entries.push({ title: post.title, id: post.id });
      }
    }
  }

  const uniqueUrls = Array.from(urlMap.keys());
  const brokenLinks: { url: string; posts: { title: string; id: string }[]; status: number | string }[] = [];

  // 3. Check each unique URL.
  // We process in batches to be polite and efficient.
  const BATCH_SIZE = 10;
  for (let i = 0; i < uniqueUrls.length; i += BATCH_SIZE) {
    const batch = uniqueUrls.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (url) => {
        try {
          // 3. Lightweight HTTP HEAD request
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

          const response = await fetch(url, {
            method: "HEAD",
            signal: controller.signal,
            // Add a User-Agent to avoid being blocked by some servers
            headers: {
              "User-Agent": "LinkMedic/1.0",
            },
          });

          clearTimeout(timeoutId);

          // 4. If 404 or 500 status code, add to broken links.
          // Note: Some servers might return 405 Method Not Allowed for HEAD,
          // in which case we might retry with GET, but for now we stick to requirements.
          // Or we can be lenient and only flag 404/500 range explicitly.
          if (response.status === 404 || response.status >= 500) {
             brokenLinks.push({
               url,
               posts: urlMap.get(url)!,
               status: response.status,
             });
          }
        } catch (err: unknown) {
          // Handle timeouts and network errors
          let errorMessage = 'Error';
          if (err instanceof Error) {
            errorMessage = err.name === 'AbortError' ? 'Timeout' : err.message;
          }

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
      // Group by Post for better readability in the message
      // Or just list them as requested: "Post title and the broken URL"

      let messageContent = "**Link Medic Report: Broken Links Found**\n\n";

      // We can iterate broken links and list them.
      // To avoid hitting Discord message length limits (2000 chars), we might need to truncate.

      for (const link of brokenLinks) {
        const postTitles = link.posts.map(p => p.title).join(", ");
        const line = `- **${link.status}**: <${link.url}> in *${postTitles}*\n`;

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
