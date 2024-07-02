import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/satoshi.css";

export const metadata: Metadata = {
  title: "TeamSpirit Survey",
  description: "Make your way better with our survey app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[url('/images/cover/bg-img.png')] bg-cover bg-no-repeat bg-fixed flex flex-col items-center justify-center w-[screen] h-screen mt-[50px]">
        {children}
      </body>
    </html>
  );
}
