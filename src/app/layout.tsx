import { Rubik } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";

import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";

import { SanityLive } from "@/sanity/lib/live";

import { classnames } from "@/utils/classnames";

const rubik = Rubik({
  subsets: ["latin-ext"],
});
const fonts = [rubik];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={classnames(fonts.map((f) => f.className))} lang="en">
      <body>
        {children}
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
        <Analytics />
      </body>
    </html>
  );
}
