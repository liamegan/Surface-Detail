import type { Metadata } from "next";
import Link from "next/link";

import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import { buildSrc } from "@sanity-image/url-builder";
import { PortableText } from "next-sanity";

import { image } from "@/components/image";
import { codepen } from "@/components/codepen";
import { code } from "@/components/code";
import { ArticleSeries } from "@/components/ArticleSeries";

interface InternalLinkProps {
  children: React.ReactNode;
  value?: { slug?: { current?: string } };
}

const components = {
  types: {
    image,
    codepen,
    code,
  },
  marks: {
    internalLink: (props: InternalLinkProps) => {
      const href = `/posts/${props.value?.slug?.current}`;
      return <Link href={href}>{props.children}</Link>;
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const metaQuery = groq`*[ _type == "post" && slug.current == $slug ][0] {
    _id, title, publishedAt, mainImage
  }`;

  const post = await sanityFetch({ query: metaQuery, params });

  let src = null;
  if (post?.data?.mainImage?.asset?._ref) {
    ({ src } = buildSrc({
      id: post.data.mainImage?.asset._ref ?? "",
      width: 1200,
      baseUrl: `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/`,
    }));
  }

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

  const postQuery = groq`*[ _type == "post" && slug.current == $slug ][0] {
    _id, title, body[]{
      ..., markDefs[]{
        ...,
        _type == "internalLink" => {
          "slug": @.reference->slug
        }
      }
    }, publishedAt, mainImage
  }`;

  const post = await sanityFetch({ query: postQuery, params });

  if (!post?.data) return <div>No post found for {slug}</div>;

  return (
    <article>
      <header>
        <h2 className="heading1">{post.data.title}</h2>
        <p>{new Date(post.data.publishedAt).toDateString()}</p>
      </header>
      <main>
        <ArticleSeries slug={slug} />
        <PortableText value={post.data.body} components={components} />
      </main>
    </article>
  );
}
