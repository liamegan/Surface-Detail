"use client";
import { useRef, useEffect, useState } from "react";
import { Image } from "next-sanity/image";
import { buildSrc } from "@sanity-image/url-builder";
import { baselinefactor } from "../../utils/consts";

import styles from "./image.module.scss";

export const ImageItem = ({
  value,
}: {
  value: { asset: { _ref: string }; alt: string };
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const { src, width, height } = buildSrc({
    id: value.asset._ref,
    width: 1000,
    baseUrl: `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/`,
  });

  useEffect(() => {
    if (containerRef.current) {
      const { width: containerWidth } =
        containerRef.current.getBoundingClientRect();
      const aspectRatio = width / height;
      const w = Math.min(width, containerWidth);
      const h = Math.floor(w / aspectRatio / baselinefactor) * baselinefactor;
      setImageSize({ width: w, height: h });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.imgcontainer}
      style={
        {
          ["--height" as string]: `${imageSize.height}px`,
          ["--width" as string]: `${imageSize.width}px`,
        } as React.CSSProperties
      }
    >
      <Image
        className={styles.img}
        src={src}
        alt={value.alt || ""}
        width={width}
        height={height}
      />
    </div>
  );
};
