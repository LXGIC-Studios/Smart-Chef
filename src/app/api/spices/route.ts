import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_SPICES = [
  // Basics
  { id: 1, name: "Salt", category: "Basics", is_common: true },
  { id: 2, name: "Black Pepper", category: "Basics", is_common: true },
  { id: 3, name: "Garlic Powder", category: "Basics", is_common: true },
  { id: 4, name: "Onion Powder", category: "Basics", is_common: true },
  // Herbs
  { id: 5, name: "Oregano", category: "Herbs", is_common: true },
  { id: 6, name: "Basil", category: "Herbs", is_common: true },
  { id: 7, name: "Thyme", category: "Herbs", is_common: true },
  { id: 8, name: "Rosemary", category: "Herbs", is_common: true },
  { id: 9, name: "Parsley", category: "Herbs", is_common: true },
  { id: 10, name: "Cilantro", category: "Herbs", is_common: true },
  // Warm Spices
  { id: 11, name: "Paprika", category: "Warm Spices", is_common: true },
  { id: 12, name: "Cumin", category: "Warm Spices", is_common: true },
  { id: 13, name: "Chili Powder", category: "Warm Spices", is_common: true },
  { id: 14, name: "Cayenne", category: "Warm Spices", is_common: true },
  { id: 15, name: "Ginger", category: "Warm Spices", is_common: true },
  { id: 16, name: "Turmeric", category: "Warm Spices", is_common: true },
  { id: 17, name: "Curry Powder", category: "Warm Spices", is_common: true },
  { id: 18, name: "Cinnamon", category: "Warm Spices", is_common: true },
  { id: 19, name: "Nutmeg", category: "Warm Spices", is_common: true },
  // Blends
  { id: 20, name: "Italian Seasoning", category: "Blends", is_common: true },
  { id: 21, name: "Taco Seasoning", category: "Blends", is_common: true },
  { id: 22, name: "Everything Bagel", category: "Blends", is_common: true },
  { id: 23, name: "Cajun Seasoning", category: "Blends", is_common: true },
  { id: 24, name: "Greek Seasoning", category: "Blends", is_common: true },
  // Oils
  { id: 25, name: "Olive Oil", category: "Oils", is_common: true },
  { id: 26, name: "Vegetable Oil", category: "Oils", is_common: true },
  { id: 27, name: "Sesame Oil", category: "Oils", is_common: true },
  { id: 28, name: "Coconut Oil", category: "Oils", is_common: true },
  { id: 29, name: "Avocado Oil", category: "Oils", is_common: true },
  { id: 30, name: "Butter", category: "Oils", is_common: true },
  // Sauces
  { id: 31, name: "Soy Sauce", category: "Sauces", is_common: true },
  { id: 32, name: "Fish Sauce", category: "Sauces", is_common: true },
  { id: 33, name: "Worcestershire", category: "Sauces", is_common: true },
  { id: 34, name: "Hot Sauce", category: "Sauces", is_common: true },
  { id: 35, name: "Sriracha", category: "Sauces", is_common: true },
  { id: 36, name: "Oyster Sauce", category: "Sauces", is_common: true },
  { id: 37, name: "Teriyaki Sauce", category: "Sauces", is_common: true },
  { id: 38, name: "BBQ Sauce", category: "Sauces", is_common: true },
  // Vinegars
  { id: 39, name: "White Vinegar", category: "Vinegars", is_common: true },
  { id: 40, name: "Apple Cider Vinegar", category: "Vinegars", is_common: true },
  { id: 41, name: "Balsamic Vinegar", category: "Vinegars", is_common: true },
  { id: 42, name: "Rice Vinegar", category: "Vinegars", is_common: true },
  { id: 43, name: "Red Wine Vinegar", category: "Vinegars", is_common: true },
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("spices")
      .select("*")
      .order("category", { ascending: true });

    if (error || !data || data.length === 0) {
      return NextResponse.json(DEFAULT_SPICES);
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(DEFAULT_SPICES);
  }
}
