import styles from "./codepen.module.scss";
import { baselinefactor } from "../../utils/consts";

export const codepen = ({
  value,
}: {
  value: { title: string; url: string };
}) => {
  const embdedURL =
    value.url.indexOf("embed") !== -1
      ? value.url
      : value.url.replace("pen/", "embed/") + "?default-tab=result";

  console.log("Codepen URL:", embdedURL);

  return (
    <div
      className={styles.codepen}
      style={
        {
          ["--height" as string]: `${Math.floor(400 / baselinefactor) * baselinefactor}px`,
        } as React.CSSProperties
      }
    >
      {/* <h3 className={styles.title}>{value.title}</h3> */}
      <iframe className={styles.iframe} src={embdedURL} allowFullScreen />
    </div>
  );
};
