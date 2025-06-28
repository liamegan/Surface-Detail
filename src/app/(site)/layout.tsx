import type { Metadata } from "next";
import Link from "next/link";

import "@/css/styles.scss";

export const metadata: Metadata = {
  title: "Surface Detail - Liam Egan",
  authors: [{ name: "Liam Egan", url: "https://github.com/liamegan" }],
  creator: "Liam Egan",
  description: "A small online space to muse and experiment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"wrapper"}>
      <div>
        <header className={"header"}>
          <h1 className={"logo"}>Surface Detail</h1>
          <p>
            A small online home for my thoughts, projects, ideas and
            experiments. I don&apos;t expect anyone will read this, but
            it&apos;s not for you anyway.
          </p>

          <nav className={"nav"}>
            <ul>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <a target="_blank" href="https://github.com/liamegan">
                  GitHub
                </a>
              </li>
              <li>
                <a target="_blank" href="https://codepen.io/shubniggurath">
                  CodePen
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://bsky.app/profile/liamegan.bsky.social"
                >
                  Bluesky
                </a>
              </li>
            </ul>
          </nav>
          <p>All work, writing and random musings copyright Liam Egan.</p>
        </header>
      </div>
      <div className={"main"}>{children}</div>
    </div>
  );
}
