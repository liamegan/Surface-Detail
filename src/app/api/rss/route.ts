import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import RSS from "rss";
import { NextResponse } from "next/server";
import type { RSSQueryResult } from "@/sanity/types";

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
    feed_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/rss`,
    site_url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    image_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/favicon.ico`,
    managingEditor: "Surface Detail",
    webMaster: "Surface Detail",
    copyright: `${new Date().getFullYear()} Surface Detail`,
    language: "en",
    pubDate: new Date().toUTCString(),
    ttl: 60,
  });

  posts.data.forEach((post) => {
    if (!post.slug || !post.title || !post.publishedAt) return;

    // Convert PortableText to plain text for RSS description
    const plainTextBody =
      post.body
        ?.map((block) => {
          if (block._type === "block") {
            return (
              block.children
                ?.map((child: { text?: string }) => child.text || "")
                .join("") || ""
            );
          }
          return "";
        })
        .join(" ")
        .substring(0, 300) + "...";

    feed.item({
      title: post.title,
      description: plainTextBody,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/posts/${post.slug.current}`,
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
