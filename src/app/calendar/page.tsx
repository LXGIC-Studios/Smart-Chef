"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import type { Recipe, ScheduledMeal } from "@/lib/types";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
const MEAL_LABELS: Record<string, string> = {
  breakfast: "🌅 Breakfast",
  lunch: "☀️ Lunch",
  dinner: "🌙 Dinner",
  snack: "🍎 Snack",
};

function getWeekDates(baseDate: Date): Date[] {
  const dates: Date[] = [];
  const startOfWeek = new Date(baseDate);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - day);

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatDayLabel(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

export default function CalendarPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [meals, setMeals] = useState<ScheduledMeal[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<typeof MEAL_TYPES[number]>("dinner");
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");
  const [customMeal, setCustomMeal] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const weekDates = getWeekDates(currentWeek);
  const startDate = formatDateKey(weekDates[0]);
  const endDate = formatDateKey(weekDates[6]);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const mealsRes = await fetch(`/api/scheduled-meals?start=${startDate}&end=${endDate}`);
      if (mealsRes.ok) {
        const data = await mealsRes.json();
        setMeals(data);
      }

      const recipesRes = await fetch("/api/recipes");
      if (recipesRes.ok) {
        const data = await recipesRes.json();
        setRecipes(data);
      }

      setLoading(false);
    }
    loadData();
  }, [supabase.auth, router, startDate, endDate]);

  function prevWeek() {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeek(newDate);
  }

  function nextWeek() {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeek(newDate);
  }

  function goToToday() {
    setCurrentWeek(new Date());
  }

  function openAddModal(date: Date, mealType: typeof MEAL_TYPES[number]) {
    setSelectedDate(date);
    setSelectedMealType(mealType);
    setSelectedRecipeId("");
    setCustomMeal("");
    setShowAddModal(true);
  }

  async function handleAddMeal() {
    if (!selectedDate) return;
    if (!selectedRecipeId && !customMeal.trim()) return;

    const res = await fetch("/api/scheduled-meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: formatDateKey(selectedDate),
        meal_type: selectedMealType,
        recipe_id: selectedRecipeId || null,
        custom_meal: customMeal.trim() || null,
      }),
    });

    if (res.ok) {
      const newMeal = await res.json();
      setMeals([...meals, newMeal]);
      setShowAddModal(false);
    }
  }

  async function handleDeleteMeal(mealId: string) {
    const res = await fetch(`/api/scheduled-meals/${mealId}`, { method: "DELETE" });
    if (res.ok) {
      setMeals(meals.filter(m => m.id !== mealId));
    }
  }

  function getMealsForDateAndType(date: Date, mealType: string): ScheduledMeal[] {
    const dateKey = formatDateKey(date);
    return meals.filter(m => m.date === dateKey && m.meal_type === mealType);
  }

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-20">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
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
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Your Week</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[0.9]">
              Meal
              <br />
              <span className="text-accent glow-signal">Calendar</span>
            </h1>
          </motion.div>
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <button onClick={prevWeek} className="px-3 py-2 border border-border hover:border-accent font-mono text-xs uppercase transition-colors">
              ← Prev
            </button>
            <button onClick={goToToday} className="px-3 py-2 border border-accent text-accent font-mono text-xs uppercase">
              Today
            </button>
            <button onClick={nextWeek} className="px-3 py-2 border border-border hover:border-accent font-mono text-xs uppercase transition-colors">
              Next →
            </button>
          </motion.div>
        </div>

        {/* Week Header */}
        <motion.div 
          className="mb-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="font-mono text-sm text-muted">
            {weekDates[0].toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            {" - "}
            {weekDates[6].toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div 
          className="grid grid-cols-7 gap-1 sm:gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Day Headers */}
          {weekDates.map((date) => (
            <div
              key={formatDateKey(date)}
              className={`text-center p-2 border-b-2 ${
                isToday(date) ? "border-accent" : "border-border"
              }`}
            >
              <p className="font-mono text-xs text-muted">{formatDayLabel(date)}</p>
              <p className={`font-display text-lg sm:text-2xl font-bold ${isToday(date) ? "text-accent" : ""}`}>
                {date.getDate()}
              </p>
            </div>
          ))}

          {/* Meal Slots */}
          {MEAL_TYPES.map((mealType) => (
            weekDates.map((date) => {
              const dayMeals = getMealsForDateAndType(date, mealType);
              
              return (
                <div
                  key={`${formatDateKey(date)}-${mealType}`}
                  className="min-h-[100px] sm:min-h-[120px] border border-border bg-card/30 p-1 sm:p-2 hover:border-accent/50 transition-colors"
                >
                  <p className="font-mono text-[10px] sm:text-xs text-muted mb-1">{MEAL_LABELS[mealType]}</p>
                  
                  {dayMeals.map((meal) => (
                    <motion.div
                      key={meal.id}
                      className="bg-background border border-accent/20 p-1.5 mb-1 group relative"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <p className="font-mono text-xs truncate">
                        {meal.recipe?.title || meal.custom_meal || "Meal"}
                      </p>
                      <button
                        onClick={() => handleDeleteMeal(meal.id)}
                        className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 text-accent text-xs transition-opacity"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}

                  <button
                    onClick={() => openAddModal(date, mealType)}
                    className="w-full font-mono text-xs text-muted hover:text-accent transition-colors py-1"
                  >
                    + Add
                  </button>
                </div>
              );
            })
          ))}
        </motion.div>

        {/* Generate Shopping List */}
        <motion.div 
          className="mt-8 pt-6 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/shopping" className="btn-tech inline-flex">
            🛒 View Shopping List →
          </Link>
        </motion.div>
      </div>

      {/* Add Meal Modal */}
      <AnimatePresence>
        {showAddModal && selectedDate && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-background border border-accent/20 p-6 max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h2 className="font-display text-xl font-bold mb-4">
                Add {MEAL_LABELS[selectedMealType]}
              </h2>
              <p className="font-mono text-xs text-muted mb-6">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted block mb-2">Meal Type</label>
                  <select
                    value={selectedMealType}
                    onChange={(e) => setSelectedMealType(e.target.value as typeof MEAL_TYPES[number])}
                    className="w-full bg-card border border-border px-3 py-2 font-mono text-sm focus:border-accent outline-none"
                  >
                    {MEAL_TYPES.map(type => (
                      <option key={type} value={type}>{MEAL_LABELS[type]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted block mb-2">From Saved Recipes</label>
                  <select
                    value={selectedRecipeId}
                    onChange={(e) => { setSelectedRecipeId(e.target.value); setCustomMeal(""); }}
                    className="w-full bg-card border border-border px-3 py-2 font-mono text-sm focus:border-accent outline-none"
                  >
                    <option value="">-- Select a recipe --</option>
                    {recipes.map(recipe => (
                      <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
                    ))}
                  </select>
                </div>

                <div className="text-center font-mono text-xs text-muted">— or —</div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted block mb-2">Custom Meal</label>
                  <input
                    type="text"
                    value={customMeal}
                    onChange={(e) => { setCustomMeal(e.target.value); setSelectedRecipeId(""); }}
                    placeholder="e.g., Leftover pasta"
                    className="w-full bg-card border border-border px-3 py-2 font-mono text-sm focus:border-accent outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button 
                    onClick={handleAddMeal} 
                    className="flex-1 bg-accent hover:bg-accent/90 text-white font-mono text-sm uppercase py-3 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Meal
                  </motion.button>
                  <motion.button 
                    onClick={() => setShowAddModal(false)} 
                    className="flex-1 border border-border hover:border-accent font-mono text-sm uppercase py-3 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
