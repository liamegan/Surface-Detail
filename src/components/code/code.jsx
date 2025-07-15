import React from "react";
import { Refractor } from "react-refractor";
// import js from "refractor/lang/javascript.js";

// registerLanguage(js);

import styles from "./code.module.scss";

export function code(props) {
  return (
    <Refractor
      className={styles.container}
      language={props.value.language}
      value={props.value.code}
      plainText={true}
    />
  );
}
