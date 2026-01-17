"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Recipe } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onToggleFamilyFavorite?: (id: string, isFamilyFavorite: boolean) => void;
}

export function RecipeCard({ recipe, onDelete, onToggleFavorite, onToggleFamilyFavorite }: RecipeCardProps) {
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

  return (
    <div className="group border-b border-border py-6 sm:py-8 first:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <Link href={`/recipes/${recipe.id}`} className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
            <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold group-hover:text-accent transition-colors break-words">
              {recipe.title}
            </h3>
            {recipe.is_favorite && (
              <span className="text-accent text-base sm:text-lg" title="Favorite">★</span>
            )}
            {recipe.is_family_favorite && (
              <span className="text-red-500 text-base sm:text-lg" title="Family Favorite">♥</span>
            )}
          </div>
          <p className="font-mono text-sm text-muted mt-2 line-clamp-2">
            {recipe.description}
          </p>
        </Link>
        <span
          className={`self-start shrink-0 px-2 sm:px-3 py-1 font-mono text-[10px] sm:text-xs uppercase tracking-wider ${
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

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 font-mono text-xs sm:text-sm">
        <span className="text-muted">
          <span className="text-accent">{totalTime}</span> min
        </span>
        <span className="text-muted">
          <span className="text-accent">{recipe.servings}</span> servings
        </span>
        <span className="text-muted hidden sm:inline">
          {new Date(recipe.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 pt-4 border-t border-border sm:border-0 sm:pt-0 sm:mt-3">
        {onToggleFavorite && (
          <motion.button
            onClick={() => onToggleFavorite(recipe.id, !recipe.is_favorite)}
            className={`font-mono uppercase tracking-wider text-[10px] sm:text-xs transition-colors ${
              recipe.is_favorite ? "text-accent" : "text-muted hover:text-accent"
            }`}
            title={recipe.is_favorite ? "Remove from favorites" : "Add to favorites"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {recipe.is_favorite ? "★ Favorite" : "☆ Favorite"}
          </motion.button>
        )}
        {onToggleFamilyFavorite && (
          <motion.button
            onClick={() => onToggleFamilyFavorite(recipe.id, !recipe.is_family_favorite)}
            className={`font-mono uppercase tracking-wider text-[10px] sm:text-xs transition-colors ${
              recipe.is_family_favorite ? "text-red-500" : "text-muted hover:text-red-500"
            }`}
            title={recipe.is_family_favorite ? "Remove from family favorites" : "Add to family favorites"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {recipe.is_family_favorite ? "♥ Family" : "♡ Family"}
          </motion.button>
        )}
        <Link
          href={`/recipes/${recipe.id}`}
          className="font-mono uppercase tracking-wider text-[10px] sm:text-xs hover:text-accent transition-colors"
        >
          View →
        </Link>
        {onDelete && (
          <motion.button
            onClick={() => onDelete(recipe.id)}
            className="font-mono uppercase tracking-wider text-[10px] sm:text-xs text-accent/60 hover:text-accent transition-colors ml-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        )}
      </div>
    </div>
  );
}
