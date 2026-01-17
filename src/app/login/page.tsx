"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    <main className="min-h-screen flex relative overflow-hidden">
      {/* Background image side */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src="/chef1.jpg"
          alt="Chef cooking"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />
        
        {/* Decorative elements */}
        <motion.div
          className="absolute bottom-8 left-8 right-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/60 mb-2">Smart Chef</p>
          <p className="font-display text-2xl text-white font-bold">Cook with what you have</p>
        </motion.div>
      </div>
      
      {/* Form side */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 md:px-16 py-8 sm:py-12 relative">
        {/* Background effects */}
        <div className="absolute inset-0 starfield opacity-30" />
        <div className="absolute inset-0 grid-bg opacity-50" />
        
        <motion.div 
          className="max-w-md mx-auto w-full relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="inline-block mb-8 sm:mb-12">
            <Image
              src="/smartcheflogo.png"
              alt="Smart Chef"
              width={360}
              height={96}
              className="h-12 sm:h-16 w-auto"
              priority
            />
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-2">Welcome back</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10">
              Sign <span className="text-accent glow-signal">In</span>
            </h1>
          </motion.div>

          <motion.button 
            onClick={handleGoogleLogin} 
            className="w-full mb-6 sm:mb-8 flex items-center justify-center gap-3 px-6 py-4 border border-border hover:border-accent bg-card/50 backdrop-blur-sm transition-all font-mono text-sm uppercase tracking-wider"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </motion.button>

          <div className="relative mb-6 sm:mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 font-mono text-xs text-muted uppercase tracking-wider">or</span>
            </div>
          </div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <label htmlFor="email" className="font-mono text-xs uppercase tracking-[0.2em] text-muted block mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-card/50 border border-border focus:border-accent px-4 py-3 font-mono text-sm outline-none transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="font-mono text-xs uppercase tracking-[0.2em] text-muted block mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-card/50 border border-border focus:border-accent px-4 py-3 font-mono text-sm outline-none transition-colors"
                placeholder="Your password"
                required
              />
            </div>

            {error && (
              <motion.p 
                className="text-accent font-mono text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            <motion.button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 text-white font-mono text-sm uppercase tracking-wider py-4 transition-colors disabled:opacity-50"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Signing in...
                </span>
              ) : "Sign In"}
            </motion.button>
          </motion.form>

          <motion.p 
            className="mt-8 font-mono text-xs text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Sign up
            </Link>
          </motion.p>

          {/* Lxgic Studios branding */}
          <motion.p 
            className="mt-12 font-mono text-[10px] uppercase tracking-[0.3em] text-muted/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            by <span className="text-accent/50">Lxgic Studios</span>
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}
