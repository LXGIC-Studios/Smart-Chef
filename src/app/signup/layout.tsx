import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const metadata: Metadata = {
  title: "Sign Up - Create Your Free Account",
  description: "Join Smart Chef for free and start generating personalized recipes with AI. Reduce food waste by cooking with ingredients you already have.",
  keywords: ["sign up", "create account", "register", "smart chef", "free recipe app", "meal planning app"],
  openGraph: {
    title: "Create Your Free Smart Chef Account",
    description: "Join thousands of home cooks using AI to create delicious recipes from ingredients they already have.",
    url: `${siteUrl}/signup`,
  },
  alternates: {
    canonical: `${siteUrl}/signup`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
