import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Smart Chef privacy policy. Learn how we collect, use, and protect your personal information when you use our AI recipe generator and meal planning services.",
  keywords: ["privacy policy", "data protection", "smart chef privacy", "user data"],
  openGraph: {
    title: "Privacy Policy | Smart Chef",
    description: "Learn how Smart Chef protects your privacy and handles your data.",
    url: `${siteUrl}/privacy`,
  },
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
