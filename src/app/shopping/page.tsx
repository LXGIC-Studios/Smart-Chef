"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import type { ShoppingList, ShoppingListItem } from "@/lib/types";

const CATEGORIES = ["Proteins", "Produce", "Dairy", "Pantry", "Frozen", "Bakery", "Other"];

export default function ShoppingPage() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeList, setActiveList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("Other");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/shopping-lists");
      if (res.ok) {
        const data = await res.json();
        setLists(data);
        if (data.length > 0) {
          setActiveList(data[0]);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase.auth, router]);

  async function createNewList() {
    const res = await fetch("/api/shopping-lists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "New Shopping List", items: [] }),
    });

    if (res.ok) {
      const newList = await res.json();
      setLists([newList, ...lists]);
      setActiveList(newList);
    }
  }

  async function updateList(items: ShoppingListItem[]) {
    if (!activeList) return;

    const res = await fetch(`/api/shopping-lists/${activeList.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    if (res.ok) {
      const updatedList = await res.json();
      setActiveList(updatedList);
      setLists(lists.map(l => l.id === updatedList.id ? updatedList : l));
    }
  }

  function toggleItem(itemId: string) {
    if (!activeList) return;
    const items = activeList.items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    updateList(items);
  }

  function removeItem(itemId: string) {
    if (!activeList) return;
    const items = activeList.items.filter(item => item.id !== itemId);
    updateList(items);
  }

  function addItem() {
    if (!activeList || !newItem.trim()) return;
    const item: ShoppingListItem = {
      id: crypto.randomUUID(),
      item: newItem.trim(),
      amount: newAmount.trim() || "1",
      category: newCategory,
      checked: false,
    };
    updateList([...activeList.items, item]);
    setNewItem("");
    setNewAmount("");
  }

  async function deleteList() {
    if (!activeList) return;
    const confirmed = window.confirm("Delete this shopping list?");
    if (!confirmed) return;

    const res = await fetch(`/api/shopping-lists/${activeList.id}`, { method: "DELETE" });
    if (res.ok) {
      const remaining = lists.filter(l => l.id !== activeList.id);
      setLists(remaining);
      setActiveList(remaining[0] || null);
    }
  }

  function clearChecked() {
    if (!activeList) return;
    const items = activeList.items.filter(item => !item.checked);
    updateList(items);
  }

  const groupedItems = (activeList?.items || []).reduce((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, ShoppingListItem[]>);

  const checkedCount = activeList?.items.filter(i => i.checked).length || 0;
  const totalCount = activeList?.items.length || 0;

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
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">At the Store</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-[0.9]">
              Shopping
              <br />
              <span className="text-accent glow-signal">List</span>
            </h1>
          </motion.div>
          <motion.button 
            onClick={createNewList} 
            className="btn-tech self-start sm:self-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            + New List
          </motion.button>
        </div>

        {lists.length === 0 ? (
          <motion.div 
            className="py-16 text-center border border-border bg-card/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="font-mono text-sm text-muted mb-6">No shopping lists yet</p>
            <button onClick={createNewList} className="btn-tech">
              Create Your First List →
            </button>
          </motion.div>
        ) : (
          <>
            {/* List Selector */}
            {lists.length > 1 && (
              <motion.div 
                className="flex gap-2 mb-6 overflow-x-auto pb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {lists.map(list => (
                  <button
                    key={list.id}
                    onClick={() => setActiveList(list)}
                    className={`px-4 py-2 font-mono text-xs uppercase tracking-wider border whitespace-nowrap transition-colors ${
                      activeList?.id === list.id
                        ? "bg-accent text-white border-accent"
                        : "border-border hover:border-accent"
                    }`}
                  >
                    {list.name}
                  </button>
                ))}
              </motion.div>
            )}

            {activeList && (
              <>
                {/* Progress */}
                <motion.div 
                  className="mb-6 p-4 bg-card/50 border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs text-muted uppercase tracking-wider">Progress</span>
                    <span className="font-mono text-sm font-bold text-accent">{checkedCount} / {totalCount}</span>
                  </div>
                  <div className="h-2 bg-border overflow-hidden">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: totalCount > 0 ? `${(checkedCount / totalCount) * 100}%` : "0%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>

                {/* Add Item */}
                <motion.div 
                  className="mb-8 p-4 border border-border bg-card/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder="Add item..."
                      className="flex-1 bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent"
                      onKeyDown={(e) => e.key === "Enter" && addItem()}
                    />
                    <input
                      type="text"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      placeholder="Amount"
                      className="w-24 bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent"
                    />
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="bg-background border border-border px-3 py-2 font-mono text-sm focus:outline-none focus:border-accent"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <motion.button 
                      onClick={addItem} 
                      className="px-6 py-2 bg-accent text-white font-mono text-xs uppercase tracking-wider"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add
                    </motion.button>
                  </div>
                </motion.div>

                {/* Items by Category */}
                {Object.keys(groupedItems).length === 0 ? (
                  <motion.div 
                    className="py-12 text-center border border-border bg-card/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <p className="font-mono text-sm text-muted">No items in this list</p>
                    <p className="font-mono text-xs text-muted/60 mt-2">Add items above or from your recipes and meal plans</p>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {CATEGORIES.filter(cat => groupedItems[cat]?.length > 0).map((category, catIndex) => (
                      <motion.div 
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + catIndex * 0.05 }}
                      >
                        <h3 className="font-display font-bold text-accent mb-3">{category}</h3>
                        <div className="space-y-2">
                          {groupedItems[category].map(item => (
                            <motion.div
                              key={item.id}
                              className={`flex items-center gap-4 p-3 border border-border bg-card/30 transition-colors ${
                                item.checked ? "opacity-50" : ""
                              }`}
                              layout
                            >
                              <motion.button
                                onClick={() => toggleItem(item.id)}
                                className={`w-6 h-6 border-2 shrink-0 flex items-center justify-center transition-colors ${
                                  item.checked
                                    ? "bg-accent border-accent text-white"
                                    : "border-border hover:border-accent"
                                }`}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {item.checked && "✓"}
                              </motion.button>
                              <div className="flex-1 min-w-0">
                                <p className={`font-mono text-sm ${item.checked ? "line-through text-muted" : ""}`}>
                                  {item.item}
                                </p>
                                <p className="font-mono text-xs text-muted">{item.amount}</p>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="font-mono text-xs text-muted hover:text-accent transition-colors"
                              >
                                ✕
                              </button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <motion.div 
                  className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-border"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  {checkedCount > 0 && (
                    <button
                      onClick={clearChecked}
                      className="font-mono text-xs uppercase tracking-wider text-muted hover:text-accent transition-colors"
                    >
                      Clear {checkedCount} checked items
                    </button>
                  )}
                  <button
                    onClick={deleteList}
                    className="font-mono text-xs uppercase tracking-wider text-accent hover:text-accent/70 transition-colors ml-auto"
                  >
                    Delete List
                  </button>
                </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
