"use client";

import Link from "next/link";
import { ChevronRight, Search, Landmark } from "lucide-react";
import {
  FacebookIcon,
  XIcon,
  LinkedinIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/ui/social-icons";
import { CONTACT_INFO } from "@/data/travelData";

const socialIcons = [
  { label: "Facebook", icon: FacebookIcon },
  { label: "Twitter", icon: XIcon },
  { label: "LinkedIn", icon: LinkedinIcon },
  { label: "Instagram", icon: InstagramIcon },
  { label: "TikTok", icon: TikTokIcon },
];

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Destinations map", href: "/map" },
      { label: "Tour packages", href: "/#tours" },
      { label: "AI trip planner", href: "/planner" },
      { label: "Photo gallery", href: "/gallery" },
      { label: "Checkout", href: "/checkout" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Wishlist", href: "/dashboard" },
      { label: "Sign in", href: "/auth/signin" },
      { label: "Register", href: "/auth/signup" },
      { label: "Contact us", href: "/#contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-card text-foreground">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
                <Landmark className="h-5 w-5" />
              </span>
              <span className="text-xl font-bold tracking-[0.25em]">REAORI</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Curated escapes, cultural odysseys, and once-in-a-lifetime journeys —
              planned to the last detail by real travelers.
            </p>
            <div className="mt-5 flex gap-2">
              {socialIcons.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href={CONTACT_INFO.socials.find((s) => s.label === label)?.href ?? "#"}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-hairline text-muted-foreground transition-all duration-300 hover:rotate-180 hover:border-primary hover:text-primary hover:shadow-glow"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group flex items-center gap-1 text-sm text-muted-foreground transition-all duration-200 hover:pl-2 hover:text-foreground"
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-destructive opacity-0 transition-all duration-200 group-hover:opacity-100" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
              Stay inspired
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              Join the newsletter for secret deals and new routes.
            </p>
            <form
              className="mt-4 flex overflow-hidden rounded-xl border border-hairline bg-surface/50 focus-within:border-primary/50"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="search"
                placeholder="Your email"
                aria-label="Email address"
                className="h-11 w-full bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-auto w-12 shrink-0 place-items-center bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            All rights reserved © {new Date().getFullYear()} Mohamed Wahib ·
            {CONTACT_INFO.email}
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}