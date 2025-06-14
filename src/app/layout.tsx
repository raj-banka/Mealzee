import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mealzee - Better Food for More People",
  description: "Delicious meals delivered to your doorstep. Order breakfast, lunch, dinner, and combo meals from Mealzee - your favorite food delivery app.",
  keywords: "food delivery, online food order, meal delivery, breakfast, lunch, dinner, combo meals, Mealzee",
  authors: [{ name: "Mealzee Team" }],
  openGraph: {
    title: "Mealzee - Food Delivery App",
    description: "Better food for more people. Order delicious meals delivered to your doorstep.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mealzee - Food Delivery",
    description: "Better food for more people. Delicious meals delivered fast.",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white">
        <div className="min-h-screen">
          {children}
        </div>
        <WhatsAppButton />
      </body>
    </html>
  );
}
