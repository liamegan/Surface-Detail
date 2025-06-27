import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

import styles from "./page.module.css";

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

  console.log(styles);

  return (
    <main className={styles.main}>
      <h1>Latest blog posts</h1>
      {posts.length > 0 ? (
        <ul className={styles.postList}>
          {posts.map((post) => (
            <li key={post._id} className={styles.postItem}>
              <a href={`/posts/${post.slug.current}`}>{post.title}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found</p>
      )}
    </main>
  );
}
