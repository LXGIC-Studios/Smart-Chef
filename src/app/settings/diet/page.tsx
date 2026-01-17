"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import type { DietProfile } from "@/lib/types";

const DIETARY_OPTIONS = [
  "Gluten-Free", "Dairy-Free", "Egg-Free", "Nut-Free", 
  "Vegetarian", "Vegan", "Keto", "Low-Carb", "Low-Sodium", "Halal", "Kosher"
];

const CUISINE_OPTIONS = [
  "American", "Italian", "Mexican", "Chinese", "Japanese", "Thai", "Indian",
  "Mediterranean", "French", "Korean", "Vietnamese", "Greek", "Middle Eastern"
];

const PROTEIN_OPTIONS = [
  "Chicken", "Beef", "Pork", "Turkey", "Fish", "Shrimp", "Lamb",
  "Tofu", "Tempeh", "Beans/Legumes", "Eggs"
];

const EQUIPMENT_OPTIONS = [
  "Instant Pot", "Air Fryer", "Slow Cooker", "Stand Mixer", 
  "Food Processor", "Grill", "Smoker", "Sous Vide", "Dutch Oven"
];

export default function DietSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([]);
  const [proteinPreferences, setProteinPreferences] = useState<string[]>([]);
  const [dislikedIngredients, setDislikedIngredients] = useState("");
  const [calorieTarget, setCalorieTarget] = useState<number | "">("");
  const [kitchenEquipment, setKitchenEquipment] = useState<string[]>([]);
  const [budgetMode, setBudgetMode] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/diet-profile");
      if (res.ok) {
        const profile: DietProfile = await res.json();
        setDietaryRestrictions(profile.dietary_restrictions || []);
        setCuisinePreferences(profile.cuisine_preferences || []);
        setProteinPreferences(profile.protein_preferences || []);
        setDislikedIngredients((profile.disliked_ingredients || []).join(", "));
        setCalorieTarget(profile.calorie_target || "");
        setKitchenEquipment(profile.kitchen_equipment || []);
        setBudgetMode(profile.budget_mode || false);
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase.auth, router]);

  function toggleItem(list: string[], setList: (v: string[]) => void, item: string) {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/diet-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dietary_restrictions: dietaryRestrictions,
        cuisine_preferences: cuisinePreferences,
        protein_preferences: proteinPreferences,
        disliked_ingredients: dislikedIngredients.split(",").map(s => s.trim()).filter(Boolean),
        calorie_target: calorieTarget || null,
        kitchen_equipment: kitchenEquipment,
        budget_mode: budgetMode,
      }),
    });

    if (res.ok) {
      setSaved(true);
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
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

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <motion.div 
          className="mb-8"
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
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Personalization</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[0.9]">
            Diet
            <br />
            <span className="text-accent glow-signal">Profile</span>
          </h1>
          <p className="font-mono text-sm text-muted mt-4">
            <span className="text-accent">$</span> Set your preferences once and they&apos;ll auto-apply to recipe and meal plan generation.
          </p>
        </motion.div>

        {/* Dietary Restrictions */}
        <SettingsSection title="Dietary Restrictions" delay={0.1}>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map(opt => (
              <ToggleButton
                key={opt}
                label={opt}
                active={dietaryRestrictions.includes(opt)}
                onClick={() => toggleItem(dietaryRestrictions, setDietaryRestrictions, opt)}
              />
            ))}
          </div>
        </SettingsSection>

        {/* Cuisine Preferences */}
        <SettingsSection title="Favorite Cuisines" subtitle="Select cuisines you enjoy for recipe suggestions" delay={0.2}>
          <div className="flex flex-wrap gap-2">
            {CUISINE_OPTIONS.map(opt => (
              <ToggleButton
                key={opt}
                label={opt}
                active={cuisinePreferences.includes(opt)}
                onClick={() => toggleItem(cuisinePreferences, setCuisinePreferences, opt)}
              />
            ))}
          </div>
        </SettingsSection>

        {/* Protein Preferences */}
        <SettingsSection title="Protein Preferences" subtitle="Proteins you typically cook with" delay={0.3}>
          <div className="flex flex-wrap gap-2">
            {PROTEIN_OPTIONS.map(opt => (
              <ToggleButton
                key={opt}
                label={opt}
                active={proteinPreferences.includes(opt)}
                onClick={() => toggleItem(proteinPreferences, setProteinPreferences, opt)}
              />
            ))}
          </div>
        </SettingsSection>

        {/* Disliked Ingredients */}
        <SettingsSection title="Disliked Ingredients" subtitle="Ingredients you want to avoid (comma-separated)" delay={0.4}>
          <input
            type="text"
            value={dislikedIngredients}
            onChange={(e) => { setDislikedIngredients(e.target.value); setSaved(false); }}
            placeholder="e.g., mushrooms, olives, cilantro"
            className="w-full bg-card/50 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-accent transition-colors"
          />
        </SettingsSection>

        {/* Kitchen Equipment */}
        <SettingsSection title="Kitchen Equipment" subtitle="Special equipment you have available" delay={0.5}>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map(opt => (
              <ToggleButton
                key={opt}
                label={opt}
                active={kitchenEquipment.includes(opt)}
                onClick={() => toggleItem(kitchenEquipment, setKitchenEquipment, opt)}
              />
            ))}
          </div>
        </SettingsSection>

        {/* Calorie Target & Budget Mode */}
        <motion.div 
          className="mb-10 grid sm:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div>
            <h2 className="font-display text-lg font-bold mb-4">Daily Calorie Target</h2>
            <input
              type="number"
              value={calorieTarget}
              onChange={(e) => { setCalorieTarget(e.target.value ? parseInt(e.target.value) : ""); setSaved(false); }}
              placeholder="e.g., 2000"
              className="w-full bg-card/50 border border-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold mb-4">Budget Mode</h2>
            <motion.button
              onClick={() => { setBudgetMode(!budgetMode); setSaved(false); }}
              className={`w-full px-4 py-3 font-mono text-xs uppercase tracking-wider border transition-colors ${
                budgetMode
                  ? "bg-accent text-white border-accent"
                  : "border-border hover:border-accent"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {budgetMode ? "✓ Enabled - Prefer affordable ingredients" : "Disabled"}
            </motion.button>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          className="flex gap-4 pt-6 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <motion.button
            onClick={handleSave}
            disabled={saving}
            className={`px-8 py-3 font-mono text-sm uppercase tracking-wider transition-colors ${
              saved 
                ? "bg-success text-black" 
                : "bg-accent text-white hover:bg-accent/90"
            } disabled:opacity-50`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <motion.span
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Saving...
              </span>
            ) : saved ? "✓ Saved" : "Save Profile"}
          </motion.button>
          <motion.button 
            onClick={() => router.back()} 
            className="px-8 py-3 border border-border hover:border-accent font-mono text-sm uppercase tracking-wider transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}

function SettingsSection({ title, subtitle, delay, children }: { 
  title: string; 
  subtitle?: string; 
  delay: number; 
  children: React.ReactNode;
}) {
  return (
    <motion.section 
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <h2 className="font-display text-lg font-bold mb-2">{title}</h2>
      {subtitle && <p className="font-mono text-xs text-muted mb-3">{subtitle}</p>}
      {children}
    </motion.section>
  );
}

function ToggleButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-3 py-1.5 font-mono text-xs border transition-colors ${
        active
          ? "bg-accent text-white border-accent"
          : "border-border hover:border-accent"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  );
}
