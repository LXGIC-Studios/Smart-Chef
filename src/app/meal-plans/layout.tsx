import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const metadata: Metadata = {
  title: "My Meal Plans - Saved Meal Plans",
  description: "View and manage all your saved meal plans. Access grocery lists, prep instructions, and daily meal schedules for each plan.",
  keywords: [
    "meal plans",
    "saved meal plans",
    "my meal plans",
    "weekly plans",
    "meal plan collection",
    "meal prep plans",
  ],
  openGraph: {
    title: "My Meal Plans | Smart Chef",
    description: "Your collection of AI-generated meal plans with grocery lists and prep guides.",
    url: `${siteUrl}/meal-plans`,
  },
  alternates: {
    canonical: `${siteUrl}/meal-plans`,
  },
};

export default function MealPlansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
