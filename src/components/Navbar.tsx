"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="h-8 sm:h-10 shrink-0 relative z-10">
          <Image
            src="/smartcheflogo.png"
            alt="Smart Chef"
            width={200}
            height={60}
            className="h-full w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink href={isLoggedIn ? "/generate" : "/login"}>Generate</NavLink>
          <NavLink href={isLoggedIn ? "/plan" : "/login"}>Plan</NavLink>
          <NavLink href={isLoggedIn ? "/calendar" : "/login"}>Calendar</NavLink>
          <NavLink href={isLoggedIn ? "/recipes" : "/login"}>Recipes</NavLink>
          
          {!loading && (
            isLoggedIn ? (
              <>
                <NavLink href="/meal-plans">My Plans</NavLink>
                <div className="w-px h-4 bg-border mx-2" />
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-accent hover:text-accent/80 font-mono text-xs uppercase tracking-widest transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="w-px h-4 bg-border mx-2" />
                <NavLink href="/login">Login</NavLink>
                <Link 
                  href="/signup"
                  className="ml-2 px-4 py-2 bg-accent text-white font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:bg-foreground/5 transition-colors relative z-10"
          aria-label="Toggle menu"
        >
          <motion.span 
            className="w-6 h-0.5 bg-foreground"
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span 
            className="w-6 h-0.5 bg-foreground"
            animate={{ opacity: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span 
            className="w-6 h-0.5 bg-foreground"
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md border-b border-accent/20 overflow-hidden"
          >
            <div className="flex flex-col py-4">
              <MobileNavLink href={isLoggedIn ? "/generate" : "/login"} onClick={closeMenu}>
                Generate Recipe
              </MobileNavLink>
              <MobileNavLink href={isLoggedIn ? "/plan" : "/login"} onClick={closeMenu}>
                Meal Plan Wizard
              </MobileNavLink>
              <MobileNavLink href={isLoggedIn ? "/calendar" : "/login"} onClick={closeMenu}>
                Calendar
              </MobileNavLink>
              <MobileNavLink href={isLoggedIn ? "/shopping" : "/login"} onClick={closeMenu}>
                Shopping List
              </MobileNavLink>
              <MobileNavLink href={isLoggedIn ? "/recipes" : "/login"} onClick={closeMenu}>
                My Recipes
              </MobileNavLink>

              <div className="h-px bg-border/50 my-2 mx-6" />

              {!loading && (
                isLoggedIn ? (
                  <>
                    <MobileNavLink href="/meal-plans" onClick={closeMenu}>
                      Saved Plans
                    </MobileNavLink>
                    <MobileNavLink href="/settings/diet" onClick={closeMenu}>
                      Diet Settings
                    </MobileNavLink>
                    <div className="px-6 py-2 font-mono text-xs text-muted uppercase tracking-wider">
                      {userEmail}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-3 text-left font-mono text-sm uppercase tracking-wider text-accent hover:bg-accent/10 transition-colors"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink href="/login" onClick={closeMenu}>
                      Log In
                    </MobileNavLink>
                    <div className="px-6 py-2">
                      <Link 
                        href="/signup" 
                        onClick={closeMenu}
                        className="block w-full py-3 bg-accent text-white text-center font-mono text-sm uppercase tracking-wider hover:bg-accent/90 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.span
        className="relative px-4 py-2 text-muted hover:text-foreground font-mono text-xs uppercase tracking-widest transition-colors"
        whileHover={{ y: -1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="px-6 py-3 font-mono text-sm uppercase tracking-wider text-foreground hover:text-accent hover:bg-accent/5 transition-colors"
    >
      {children}
    </Link>
  );
}
