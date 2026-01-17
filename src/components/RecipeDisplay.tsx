"use client";

import { motion } from "framer-motion";
import type { GenerateRecipeResponse } from "@/lib/types";

interface RecipeDisplayProps {
  recipe: GenerateRecipeResponse;
  onSave?: () => void;
  onNewRecipe?: () => void;
  saving?: boolean;
  saved?: boolean;
}

export function RecipeDisplay({ recipe, onSave, onNewRecipe, saving, saved }: RecipeDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-success"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Your Recipe</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold break-words">{recipe.title}</h2>
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

      {/* Macros */}
      {recipe.macros_per_serving && (
        <motion.div 
          className="grid grid-cols-4 gap-2 sm:gap-4 mb-8 sm:mb-12 p-4 sm:p-6 bg-card/50 border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            <p className="font-display text-xl sm:text-3xl font-bold text-accent">{recipe.macros_per_serving.calories}</p>
            <p className="font-mono text-[10px] sm:text-xs text-muted uppercase tracking-wider">Calories</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl sm:text-3xl font-bold">{recipe.macros_per_serving.protein_g}g</p>
            <p className="font-mono text-[10px] sm:text-xs text-muted uppercase tracking-wider">Protein</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl sm:text-3xl font-bold">{recipe.macros_per_serving.carbs_g}g</p>
            <p className="font-mono text-[10px] sm:text-xs text-muted uppercase tracking-wider">Carbs</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl sm:text-3xl font-bold">{recipe.macros_per_serving.fat_g}g</p>
            <p className="font-mono text-[10px] sm:text-xs text-muted uppercase tracking-wider">Fat</p>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Ingredients</h3>
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
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Instructions</h3>
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

      {/* Grocery List */}
      {recipe.grocery_list && recipe.grocery_list.length > 0 && (
        <motion.div 
          className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="font-display text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Grocery List</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {recipe.grocery_list.map((item, index) => (
              <div key={index} className="flex items-center gap-2 font-mono text-sm">
                <span className="w-4 h-4 border border-accent/50 shrink-0"></span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div 
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {onSave && !saved && (
          <motion.button 
            onClick={onSave} 
            className="px-8 py-4 bg-accent hover:bg-accent/90 text-white font-mono text-sm uppercase tracking-wider transition-colors disabled:opacity-50" 
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Saving...
              </span>
            ) : "Save Recipe"}
          </motion.button>
        )}
        {saved && (
          <span className="text-success font-mono uppercase tracking-wider text-xs sm:text-sm py-3 sm:py-4">
            ✓ Recipe saved
          </span>
        )}
        {onNewRecipe && (
          <motion.button 
            onClick={onNewRecipe} 
            className="px-8 py-4 border border-border hover:border-accent font-mono text-sm uppercase tracking-wider transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Generate Another →
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
