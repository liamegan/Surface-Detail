import type { Metadata } from "next";

import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import { buildSrc } from "@sanity-image/url-builder";
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
    mainImage?: {
      asset: {
        _ref: string;
      };
    };
  };
}

const components = {
  types: {
    image,
    codepen,
    code,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const query = groq`*[ _type == "post" && slug.current == $slug ][0] {
    _id, title, publishedAt, mainImage
  }`;

  const post: Post = await sanityFetch({ query, params });

  let src = null;
  if (post?.data?.mainImage?.asset?._ref) {
    ({ src } = buildSrc({
      id: post.data.mainImage?.asset._ref ?? "",
      width: 1200,
      baseUrl: `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/`,
    }));
  }

  console.log(src);

  return {
    title: post.data.title,
    description: `Published on ${new Date(post.data.publishedAt).toDateString()}`,
    openGraph: {
      images: src ? [src] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const query = groq`*[ _type == "post" && slug.current == $slug ][0] {
    _id, title, body, publishedAt, mainImage
  }`;

  const post: Post = await sanityFetch({ query, params });

  if (!post?.data) return <div>No post found for {slug}</div>;

  console.log("Post data:", post.data);

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
