"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Landmark, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  mode: "signin" | "register";
}

export function AuthCard({ mode }: AuthCardProps) {
  const [submitting, setSubmitting] = useState(false);

  const isSignIn = mode === "signin";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 900);
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-hairline bg-surface/70 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:bg-surface";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-primary/20 blur-2xl" />
      <div className="glass rounded-3xl p-8 shadow-card sm:p-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/40">
            <Landmark className="h-7 w-7" />
          </span>
          <h1 className="text-3xl font-bold uppercase tracking-wide text-foreground">
            {isSignIn ? (
              <>
                <span className="text-primary">S</span>ign in
              </>
            ) : (
              <>
                <span className="text-primary">R</span>egister
              </>
            )}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {isSignIn
              ? "Welcome back — your next journey is waiting."
              : "Create an account to unlock member fares and saved trips."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {!isSignIn && (
            <input required className={inputClass} type="text" placeholder="Full name" />
          )}
          <input required className={inputClass} type="email" placeholder="Email" />
          <input
            required
            minLength={6}
            className={inputClass}
            type="password"
            placeholder="Password"
          />
          {!isSignIn && (
            <input
              required
              minLength={6}
              className={inputClass}
              type="password"
              placeholder="Confirm password"
            />
          )}

          {isSignIn && (
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-primary" />
                Remember me
              </label>
              <a href="#" className="text-primary transition-colors hover:text-white">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-8 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-glow transition-all duration-300 hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isSignIn ? "Signing in…" : "Creating…"}
              </>
            ) : isSignIn ? (
              "Log in"
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-hairline" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            or
          </span>
          <div className="h-px flex-1 bg-hairline" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <SocialButton label="Facebook" emoji="f" className="bg-[#1877f2]" />
          <SocialButton label="Google" emoji="G" className="bg-[#ea4335]" />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignIn ? "New to REAORI? " : "Already have an account? "}
          <Link
            href={isSignIn ? "/register" : "/sign-in"}
            className="font-semibold text-primary transition-colors hover:text-white"
          >
            {isSignIn ? "Register now" : "Sign in"}
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

function SocialButton({
  label,
  emoji,
  className,
}: {
  label: string;
  emoji: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.03]",
        className
      )}
    >
      <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs font-bold">
        {emoji}
      </span>
      {label}
    </button>
  );
}

export function AuthLayout({
  children,
  background,
}: {
  children: ReactNode;
  background?: string;
}) {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center px-4 py-28"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgb(5 6 10 / 0.88), rgb(5 6 10 / 0.95)), url(${background ?? "/images/form.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {children}
    </section>
  );
}