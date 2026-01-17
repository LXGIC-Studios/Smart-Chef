import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const metadata: Metadata = {
  title: "Generate Recipe - AI Recipe Creator",
  description: "Enter your ingredients and let AI create a personalized recipe just for you. Smart Chef generates delicious meals based on what's in your kitchen.",
  keywords: [
    "generate recipe",
    "AI recipe generator",
    "cook with ingredients",
    "what can I make",
    "recipe from ingredients",
    "ingredient-based cooking",
    "leftover recipes",
    "fridge to table",
  ],
  openGraph: {
    title: "Generate Recipe with AI | Smart Chef",
    description: "Enter your ingredients and get a personalized recipe in seconds. No more food waste!",
    url: `${siteUrl}/generate`,
  },
  alternates: {
    canonical: `${siteUrl}/generate`,
  },
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
