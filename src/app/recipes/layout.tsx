import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const metadata: Metadata = {
  title: "My Recipes - Saved Recipe Collection",
  description: "Browse and manage your saved recipes. Filter by favorites and family favorites. Access all your AI-generated recipes in one place.",
  keywords: [
    "saved recipes",
    "recipe collection",
    "my recipes",
    "favorite recipes",
    "family recipes",
    "recipe book",
    "digital cookbook",
  ],
  openGraph: {
    title: "My Recipes | Smart Chef",
    description: "Your personal collection of AI-generated recipes, all in one place.",
    url: `${siteUrl}/recipes`,
  },
  alternates: {
    canonical: `${siteUrl}/recipes`,
  },
};

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
