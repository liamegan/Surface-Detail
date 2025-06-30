import { Rubik } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";

import { WheelContextProvider } from "@/components/MouseContextProvider";
import { ClientLayout } from "@/components/ClientLayout";
import { classnames } from "@/utils/classnames";

const rubik = Rubik({
  subsets: ["latin-ext"],
});
const fonts = [rubik];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={classnames(fonts.map((f) => f.className))} lang="en">
      <body>
        <WheelContextProvider>
          <ClientLayout>{children}</ClientLayout>
        </WheelContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
