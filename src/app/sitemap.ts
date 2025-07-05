import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import { MetadataRoute } from "next";

interface Post {
  _id: string;
  title: string;
  publishedAt: string;
  slug: { current: string };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Get all posts
  const sitemapQuery = groq`*[_type == "post"] {
    _id,
    title,
    slug,
    publishedAt
  } | order(publishedAt desc)`;

  const posts: { data: Post[] } = await sanityFetch({ query: sitemapQuery });

  // Create sitemap entries for posts
  const postEntries = posts.data.map((post) => ({
    url: `${baseUrl}/posts/${post.slug.current}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  return [...staticPages, ...postEntries];
}
