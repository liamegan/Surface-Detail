import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import pagestyles from "./page.module.scss";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
}

export default async function Home() {
  const query = groq`*[_type == "post"] {
    _id,
    title,
    slug,
    publishedAt
  } | order(publishedAt desc)`;

  const posts: Post[] = await client.fetch(query);

  console.log(pagestyles);

  return (
    <main className={pagestyles.main}>
      <h2>Latest posts</h2>
      {posts.length > 0 ? (
        <nav>
          <ul className={pagestyles.postList}>
            {posts.map((post) => (
              <li key={post._id} className={pagestyles.postItem}>
                <a href={`/posts/${post.slug.current}`}>{post.title}</a>
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
