"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  CheckCheck,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { GoogleIcon, AppleIcon } from "@/components/ui/social-icons";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";
type Step = "form" | "otp" | "done";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASS_MIN = 6;

const errorText = (e: string | null | undefined) =>
  e ? <p className="mt-1 text-xs font-medium text-red-400">{e}</p> : null;

interface SocialButtonProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
}

function SocialButton({ icon: Icon, label, onClick }: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 flex-1 items-center justify-center gap-2 border border-hairline bg-surface/50 text-sm font-semibold text-foreground transition-colors hover:border-foreground/25 hover:bg-surface"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function OtpInput({
  value,
  onChange,
  onComplete,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  onComplete: (code: string) => void;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const set = (i: number, char: string) => {
    const digit = char.replace(/\D/g, "");
    if (!digit) return;
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (i < 5) refs.current[i + 1]?.focus();
    if (next.every((c) => c !== "")) onComplete(next.join(""));
  };

  const handleKey: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const i = Number((e.target as HTMLInputElement).dataset.index);
    if (e.key === "Backspace" && !(e.target as HTMLInputElement).value && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...value];
    digits.split("").forEach((d, i) => (next[i] = d));
    onChange(next);
    if (digits.length === 6) onComplete(digits);
  };

  return (
    <div className="flex justify-between gap-2">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          data-index={i}
          value={digit}
          inputMode="numeric"
          maxLength={1}
          onChange={(e) => set(i, e.target.value.slice(-1))}
          onPaste={handlePaste}
          onKeyDown={handleKey}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            "h-14 w-12 rounded-xl border bg-muted text-center text-xl font-bold text-foreground outline-none transition-colors sm:w-14",
            digit ? "border-primary text-primary" : "border-hairline",
            "focus:border-primary focus:shadow-glow"
          )}
        />
      ))}
    </div>
  );
}

interface FieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  icon: ComponentType<{ className?: string }>;
  placeholder?: string;
  autoComplete?: string;
}

function Field({ label, type = "text", value, onChange, error, icon: Icon, placeholder, autoComplete }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <span className="relative block">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "h-12 w-full rounded-xl border bg-muted pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50",
            error ? "border-red-400/60" : "border-hairline focus:border-primary/60"
          )}
        />
      </span>
      {errorText(error)}
    </label>
  );
}

export function AuthFlow({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; agree?: string }>({});
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [social, setSocial] = useState<string | null>(null);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const isSignup = mode === "signup";

  const validate = () => {
    const next: typeof errors = {};
    if (isSignup && name.trim().length < 2) next.name = "Enter your full name";
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address";
    if (password.length < PASS_MIN) next.password = `At least ${PASS_MIN} characters`;
    if (isSignup && !agree) next.agree = "Please accept the terms to continue";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "form" && !validate()) return;
    setLoading(true);
    setOtpError(null);
    setTimeout(() => {
      setLoading(false);
      if (isSignup || step === "otp") {
        if (step === "otp") {
          if (otp.join("").length !== 6) {
            setOtpError("Enter all 6 digits");
            return;
          }
          signIn({ name: name.trim() || email.split("@")[0], email });
          setStep("done");
        } else {
          setSentTo(email);
          setStep("otp");
          setResendIn(30);
        }
      } else {
        signIn({ name: email.split("@")[0], email });
        setStep("done");
      }
    }, 900);
  };

  const handleSocial = (provider: "Google" | "Apple") => {
    setSocial(provider);
    setTimeout(() => {
      setSocial(null);
      signIn({
        name: provider === "Apple" ? "Apple User" : "Google User",
        email: `${provider.toLowerCase()}@reaori.local`,
      });
      setStep("done");
    }, 800);
  };

  const resend = () => {
    setResendIn(30);
    setOtp(Array(6).fill(""));
    setOtpError(null);
  };

  const done = (
    <div className="flex flex-col items-center px-2 py-8 text-center">
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success"
      >
        <CheckCheck className="h-10 w-10" />
      </motion.span>
      <h2 className="mt-6 text-2xl font-bold text-foreground">
        {isSignup ? "Account created" : "Welcome back"}
      </h2>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {social
          ? `Signed in with ${social}. Redirecting you to your dashboard…`
          : "Identity verified. You’ll now be redirected to your dashboard."}
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
      >
        Go to dashboard
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-hairline bg-card/90 p-6 shadow-card backdrop-blur-xl sm:p-8">
      <AnimatePresence mode="wait">
        {step === "done" ? (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {done}
          </motion.div>
        ) : step === "otp" ? (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              onClick={() => setStep("form")}
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h2 className="mt-4 text-2xl font-bold text-foreground">Verify it’s you</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a 6-digit code to <span className="font-semibold text-foreground">{sentTo}</span>.
              {isSignup && " Check your inbox or SMS."}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <OtpInput value={otp} onChange={setOtp} onComplete={(code) => {
                  setOtp(code.split(""));
                  setTimeout(() => {
                    setOtpError(null);
                    signIn({ name: name.trim() || email.split("@")[0], email });
                    setStep("done");
                  }, 400);
                }} />
                {errorText(otpError)}
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={resend}
                  disabled={resendIn > 0}
                  className="font-semibold text-primary transition-colors hover:text-primary/80 disabled:text-muted-foreground"
                >
                  {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                </button>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {sentTo}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4" />}
                {loading ? "Verifying…" : "Verify code"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-foreground">
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isSignup
                  ? "Join REAORI and never lose a dream trip again."
                  : "Sign in to manage trips, wishlists and bookings."}
              </p>
            </div>

            <div className="mb-6 flex gap-2">
              <SocialButton icon={GoogleIcon} label="Google" onClick={() => handleSocial("Google")} />
              <SocialButton icon={AppleIcon} label="Apple" onClick={() => handleSocial("Apple")} />
            </div>
            {social && (
              <p className="mb-4 text-center text-xs font-semibold text-muted-foreground">
                <Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />
                Connecting to {social}…
              </p>
            )}

            <div className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-hairline" />
              or continue with email
              <span className="h-px flex-1 bg-hairline" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {isSignup && (
                <Field
                  label="Full name"
                  value={name}
                  onChange={setName}
                  error={errors.name}
                  icon={User}
                  placeholder="Karim Hassan"
                  autoComplete="name"
                />
              )}
              <Field
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                error={errors.email}
                icon={Mail}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <Field
                label="Password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={setPassword}
                error={errors.password}
                icon={Lock}
                placeholder="Minimum 6 characters"
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
              {isSignup && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={showPass}
                      onChange={(e) => setShowPass(e.target.checked)}
                      className="accent-primary"
                    />
                    Show password
                  </label>
                  <label className="flex items-start gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-0.5 accent-primary"
                    />
                    <span>
                      I agree to the <Link href="#" className="font-semibold text-primary">Terms</Link> and{" "}
                      <Link href="#" className="font-semibold text-primary">Privacy Policy</Link>.
                    </span>
                  </label>
                  {errorText(errors.agree)}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {loading
                  ? "Sending…"
                  : isSignup
                    ? "Create account"
                    : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignup ? "Already have an account?" : "New to REAORI?"}{" "}
              <Link
                href={isSignup ? "/auth/signin" : "/auth/signup"}
                className="font-bold text-primary transition-colors hover:text-primary/80"
              >
                {isSignup ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}