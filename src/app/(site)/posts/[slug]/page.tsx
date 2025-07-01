import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import { PortableText, PortableTextBlock } from "next-sanity";

import { image } from "@/components/image";
import { codepen } from "@/components/codepen";
import { code } from "@/components/code";
interface Post {
  data: {
    _id: string;
    title: string;
    publishedAt: string;
    body: PortableTextBlock[];
  };
}

const components = {
  types: {
    image,
    codepen,
    code,
  },
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const query = groq`*[ _type == "post" && slug.current == $slug ][0] {
    _id, title, body, publishedAt
  }`;

  const post: Post = await sanityFetch({ query, params });

  if (!post?.data) return <div>No post found for {slug}</div>;

  return (
    <article>
      <header>
        <h2 className="heading1">{post.data.title}</h2>
        <p>{new Date(post.data.publishedAt).toDateString()}</p>
      </header>
      <main>
        <PortableText value={post.data.body} components={components} />
      </main>
    </article>
  );
}
