"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase/client";
import type { UserRole } from "@/types";

export interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  role: UserRole | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

const demoProfile: Profile = {
  id: "demo-user",
  email: "demo@tasknow.app",
  name: "Sarah Johnson",
  role: null,
  avatar_url: null,
  phone: null,
  created_at: new Date().toISOString(),
};

interface AuthResult {
  error: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, name?: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  createProfile: (role: UserRole, extra?: { name?: string }) => Promise<AuthResult>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    isSupabaseConfigured() ? null : null
  );
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const isDemo = !isSupabaseConfigured();

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    if (!isSupabaseConfigured()) return null;
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) return null;
    return data as Profile;
  }, []);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user: current },
      } = await supabase.auth.getUser();
      setUser(current);
      if (current?.id) {
        const p = await fetchProfile(current.id);
        setProfile(p);
      } else {
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    let mounted = true;

    const boot = async () => {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }
      const supabase = getSupabaseBrowserClient();

      const {
        data: { user: current },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(current);
      if (current?.id) {
        const p = await fetchProfile(current.id);
        if (mounted) setProfile(p);
      }
      setLoading(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        async (_event: AuthChangeEvent, session: Session | null) => {
          const u = session?.user ?? null;
          setUser(u);
          if (u?.id) {
            const p = await fetchProfile(u.id);
            setProfile(p);
          } else {
            setProfile(null);
          }
        }
      );

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    };

    boot();
  }, [fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      setProfile({ ...demoProfile, role: null });
      return { error: null };
    }
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      if (!isSupabaseConfigured()) {
        setProfile({ ...demoProfile, name: name ?? demoProfile.name, role: null });
        return { error: null };
      }
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) return { error: error.message };
      // Profile row is created by the on_auth_user_created DB trigger.
      return { error: null };
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setProfile({ ...demoProfile, role: null });
      return;
    }
    const supabase = getSupabaseBrowserClient();
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setProfile(null);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const createProfile = useCallback(
    async (role: UserRole, extra?: { name?: string }) => {
      if (!isSupabaseConfigured()) {
        setProfile((prev) => ({ ...(prev ?? demoProfile), role }));
        return { error: null };
      }

      const supabase = getSupabaseBrowserClient();
      const {
        data: { user: current },
      } = await supabase.auth.getUser();
      if (!current) return { error: "You must be signed in." };

      const { error } = await supabase.from("profiles").upsert(
        {
          id: current.id,
          email: current.email,
          name: extra?.name ?? current.user_metadata?.full_name ?? current.email,
          role,
        },
        { onConflict: "id" }
      );
      if (error) return { error: error.message };

      if (role === "provider") {
        const { error: providerError } = await supabase
          .from("providers")
          .upsert(
            {
              id: current.id,
              categories: [],
              hourly_rate: 50,
              is_available: true,
            },
            { onConflict: "id" }
          );
        if (providerError) return { error: providerError.message };
      }

      const p = await fetchProfile(current.id);
      setProfile(p);
      return { error: null };
    },
    [fetchProfile]
  );

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      profile,
      role: profile?.role ?? null,
      loading,
      isDemo,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      createProfile,
      refresh,
    }),
    [user, profile, loading, isDemo, signIn, signUp, signInWithGoogle, signOut, createProfile, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}