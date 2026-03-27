import AuthProvider from "./components/AuthProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Benchmark Mondays",
  description: "Weekly AI agent competition. Same model, same challenge — your prompt wins. New competition every Monday.",
  icons: {
    icon: "/bmm-favicon.svg",
  },
  openGraph: {
    title: "Benchmark Mondays",
    description: "Weekly AI agent competition. Same model, same challenge — your prompt wins.",
    url: "https://tomalmog.com/bmm",
    siteName: "Benchmark Mondays",
    images: [
      {
        url: "https://www.tomalmog.com/bmm-og.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Benchmark Mondays",
    description: "Weekly AI agent competition. Same model, same challenge — your prompt wins.",
    images: ["https://www.tomalmog.com/bmm-og.png"],
  },
};

export default function BMMLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
