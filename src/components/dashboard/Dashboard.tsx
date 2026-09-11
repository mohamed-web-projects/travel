"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Heart,
  Ticket,
  FileText,
  Download,
  CalendarDays,
  Users,
  Check,
  Plane,
  ShieldCheck,
  MapPin,
  Sunrise,
  Moon,
  Coffee,
  LogOut,
  Pencil,
} from "lucide-react";
import {
  USER_PROFILE,
  BOOKINGS,
  generateItinerary,
  DESTINATION_EXTRA,
  type BookingEntry,
  type PlannerBudget,
} from "@/data/mockData";
import { DESTINATIONS } from "@/data/travelData";
import { useWishlist } from "@/context/WishlistContext";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/StarRating";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { cn } from "@/lib/utils";

type Tab = "overview" | "profile" | "wishlist" | "bookings" | "itinerary";

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "bookings", label: "Bookings", icon: Ticket },
  { id: "itinerary", label: "Itinerary", icon: FileText },
];

function BookingStatus({ status }: { status: BookingEntry["status"] }) {
  return status === "upcoming" ? (
    <Badge variant="gold" className="gap-1">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
      Upcoming
    </Badge>
  ) : (
    <Badge variant="outline">Completed</Badge>
  );
}

const VALID_TABS: Tab[] = ["overview", "profile", "wishlist", "bookings", "itinerary"];

