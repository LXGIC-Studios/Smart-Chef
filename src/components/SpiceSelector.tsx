"use client";

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
      <label className="label text-xs sm:text-sm block mb-4 sm:mb-6">
        What do you have available?
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {categories.map((category) => (
          <div key={category} className="space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted">{category}</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {spices
                .filter((s) => s.category === category)
                .map((spice) => (
                  <label
                    key={spice.id}
                    className={`inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 cursor-pointer transition-all text-[10px] sm:text-xs font-medium uppercase tracking-wider border-2 ${
                      selected.includes(spice.name)
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground border-border hover:border-foreground"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(spice.name)}
                      onChange={() => toggleSpice(spice.name)}
                      className="sr-only"
                    />
                    {spice.name}
                  </label>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
