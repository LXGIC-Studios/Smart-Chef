import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const metadata: Metadata = {
  title: "Dietary Settings - Customize Your Preferences",
  description: "Set your dietary restrictions, cuisine preferences, and nutritional goals. Smart Chef uses these settings to generate personalized recipes just for you.",
  keywords: [
    "dietary preferences",
    "dietary restrictions",
    "food allergies",
    "diet settings",
    "cuisine preferences",
    "nutrition goals",
    "personalized diet",
  ],
  openGraph: {
    title: "Dietary Settings | Smart Chef",
    description: "Customize your dietary preferences for personalized recipe recommendations.",
    url: `${siteUrl}/settings/diet`,
  },
  alternates: {
    canonical: `${siteUrl}/settings/diet`,
  },
};

export default function DietSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
