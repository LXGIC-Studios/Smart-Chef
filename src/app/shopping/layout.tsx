import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const metadata: Metadata = {
  title: "Shopping List - Grocery List Manager",
  description: "Manage your shopping list with Smart Chef. Organize items by category, check off purchases, and sync lists from your recipes and meal plans.",
  keywords: [
    "shopping list",
    "grocery list",
    "grocery shopping",
    "shopping list app",
    "grocery list manager",
    "meal planning shopping",
    "organized shopping",
  ],
  openGraph: {
    title: "Shopping List | Smart Chef",
    description: "Organize your grocery shopping with smart lists from your meal plans.",
    url: `${siteUrl}/shopping`,
  },
  alternates: {
    canonical: `${siteUrl}/shopping`,
  },
};

export default function ShoppingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
