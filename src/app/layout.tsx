import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flipkart Dash — Campus food delivery | Flipkart.com",
  description: "Order from nearby Dash Hub brands with Clubbed or Priority campus delivery and pay with SuperCoins.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
