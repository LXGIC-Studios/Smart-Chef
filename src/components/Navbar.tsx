"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { userEmail, loading } = useAuth();

  const isLoggedIn = !loading && !!userEmail;

  async function handleLogout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="relative border-b border-border">
      <div className="flex items-center justify-between p-3 sm:p-4">
        {/* Logo */}
        <a href="/" className="h-10 sm:h-14 shrink-0">
          <Image
            src="/smartcheflogo.png"
            alt="Smart Chef"
            width={280}
            height={80}
            className="h-full w-auto"
            priority
          />
        </a>

        {/* Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:bg-foreground/5 transition-colors"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-foreground transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-foreground transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-foreground transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border z-50 shadow-lg">
          <div className="flex flex-col">
            {/* Main Links */}
            <Link 
              href={isLoggedIn ? "/generate" : "/login"} 
              onClick={closeMenu}
              className="px-6 py-4 text-sm font-medium hover:bg-foreground/5 border-b border-border/50"
            >
              Generate Recipe
            </Link>
            <Link 
              href={isLoggedIn ? "/plan" : "/login"} 
              onClick={closeMenu}
              className="px-6 py-4 text-sm font-medium hover:bg-foreground/5 border-b border-border/50"
            >
              Meal Plan Wizard
            </Link>
            <Link 
              href={isLoggedIn ? "/calendar" : "/login"} 
              onClick={closeMenu}
              className="px-6 py-4 text-sm font-medium hover:bg-foreground/5 border-b border-border/50"
            >
              Calendar
            </Link>
            <Link 
              href={isLoggedIn ? "/shopping" : "/login"} 
              onClick={closeMenu}
              className="px-6 py-4 text-sm font-medium hover:bg-foreground/5 border-b border-border/50"
            >
              Shopping List
            </Link>
            <Link 
              href={isLoggedIn ? "/recipes" : "/login"} 
              onClick={closeMenu}
              className="px-6 py-4 text-sm font-medium hover:bg-foreground/5 border-b border-border/50"
            >
              My Recipes
            </Link>

            {/* Auth Section */}
            {!loading && (
              isLoggedIn ? (
                <>
                  <Link 
                    href="/meal-plans" 
                    onClick={closeMenu}
                    className="px-6 py-4 text-sm font-medium hover:bg-foreground/5 border-b border-border/50"
                  >
                    Saved Plans
                  </Link>
                  <Link 
                    href="/settings/diet" 
                    onClick={closeMenu}
                    className="px-6 py-4 text-sm font-medium hover:bg-foreground/5 border-b border-border/50"
                  >
                    Diet Settings
                  </Link>
                  <div className="px-6 py-3 text-xs text-muted border-b border-border/50">
                    {userEmail}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-4 text-sm font-medium text-left text-accent hover:bg-foreground/5"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    onClick={closeMenu}
                    className="px-6 py-4 text-sm font-medium hover:bg-foreground/5 border-b border-border/50"
                  >
                    Log In
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={closeMenu}
                    className="px-6 py-4 text-sm font-bold text-accent hover:bg-foreground/5"
                  >
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
