import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, HeartHandshake, BadgeCheck } from "lucide-react";
import { AuthFlow } from "@/components/auth/AuthFlow";

export const metadata: Metadata = {
  title: "Create account · REAORI Travel",
  description: "Join REAORI to save wishlists, book packages and get personalized itineraries.",
};

export default function SignUpPage() {
  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="grid w-full items-center gap-12 lg:grid-cols-2">
        <div className="order-2 mx-auto w-full max-w-md lg:order-1">
          <AuthFlow mode="signup" />
        </div>

        <div className="order-1 hidden lg:order-2 lg:block">
          <div className="glass space-y-6 rounded-3xl p-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Why join REAORI
            </span>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
              One account, <span className="text-gradient">every trip</span>
            </h1>
            {[
              {
                icon: HeartHandshake,
                title: "Curated for you",
                text: "Wishlists, compare tools and AI itineraries tuned to your travel style.",
              },
              {
                icon: BadgeCheck,
                title: "Trusted, verified",
                text: "Human advisors, verified reviews and protected payments on every booking.",
              },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                  <f.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-foreground">{f.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              By signing up you accept the{" "}
              <Link href="#" className="font-semibold text-primary">Terms of Service</Link> and{" "}
              <Link href="#" className="font-semibold text-primary">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}