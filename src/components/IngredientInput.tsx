"use client";

import { useState, KeyboardEvent } from "react";

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
      <label className="label text-xs sm:text-sm block mb-3 sm:mb-4">
        Your Ingredients
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type an ingredient..."
          className="input text-sm sm:text-lg flex-1"
        />
        <button
          type="button"
          onClick={addIngredient}
          className="btn-secondary text-xs sm:text-sm px-3 sm:px-4 shrink-0"
        >
          Add
        </button>
      </div>
      {ingredients.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-6">
          {ingredients.map((ingredient, index) => (
            <span key={index} className="tag text-xs sm:text-sm">
              {ingredient}
              <button
                onClick={() => removeIngredient(index)}
                className="ml-1.5 sm:ml-2 hover:text-accent"
                aria-label={`Remove ${ingredient}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-muted mt-3 sm:mt-4">
          Add at least 2-3 ingredients to generate a recipe
        </p>
      )}
    </div>
  );
}
