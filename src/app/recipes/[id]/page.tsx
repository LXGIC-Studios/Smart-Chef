"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import type { Recipe } from "@/lib/types";

export default function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch(`/api/recipes/${id}`);
      if (res.ok) {
        const data = await res.json();
        setRecipe(data);
      }
      setLoading(false);
    }
    loadData();
  }, [id, supabase.auth]);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this recipe?");
    if (!confirmed) return;

    const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/recipes");
    }
  }

  async function handleToggleFavorite() {
    if (!recipe) return;
    const res = await fetch(`/api/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_favorite: !recipe.is_favorite }),
    });
    if (res.ok) {
      const updated = await res.json();
      setRecipe(updated);
    }
  }

  async function handleToggleFamilyFavorite() {
    if (!recipe) return;
    const res = await fetch(`/api/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_family_favorite: !recipe.is_family_favorite }),
    });
    if (res.ok) {
      const updated = await res.json();
      setRecipe(updated);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-24 text-center">
          <motion.div
            className="flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">Loading...</span>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!recipe) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-24 text-center">
          <p className="font-mono text-sm text-muted mb-6">Recipe not found</p>
          <Link href="/recipes" className="btn-tech inline-flex">
            ← Back to Recipes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            href="/recipes" 
            className="inline-block mb-6 sm:mb-8 font-mono text-xs uppercase tracking-wider text-muted hover:text-accent transition-colors"
          >
            ← Back to recipes
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-success"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Recipe</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold break-words">{recipe.title}</h1>
                {recipe.is_favorite && <span className="text-accent text-xl sm:text-2xl">★</span>}
                {recipe.is_family_favorite && <span className="text-red-500 text-xl sm:text-2xl">♥</span>}
              </div>
              <p className="font-mono text-sm text-muted mt-2 max-w-2xl">{recipe.description}</p>
            </div>
            <span
              className={`self-start shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-[10px] sm:text-xs uppercase tracking-wider ${
                recipe.difficulty === "easy"
                  ? "bg-success text-black"
                  : recipe.difficulty === "medium"
                  ? "bg-yellow-500 text-black"
                  : "bg-accent text-white"
              }`}
            >
              {recipe.difficulty}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
            <motion.button
              onClick={handleToggleFavorite}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-xs uppercase tracking-wider border transition-all ${
                recipe.is_favorite
                  ? "bg-accent text-white border-accent"
                  : "bg-transparent text-foreground border-border hover:border-accent"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {recipe.is_favorite ? "★ Favorited" : "☆ Favorite"}
            </motion.button>
            <motion.button
              onClick={handleToggleFamilyFavorite}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-xs uppercase tracking-wider border transition-all ${
                recipe.is_family_favorite
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-transparent text-foreground border-border hover:border-red-500"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {recipe.is_family_favorite ? "♥ Family" : "♡ Family"}
            </motion.button>
          </div>

          <motion.div 
            className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-8 mb-8 sm:mb-12 py-4 sm:py-6 border-y border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div>
              <p className="font-mono text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1">Prep Time</p>
              <p className="font-display text-lg sm:text-2xl font-bold"><span className="text-accent">{recipe.prep_time_minutes}</span> min</p>
            </div>
            <div>
              <p className="font-mono text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1">Cook Time</p>
              <p className="font-display text-lg sm:text-2xl font-bold"><span className="text-accent">{recipe.cook_time_minutes}</span> min</p>
            </div>
            <div>
              <p className="font-mono text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1">Total</p>
              <p className="font-display text-lg sm:text-2xl font-bold"><span className="text-accent">{recipe.prep_time_minutes + recipe.cook_time_minutes}</span> min</p>
            </div>
            <div>
              <p className="font-mono text-[10px] sm:text-xs text-muted uppercase tracking-wider mb-1">Servings</p>
              <p className="font-display text-lg sm:text-2xl font-bold"><span className="text-accent">{recipe.servings}</span></p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Ingredients</h2>
              <ul className="space-y-3 sm:space-y-4">
                {(recipe.ingredients || []).map((ing, index) => (
                  <li key={index} className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border font-mono text-sm">
                    <span className="text-accent shrink-0 w-16 sm:w-24">{ing.amount}</span>
                    <span>
                      {ing.item}
                      {ing.note && <span className="text-muted"> ({ing.note})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Instructions</h2>
              <ol className="space-y-4 sm:space-y-6">
                {(recipe.instructions || []).map((step, index) => (
                  <li key={index} className="flex gap-3 sm:gap-4">
                    <span className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-accent text-white font-mono text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="pt-1 sm:pt-2 font-mono text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </motion.div>
          </div>

          {recipe.spices_used && recipe.spices_used.length > 0 && (
            <motion.div 
              className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Spices Used</h2>
              <div className="flex flex-wrap gap-2">
                {recipe.spices_used.map((spice, index) => (
                  <span key={index} className="px-3 py-1.5 bg-accent text-white font-mono text-xs uppercase tracking-wider">
                    {spice}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div 
            className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="font-mono text-xs text-muted">
              Saved on {new Date(recipe.created_at).toLocaleDateString()}
            </span>
            <motion.button 
              onClick={handleDelete} 
              className="font-mono text-xs uppercase tracking-wider text-accent/60 hover:text-accent transition-colors self-start sm:self-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete Recipe
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
