import styles from "./codepen.module.scss";
import { baselinefactor } from "../../utils/consts";

export const codepen = ({
  value,
}: {
  value: { title: string; url: string };
}) => {
  const embedURL = (() => {
    const url = new URL(value.url);
    url.pathname = url.pathname.replace(/\/(pen|embed)\//, "/embed/");
    url.searchParams.set("default-tab", "result");
    return url.toString();
  })();

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
      <iframe className={styles.iframe} src={embedURL} allowFullScreen />
    </div>
  );
};
