"use client";

import { useDraftModeEnvironment } from "next-sanity/hooks";

export function DisableDraftMode() {
  const env = useDraftModeEnvironment();
  if (env !== "live" && env !== "unknown") {
    return null;
  }
  return <a href="/api/draft-mode/disable">Disable Draft Mode</a>;
}
