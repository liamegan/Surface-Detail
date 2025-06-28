import { WheelContextProvider } from "@/components/MouseContextProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <WheelContextProvider>
        <body>{children}</body>
      </WheelContextProvider>
    </html>
  );
}
