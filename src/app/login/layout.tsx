import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to Smart Chef to access your personalized recipes, meal plans, and shopping lists. Continue cooking with what you have.",
  keywords: ["login", "sign in", "smart chef login", "recipe app login", "meal planning login"],
  openGraph: {
    title: "Login | Smart Chef",
    description: "Sign in to access your personalized recipes and meal plans.",
    url: `${siteUrl}/login`,
  },
  alternates: {
    canonical: `${siteUrl}/login`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
