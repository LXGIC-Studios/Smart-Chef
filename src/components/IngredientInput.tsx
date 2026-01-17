"use client";

import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IngredientInputProps {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}

export function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const [input, setInput] = useState("");

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      addIngredient();
    }
  }

  function addIngredient() {
    const trimmed = input.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      onChange([...ingredients, trimmed]);
    }
    setInput("");
  }

  function removeIngredient(index: number) {
    onChange(ingredients.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted block mb-3 sm:mb-4">
        Your Ingredients
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an ingredient..."
          className="flex-1 bg-card/50 border border-border focus:border-accent px-4 py-3 font-mono text-sm outline-none transition-colors"
        />
        <motion.button
          type="button"
          onClick={addIngredient}
          className="px-4 sm:px-6 border border-border hover:border-accent font-mono text-xs uppercase tracking-wider transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add
        </motion.button>
      </div>
      {ingredients.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
          <AnimatePresence>
            {ingredients.map((ingredient, index) => (
              <motion.span 
                key={ingredient} 
                className="inline-flex items-center gap-2 bg-accent text-white px-3 py-1.5 font-mono text-xs uppercase tracking-wider"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(index)}
                  className="hover:text-black transition-colors"
                  aria-label={`Remove ${ingredient}`}
                >
                  ×
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="font-mono text-xs text-muted mt-3 sm:mt-4">
          <span className="text-accent">$</span> Add at least 2-3 ingredients to generate a recipe
        </p>
      )}
    </div>
  );
}
