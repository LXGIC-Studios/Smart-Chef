import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/generate`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/plan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/meal-plans`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/calendar`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/shopping`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic recipe pages - fetch public/featured recipes if any
  // For now, we'll include the structure but skip user-specific content
  // In production, you might want to fetch featured/public recipes
  let recipePages: MetadataRoute.Sitemap = [];

  try {
    const supabase = await createClient();

    // Fetch recent recipes (you may want to add a 'is_public' flag for public recipes)
    // For now, we'll skip dynamic recipe URLs since they're user-specific
    // Uncomment below if you have public recipes:
    /*
    const { data: recipes } = await supabase
      .from("recipes")
      .select("id, updated_at")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(100);

    if (recipes) {
      recipePages = recipes.map((recipe) => ({
        url: `${siteUrl}/recipes/${recipe.id}`,
        lastModified: new Date(recipe.updated_at || Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    }
    */
  } catch (error) {
    console.error("Error fetching recipes for sitemap:", error);
  }

  return [...staticPages, ...recipePages];
}
