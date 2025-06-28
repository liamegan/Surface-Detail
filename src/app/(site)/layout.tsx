import type { Metadata } from "next";
import { Sidebar } from "./components/sidebar";

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
        <Sidebar />
      </div>
      <div className={"main"}>{children}</div>
    </div>
  );
}
