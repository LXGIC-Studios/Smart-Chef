"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { RecipeCard } from "@/components/RecipeCard";
import { createClient } from "@/lib/supabase/client";
import type { Recipe } from "@/lib/types";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>();
  const [filter, setFilter] = useState<"all" | "favorites" | "family">("all");
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }

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
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div>
            <p className="label text-xs sm:text-sm mb-2">Your Collection</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9]">
              Saved
              <br />
              <span className="text-accent">Recipes</span>
            </h1>
          </div>
          <Link href="/generate" className="btn-primary text-sm sm:text-base self-start sm:self-auto">
            New Recipe
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider border-2 transition-all ${
              filter === "all"
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-foreground border-border hover:border-foreground"
            }`}
          >
            All ({recipes.length})
          </button>
          <button
            onClick={() => setFilter("favorites")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider border-2 transition-all ${
              filter === "favorites"
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-foreground border-border hover:border-foreground"
            }`}
          >
            ★ Favorites ({favoritesCount})
          </button>
          <button
            onClick={() => setFilter("family")}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider border-2 transition-all ${
              filter === "family"
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-foreground border-border hover:border-foreground"
            }`}
          >
            ♥ Family ({familyCount})
          </button>
        </div>

        {loading ? (
          <div className="py-16 sm:py-24 text-center">
            <p className="text-muted uppercase tracking-wider text-xs sm:text-sm">Loading...</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="py-12 sm:py-24 px-4 text-center border border-border">
            {filter === "all" ? (
              <>
                <p className="text-muted text-sm sm:text-base mb-4 sm:mb-6">No saved recipes yet</p>
                <Link href="/generate" className="btn-primary text-sm sm:text-base">
                  Generate Your First Recipe
                </Link>
              </>
            ) : (
              <p className="text-muted text-sm sm:text-base">
                No {filter === "favorites" ? "favorites" : "family favorites"} yet. 
                Mark recipes using the buttons below each recipe.
              </p>
            )}
          </div>
        ) : (
          <div>
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onToggleFamilyFavorite={handleToggleFamilyFavorite}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
