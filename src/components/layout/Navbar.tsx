"use client";

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Landmark,
  Menu,
  X,
  Sparkles,
  Heart,
  LayoutDashboard,
  Ticket,
  LogOut,
  ChevronDown,
  User,
} from "lucide-react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useWishlist } from "@/context/WishlistContext";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NAV_LINKS, type NavLink } from "@/data/travelData";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SECTION_IDS = ["hero", "tours", "info", "contact"] as const;

const TOURS_LINK: NavLink = {
  label: "Tours",
  href: "/#tours",
  isPage: false,
  section: "tours",
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const spiedSection = useScrollSpy(SECTION_IDS, isHome);
  const { ids } = useWishlist();
  const { t } = useSettings();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onPointerDown = (e: globalThis.PointerEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const isActive = (link: NavLink) => {
    if (link.isPage) {
      return (
        pathname === link.href ||
        (link.href !== "/" && pathname.startsWith(`${link.href}/`))
      );
    }
    return isHome && (spiedSection ?? "hero") === link.section;
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleNavClick = (
    e: MouseEvent<HTMLAnchorElement>,
    link: NavLink
  ) => {
    closeMenus();

    if (link.isPage || !isHome) return;

    e.preventDefault();

    if (link.section === "hero") {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    } else {
      document
        .getElementById(link.section ?? "")
        ?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
    }

    if (link.href.startsWith("/#")) {
      history.replaceState(null, "", `#${link.section}`);
    }
  };

  const handleLogout = () => {
    closeMenus();
    signOut();
    if (pathname.startsWith("/dashboard")) router.push("/");
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || menuOpen || profileOpen
          ? "border-b border-hairline bg-background/85 shadow-lg backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 transition-transform duration-300 group-hover:rotate-6">
            <Landmark className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold tracking-[0.25em] text-foreground">
            REAORI
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className={cn(
                "relative rounded-lg px-4 py-2 text-sm font-semibold transition-colors duration-300",
                isActive(link)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive(link) && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-lg bg-surface ring-1 ring-hairline"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle className="hidden md:grid" />

          <Link
            href={TOURS_LINK.href}
            onClick={(e) => handleNavClick(e, TOURS_LINK)}
            className={cn(buttonClasses({ size: "sm", variant: "primary" }), "hidden sm:inline-flex")}
          >
            <Sparkles className="h-4 w-4" />
            {t("bookNow")}
          </Link>

          <Link
            href="/dashboard"
            aria-label={t("wishlist")}
            className="relative grid h-10 w-10 place-items-center rounded-xl border border-hairline text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Heart className="h-5 w-5" />
            {ids.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {ids.length}
              </span>
            )}
          </Link>

          {/* Auth zone */}
          {user ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1.5 rounded-xl border border-hairline bg-surface py-1 pl-1 pr-2 transition-colors hover:border-primary/40"
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground shadow-glow">
                  {user.initials}
                </span>
                <span className="hidden max-w-24 truncate text-sm font-semibold text-foreground sm:block">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-300",
                    profileOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-hairline bg-card shadow-card"
                  >
                    <div className="border-b border-hairline bg-surface/60 px-4 py-3">
                      <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                        <User className="h-3 w-3" />
                        {user.plan}
                      </p>
                    </div>
                    <div className="p-1.5">
                      <DropdownItem
                        icon={LayoutDashboard}
                        label={t("dashboard")}
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/dashboard");
                        }}
                      />
                      <DropdownItem
                        icon={Ticket}
                        label={t("myBookings")}
                        onClick={() => {
                          setProfileOpen(false);
                          router.push("/dashboard?tab=bookings");
                        }}
                      />
                    </div>
                    <div className="border-t border-hairline p-1.5">
                      <button
                        role="menuitem"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("signOut")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className={cn(buttonClasses({ size: "sm", variant: "gold" }), "hidden sm:inline-flex")}
            >
              {t("signIn")}
            </Link>
          )}

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              setMenuOpen((v) => !v);
              setProfileOpen(false);
            }}
            className="grid h-10 w-10 place-items-center rounded-xl border border-hairline text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-hairline bg-background/95 backdrop-blur-xl lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              <div className="mb-2 flex items-center justify-between rounded-xl border border-hairline bg-surface px-4 py-2.5">
                <span className="text-sm font-semibold text-foreground">Appearance</span>
                <ThemeToggle />
              </div>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-semibold transition-colors hover:bg-surface",
                    isActive(link)
                      ? "bg-surface text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="mt-2 flex items-center gap-3 rounded-xl border border-hairline bg-surface px-4 py-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                      {user.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">{user.name}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {t("dashboard")}
                  </Link>
                  <Link
                    href="/dashboard?tab=bookings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                  >
                    <Ticket className="h-4 w-4" />
                    {t("myBookings")}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("signOut")}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMenuOpen(false)}
                    className={cn(buttonClasses({ size: "md", variant: "gold" }), "mt-2 w-full")}
                  >
                    {t("signIn")}
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 rounded-lg px-4 py-3 text-center text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function DropdownItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof User;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </button>
  );
}