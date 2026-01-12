import OpenAI from "openai";
import type { GenerateRecipeResponse } from "./types";

const USE_ALL_PROMPT = `You are a professional chef assistant. Generate a recipe that uses ALL of the ingredients provided.

INGREDIENTS TO USE (you MUST use ALL of these - the user wants to use up everything):
{ingredients}

AVAILABLE SPICES:
{spices}

STRICT REQUIREMENTS:
- You MUST use EVERY single ingredient listed above - no exceptions
- Use ingredients EXACTLY as listed (fresh, not canned/frozen unless specified)
- Do NOT add ANY ingredients the user didn't list (no oil, butter, etc. unless listed)
- Only exception: water and the spices listed above
- Include exact measurements
- Provide clear step-by-step instructions
- Estimate prep time, cook time, and servings

RESPOND ONLY WITH VALID JSON IN THIS EXACT FORMAT:`;

const BEST_MEAL_PROMPT = `You are a professional chef assistant. Generate the best possible recipe using some or all of the available ingredients.

AVAILABLE INGREDIENTS (use these EXACTLY as listed - fresh ingredients):
{ingredients}

AVAILABLE SPICES:
{spices}

REQUIREMENTS:
- Create the BEST tasting recipe possible using the available ingredients
- You may choose which ingredients to use - pick what makes sense together
- Use ingredients EXACTLY as listed (fresh, not canned/frozen unless specified)
- You may suggest 1-2 common pantry staples (oil, butter, salt) if needed
- Include exact measurements
- Provide clear step-by-step instructions
- Estimate prep time, cook time, and servings

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
  spices: string[],
  useAllIngredients: boolean = false
): Promise<GenerateRecipeResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const openai = new OpenAI({ apiKey });

  const basePrompt = useAllIngredients ? USE_ALL_PROMPT : BEST_MEAL_PROMPT;
  const prompt = basePrompt.replace(
    "{ingredients}",
    ingredients.join(", ")
  ).replace("{spices}", spices.length > 0 ? spices.join(", ") : "None specified");

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
