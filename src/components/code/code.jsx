import React from "react";
import { Refractor, registerLanguage } from "react-refractor";
import js from 'refractor/javascript'
// import js from "refractor/lang/javascript.js";
//
registerLanguage(js);

import styles from "./code.module.scss";

export function code(props) {
  console.log(props)
  return (
    <Refractor
      className={styles.container}
      language="js"
      value={props.value.code}
    />
  );
}