// import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/live";
import { groq, PortableTextBlock } from "next-sanity";

import pagestyles from "./page.module.scss";

interface Post {
  _id: string;
  title: string;
  publishedAt: string;
  slug: { current: string };
  body: PortableTextBlock[];
}
interface Posts {
  data: Post[];
}

export default async function Home() {
  const query = groq`*[_type == "post"] {
    _id,
    title,
    slug,
    publishedAt
  } | order(publishedAt desc)`;

  const posts: Posts = await sanityFetch({ query });

  return (
    <main className={pagestyles.main}>
      <h2 className="heading1">Posts</h2>
      {posts.data.length > 0 ? (
        <nav>
          <ul className={pagestyles.postList}>
            {posts.data.map((post) => (
              <li key={post._id} className={pagestyles.postItem}>
                <a href={`/posts/${post.slug.current}`}>
                  {post.title} - {new Date(post.publishedAt).toDateString()}
                </a>
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
