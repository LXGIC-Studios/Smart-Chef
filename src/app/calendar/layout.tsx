import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const metadata: Metadata = {
  title: "Meal Calendar - Weekly Schedule",
  description: "Organize your weekly meals with our interactive calendar. Schedule breakfast, lunch, and dinner for each day and never wonder what to cook again.",
  keywords: [
    "meal calendar",
    "meal schedule",
    "weekly meal schedule",
    "meal planner calendar",
    "food calendar",
    "dinner schedule",
    "weekly menu",
  ],
  openGraph: {
    title: "Meal Calendar | Smart Chef",
    description: "Plan your weekly meals with an interactive calendar.",
    url: `${siteUrl}/calendar`,
  },
  alternates: {
    canonical: `${siteUrl}/calendar`,
  },
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
