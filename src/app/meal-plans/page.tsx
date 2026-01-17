"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

interface MealPlan {
  id: string;
  title: string;
  description: string;
  plan_type: string;
  people: number;
  days: number;
  total_prep_time_hours: number;
  created_at: string;
}

const PLAN_ICONS: Record<string, string> = {
  "freezer-burritos": "🌯",
  "dinner-plan": "🍽️",
  "lunch-prep": "🥗",
  "breakfast-prep": "🍳",
  "snack-prep": "🥜",
  "full-week": "📅",
  "weekly-plan": "📅",
  "weekly-prep": "🍱",
};

export default function MealPlansPage() {
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/api/meal-plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
      setLoading(false);
    }
    loadData();
  }, [supabase.auth]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this meal plan?");
    if (!confirmed) return;

    const res = await fetch(`/api/meal-plans/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPlans(plans.filter((p) => p.id !== id));
    }
  }

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
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[0.9]">
              Meal
              <br />
              <span className="text-accent glow-signal">Plans</span>
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/plan" className="btn-tech inline-flex">
              New Plan →
            </Link>
          </motion.div>
        </div>

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
        ) : plans.length === 0 ? (
          <motion.div 
            className="py-12 sm:py-24 px-4 text-center border border-border bg-card/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="font-mono text-sm text-muted mb-6">No saved meal plans yet</p>
            <Link href="/plan" className="btn-tech inline-flex">
              Create Your First Plan →
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan, index) => (
              <motion.div 
                key={plan.id} 
                className="border border-border bg-card/30 p-4 sm:p-6 hover:border-accent transition-colors group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <span className="text-4xl">{PLAN_ICONS[plan.plan_type] || "📋"}</span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/meal-plans/${plan.id}`}>
                      <h3 className="font-display text-xl font-bold group-hover:text-accent transition-colors">
                        {plan.title}
                      </h3>
                    </Link>
                    <p className="font-mono text-sm text-muted mt-1 line-clamp-2">{plan.description}</p>
                    <div className="flex flex-wrap gap-4 mt-3 font-mono text-xs text-muted">
                      <span><span className="text-accent">{plan.people}</span> people</span>
                      <span><span className="text-accent">{plan.days}</span> days</span>
                      <span><span className="text-accent">~{plan.total_prep_time_hours}h</span> prep</span>
                      <span className="hidden sm:inline">
                        {new Date(plan.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-4 sm:flex-col">
                    <Link
                      href={`/meal-plans/${plan.id}`}
                      className="font-mono text-xs uppercase tracking-wider hover:text-accent transition-colors"
                    >
                      View →
                    </Link>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="font-mono text-xs uppercase tracking-wider text-accent/60 hover:text-accent transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
