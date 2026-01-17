import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const metadata: Metadata = {
  title: "Create Meal Plan - AI Meal Planning Wizard",
  description: "Create a personalized meal plan with our AI-powered wizard. Set your preferences, dietary needs, and family size to get a complete weekly meal plan with grocery lists.",
  keywords: [
    "meal plan",
    "meal planning",
    "weekly meal plan",
    "AI meal planner",
    "personalized meal plan",
    "diet plan",
    "family meal plan",
    "healthy eating plan",
    "meal plan generator",
  ],
  openGraph: {
    title: "Create Your Personalized Meal Plan | Smart Chef",
    description: "Generate a complete weekly meal plan tailored to your preferences with AI.",
    url: `${siteUrl}/plan`,
  },
  alternates: {
    canonical: `${siteUrl}/plan`,
  },
};

export default function PlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
