import { WheelContextProvider } from "@/components/MouseContextProvider";
import { ClientLayout } from "@/components/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <WheelContextProvider>
        <ClientLayout>{children}</ClientLayout>
      </WheelContextProvider>
    </html>
  );
}
