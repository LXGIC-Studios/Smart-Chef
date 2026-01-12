import OpenAI from "openai";
import type { GenerateRecipeResponse } from "./types";

const RECIPE_PROMPT = `You are a professional chef assistant. Generate a delicious recipe.

MAIN INGREDIENTS (the user has these - try to use ALL of them):
{ingredients}

AVAILABLE SEASONINGS (oils, spices, sauces the user has - pick the BEST ones for this dish, not all):
{spices}

REQUIREMENTS:
- Try to incorporate ALL the main ingredients listed above
- From the seasonings list, pick only what makes sense for the dish (don't use everything)
- Use ingredients EXACTLY as listed (if they say "tomatoes" use fresh tomatoes, not canned)
- You may add basic pantry items like water, salt, pepper if not listed
- Include exact measurements
- Provide clear step-by-step instructions
- Estimate prep time, cook time, and servings
- Keep it practical and delicious

RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:
{
  "title": "Recipe Name",
  "description": "Brief 1-2 sentence description",
  "servings": 4,
  "prep_time_minutes": 15,
  "cook_time_minutes": 30,
  "difficulty": "easy",
  "ingredients": [
    {"item": "ingredient name", "amount": "1 cup", "note": "optional note"}
  ],
  "instructions": [
    "Step 1 description",
    "Step 2 description"
  ]
}`;

export async function generateRecipe(
  ingredients: string[],
  spices: string[]
): Promise<GenerateRecipeResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const openai = new OpenAI({ apiKey });

  const prompt = RECIPE_PROMPT
    .replace("{ingredients}", ingredients.join(", "))
    .replace("{spices}", spices.length > 0 ? spices.join(", ") : "None specified - use basic seasonings");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = completion.choices[0].message.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(content) as GenerateRecipeResponse;
}
