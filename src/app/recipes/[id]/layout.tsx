import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartchef.app";

interface Ingredient {
  item: string;
  amount: string;
  note?: string;
}

interface RecipeData {
  title: string;
  description: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  difficulty: string;
  ingredients: Ingredient[];
  instructions: string[];
  created_at?: string;
}

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

async function getRecipe(id: string): Promise<RecipeData | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("recipes")
    .select("title, description, prep_time_minutes, cook_time_minutes, servings, difficulty, ingredients, instructions, created_at")
    .eq("id", id)
    .single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    return {
      title: "Recipe Not Found",
      description: "The requested recipe could not be found.",
    };
  }

  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const ingredientList = recipe.ingredients?.map((i: Ingredient) => i.item).join(", ") || "";

  return {
    title: recipe.title,
    description: `${recipe.description} Ready in ${totalTime} minutes. Serves ${recipe.servings}. Difficulty: ${recipe.difficulty}.`,
    keywords: [
      recipe.title,
      "recipe",
      "cooking",
      "homemade",
      recipe.difficulty,
      `${totalTime} minute recipe`,
      ...ingredientList.split(", ").slice(0, 10),
    ],
    openGraph: {
      title: `${recipe.title} | Smart Chef Recipe`,
      description: recipe.description,
      type: "article",
      url: `${siteUrl}/recipes/${id}`,
      images: [
        {
          url: "/smartchefthumbnail.png",
          width: 1200,
          height: 630,
          alt: recipe.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${recipe.title} | Smart Chef`,
      description: recipe.description,
    },
    alternates: {
      canonical: `${siteUrl}/recipes/${id}`,
    },
  };
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `PT${hours}H${mins}M`;
  if (hours > 0) return `PT${hours}H`;
  return `PT${mins}M`;
}

export default async function RecipeLayout({ params, children }: Props) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    return children;
  }

  // Build Recipe JSON-LD schema for rich snippets
  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description,
    author: {
      "@type": "Organization",
      name: "Smart Chef",
      url: siteUrl,
    },
    datePublished: recipe.created_at || new Date().toISOString(),
    prepTime: formatDuration(recipe.prep_time_minutes),
    cookTime: formatDuration(recipe.cook_time_minutes),
    totalTime: formatDuration(recipe.prep_time_minutes + recipe.cook_time_minutes),
    recipeYield: `${recipe.servings} servings`,
    recipeCategory: "Main Course",
    recipeCuisine: "International",
    recipeIngredient: recipe.ingredients?.map(
      (ing: Ingredient) => `${ing.amount} ${ing.item}${ing.note ? ` (${ing.note})` : ""}`
    ) || [],
    recipeInstructions: recipe.instructions?.map((step: string, index: number) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })) || [],
    image: `${siteUrl}/smartchefthumbnail.png`,
    url: `${siteUrl}/recipes/${id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(recipeSchema),
        }}
      />
      {children}
    </>
  );
}
