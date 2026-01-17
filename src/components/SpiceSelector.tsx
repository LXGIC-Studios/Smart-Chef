"use client";

import { motion } from "framer-motion";
import type { Spice } from "@/lib/types";

interface SpiceSelectorProps {
  spices: Spice[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function SpiceSelector({ spices, selected, onChange }: SpiceSelectorProps) {
  const categories = [...new Set(spices.map((s) => s.category))];

  function toggleSpice(name: string) {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name));
    } else {
      onChange([...selected, name]);
    }
  }

  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-[0.2em] text-muted block mb-4 sm:mb-6">
        What do you have available?
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {categories.map((category, catIndex) => (
          <motion.div 
            key={category} 
            className="space-y-2 sm:space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: catIndex * 0.1 }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{category}</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {spices
                .filter((s) => s.category === category)
                .map((spice) => (
                  <motion.label
                    key={spice.id}
                    className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 cursor-pointer transition-all font-mono text-[10px] sm:text-xs uppercase tracking-wider border ${
                      selected.includes(spice.name)
                        ? "bg-accent text-white border-accent"
                        : "bg-transparent text-foreground border-border hover:border-accent"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(spice.name)}
                      onChange={() => toggleSpice(spice.name)}
                      className="sr-only"
                    />
                    {spice.name}
                  </motion.label>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
