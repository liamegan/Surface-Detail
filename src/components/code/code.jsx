import React from "react";
import { Refractor } from "react-refractor";
// import js from "refractor/lang/javascript.js";

// registerLanguage(js);

export function code(props) {
  return (
    <Refractor
      language={props.value.language}
      value={props.value.code}
      plainText={true}
    />
  );
}
