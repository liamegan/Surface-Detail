import Link from "next/link";

import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import type { QueryResult } from "@/sanity/types";

import pagestyles from "./page.module.scss";

export default async function Home() {
  const query = groq`*[_type == "post"] {
    _id,
    title,
    slug,
    publishedAt
  } | order(publishedAt desc)`;

  const posts: { data: QueryResult } = await sanityFetch({ query });

  return (
    <main className={pagestyles.main}>
      <header>
        <h2 className="heading1">Posts</h2>
      </header>
      {posts.data.length > 0 ? (
        <nav>
          <ul className={pagestyles.postList}>
            {posts.data.map((post) => post.slug && (
              <li key={post._id} className={pagestyles.postItem}>
                <Link href={`/posts/${post.slug.current}`}>
                  {post.title}{post.publishedAt && ` - ${new Date(post.publishedAt).toDateString()}`}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : (
        <p>No posts found</p>
      )}
    </main>
  );
}
