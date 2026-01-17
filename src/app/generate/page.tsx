"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { IngredientInput } from "@/components/IngredientInput";
import { SpiceSelector } from "@/components/SpiceSelector";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { createClient } from "@/lib/supabase/client";
import type { Spice, GenerateRecipeResponse, DietProfile } from "@/lib/types";

const DIETARY_OPTIONS = [
  "Gluten-Free",
  "Dairy-Free",
  "Egg-Free",
  "Nut-Free",
  "Vegetarian",
  "Vegan",
  "Keto",
  "Low-Carb",
];

const STYLE_OPTIONS = [
  { label: "Chef's Choice", value: "Any style - chef's choice" },
  { label: "High Protein", value: "High protein meal - maximize protein content, ideal for meal prep" },
  { label: "Quick & Easy", value: "Quick and easy - under 30 minutes, minimal prep" },
  { label: "Meal Prep", value: "Meal prep friendly - stores well, easy to portion for the week" },
  { label: "Comfort Food", value: "Comfort food - hearty, satisfying, homestyle cooking" },
  { label: "Light & Healthy", value: "Light and healthy - lower calorie, nutrient-dense" },
];

export default function GeneratePage() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedSpices, setSelectedSpices] = useState<string[]>([]);
  const [spices, setSpices] = useState<Spice[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [style, setStyle] = useState("Any style - chef's choice");
  const [recipe, setRecipe] = useState<GenerateRecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [, setUserEmail] = useState<string>();
  const [dietProfile, setDietProfile] = useState<DietProfile | null>(null);
  const [useDietProfile, setUseDietProfile] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }

      const spicesRes = await fetch("/api/spices");
      if (spicesRes.ok) {
        const data = await spicesRes.json();
        setSpices(data);
      }

      const profileRes = await fetch("/api/diet-profile");
      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (profile.dietary_restrictions?.length > 0 || profile.disliked_ingredients?.length > 0) {
          setDietProfile(profile);
          setDietary(profile.dietary_restrictions || []);
        }
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
        dietary,
        style,
        dislikedIngredients: useDietProfile && dietProfile ? dietProfile.disliked_ingredients : [],
        cuisinePreferences: useDietProfile && dietProfile ? dietProfile.cuisine_preferences : [],
        kitchenEquipment: useDietProfile && dietProfile ? dietProfile.kitchen_equipment : [],
        budgetMode: useDietProfile && dietProfile ? dietProfile.budget_mode : false,
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
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {!recipe ? (
          <>
            <motion.div 
              className="mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className="w-2 h-2 rounded-full bg-success"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Recipe Generator</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.9]">
                What&apos;s in your
                <br />
                <span className="text-accent glow-signal">kitchen?</span>
              </h1>
            </motion.div>

            <div className="space-y-8 sm:space-y-12">
              <motion.div 
                className="pb-8 sm:pb-12 border-b border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <IngredientInput
                  ingredients={ingredients}
                  onChange={setIngredients}
                />
                <p className="font-mono text-xs text-muted mt-4">
                  <span className="text-accent">$</span> We&apos;ll try to use all your ingredients, but may exclude items that don&apos;t work together.
                </p>
              </motion.div>

              {spices.length > 0 && (
                <motion.div 
                  className="pb-8 sm:pb-12 border-b border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <SpiceSelector
                    spices={spices}
                    selected={selectedSpices}
                    onChange={setSelectedSpices}
                  />
                </motion.div>
              )}

              <motion.div 
                className="pb-8 sm:pb-12 border-b border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted block mb-4">Recipe Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STYLE_OPTIONS.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => setStyle(option.value)}
                      className={`px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs uppercase tracking-wider border transition-all ${
                        style === option.value
                          ? "bg-accent text-white border-accent"
                          : "bg-card/50 text-foreground border-border hover:border-accent"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                className="pb-8 sm:pb-12 border-b border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Dietary Restrictions</label>
                  {dietProfile && (
                    <button
                      onClick={() => setUseDietProfile(!useDietProfile)}
                      className={`font-mono text-xs px-3 py-1 border transition-colors ${
                        useDietProfile
                          ? "bg-accent text-white border-accent"
                          : "border-border hover:border-accent"
                      }`}
                    >
                      {useDietProfile ? "✓ Using Profile" : "Use Profile"}
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((option) => (
                    <motion.button
                      key={option}
                      type="button"
                      onClick={() => {
                        if (dietary.includes(option)) {
                          setDietary(dietary.filter((d) => d !== option));
                        } else {
                          setDietary([...dietary, option]);
                        }
                      }}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-xs border transition-all ${
                        dietary.includes(option)
                          ? "bg-accent text-white border-accent"
                          : "bg-transparent text-foreground border-border hover:border-accent"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
                {dietary.length > 0 && (
                  <p className="font-mono text-xs text-muted mt-3">
                    <span className="text-accent">→</span> Excluding: {dietary.join(", ")}
                  </p>
                )}
                {useDietProfile && dietProfile && dietProfile.disliked_ingredients?.length > 0 && (
                  <p className="font-mono text-xs text-muted mt-2">
                    <span className="text-accent">→</span> Also avoiding: {dietProfile.disliked_ingredients.join(", ")}
                  </p>
                )}
                {!dietProfile && (
                  <p className="font-mono text-xs text-muted mt-3">
                    <Link href="/settings/diet" className="text-accent hover:underline">
                      Set up your diet profile
                    </Link>{" "}
                    to auto-apply preferences
                  </p>
                )}
              </motion.div>

              {error && (
                <motion.p 
                  className="text-accent font-mono text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                onClick={handleGenerate}
                className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-accent hover:bg-accent/90 text-white font-mono text-sm uppercase tracking-wider transition-colors disabled:opacity-50"
                disabled={loading || ingredients.length < 2}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <motion.span
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Generating...
                  </span>
                ) : (
                  "Generate Recipe →"
                )}
              </motion.button>
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
