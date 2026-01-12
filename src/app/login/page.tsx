"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/generate");
    router.refresh();
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <main className="min-h-screen flex">
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/chef1.jpg"
          alt="Chef cooking"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-16 py-8 sm:py-12">
        <div className="max-w-md mx-auto w-full">
          <Link href="/" className="inline-block mb-8 sm:mb-12">
            <Image
              src="/smartcheflogo.png"
              alt="Smart Chef"
              width={360}
              height={96}
              className="h-16 sm:h-20 md:h-24 w-auto"
              priority
            />
          </Link>

          <p className="label text-xs sm:text-sm mb-2">Welcome back</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 sm:mb-12">Sign In</h1>

          <button 
            onClick={handleGoogleLogin} 
            className="btn-secondary w-full mb-6 sm:mb-8 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base py-3"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6 sm:mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-xs sm:text-sm text-muted uppercase tracking-wider">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label htmlFor="email" className="label text-xs sm:text-sm block mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input text-sm sm:text-base"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label text-xs sm:text-sm block mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input text-sm sm:text-base"
                placeholder="Your password"
                required
              />
            </div>

            {error && <p className="text-accent text-xs sm:text-sm">{error}</p>}

            <button type="submit" className="btn-primary w-full text-sm sm:text-base py-3" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 sm:mt-8 text-xs sm:text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-foreground font-medium hover:text-accent transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
