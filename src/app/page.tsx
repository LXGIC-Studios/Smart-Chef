"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch(`/api/auth/me?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        setUserEmail(data.email);
        setChecked(true);
      })
      .catch(() => {
        setChecked(true);
      });
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="status-dot" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted">Initializing...</span>
        </motion.div>
      </div>
    );
  }

  const isLoggedIn = !!userEmail;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col md:flex-row pt-16 overflow-hidden">
        {/* Floating Ingredients - Cooking themed background animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Floating spice/herb particles */}
          {[...Array(12)].map((_, i) => (
            <FloatingParticle key={i} index={i} />
          ))}
          
          {/* Steam wisps rising */}
          <div className="absolute bottom-0 left-1/4 w-full h-1/2">
            <SteamWisp delay={0} left="10%" />
            <SteamWisp delay={2} left="25%" />
            <SteamWisp delay={4} left="40%" />
          </div>

          {/* Gradient glow behind content */}
          <motion.div
            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, var(--signal) 0%, transparent 70%)",
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Knife slash accent lines */}
        <motion.div
          className="absolute top-32 right-1/3 w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent hidden md:block"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        />
        <motion.div
          className="absolute top-36 right-1/3 w-20 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent hidden md:block"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-6 md:px-16 pt-8 sm:pt-12 pb-12 sm:pb-16 md:py-0 relative z-10"
        >
          <div className="md:ml-12 lg:ml-20">
            {/* Label */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                Smart Recipe Generation
              </span>
            </motion.div>

            {/* Main Title with Slide-up Animation */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-titanium leading-[0.9] tracking-tight"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              >
                COOK
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-titanium leading-[0.9] tracking-tight"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              >
                WITH WHAT
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              >
                YOU <span className="text-accent">HAVE</span>
              </motion.h1>
            </div>

            {/* By Lxgic Studios */}
            <motion.p
              className="font-mono text-xs uppercase tracking-[0.3em] text-lunar mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              by <span className="text-accent">Lxgic Studios</span>
            </motion.p>

            {/* Tagline */}
            <motion.div
              className="mt-6 text-muted text-sm sm:text-base max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Enter the ingredients in your kitchen.
              <br />
              <span className="text-foreground">Get a delicious recipe tailored just for you.</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <Link href={isLoggedIn ? "/generate" : "/signup"}>
                <motion.span
                  className="btn-tech inline-flex"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoggedIn ? "Generate Recipe" : "Get Started"}
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.span>
              </Link>
              <Link href={isLoggedIn ? "/plan" : "/login"} className="btn-secondary text-sm sm:text-base">
                Plan My Week →
              </Link>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="hidden md:flex items-center gap-2 mt-12 text-lunar text-xs font-mono"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="w-1 h-1 bg-accent rounded-full" />
              <span className="uppercase tracking-widest">Scroll to explore</span>
            </motion.div>
          </div>
        </motion.div>

        <div className="w-full md:w-1/2 relative min-h-[40vh] sm:min-h-[50vh] md:min-h-screen">
          <Image
            src="/chefhero.jpg"
            alt="Chef preparing food"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent md:block hidden" />
        </div>
      </section>

      {/* Features Grid - Dashboard (DARK) */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 bg-foreground text-background relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3 sm:mb-4 text-background/60">Your Kitchen Tools</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-10 sm:mb-16">
              Everything you need
              <br />
              <span className="text-accent">in one place</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard
              href={isLoggedIn ? "/generate" : "/login"}
              icon={<LightningIcon />}
              title="Quick Recipe"
              description="Enter ingredients you have and get a recipe instantly."
              cta={isLoggedIn ? "Generate →" : "Sign In →"}
              index={0}
            />
            <FeatureCard
              href={isLoggedIn ? "/plan" : "/login"}
              icon={<ClipboardIcon />}
              title="Meal Plan Wizard"
              description="Plan your week with a step-by-step wizard."
              cta={isLoggedIn ? "Start Planning →" : "Sign In →"}
              index={1}
            />
            <FeatureCard
              href={isLoggedIn ? "/calendar" : "/login"}
              icon={<CalendarIcon />}
              title="Meal Calendar"
              description="Schedule meals on your weekly calendar."
              cta={isLoggedIn ? "View Calendar →" : "Sign In →"}
              index={2}
            />
            <FeatureCard
              href={isLoggedIn ? "/shopping" : "/login"}
              icon={<CartIcon />}
              title="Shopping List"
              description="Aggregate ingredients from recipes and meal plans."
              cta={isLoggedIn ? "View List →" : "Sign In →"}
              index={3}
            />
            <FeatureCard
              href={isLoggedIn ? "/recipes" : "/login"}
              icon={<BookIcon />}
              title="My Recipes"
              description="Access all your saved recipes."
              cta={isLoggedIn ? "View Recipes →" : "Sign In →"}
              index={4}
            />
            <FeatureCard
              href={isLoggedIn ? "/settings/diet" : "/login"}
              icon={<GearIcon />}
              title="Diet Profile"
              description="Set your dietary preferences once."
              cta={isLoggedIn ? "Set Up →" : "Sign In →"}
              index={5}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3 sm:mb-4 text-muted">How It Works</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-10 sm:mb-16">
              Three steps to
              <br />
              your perfect meal
            </h2>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-8">
            <StepCard number="01" title="Add Ingredients" description="List what you have in your fridge and pantry. No need to go shopping." delay={0} />
            <StepCard number="02" title="Select Spices" description="Check off the spices available in your kitchen for flavor matching." delay={0.1} />
            <StepCard number="03" title="Get Recipe" description="Get a custom recipe with exact measurements in seconds." delay={0.2} />
          </div>
        </div>
      </section>

      {/* Why Smart Chef */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 bg-foreground text-background">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          <motion.div 
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3 sm:mb-4 text-background/60">Why Smart Chef</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 sm:mb-8">
              Stop wasting
              <br />
              food & time
            </h2>
            <p className="text-background/70 text-base sm:text-lg mb-6 sm:mb-8">
              The average household throws away hundreds of dollars worth of food each year. 
              Smart Chef helps you use what you already have, reducing waste and saving money.
            </p>
            <Link href={isLoggedIn ? "/generate" : "/signup"} className="btn-secondary border-background text-background hover:bg-background hover:text-foreground text-sm sm:text-base">
              Start Cooking
            </Link>
          </motion.div>
          <motion.div 
            className="relative aspect-square order-1 md:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src="/chef2.jpg"
              alt="Fresh ingredients"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Meal Prep Section */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.2em] mb-3 sm:mb-4 text-muted">Meal Prep Made Easy</p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 sm:mb-8">
                Plan your entire
                <br />
                <span className="text-accent">week in minutes</span>
              </h2>
              <ul className="space-y-3 text-sm sm:text-base mb-8">
                <li className="flex items-center gap-3">
                  <span className="text-accent">✓</span>
                  <span>Freezer burritos, dinner plans, lunch prep & more</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent">✓</span>
                  <span>Full recipes with ingredients and instructions</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent">✓</span>
                  <span>Complete grocery list organized by category</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-accent">✓</span>
                  <span>Step-by-step prep instructions</span>
                </li>
              </ul>
              <Link href={isLoggedIn ? "/plan" : "/signup"} className="btn-primary text-sm sm:text-base">
                Start Meal Planning →
              </Link>
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              <PrepCard number="01" title="Freezer Ready" description="Make-ahead grab & go" delay={0} />
              <PrepCard number="02" title="Dinner Plan" description="Family dinners for the week" delay={0.1} />
              <PrepCard number="03" title="Lunch Prep" description="Portioned work lunches" delay={0.2} />
              <PrepCard number="04" title="Breakfast Prep" description="Quick morning meals" delay={0.3} />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-16 bg-foreground">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <GalleryCard image="/chef3.jpg" label="Feature" title="Save Your Favorites" index={0} altText="Chef organizing saved favorite recipes on a tablet in a modern kitchen" />
          <GalleryCard image="/chef4.jpg" label="Feature" title="Detailed Steps" index={1} altText="Chef following detailed step-by-step cooking instructions while preparing ingredients" />
          <GalleryCard image="/chef5.jpg" label="Feature" title="Family Favorites" index={2} altText="Family gathering around a table enjoying a home-cooked meal together" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 md:px-16 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <Link href="/">
            <Image src="/smartcheflogo.png" alt="Smart Chef" width={300} height={80} className="h-12 sm:h-16 md:h-20 w-auto opacity-50 hover:opacity-100 transition-opacity" />
          </Link>
          <div className="flex flex-col items-center md:flex-row gap-3 sm:gap-4 md:gap-8">
            <div className="flex gap-4 sm:gap-6">
              <Link href="/privacy" className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors font-mono uppercase tracking-wider">Privacy</Link>
              <Link href="/terms" className="text-xs sm:text-sm text-muted hover:text-foreground transition-colors font-mono uppercase tracking-wider">Terms</Link>
            </div>
            <p className="text-muted text-xs sm:text-sm text-center font-mono">
              © {new Date().getFullYear()} <span className="text-accent">Lxgic Studios</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Component: Floating Particle (herbs/spices floating)
function FloatingParticle({ index }: { index: number }) {
  const particles = [
    { emoji: "🌿", size: "text-lg" },
    { emoji: "🌶️", size: "text-sm" },
    { emoji: "🧄", size: "text-base" },
    { emoji: "🧅", size: "text-sm" },
    { emoji: "🍋", size: "text-lg" },
    { emoji: "🫒", size: "text-sm" },
    { emoji: "🥬", size: "text-base" },
    { emoji: "🌰", size: "text-xs" },
    { emoji: "🍅", size: "text-sm" },
    { emoji: "🥕", size: "text-base" },
    { emoji: "🧈", size: "text-sm" },
    { emoji: "🥚", size: "text-base" },
  ];
  
  const particle = particles[index % particles.length];
  const startX = 10 + (index * 7) % 80;
  const duration = 15 + (index * 3) % 10;
  const delay = index * 0.8;
  
  return (
    <motion.div
      className={`absolute ${particle.size} opacity-20`}
      style={{ left: `${startX}%` }}
      initial={{ y: "100vh", opacity: 0, rotate: 0 }}
      animate={{ 
        y: "-20vh", 
        opacity: [0, 0.3, 0.2, 0],
        rotate: 360,
        x: [0, 20, -20, 10, 0]
      }}
      transition={{ 
        duration, 
        delay,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {particle.emoji}
    </motion.div>
  );
}

// Component: Steam Wisp (rising steam animation)
function SteamWisp({ delay, left }: { delay: number; left: string }) {
  return (
    <motion.div
      className="absolute bottom-0 w-1 opacity-10"
      style={{ left }}
      initial={{ height: 0, opacity: 0 }}
      animate={{ 
        height: ["0%", "40%", "0%"],
        opacity: [0, 0.15, 0],
      }}
      transition={{ 
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeOut"
      }}
    >
      <div className="w-full h-full bg-gradient-to-t from-accent/30 via-white/10 to-transparent blur-sm" />
    </motion.div>
  );
}

// Component: Feature Card
function FeatureCard({ href, icon, title, description, cta, index }: { 
  href: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  cta: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link href={href} className="group border border-background/20 hover:border-accent p-6 sm:p-8 transition-all hover:bg-background/5 flex flex-col h-full">
        <div className="w-12 h-12 border-2 border-accent flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold mb-2 group-hover:text-accent transition-colors">{title}</h3>
        <p className="text-background/70 text-sm sm:text-base mb-4 flex-grow">{description}</p>
        <span className="text-accent text-sm font-bold uppercase tracking-wider font-mono">{cta}</span>
      </Link>
    </motion.div>
  );
}

// Component: Step Card
function StepCard({ number, title, description, delay }: { number: string; title: string; description: string; delay: number }) {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <span className="font-display text-6xl sm:text-7xl md:text-8xl font-bold text-border group-hover:text-accent transition-colors">{number}</span>
      <h3 className="font-display text-xl sm:text-2xl font-bold mt-3 sm:mt-4 mb-2 sm:mb-3">{title}</h3>
      <p className="text-muted text-sm sm:text-base">{description}</p>
    </motion.div>
  );
}

// Component: Prep Card
function PrepCard({ number, title, description, delay }: { number: string; title: string; description: string; delay: number }) {
  return (
    <motion.div
      className="bg-card border border-border p-4 sm:p-6 group hover:border-accent transition-colors"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
    >
      <p className="font-display text-3xl sm:text-4xl font-bold text-accent/20 group-hover:text-accent transition-colors leading-none mb-2">{number}</p>
      <p className="font-bold">{title}</p>
      <p className="text-xs text-muted">{description}</p>
    </motion.div>
  );
}

// Component: Gallery Card
function GalleryCard({ image, label, title, index, altText }: { image: string; label: string; title: string; index: number; altText?: string }) {
  return (
    <motion.div
      className={`relative aspect-[4/3] sm:aspect-[3/4] group overflow-hidden ${index === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Image src={image} alt={altText || `Smart Chef feature: ${title} - chef preparing a meal in kitchen`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <p className="font-mono text-[10px] sm:text-xs text-white/60 mb-1 sm:mb-2 uppercase tracking-wider">{label}</p>
        <h3 className="font-display text-lg sm:text-xl md:text-2xl font-bold text-white">{title}</h3>
      </div>
    </motion.div>
  );
}

// Icons
function LightningIcon() {
  return (
    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
