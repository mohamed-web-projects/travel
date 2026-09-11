import type { Metadata } from "next";
import { Plane } from "lucide-react";
import { AuthFlow } from "@/components/auth/AuthFlow";

export const metadata: Metadata = {
  title: "Sign in · REAORI Travel",
  description: "Sign in to REAORI to manage your trips, wishlist and bookings.",
};

export default function SignInPage() {
  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="grid w-full items-center gap-12 lg:grid-cols-2">
        <div className="hidden lg:block">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <Plane className="h-3.5 w-3.5" />
            Members only
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Welcome back to <span className="text-gradient">REAORI</span>
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            Your wishlist, bookings and dream itineraries are all waiting. Sign in
            and pick up exactly where you left off.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {[
              "Sync your wishlist across devices",
              "Track live booking status and PDF itineraries",
              "Unlock member-only fares and early-arrival deals",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md">
          <AuthFlow mode="signin" />
        </div>
      </div>
    </div>
  );
}