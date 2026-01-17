import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: plan } = await supabase
    .from("meal_plans")
    .select("title, description, days, people, meals_per_day, total_prep_time_hours, plan_type")
    .eq("id", id)
    .single();

  if (!plan) {
    return {
      title: "Meal Plan Not Found",
      description: "The requested meal plan could not be found.",
    };
  }

  const totalMeals = plan.days * plan.meals_per_day;

  return {
    title: `${plan.title} - ${plan.days} Day Meal Plan`,
    description: `${plan.description} ${plan.days}-day meal plan for ${plan.people} people with ${totalMeals} meals. Total prep time: ${plan.total_prep_time_hours} hours.`,
    keywords: [
      "meal plan",
      "meal prep",
      `${plan.days} day meal plan`,
      `meal plan for ${plan.people}`,
      plan.plan_type,
      "weekly meals",
      "grocery list",
      "meal planning",
      "food prep",
    ],
    openGraph: {
      title: `${plan.title} | Smart Chef Meal Plan`,
      description: plan.description,
      type: "article",
      url: `${siteUrl}/meal-plans/${id}`,
      images: [
        {
          url: "/smartchefthumbnail.png",
          width: 1200,
          height: 630,
          alt: plan.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${plan.title} | Smart Chef`,
      description: plan.description,
    },
    alternates: {
      canonical: `${siteUrl}/meal-plans/${id}`,
    },
  };
}

export default function MealPlanLayout({ children }: Props) {
  return children;
}
