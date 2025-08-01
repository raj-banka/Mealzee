import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { AppProvider } from "@/contexts/AppContext";
import StructuredData from "@/components/seo/StructuredData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Mealzee - Homemade Tiffin Service | Fresh Meals Delivered Daily",
  description: "Mealzee delivers fresh, homemade tiffin meals to your doorstep in Bokaro Steel City. Order healthy breakfast, lunch, dinner & combo meal plans. No stress, just fresh tiffins on time.",
  keywords: "Mealzee, tiffin service, homemade food, meal delivery, Bokaro Steel City, healthy meals, daily tiffin, food delivery, home cooked meals, fresh food",
  authors: [{ name: "Mealzee Team" }],
  applicationName: "Mealzee",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  creator: "Mealzee Team",
  publisher: "Mealzee",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Mealzee - Homemade Tiffin Service | Fresh Meals Delivered Daily",
    description: "Fresh, homemade tiffin meals delivered to your doorstep in Bokaro Steel City. Order healthy meal plans today!",
    url: "https://mealzee.in",
    siteName: "Mealzee",
    images: [
      {
        url: "/logo_resized_for_web.png",
        width: 1200,
        height: 630,
        alt: "Mealzee - Homemade Tiffin Service",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mealzee - Homemade Tiffin Service",
    description: "Fresh, homemade tiffin meals delivered daily in Bokaro Steel City. Order healthy meal plans today!",
    images: ["/logo_resized_for_web.png"],
    creator: "@mealzee",
    site: "@mealzee",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <StructuredData />
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#22C55E" />
        <meta name="msapplication-TileColor" content="#22C55E" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Mealzee" />
        <link rel="canonical" href="https://mealzee.in" />
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/footer_logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/footer_logo.png" />
        <link rel="shortcut icon" href="/footer_logo.png" />
        <link rel="apple-touch-icon" href="/footer_logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="business:contact_data:street_address" content="Bokaro Steel City" />
        <meta property="business:contact_data:locality" content="Bokaro" />
        <meta property="business:contact_data:region" content="Jharkhand" />
        <meta property="business:contact_data:postal_code" content="827004" />
        <meta property="business:contact_data:country_name" content="India" />
        <meta property="business:contact_data:phone_number" content="+91-6299367631" />
      </head>
      <body className="font-sans antialiased bg-olive-50">
        <AppProvider>
          <div className="min-h-screen bg-olive-50">
            {children}
          </div>
          <WhatsAppButton />
        </AppProvider>
      </body>
    </html>
  );
}
