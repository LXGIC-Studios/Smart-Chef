import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FF4D00" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Smart Chef - AI Recipe Generator | Cook With What You Have",
    template: "%s | Smart Chef",
  },
  description: "Generate delicious recipes instantly with AI using ingredients you already have. Smart Chef helps you reduce food waste, plan meals, create shopping lists, and discover new dishes tailored to your dietary preferences.",
  keywords: [
    "recipe generator",
    "AI recipes",
    "cook with ingredients",
    "meal planning",
    "what to cook",
    "recipe finder",
    "ingredient-based recipes",
    "food waste reduction",
    "meal prep",
    "shopping list",
    "dietary preferences",
    "personalized recipes",
    "cooking assistant",
    "smart cooking",
    "recipe ideas",
    "weekly meal plan",
    "grocery list",
    "healthy recipes",
    "quick recipes",
    "easy cooking",
  ],
  authors: [{ name: "Smart Chef", url: siteUrl }],
  creator: "Smart Chef",
  publisher: "Smart Chef",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Smart Chef",
    title: "Smart Chef - AI Recipe Generator | Cook With What You Have",
    description: "Generate delicious recipes instantly with AI using ingredients you already have. Reduce food waste and discover new dishes tailored to your preferences.",
    images: [
      {
        url: "/smartchefthumbnail.png",
        width: 1200,
        height: 630,
        alt: "Smart Chef - AI-Powered Recipe Generator",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Chef - AI Recipe Generator | Cook With What You Have",
    description: "Generate delicious recipes instantly with AI using ingredients you already have. Reduce food waste and discover new dishes.",
    images: ["/smartchefthumbnail.png"],
    creator: "@smartchefapp",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Food & Cooking",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "google-site-verification": process.env.GOOGLE_SITE_VERIFICATION || "",
  },
};

// JSON-LD Structured Data
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Smart Chef",
  url: siteUrl,
  logo: `${siteUrl}/smartcheflogo.png`,
  description: "AI-powered recipe generator that helps you cook delicious meals with ingredients you already have.",
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Smart Chef",
  url: siteUrl,
  description: "Generate delicious recipes instantly with AI using ingredients you already have.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/recipes?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Smart Chef",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description: "AI-powered recipe generator and meal planning application.",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareAppSchema),
          }}
        />
        {/* Space Grotesk & Space Mono fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {/* Google Analytics */}
        <GoogleAnalytics />

        {/* Background Effects */}
        <div className="starfield" aria-hidden="true" />
        <div className="grid-bg" aria-hidden="true" />

        <AuthProvider>
          <div className="relative z-10">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
