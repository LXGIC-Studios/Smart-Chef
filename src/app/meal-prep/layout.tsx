import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const metadata: Metadata = {
  title: "Meal Prep - Weekly Meal Preparation Guide",
  description: "Plan your weekly meal prep with AI-generated recipes, grocery lists, and step-by-step prep instructions. Save time and eat healthier.",
  keywords: [
    "meal prep",
    "meal preparation",
    "weekly meal prep",
    "batch cooking",
    "food prep",
    "meal prep ideas",
    "healthy meal prep",
    "meal prep guide",
  ],
  openGraph: {
    title: "Meal Prep Planning | Smart Chef",
    description: "AI-powered meal prep planning with grocery lists and prep instructions.",
    url: `${siteUrl}/meal-prep`,
  },
  alternates: {
    canonical: `${siteUrl}/meal-prep`,
  },
};

export default function MealPrepLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
