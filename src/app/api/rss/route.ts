import { sanityFetch } from "@/sanity/lib/live";
import { urlFor } from "@/sanity/lib/image";
import { groq } from "next-sanity";
import RSS from "rss";
import { NextResponse } from "next/server";
import type { RSSQueryResult, BlockContent } from "@/sanity/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blockContentToHtml(body: BlockContent): string {
  const parts: string[] = [];
  let listBuffer: { type: "bullet" | "number"; items: string[] } | null = null;

  const flushList = () => {
    if (!listBuffer) return;
    const tag = listBuffer.type === "bullet" ? "ul" : "ol";
    parts.push(`<${tag}>${listBuffer.items.map((i) => `<li>${i}</li>`).join("")}</${tag}>`);
    listBuffer = null;
  };

  for (const block of body) {
    if (block._type === "block") {
      const inlineHtml = (block.children ?? [])
        .map((span) => {
          let text = escapeHtml(span.text ?? "");
          const marks = span.marks ?? [];
          const markDefs = block.markDefs ?? [];

          for (const mark of marks) {
            if (mark === "strong") text = `<strong>${text}</strong>`;
            else if (mark === "em") text = `<em>${text}</em>`;
            else if (mark === "code") text = `<code>${text}</code>`;
            else {
              const def = markDefs.find((d) => d._key === mark);
              if (def?._type === "link" && def.href) {
                text = `<a href="${escapeHtml(def.href)}">${text}</a>`;
              } else if (def?._type === "internalLink") {
                const slug = (def.reference as { slug?: { current?: string } } | undefined)?.slug?.current;
                if (slug) text = `<a href="${SITE_URL}/posts/${slug}">${text}</a>`;
              }
            }
          }
          return text;
        })
        .join("");

      if (block.listItem) {
        if (!listBuffer || listBuffer.type !== block.listItem) {
          flushList();
          listBuffer = { type: block.listItem, items: [] };
        }
        listBuffer.items.push(inlineHtml);
      } else {
        flushList();
        const style = block.style ?? "normal";
        if (style === "h3" || style === "h4" || style === "h5") {
          parts.push(`<${style}>${inlineHtml}</${style}>`);
        } else if (style === "blockquote") {
          parts.push(`<blockquote>${inlineHtml}</blockquote>`);
        } else {
          parts.push(`<p>${inlineHtml}</p>`);
        }
      }
    } else if (block._type === "code") {
      flushList();
      const lang = escapeHtml(block.language ?? "");
      const code = escapeHtml(block.code ?? "");
      parts.push(`<pre><code${lang ? ` class="language-${lang}"` : ""}>${code}</code></pre>`);
    } else if (block._type === "image" && block.asset) {
      flushList();
      const src = urlFor(block).width(800).url();
      const alt = escapeHtml(block.alt ?? "");
      parts.push(`<img src="${src}" alt="${alt}" />`);
    } else if (block._type === "codepen" && block.url) {
      flushList();
      const url = escapeHtml(block.url);
      parts.push(`<p>CodePen iframe: <a href="${url}">${url}</a></p>`);
    }
  }

  flushList();
  return parts.join("\n");
}

export async function GET() {
  const RSSQuery = groq`*[_type == "post"] {
    _id,
    title,
    slug,
    publishedAt,
    body
  } | order(publishedAt desc)`;

  const posts: { data: RSSQueryResult } = await sanityFetch({ query: RSSQuery });

  const feed = new RSS({
    title: "Surface Detail",
    description: "Posts from Liam Egan",
    feed_url: `${SITE_URL}/api/rss`,
    site_url: SITE_URL,
    image_url: `${SITE_URL}/favicon.ico`,
    managingEditor: "Surface Detail",
    webMaster: "Surface Detail",
    copyright: `${new Date().getFullYear()} Surface Detail`,
    language: "en",
    pubDate: new Date().toUTCString(),
    ttl: 60,
  });

  posts.data.forEach((post) => {
    if (!post.slug || !post.title || !post.publishedAt) return;

    feed.item({
      title: post.title,
      description: post.body ? blockContentToHtml(post.body) : "",
      url: `${SITE_URL}/posts/${post.slug.current}`,
      guid: post._id,
      categories: [],
      author: "Surface Detail",
      date: post.publishedAt,
    });
  });

  const xml = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
