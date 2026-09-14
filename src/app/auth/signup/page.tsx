"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AuthForm } from "@/components/ui/auth-form";
import { GoogleButton } from "@/components/ui/google-button";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, isDemo } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleSubmit = async (email: string, password: string, name?: string) => {
    setError(null);
    const result = await signUp(email, password, name);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (isDemo) {
      setRedirecting(true);
      router.push("/auth/role-select");
      return;
    }
    setEmailSent(true);
  };

  const handleGoogle = async () => {
    setError(null);
    setRedirecting(true);
    try {
      await signInWithGoogle();
    } catch {
      setRedirecting(false);
      setError("Google sign-up failed. Please try again.");
    }
  };

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-surface-50">
        <div className="text-center">
          <Loader2 className="mx-auto w-10 h-10 text-accent-500 animate-spin" />
          <p className="mt-4 text-surface-500 text-sm">Setting things up…</p>
        </div>
      </div>
    );
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-surface-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-card p-8 text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-accent-50">
            <CheckCircle2 className="w-8 h-8 text-accent-600" />
          </div>
          <h1 className="text-xl font-bold text-primary-900 mt-4">Check your email</h1>
          <p className="text-surface-500 mt-2 text-sm leading-relaxed">
            We sent a confirmation link. Click it to verify your account, then come back here
            and sign in.
          </p>
          <Link
            href="/auth/login"
            className="btn-primary mt-6 inline-flex items-center justify-center w-full"
          >
            Go to sign in
          </Link>
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
          <h1 className="text-2xl font-bold text-primary-900">Create your account</h1>
          <p className="text-surface-500 mt-1">Join TaskNow today — it&apos;s free to start</p>

          <div className="mt-6">
            <GoogleButton label="Sign up with Google" onClick={handleGoogle} />
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-surface-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          <AuthForm mode="signup" onSubmit={handleSubmit} error={error} />

          <p className="mt-6 text-center text-sm text-surface-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-accent-600 font-semibold hover:text-accent-700">
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-surface-400">
          © 2026 TaskNow. All rights reserved.
        </p>
      </div>
    </div>
  );
}