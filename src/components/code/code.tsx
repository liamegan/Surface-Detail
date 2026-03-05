import { Refractor, registerLanguage } from "react-refractor";
import js from "refractor/javascript";
import ts from "refractor/typescript";
import css from "refractor/css";
import markup from "refractor/markup";

registerLanguage(js);
registerLanguage(ts);
registerLanguage(css);
registerLanguage(markup);

import styles from "./code.module.scss";

const languageMap: Record<string, string> = {
  html: "markup",
};

export function code(props: { value: { code: string; language?: string } }) {
  const lang =
    languageMap[props.value.language ?? ""] ?? props.value.language ?? "javascript";
  return (
    <Refractor
      className={styles.container}
      language={lang}
      value={props.value.code}
    />
  );
}
