"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  userEmail?: string;
}

export function Navbar({ userEmail }: NavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="flex items-center justify-between p-4 sm:p-6 md:p-8 border-b border-border">
      <Link href="/" className="h-12 sm:h-16 md:h-24 ml-2 sm:ml-8 md:ml-16 shrink-0">
        <Image
          src="/smartcheflogo.png"
          alt="Smart Chef"
          width={360}
          height={96}
          className="h-full w-auto"
          priority
        />
      </Link>
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {userEmail ? (
          <>
            {/* Logged in - show all features */}
            <Link href="/generate" className="text-xs sm:text-sm font-medium hover:text-accent transition-colors">
              Generate
            </Link>
            <Link href="/plan" className="text-xs sm:text-sm font-medium hover:text-accent transition-colors">
              Plan
            </Link>
            <Link href="/calendar" className="text-xs sm:text-sm font-medium hover:text-accent transition-colors hidden sm:block">
              Calendar
            </Link>
            <Link href="/shopping" className="text-xs sm:text-sm font-medium hover:text-accent transition-colors hidden sm:block">
              Shopping
            </Link>
            <Link href="/recipes" className="text-xs sm:text-sm font-medium hover:text-accent transition-colors">
              Recipes
            </Link>
            <Link href="/meal-plans" className="text-xs sm:text-sm font-medium hover:text-accent transition-colors hidden md:block">
              My Plans
            </Link>
            <Link href="/settings/diet" className="text-xs sm:text-sm font-medium hover:text-accent transition-colors hidden md:block">
              Settings
            </Link>
            <span className="text-xs text-muted hidden lg:inline">{userEmail}</span>
            <button onClick={handleLogout} className="btn-secondary text-xs px-2 sm:px-3 py-1.5">
              Log Out
            </button>
          </>
        ) : (
          <>
            {/* Logged out - show key features + auth buttons */}
            <Link href="/login" className="text-xs sm:text-sm font-medium hover:text-accent transition-colors">
              Generate
            </Link>
            <Link href="/login" className="text-xs sm:text-sm font-medium hover:text-accent transition-colors">
              Meal Plan
            </Link>
            <Link href="/login" className="text-xs sm:text-sm font-medium hover:text-accent transition-colors hidden sm:block">
              Calendar
            </Link>
            <Link href="/login" className="btn-secondary text-xs px-2 sm:px-3 py-1.5">
              Log In
            </Link>
            <Link href="/signup" className="btn-primary text-xs px-2 sm:px-3 py-1.5">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
