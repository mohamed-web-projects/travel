import Link from "next/link";
import { Landmark, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 pt-20 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary">
        <Landmark className="h-8 w-8" />
      </span>
      <h1 className="text-6xl font-bold uppercase tracking-wide text-foreground">404</h1>
      <p className="max-w-md text-muted-foreground">
        This destination seems to have drifted off the map.
      </p>
      <Link
        href="/"
        className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
      >
        <Compass className="h-4 w-4" />
        Back to home
      </Link>
    </section>
  );
}