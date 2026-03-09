import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

export const metadata: Metadata = {
  title: "LabSearch - Lab Method Finder",
  description: "Find environmental laboratory test procedures instantly",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
