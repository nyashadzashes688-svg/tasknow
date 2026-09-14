"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AuthForm } from "@/components/ui/auth-form";
import { GoogleButton } from "@/components/ui/google-button";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/auth/role-select";
  const { signIn, signInWithGoogle, role, isDemo } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (email: string, password: string) => {
    setError(null);
    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
      return;
    }
    setRedirecting(true);
    // In demo mode we go straight to role-select.
    if (isDemo || !role) {
      router.push("/auth/role-select");
    } else {
      router.push(
        next && next !== "/auth/login"
          ? next
          : role === "client"
            ? "/client/dashboard"
            : "/provider/dashboard"
      );
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setRedirecting(true);
    try {
      await signInWithGoogle();
      // Google redirect takes over the page — no further client code runs.
    } catch {
      setRedirecting(false);
      setError("Google sign-in failed. Please try again.");
    }
  };

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-surface-50">
        <div className="text-center">
          <div className="mx-auto w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-surface-500 text-sm">Signing you in…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-surface-50">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-accent-500/25">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <span className="text-3xl font-bold text-primary-900">
              Task<span className="text-accent-500">Now</span>
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-primary-900">Welcome back</h1>
          <p className="text-surface-500 mt-1">Sign in to continue to your account</p>

          <div className="mt-6">
            <GoogleButton label="Continue with Google" onClick={handleGoogle} />
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-surface-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          <AuthForm mode="login" onSubmit={handleSubmit} error={error} />

          <p className="mt-6 text-center text-sm text-surface-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-accent-600 font-semibold hover:text-accent-700">
              Sign up
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-surface-400">
          By continuing you agree to TaskNow&apos;s Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen grid place-items-center bg-surface-50">
          <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}