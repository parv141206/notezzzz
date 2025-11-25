import { AppShell } from "@/components/app-shell";
import { getFileTree } from "@/lib/github";
import { buildFileTree } from "@/lib/tree";
import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

export const metadata: Metadata = {
  title: "Notezzzz",
  description: "A remote viewer for my notes.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const allFiles = await getFileTree();
  const fileTree = buildFileTree(allFiles);

  return (
    <html lang="en" className={`${geist.variable} bg-gray-950 text-gray-300`}>
      <AppShell nodes={fileTree}>{children}</AppShell>
    </html>
  );
}
