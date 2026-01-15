"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  userEmail: string | undefined;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userEmail: undefined,
  loading: true,
});

// Cache auth state in memory to survive re-renders and navigations
let cachedUser: User | null = null;
let authInitialized = false;

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from cache to prevent flicker on navigation
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(!authInitialized);
  const supabaseRef = useRef(createClient());
  const initialFetchDone = useRef(false);

  // Stable update function that only updates if actually changed
  const updateUser = useCallback((newUser: User | null) => {
    // Only update if the user ID actually changed (or null transition)
    const currentId = cachedUser?.id;
    const newId = newUser?.id;
    
    if (currentId !== newId) {
      cachedUser = newUser;
      setUser(newUser);
    }
    
    if (!authInitialized) {
      authInitialized = true;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const supabase = supabaseRef.current;

    // Only fetch if not already initialized
    if (!authInitialized && !initialFetchDone.current) {
      initialFetchDone.current = true;
      supabase.auth.getUser().then(({ data: { user } }) => {
        updateUser(user);
      });
    }

    // Listen for auth changes (login/logout) - but skip INITIAL_SESSION
    // as we already handle that with getUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Skip INITIAL_SESSION event since we handle it with getUser()
        if (event === 'INITIAL_SESSION') {
          return;
        }
        
        updateUser(session?.user ?? null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [updateUser]);

  return (
    <AuthContext.Provider value={{ user, userEmail: user?.email, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
