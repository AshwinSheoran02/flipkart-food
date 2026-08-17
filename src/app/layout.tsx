import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flipkart Food — Order food delivery | Flipkart.com",
  description: "Order food delivery from restaurants near you. Pay with SuperCoins. Free delivery on Flipkart Plus.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
