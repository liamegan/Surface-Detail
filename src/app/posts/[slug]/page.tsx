import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { PortableText, PortableTextBlock } from "next-sanity";
import { Image } from "next-sanity/image";
import { buildSrc } from "@sanity-image/url-builder";

import styles from "./post.module.scss";

interface Post {
  _id: string;
  title: string;
  body: PortableTextBlock[];
}

const components = {
  types: {
    image: ({ value }: { value: { asset: { _ref: string } } }) => {
      const { src, width, height } = buildSrc({
        id: value.asset._ref,
        width: 1000,
        // height: 306,
        baseUrl: `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/`,
      });

      const baselinefactor = 14 * 1.5;

      return (
        <div
          className={styles.imageContainer}
          style={
            {
              ["--height" as string]: `${Math.floor(height / baselinefactor) * baselinefactor}px`,
            } as React.CSSProperties
          }
        >
          <Image src={src} alt="Sanity Image" width={width} height={height} />
        </div>
      );
    },
  },
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const query = groq`*[ _type == "post" && slug.current == $slug ][0] {
    _id, title, body
  }`;

  const post: Post = await client.fetch(query, { slug });

  if (!post) return <div>No post found for {slug}</div>;

  return (
    <main>
      <h1>{post.title}</h1>
      <PortableText value={post.body} components={components} />
    </main>
  );
}
