import { Image } from "next-sanity/image";
import { buildSrc } from "@sanity-image/url-builder";
import { baselinefactor } from "../../utils/consts";

import styles from "./image.module.scss";

export const image = ({
  value,
}: {
  value: { asset: { _ref: string }; alt: string };
}) => {
  const { src, width, height } = buildSrc({
    id: value.asset._ref,
    width: 1000,
    baseUrl: `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/`,
  });

  return (
    <div
      className={styles.imgcontainer}
      style={
        {
          ["--height" as string]: `${Math.floor(height / baselinefactor) * baselinefactor}px`,
          ["--width" as string]: `${width}px`,
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
