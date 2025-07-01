import type { Metadata } from "next";

import { WheelContextProvider } from "@/components/MouseContextProvider";
import { ClientLayout } from "@/components/ClientLayout";

import { Sidebar } from "./components/sidebar";

import "@/css/styles.scss";

export const metadata: Metadata = {
  title: "Surface Detail - Liam Egan",
  authors: [{ name: "Liam Egan", url: "https://github.com/liamegan" }],
  creator: "Liam Egan",
  description: "A small online space to muse and experiment.",
  alternates: {
    types: {
      "application/rss+xml": "/api/rss",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WheelContextProvider>
      <ClientLayout>
        <div className={"wrapper"}>
          <div>
            <Sidebar />
          </div>
          <div className={"main"}>{children}</div>
        </div>
      </ClientLayout>
    </WheelContextProvider>
  );
}
