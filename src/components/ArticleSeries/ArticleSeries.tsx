

import { sanityFetch } from "@/sanity/lib/live";
import { groq } from "next-sanity";
import Link from "next/link";

import type { SeriesQueryResult } from "@/sanity/types";

export async function ArticleSeries({ slug }: { slug: string }) {

  // Find an article series that contains this post
  const seriesQuery = groq`*[_type == "articleSeries" && references(
    *[_type == "post" && slug.current == $slug ][0]._id)][0] {
      title,
      "list": list[]->{
        _id, title, slug, publishedAt, mainImage
      }
  }`;
  
  const series = await sanityFetch({ query: seriesQuery, params: { slug } });

  const seriesObject: SeriesQueryResult = series.data;

  if (!series.data || !seriesObject || !seriesObject.list) {
    return <></>;
  }

  return (
    <>
      { seriesObject.title && (<h3>{seriesObject.title}</h3>)}
      <ul>
        {seriesObject.list.map((item) => (
          item.slug ? <li key={item._id}>
            {
              item.slug.current === slug ? <span>{item.title}</span> :
              <Link href={`/posts/${item.slug.current}`}>
                {item.title}
              </Link>
            }
          </li>
          : ''
        ))}
      </ul>
  </>)
}