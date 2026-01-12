"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { IngredientInput } from "@/components/IngredientInput";
import { SpiceSelector } from "@/components/SpiceSelector";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { createClient } from "@/lib/supabase/client";
import type { Spice, GenerateRecipeResponse } from "@/lib/types";

export default function GeneratePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedSpices, setSelectedSpices] = useState<string[]>([]);
  const [spices, setSpices] = useState<Spice[]>([]);
  const [recipe, setRecipe] = useState<GenerateRecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string>();
  const [useAllIngredients, setUseAllIngredients] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }

      const res = await fetch("/api/spices");
      if (res.ok) {
        const data = await res.json();
        setSpices(data);
      }
    }
    init();
  }, [supabase.auth]);

  async function handleGenerate() {
    if (ingredients.length < 2) {
      setError("Please add at least 2 ingredients");
      return;
    }

    setError("");
    setLoading(true);
    setRecipe(null);
    setSaved(false);

    const res = await fetch("/api/recipes/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredients,
        spices: selectedSpices,
        useAllIngredients,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to generate recipe");
      setLoading(false);
      return;
    }

    const data = await res.json();
    setRecipe(data);
    setLoading(false);
  }

  async function handleSave() {
    if (!recipe) return;

    setSaving(true);
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...recipe,
        ingredients_input: ingredients,
        spices_used: selectedSpices,
      }),
    });

    if (res.ok) {
      setSaved(true);
    }
    setSaving(false);
  }

  function handleNewRecipe() {
    setRecipe(null);
    setSaved(false);
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar userEmail={userEmail} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {!recipe ? (
          <>
            <div className="mb-8 sm:mb-12">
              <p className="label text-xs sm:text-sm mb-2">Recipe Generator</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9]">
                What&apos;s in your
                <br />
                <span className="text-accent">kitchen?</span>
              </h1>
            </div>

            <div className="space-y-8 sm:space-y-12">
              <div className="pb-8 sm:pb-12 border-b border-border">
                <IngredientInput
                  ingredients={ingredients}
                  onChange={setIngredients}
                />
              </div>

              {spices.length > 0 && (
                <div className="pb-8 sm:pb-12 border-b border-border">
                  <SpiceSelector
                    spices={spices}
                    selected={selectedSpices}
                    onChange={setSelectedSpices}
                  />
                </div>
              )}

              <div className="pb-8 sm:pb-12 border-b border-border">
                <label className="label text-xs sm:text-sm block mb-3 sm:mb-4">Recipe Mode</label>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setUseAllIngredients(true)}
                    className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider border-2 transition-all ${
                      useAllIngredients
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground border-border hover:border-foreground"
                    }`}
                  >
                    Use Every Ingredient
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseAllIngredients(false)}
                    className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold uppercase tracking-wider border-2 transition-all ${
                      !useAllIngredients
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground border-border hover:border-foreground"
                    }`}
                  >
                    Best Meal Possible
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-muted mt-2 sm:mt-3">
                  {useAllIngredients 
                    ? "AI will use ALL ingredients you listed - great for using up everything" 
                    : "AI will pick the best combination for a delicious meal"}
                </p>
              </div>

              {error && (
                <p className="text-accent font-medium text-sm sm:text-base">{error}</p>
              )}

              <button
                onClick={handleGenerate}
                className="btn-primary text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 w-full sm:w-auto"
                disabled={loading || ingredients.length < 2}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Generate Recipe"
                )}
              </button>
            </div>
          </>
        ) : (
          <RecipeDisplay
            recipe={recipe}
            onSave={handleSave}
            onNewRecipe={handleNewRecipe}
            saving={saving}
            saved={saved}
          />
        )}
      </div>
    </main>
  );
}
