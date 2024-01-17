import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Image from "next/image";
import { createContext } from "vm";

const AppContext = createContext();

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