export function Dashboard({ initialTab }: { initialTab?: string }) {
  const tab: Tab = VALID_TABS.includes(initialTab as Tab) ? (initialTab as Tab) : "overview";
  const { ids: items } = useWishlist();
  const { format } = useSettings();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const profile = user
    ? {
        ...USER_PROFILE,
        name: user.name,
        email: user.email,
        initials: user.initials,
        plan: user.plan,
        memberSince: user.memberSince,
      }
    : USER_PROFILE;

  const favoriteDests = DESTINATIONS.filter((d) => items.includes(d.slug));
  const upcoming = BOOKINGS.filter((b) => b.status === "upcoming");
  const past = BOOKINGS.filter((b) => b.status === "past");
  const activeBooking = upcoming[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-3 border-b border-hairline pb-5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground shadow-glow">
              {profile.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">{profile.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => router.replace(`/dashboard?tab=${id}`)}
                aria-pressed={tab === id}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                  tab === id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-surface/80 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {id === "wishlist" && items.length > 0 && (
                  <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {items.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-4 border-t border-hairline pt-4">
            <button
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="min-w-0">
        <AnimatePresence mode="wait">
          {/* ------------------------------ OVERVIEW ------------------------------ */}
          {tab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/20 via-background to-gold/10 p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  {profile.plan} member
                </p>
                <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">
                  Welcome back, {profile.name.split(" ")[0]}!
                </h1>
                <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                  You have {upcoming.length} trip{upcoming.length !== 1 ? "s" : ""} coming up and{" "}
                  {items.length} saved dream{items.length !== 1 ? "s" : ""}. Where to next?
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Upcoming trips", value: upcoming.length, icon: Plane },
                    { label: "Countries visited", value: 12, icon: MapPin },
                    { label: "Reward points", value: "4,250", icon: ShieldCheck },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-hairline bg-background/60 p-4">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                        <s.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-lg font-bold text-foreground">{s.value}</p>
                        <p className="text-[11px] text-muted-foreground">{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {activeBooking && (
                <div className="flex flex-col gap-5 rounded-3xl border border-hairline bg-card p-6 sm:flex-row sm:items-center">
                  <BookingThumb slug={activeBooking.slug} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {DESTINATIONS.find((d) => d.slug === activeBooking.slug)?.name}
                      </h3>
                      <BookingStatus status={activeBooking.status} />
                    </div>
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {activeBooking.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {activeBooking.travelers.adults} adult{activeBooking.travelers.adults > 1 ? "s" : ""}
                        {activeBooking.travelers.children > 0 && ` + ${activeBooking.travelers.children} child`}
                      </span>
                      <span className="font-bold text-primary">{format(activeBooking.total)}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => router.replace("/dashboard?tab=itinerary")}
                    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
                  >
                    <FileText className="h-4 w-4" />
                    View itinerary
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ------------------------------ PROFILE ------------------------------ */}
          {tab === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass space-y-6 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">My profile</h2>
                <button className="inline-flex items-center gap-2 rounded-xl border border-hairline px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Full name", value: profile.name },
                  { label: "Email", value: profile.email },
                  { label: "Phone", value: profile.phone },
                  { label: "Country", value: profile.country },
                  { label: "Membership", value: profile.plan },
                  { label: "Member since", value: profile.memberSince },
                ].map((f) => (
                  <div key={f.label} className="rounded-2xl border border-hairline bg-background/50 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{f.label}</p>
                    <p className="mt-1 text-sm font-bold text-foreground">{f.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ------------------------------ WISHLIST ------------------------------ */}
          {tab === "wishlist" && (
            <motion.div key="wishlist" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <h2 className="mb-5 text-xl font-bold text-foreground">
                My wishlist · <span className="text-primary">{items.length}</span>
              </h2>
              {favoriteDests.length === 0 ? (
                <EmptyWishlist />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  {favoriteDests.map((d) => (
                    <div key={d.slug} className="overflow-hidden rounded-3xl border border-hairline bg-card">
                      <div className="relative aspect-[16/10]">
                        <Image src={d.image} alt={d.name} fill sizes="(max-width:640px)100vw,50vw" className="object-cover" />
                        <WishlistButton slug={d.slug} className="absolute right-3 top-3" />
                        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                          {format(d.price)}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-foreground">{d.name}</h3>
                          <StarRating rating={d.rating} size={13} showValue={false} />
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{d.tagline}</p>
                        <div className="mt-3 flex gap-3">
                          <Link
                            href={`/packages/${d.slug}`}
                            className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-primary/15 text-xs font-semibold text-primary transition-colors hover:bg-primary/25"
                          >
                            View package
                          </Link>
                          <Link
                            href={`/destinations/${d.slug}`}
                            className="inline-flex h-10 flex-1 items-center justify-center rounded-xl border border-hairline text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                          >
                            Explore
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ------------------------------ BOOKINGS ------------------------------ */}
          {tab === "bookings" && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">My bookings</h2>
              {[...upcoming, ...past].map((b) => (
                <BookingRow key={b.id} booking={b} onItinerary={() => router.replace("/dashboard?tab=itinerary")} />
              ))}
            </motion.div>
          )}

          {/* ------------------------------ ITINERARY ------------------------------ */}
          {tab === "itinerary" && <ItineraryPreview booking={activeBooking ?? BOOKINGS[0]} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function BookingThumb({ slug }: { slug: string }) {
  const d = DESTINATIONS.find((x) => x.slug === slug);
  return (
    <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-2xl">
      {d ? (
        <Image src={d.image} alt={d.name} fill sizes="144px" className="object-cover" />
      ) : null}
    </div>
  );
}

function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-hairline bg-card p-10 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Heart className="h-6 w-6" />
      </span>
      <h3 className="mt-4 font-bold text-foreground">Nothing saved yet</h3>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Tap the heart on any tour to keep it here for later.
      </p>
      <Link
        href="/#tours"
        className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90"
      >
        Browse tours
      </Link>
    </div>
  );
}

function BookingRow({ booking, onItinerary }: { booking: BookingEntry; onItinerary: () => void }) {
  const d = DESTINATIONS.find((x) => x.slug === booking.slug);
  const { format } = useSettings();
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-hairline bg-card p-5 sm:flex-row sm:items-center">
      <BookingThumb slug={booking.slug} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-foreground">{d?.name}</h3>
          <BookingStatus status={booking.status} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {booking.code} · booked {booking.bookedOn}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {booking.date} · {booking.travelers.adults} adult{booking.travelers.adults > 1 ? "s" : ""}
          {booking.travelers.children > 0 && `, ${booking.travelers.children} child`} · {booking.tier} tier
        </p>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <p className="text-lg font-bold text-primary">{format(booking.total)}</p>
        {booking.status === "upcoming" && (
          <button
            onClick={onItinerary}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-hairline px-4 text-xs font-semibold text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
          >
            <FileText className="h-3.5 w-3.5" />
            Itinerary
          </button>
        )}
      </div>
    </div>
  );
}

function ItineraryPreview({ booking }: { booking: BookingEntry }) {
  return <ItineraryPage booking={booking} />;
}

function ItineraryPage({ booking }: { booking: BookingEntry }) {
  const d = DESTINATIONS.find((x) => x.slug === booking.slug);
  const extra = DESTINATION_EXTRA[booking.slug];
  const budget: PlannerBudget =
    booking.tier === "luxury" ? "luxe" : booking.tier === "budget" ? "smart" : "balanced";
  const itinerary = generateItinerary("adventure", 4, budget);
  const { format } = useSettings();

  if (!d || !extra) return null;

  const whereToGo = extra.attractions.map((a) => a.name).slice(0, 3).join(" · ");
  const total = itinerary.estPerPerson * (booking.travelers.adults + booking.travelers.children);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground">Trip itinerary</h2>
        <button
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-glow transition-colors hover:bg-primary/90 print:hidden"
        >
          <Download className="h-3.5 w-3.5" />
          Save as PDF
        </button>
      </div>

      <div
        id="itinerary-print"
        className="overflow-hidden rounded-3xl border border-hairline bg-white text-slate-900 shadow-card dark:bg-slate-900 dark:text-slate-100"
      >
        <div className="bg-gradient-to-br from-primary to-gold p-6 text-white break-inside-avoid page-break-inside-avoid">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">REAORI Travel</p>
              <h3 className="mt-1 text-2xl font-bold">{d.name} — {d.durationDays} days</h3>
              <p className="mt-1 text-sm text-white/80">
                Booking {booking.code} · {booking.date} · {itinerary.budgetLabel} · {itinerary.styleLabel}
              </p>
            </div>
            <span className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur">
              {booking.travelers.adults} adult{booking.travelers.adults > 1 ? "s" : ""}
              {booking.travelers.children > 0 && ` + ${booking.travelers.children} child`}
            </span>
          </div>
        </div>

        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex items-center gap-3 break-inside-avoid page-break-inside-avoid">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {extra.attractions[0]?.name.slice(0, 2) ?? "RE"}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Highlight stops</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{whereToGo}</p>
            </div>
          </div>

          {itinerary.days.map((day) => (
            <div key={day.day} className="break-inside-avoid page-break-inside-avoid rounded-2xl border border-slate-200 dark:border-slate-700/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Day {day.day} · {day.title}
                </p>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800/50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-300">
                  {day.meals} meals
                </span>
              </div>

              <div className="mt-3 grid grid-cols-[24px_1fr] gap-2">
                <div className="flex flex-col items-center">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary">
                    <Sunrise className="h-3.5 w-3.5" />
                  </span>
                  <span className="mt-1 w-px flex-1 bg-slate-200 dark:bg-slate-700" />
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gold/20 text-slate-600 dark:text-slate-300">
                    <Moon className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="space-y-4 pb-2 pt-0.5">
                  {day.morning && (
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Morning</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{day.morning}</p>
                    </div>
                  )}
                  {day.afternoon && (
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Afternoon</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{day.afternoon}</p>
                    </div>
                  )}
                  {day.evening && (
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Evening</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{day.evening}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="break-inside-avoid page-break-inside-avoid rounded-2xl bg-slate-100 dark:bg-slate-800/50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Trip notes
            </div>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
              {extra.guidelines.slice(0, 4).map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700/60 pt-4 break-inside-avoid page-break-inside-avoid">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Coffee className="h-3.5 w-3.5" />
              Generated by REAORI · ref {booking.code.toLowerCase()}
            </p>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{format(total)} all-in estimate</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}