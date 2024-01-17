import type { Metadata } from "next";
import "./globals.scss";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Movies App",
  description: "This app is for interview task",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        {children}
        <footer>
          <figure>
            <Image
              src="/bottom-shape.svg"
              alt=""
              width={0}
              height={0}
              sizes="100vw"
            />
          </figure>
        </footer>
      </body>
    </html>
  );
}
