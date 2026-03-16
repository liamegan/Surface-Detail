import styles from "./codepen.module.scss";
import { baselinefactor } from "../../utils/consts";

export const codepen = ({
  value,
}: {
  value: { title: string; url: string; scale?: number; startPaused?: boolean };
}) => {
  const scale = value.scale ?? 1;
  const embedURL = (() => {
    const url = new URL(value.url);
    const embedPath = value.startPaused ? "/embed/preview/" : "/embed/";
    url.pathname = url.pathname.replace(/\/(pen|embed(?:\/preview)?)\//, embedPath);
    url.searchParams.set("default-tab", "result");
    return url.toString();
  })();

  return (
    <div
      className={styles.codepen}
      style={
        {
          ["--height" as string]: `${Math.floor(400 / baselinefactor) * baselinefactor}px`,
          ["--scale" as string]: scale,
        } as React.CSSProperties
      }
    >
      <iframe className={styles.iframe} src={embedURL} sandbox="allow-scripts allow-same-origin allow-forms" allowFullScreen />
    </div>
  );
};
