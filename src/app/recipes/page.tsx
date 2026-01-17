"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { RecipeCard } from "@/components/RecipeCard";
import { createClient } from "@/lib/supabase/client";
import type { Recipe } from "@/lib/types";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "favorites" | "family">("all");
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/recipes");
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
      setLoading(false);
    }
    loadData();
  }, [supabase.auth]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this recipe?");
    if (!confirmed) return;

    const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRecipes(recipes.filter((r) => r.id !== id));
    }
  }

  async function handleToggleFavorite(id: string, isFavorite: boolean) {
    const res = await fetch(`/api/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_favorite: isFavorite }),
    });
    if (res.ok) {
      const updated = await res.json();
      setRecipes(recipes.map((r) => (r.id === id ? updated : r)));
    }
  }

  async function handleToggleFamilyFavorite(id: string, isFamilyFavorite: boolean) {
    const res = await fetch(`/api/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_family_favorite: isFamilyFavorite }),
    });
    if (res.ok) {
      const updated = await res.json();
      setRecipes(recipes.map((r) => (r.id === id ? updated : r)));
    }
  }

  const filteredRecipes = recipes.filter((r) => {
    if (filter === "favorites") return r.is_favorite;
    if (filter === "family") return r.is_family_favorite;
    return true;
  });

  const favoritesCount = recipes.filter((r) => r.is_favorite).length;
  const familyCount = recipes.filter((r) => r.is_family_favorite).length;

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
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
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Your Collection</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.9]">
              Saved
              <br />
              <span className="text-accent glow-signal">Recipes</span>
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/generate" className="btn-tech inline-flex">
              New Recipe →
            </Link>
          </motion.div>
        </div>

        <motion.div 
          className="flex flex-wrap gap-2 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { key: "all", label: `All (${recipes.length})` },
            { key: "favorites", label: `★ Favorites (${favoritesCount})` },
            { key: "family", label: `♥ Family (${familyCount})` },
          ].map((btn) => (
            <motion.button
              key={btn.key}
              onClick={() => setFilter(btn.key as "all" | "favorites" | "family")}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 font-mono text-xs uppercase tracking-wider border transition-all ${
                filter === btn.key
                  ? "bg-accent text-white border-accent"
                  : "bg-transparent text-foreground border-border hover:border-accent"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {btn.label}
            </motion.button>
          ))}
        </motion.div>

        {loading ? (
          <div className="py-16 sm:py-24 text-center">
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
        ) : filteredRecipes.length === 0 ? (
          <motion.div 
            className="py-12 sm:py-24 px-4 text-center border border-border bg-card/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filter === "all" ? (
              <>
                <p className="font-mono text-sm text-muted mb-6">No saved recipes yet</p>
                <Link href="/generate" className="btn-tech inline-flex">
                  Generate Your First Recipe →
                </Link>
              </>
            ) : (
              <p className="font-mono text-sm text-muted">
                No {filter === "favorites" ? "favorites" : "family favorites"} yet.
                <br />
                Mark recipes using the buttons below each recipe.
              </p>
            )}
          </motion.div>
        ) : (
          <div>
            {filteredRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <RecipeCard
                  recipe={recipe}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleFamilyFavorite={handleToggleFamilyFavorite}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
