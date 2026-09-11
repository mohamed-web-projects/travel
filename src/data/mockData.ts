import type { AccommodationTier } from "@/data/travelData";

/* ------------------------------------------------------------------ */
/* Currencies & languages                                              */
/* ------------------------------------------------------------------ */

export type CurrencyCode = "USD" | "EUR" | "EGP";

export interface Currency {
  code: CurrencyCode;
  label: string;
  symbol: string;
  rate: number;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: "USD", label: "USD · $", symbol: "$", rate: 1 },
  EUR: { code: "EUR", label: "EUR · €", symbol: "€", rate: 0.92 },
  EGP: { code: "EGP", label: "EGP · E£", symbol: "E£", rate: 48.6 },
};

export interface Language {
  code: "en" | "ar";
  label: string;
  native: string;
}

export const LANGUAGES: Language[] = [
  { code: "en", label: "English", native: "English" },
  { code: "ar", label: "Arabic", native: "العربية" },
];

export const UI_STRINGS = {
  en: {
    bookNow: "Book Now",
    siteTagline: "Travel in a new way",
    signIn: "Sign in",
    signOut: "Sign out",
    myBookings: "My bookings",
    dashboard: "Dashboard",
    tours: "Tours",
    gallery: "Gallery",
    contact: "Contact",
    planner: "AI Planner",
    map: "Map",
    wishlist: "Wishlist",
  },
  ar: {
    bookNow: "احجز الآن",
    siteTagline: "سافر بطريقة جديدة",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    myBookings: "حجوزاتي",
    dashboard: "لوحة التحكم",
    tours: "الجولات",
    gallery: "المعرض",
    contact: "اتصل بنا",
    planner: "المخطط الذكي",
    map: "الخريطة",
    wishlist: "المفضلة",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Destination extra data (weather, guidelines, attractions, map)       */
/* ------------------------------------------------------------------ */

export interface Attraction {
  name: string;
  kind: string;
  rating: number;
  distance: string;
  image: string;
}

export interface DayWeather {
  day: string;
  tempC: number;
  condition: "sun" | "cloud" | "rain" | "storm";
}

export interface DestinationExtra {
  slug: string;
  climate: string;
  bestTime: { from: string; to: string; note: string };
  weather: {
    tempC: number;
    condition: DayWeather["condition"];
    hi: number;
    lo: number;
    humidity: number;
    wind: number;
    forecast: DayWeather[];
  };
  guidelines: string[];
  attractions: Attraction[];
  localCurrency: string;
  localCurrencyNote: string;
  visa: { type: string; note: string; embassy: string };
  emergency: { police: string; ambulance: string; hospital: string };
  map: { x: number; y: number; price: number };
}

const F = {
  sun: "sun",
  cloud: "cloud",
  rain: "rain",
  storm: "storm",
} as const;

export const DESTINATION_EXTRA: Record<string, DestinationExtra> = {
  china: {
    slug: "china",
    climate: "Humid subtropical with sharp seasonal shifts",
    bestTime: {
      from: "Mar",
      to: "May",
      note: "Cool air, cherry blossoms and clear sky before summer heat.",
    },
    weather: {
      tempC: 22,
      condition: F.cloud,
      hi: 25,
      lo: 14,
      humidity: 62,
      wind: 11,
      forecast: [
        { day: "Mon", tempC: 22, condition: F.cloud },
        { day: "Tue", tempC: 24, condition: F.sun },
        { day: "Wed", tempC: 23, condition: F.rain },
        { day: "Thu", tempC: 21, condition: F.cloud },
      ],
    },
    guidelines: [
      "Carry a paper copy of your passport and visa at all times.",
      "Download WeChat + Alipay — cash is rarely used in cities.",
      "English signage is limited outside major hubs; use a translator.",
      "Water boil notice applies in several rural provinces.",
    ],
    attractions: [
      { name: "Great Wall · Mutianyu", kind: "Landmark", rating: 4.9, distance: "70 km from center", image: "/images/section1-5.jpg" },
      { name: "Temple of Heaven", kind: "UNESCO", rating: 4.8, distance: "3 km from center", image: "/images/gallery-1.jpg" },
      { name: "Hutongs Food Walk", kind: "Culinary", rating: 4.7, distance: "Downtown", image: "/images/section1-4.jpg" },
    ],
    localCurrency: "CNY",
    localCurrencyNote: "¥1 ≈ $0.14 — we accept multi-currency at checkout.",
    visa: { type: "Tourist visa required", note: "30-day single-entry is typical for most passports.", embassy: "Chinese Embassy, Cairo: +20 2 3338 4570" },
    emergency: { police: "110", ambulance: "120", hospital: "Beijing Friendship Hospital" },
    map: { x: 80, y: 43, price: 1490 },
  },
  paris: {
    slug: "paris",
    climate: "Oceanic — mild winters, warm spells in summer",
    bestTime: { from: "Apr", to: "Jun", note: "Long daylight, café terraces open, and gardens peak." },
    weather: {
      tempC: 18,
      condition: F.sun,
      hi: 21,
      lo: 11,
      humidity: 70,
      wind: 15,
      forecast: [
        { day: "Mon", tempC: 19, condition: F.sun },
        { day: "Tue", tempC: 21, condition: F.sun },
        { day: "Wed", tempC: 17, condition: F.rain },
        { day: "Thu", tempC: 18, condition: F.cloud },
      ],
    },
    guidelines: [
      "Louvre / Orsay advance tickets are mandatory in high season.",
      "Metro strikes occur sporadically — check RATP alerts daily.",
      "Restaurants: dinner is 7–11pm; lunch service stops at 2pm.",
      "Vigipirate: bag checks at most monuments and malls.",
    ],
    attractions: [
      { name: "Eiffel Tower Summit", kind: "Landmark", rating: 4.7, distance: "Center", image: "/images/section1-2.jpg" },
      { name: "Louvre · Mona Lisa", kind: "Museum", rating: 4.8, distance: "1.5 km from center", image: "/images/gallery-1.jpg" },
      { name: "Seine Dinner Cruise", kind: "Boat", rating: 4.6, distance: "Pont Neuf", image: "/images/section2-1.jpg" },
    ],
    localCurrency: "EUR",
    localCurrencyNote: "€1 ≈ $1.09 — cards dominate, cash for tips only.",
    visa: { type: "Schengen visa", note: "Apply 45 days ahead; we draft the hotel voucher for you.", embassy: "French Embassy, Cairo: +20 2 3567 3300" },
    emergency: { police: "17", ambulance: "15", hospital: "Hôpital Pitié-Salpêtrière" },
    map: { x: 47, y: 36, price: 1790 },
  },
  emirates: {
    slug: "emirates",
    climate: "Desert — scorching summers, pleasant winter nights",
    bestTime: { from: "Nov", to: "Mar", note: "Comfortable 24–30°C days and clear desert skies." },
    weather: {
      tempC: 31,
      condition: F.sun,
      hi: 35,
      lo: 24,
      humidity: 45,
      wind: 9,
      forecast: [
        { day: "Mon", tempC: 31, condition: F.sun },
        { day: "Tue", tempC: 33, condition: F.sun },
        { day: "Wed", tempC: 32, condition: F.sun },
        { day: "Thu", tempC: 30, condition: F.sun },
      ],
    },
    guidelines: [
      "Dress conservatively in public areas; resort dress is fine at pools.",
      "Alcohol is served in licensed venues — never in public.",
      "Download the DubaiNow app for permits and parking.",
      "Ramadan: refrain from eating/drinking in public during daylight.",
    ],
    attractions: [
      { name: "Burj Khalifa · 124F", kind: "Landmark", rating: 4.9, distance: "Downtown", image: "/images/section1-3.jpg" },
      { name: "Desert Safari + BBQ", kind: "Adventure", rating: 4.8, distance: "45 min drive", image: "/images/section1-6.jpg" },
      { name: "Abra Ride · Creek", kind: "Culture", rating: 4.6, distance: "Old Dubai", image: "/images/section1-4.jpg" },
    ],
    localCurrency: "AED",
    localCurrencyNote: "د.إ1 ≈ $0.27 — most places accept cards or Apple Pay.",
    visa: { type: "Visa on arrival", note: "Most nationalities get a free 30-day entry stamp.", embassy: "UAE Consulate, Cairo: +20 2 2574 9000" },
    emergency: { police: "999", ambulance: "998", hospital: "Rashid Hospital" },
    map: { x: 62, y: 43, price: 1650 },
  },
  barcelona: {
    slug: "barcelona",
    climate: "Mediterranean — mild all year, humid summer nights",
    bestTime: { from: "May", to: "Oct", note: "Beach weather with fewer crowds before August." },
    weather: {
      tempC: 24,
      condition: F.sun,
      hi: 27,
      lo: 18,
      humidity: 66,
      wind: 13,
      forecast: [
        { day: "Mon", tempC: 25, condition: F.sun },
        { day: "Tue", tempC: 24, condition: F.sun },
        { day: "Wed", tempC: 23, condition: F.cloud },
        { day: "Thu", tempC: 22, condition: F.rain },
      ],
    },
    guidelines: [
      "Sagrada Família: reserve the tower slot when booking.",
      "Pickpockets target La Rambla — keep bags forward.",
      "Catalan is co-official; a simple 'Gràcies' wins smiles.",
      "Beach day passes and umbrellas are pricey — buy ahead.",
    ],
    attractions: [
      { name: "Sagrada Família", kind: "UNESCO", rating: 4.9, distance: "2 km from center", image: "/images/section1-4.jpg" },
      { name: "Park Güell", kind: "Gaudi", rating: 4.7, distance: "4 km from center", image: "/images/gallery-1.jpg" },
      { name: "Barceloneta Beach", kind: "Beach", rating: 4.5, distance: "1.5 km", image: "/images/section1-6.jpg" },
    ],
    localCurrency: "EUR",
    localCurrencyNote: "€1 ≈ $1.09 — contactless is universal.",
    visa: { type: "Schengen visa", note: "ETA/visa depends on nationality; we handle the paperwork.", embassy: "Spanish Consulate, Cairo: +20 2 2735 6550" },
    emergency: { police: "112", ambulance: "061", hospital: "Hospital Clínic" },
    map: { x: 46, y: 38, price: 1290 },
  },
  germany: {
    slug: "germany",
    climate: "Temperate — crisp winters, mild summers",
    bestTime: { from: "May", to: "Sep", note: "Alpine trails and beer gardens at their best." },
    weather: {
      tempC: 17,
      condition: F.cloud,
      hi: 20,
      lo: 9,
      humidity: 74,
      wind: 14,
      forecast: [
        { day: "Mon", tempC: 18, condition: F.cloud },
        { day: "Tue", tempC: 17, condition: F.rain },
        { day: "Wed", tempC: 19, condition: F.cloud },
        { day: "Thu", tempC: 21, condition: F.sun },
      ],
    },
    guidelines: [
      "Cash is still required in many small shops and cafés.",
      "Sunday: most stores closed; plan museums instead.",
      "Tap water is potable everywhere.",
      "Bicycle lanes — step on the red strip, expect ringing bells.",
    ],
    attractions: [
      { name: "Neuschwanstein Castle", kind: "UNESCO", rating: 4.8, distance: "110 km from Munich", image: "/images/section1-5.jpg" },
      { name: "Brandenburg Gate", kind: "Landmark", rating: 4.7, distance: "Berlin center", image: "/images/section1-1.jpg" },
      { name: "Black Forest Hike", kind: "Nature", rating: 4.6, distance: "300 km SW", image: "/images/gallery-1.jpg" },
    ],
    localCurrency: "EUR",
    localCurrencyNote: "€1 ≈ $1.09 — ATMs are the best value.",
    visa: { type: "Schengen visa", note: "Include travel insurance — mandatory for the visa file.", embassy: "German Embassy, Cairo: +20 2 2748 2000" },
    emergency: { police: "110", ambulance: "112", hospital: "Charité, Berlin" },
    map: { x: 51, y: 33, price: 1390 },
  },
  qatar: {
    slug: "qatar",
    climate: "Desert subtropical — hot, little rain",
    bestTime: { from: "Nov", to: "Feb", note: "Mild evenings, perfect for the Corniche and dhow trips." },
    weather: {
      tempC: 28,
      condition: F.sun,
      hi: 32,
      lo: 21,
      humidity: 52,
      wind: 17,
      forecast: [
        { day: "Mon", tempC: 29, condition: F.sun },
        { day: "Tue", tempC: 30, condition: F.sun },
        { day: "Wed", tempC: 28, condition: F.sun },
        { day: "Thu", tempC: 27, condition: F.cloud },
      ],
    },
    guidelines: [
      "Modest dress off-resort; shoulders/knees covered in souqs.",
      "Use the Karwa app for taxis; metro is clean and free in tourism zones.",
      "Friday-Friday Prayer: shops reopen after 12:30.",
      "Alcohol only in hotels and licensed venues.",
    ],
    attractions: [
      { name: "Museum of Islamic Art", kind: "Museum", rating: 4.8, distance: "Corniche", image: "/images/section1-3.jpg" },
      { name: "Katara Cultural Village", kind: "Culture", rating: 4.6, distance: "12 km north", image: "/images/section1-6.jpg" },
      { name: "Inland Sea Dune Bashing", kind: "Adventure", rating: 4.9, distance: "80 km south", image: "/images/section1-5.jpg" },
    ],
    localCurrency: "QAR",
    localCurrencyNote: "ر.ق1 ≈ $0.27 — Doha Metro accepts contactless.",
    visa: { type: "Visa on arrival (Hiya)", note: "Free 30-day for 95+ nationalities; apply on Hiya app.", embassy: "Qatari Embassy, Cairo: +20 2 2749 1500" },
    emergency: { police: "999", ambulance: "999", hospital: "Hamad General Hospital" },
    map: { x: 60, y: 45, price: 1590 },
  },
  japan: {
    slug: "japan",
    climate: "Four distinct seasons — humid summer, crisp winter",
    bestTime: { from: "Mar", to: "Apr", note: "Sakura season; also stunning maple in November." },
    weather: {
      tempC: 15,
      condition: F.cloud,
      hi: 18,
      lo: 8,
      humidity: 58,
      wind: 10,
      forecast: [
        { day: "Mon", tempC: 16, condition: F.cloud },
        { day: "Tue", tempC: 15, condition: F.rain },
        { day: "Wed", tempC: 17, condition: F.sun },
        { day: "Thu", tempC: 19, condition: F.sun },
      ],
    },
    guidelines: [
      "JR Pass pays off only for multi-city routes — we size it for you.",
      "Capsule/sento etiquette: tattoo cover-ups are required at onsen.",
      "Silent phone rule on trains; no calls underground.",
      "Trash bins are rare — carry a small bag.",
    ],
    attractions: [
      { name: "Mount Fuji · 5th Station", kind: "Nature", rating: 4.8, distance: "100 km from Tokyo", image: "/images/gallery-1.jpg" },
      { name: "Senso-ji Temple", kind: "UNESCO", rating: 4.7, distance: "Asakusa", image: "/images/section1-1.jpg" },
      { name: "Robot + Gundam District", kind: "Tech", rating: 4.5, distance: "Yokohama", image: "/images/section1-6.jpg" },
    ],
    localCurrency: "JPY",
    localCurrencyNote: "¥1 ≈ $0.0067 — IC cards work on metros + convenience stores.",
    visa: { type: "Tourist visa", note: "e-Visa for many passports; we email the prep checklist.", embassy: "Japanese Embassy, Cairo: +20 2 2666 1200" },
    emergency: { police: "110", ambulance: "119", hospital: "St. Luke's Intl, Tokyo" },
    map: { x: 84, y: 50, price: 2150 },
  },
  russia: {
    slug: "russia",
    climate: "Continental — cold winters, short bright summers",
    bestTime: { from: "May", to: "Sep", note: "White nights in St. Petersburg and mild lake trips." },
    weather: {
      tempC: 14,
      condition: F.cloud,
      hi: 17,
      lo: 8,
      humidity: 70,
      wind: 12,
      forecast: [
        { day: "Mon", tempC: 15, condition: F.cloud },
        { day: "Tue", tempC: 12, condition: F.rain },
        { day: "Wed", tempC: 14, condition: F.cloud },
        { day: "Thu", tempC: 16, condition: F.sun },
      ],
    },
    guidelines: [
      "Visa invitation letter is included in every REAORI booking.",
      "Metro art: each station is a mini-museum — allow photo time.",
      "Download offline maps; roaming is limited for some carriers.",
      "Hermitage: pre-booked entrance lane saves 60+ minutes.",
    ],
    attractions: [
      { name: "Red Square & Kremlin", kind: "Landmark", rating: 4.9, distance: "Moscow center", image: "/images/section1-1.jpg" },
      { name: "Hermitage Museum", kind: "Museum", rating: 4.8, distance: "St. Petersburg", image: "/images/gallery-1.jpg" },
      { name: "Lake Baikal Ice Walk", kind: "Nature", rating: 4.9, distance: "60 km from Irkutsk", image: "/images/section1-5.jpg" },
    ],
    localCurrency: "RUB",
    localCurrencyNote: "₽1 ≈ $0.011 — Mir cards issued locally at partners.",
    visa: { type: "e-Visa", note: "We file, you approve — usually released in 4 business days.", embassy: "Russian Embassy, Cairo: +20 2 3748 9320" },
    emergency: { police: "102", ambulance: "103", hospital: "Sklifosovsky, Moscow" },
    map: { x: 62, y: 22, price: 1450 },
  },
  malaysia: {
    slug: "malaysia",
    climate: "Tropical — warm all year, short showers",
    bestTime: { from: "Dec", to: "Mar", note: "Drier west coast; Langkawi at its calmest." },
    weather: {
      tempC: 29,
      condition: F.rain,
      hi: 32,
      lo: 24,
      humidity: 82,
      wind: 8,
      forecast: [
        { day: "Mon", tempC: 29, condition: F.rain },
        { day: "Tue", tempC: 30, condition: F.cloud },
        { day: "Wed", tempC: 31, condition: F.sun },
        { day: "Thu", tempC: 29, condition: F.storm },
      ],
    },
    guidelines: [
      "Batu Caves: cover shoulders; mind the monkeys at your bag.",
      "Grab is the cheapest way around KL — never street hails.",
      "Halal dining is standard; pork-free venues marked.",
      "Rain season: pack a compact umbrella — showers pass fast.",
    ],
    attractions: [
      { name: "Petronas Twin Towers", kind: "Landmark", rating: 4.8, distance: "KL center", image: "/images/section1-3.jpg" },
      { name: "Batu Caves", kind: "Culture", rating: 4.6, distance: "15 km north", image: "/images/section1-1.jpg" },
      { name: "Langkawi Cable Car", kind: "Nature", rating: 4.7, distance: "Flight + island", image: "/images/section1-6.jpg" },
    ],
    localCurrency: "MYR",
    localCurrencyNote: "RM1 ≈ $0.21 — touts at Petronas overcharge; use Grab.",
    visa: { type: "Visa-free / eNTRI", note: "30-day free entry for most listed nationalities.", embassy: "Malaysian Embassy, Cairo: +20 2 2736 2195" },
    emergency: { police: "999", ambulance: "999", hospital: "Tawakal Hospital, KL" },
    map: { x: 77, y: 55, price: 1190 },
  },
};

/* ------------------------------------------------------------------ */
/* Reviews                                                              */
/* ------------------------------------------------------------------ */

export interface Review {
  id: string;
  slug: string;
  name: string;
  country: string;
  avatar: string;
  avatarBg: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  verified: boolean;
}

interface ReviewRow {
  name: string;
  country: string;
  rating: number;
  title: string;
  text: string;
  verified?: boolean;
}

const AVATAR_BGS = ["#7d7dfe", "#3b82f6", "#22c55e", "#eab308", "#ec4899", "#14b8a6"];

function buildReviews(slug: string, rows: ReviewRow[]): Review[] {
  return rows.map((row, i) => {
    const initials = row.name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return {
      id: `${slug}-${i}`,
      slug,
      name: row.name,
      country: row.country,
      avatar: initials,
      avatarBg: AVATAR_BGS[i % AVATAR_BGS.length],
      rating: row.rating,
      date: ["May 2026", "Mar 2026", "Jan 2026", "Nov 2025"][i % 4],
      title: row.title,
      text: row.text,
      verified: row.verified ?? i % 3 !== 0,
    };
  });
}

export const REVIEWS: Record<string, Review[]> = {
  paris: buildReviews("paris", [
    { name: "Sara Elbanna", country: "Egypt", rating: 5, title: "Worth every cent", text: "Our advisor booked Louvre slots and a Seine dinner — zero queues the whole trip. Flawless." },
    { name: "Marco Tessari", country: "Italy", rating: 5, title: "Top-tier organizers", text: "Even the strike days were handled: rerouted metro plan arrived in our app by 7am." },
    { name: "Lina Petrova", country: "Russia", rating: 4, title: "Great but tight day 3", text: "Versailles ran overtime. Otherwise hotels and transfers were excellent." },
    { name: "Omar Khaled", country: "UAE", rating: 5, title: "Perfect honeymoon", text: "Glassmorphism aside, the real magic was the Eiffel dinner on the exact sunset slot." },
  ]),
  emirates: buildReviews("emirates", [
    { name: "Youssef Amr", country: "Egypt", rating: 5, title: "Desert safari highlight", text: "The Artra-arranged dune bashing + BBQ evening was the best 8 hours of our year." },
    { name: "Nina Kovac", country: "Croatia", rating: 4, title: "Gorgeous but hot June", text: "Thanks to the weather widget we packed smart. Citadines suite was brilliant." },
    { name: "Ali Hassan", country: "Saudi", rating: 5, title: "Careful with family", text: "They handled visa-on-arrival stamps for all six of us — door to door." },
  ]),
  japan: buildReviews("japan", [
    { name: "Kenji Aoki", country: "Japan", rating: 5, title: "JR pass advice saved ¥40k", text: "Their rail sizing apology: we didn't overpay. Shinkansen day trips were seamless." },
    { name: "Emma Wilson", country: "UK", rating: 5, title: "Sakura-season perfection", text: "Onsen etiquette notes avoided disasters — and the itinerary was charted to the minute." },
    { name: "Nour Fathy", country: "Egypt", rating: 4, title: "Magical, dense itinerary", text: "Day 5 could use a free slot, but every paid activity was genuinely five-star." },
  ]),
  barcelona: buildReviews("barcelona", [
    { name: "Diego Moreno", country: "Spain", rating: 5, title: "Tapas tour = must", text: "The verified local guide took us to six bars locals actually use. Book it." },
    { name: "Hana Suzuki", country: "Japan", rating: 4, title: "Brilliant city break", text: "Sagrada tower slot was pre-reserved; only downside — the heat on day 2." },
  ]),
  qatar: buildReviews("qatar", [
    { name: "Faisal Mahmoud", country: "Egypt", rating: 5, title: "Metro magic", text: "Free tourist metro zones made it cheaper than any taxi app. Family loved Katara." },
    { name: "Sofia Lindqvist", country: "Sweden", rating: 5, title: "Underrated gem", text: "Inland Sea dune bashing beats any safari we've done. Hotel was top-drawer." },
  ]),
  germany: buildReviews("germany", [
    { name: "Lukas Brandt", country: "Germany", rating: 5, title: "Alps done right", text: "Neuschwanstein morning slot meant we skipped the 2-hour queue at lunch." },
    { name: "Aya Mostafa", country: "Egypt", rating: 4, title: "Beautiful, busy", text: "Sunday closures caught us once — the app warned us for the rest of the week." },
  ]),
  china: buildReviews("china", [
    { name: "Wei Chen", country: "China", rating: 5, title: "Local-knowledge payoff", text: "WeChat pay set up in the pre-trip kit. We don't remember touching cash." },
    { name: "Fatma Soliman", country: "Egypt", rating: 4, title: "Great wall marathon", text: "Mutianyu cable slot was perfect. A little rushed on day 3." },
  ]),
  russia: buildReviews("russia", [
    { name: "Dmitry Orlov", country: "Russia", rating: 5, title: "Hermitage lane saver", text: "Pre-booked entrance meant 60 minutes saved. White nights were unreal." },
    { name: "Layla Farouk", country: "Egypt", rating: 4, title: "Cold but brilliant", text: "Packing list was accurate to the degree. Metro stations: bring extra camera battery." },
  ]),
  malaysia: buildReviews("malaysia", [
    { name: "Aisha Rahman", country: "Malaysia", rating: 5, title: "Langkawi wow", text: "Cable car at sunset + Grab rides everywhere = effortless island few days." },
    { name: "Carlos Mendes", country: "Brazil", rating: 4, title: "Great value", text: "KLCC view suite was unreal for the price. Short monsoons passed quickly." },
  ]),
};

export function getBreakdown(slug: string) {
  const reviews = REVIEWS[slug] ?? [];
  const buckets = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const average =
    reviews.reduce((acc, r) => acc + r.rating, 0) / Math.max(reviews.length, 1);
  return { buckets, total: reviews.length, average };
}

/* ------------------------------------------------------------------ */
/* Booking / checkout mock data                                        */
/* ------------------------------------------------------------------ */

export interface AddOn {
  id: string;
  label: string;
  description: string;
  price: number;
  per: "group" | "person";
  icon: "transfer" | "tour" | "photo" | "sim";
}

export const ADDONS: AddOn[] = [
  { id: "transfer", label: "Private airport transfer", description: "Door-to-door on arrival & departure.", price: 45, per: "group", icon: "transfer" },
  { id: "tour", label: "Private guided day", description: "Exclusive guide for any chosen day.", price: 90, per: "person", icon: "tour" },
  { id: "photo", label: "Pro photo session", description: "2-hour shoot at iconic spots.", price: 60, per: "group", icon: "photo" },
  { id: "sim", label: "Travel eSIM (unlimited)", description: "20GB data, instant activation.", price: 25, per: "person", icon: "sim" },
];

export interface InsurancePlan {
  id: string;
  label: string;
  price: number;
  benefits: string[];
}

export const INSURANCE_PLANS: InsurancePlan[] = [
  { id: "none", label: "No insurance", price: 0, benefits: [] },
  { id: "basic", label: "Basic Care", price: 39, benefits: ["Medical up to $50k", "Trip delay cover"] },
  { id: "premium", label: "Premium Shield", price: 89, benefits: ["Medical up to $500k", "Cancel for any reason", "Adventure sports cover"] },
];

export const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit card", icon: "card" as const },
  { id: "wallet", label: "Digital wallet", icon: "wallet" as const },
  { id: "bank", label: "Local bank transfer", icon: "bank" as const },
];

export interface BookingEntry {
  id: string;
  slug: string;
  code: string;
  date: string;
  travelers: { adults: number; children: number };
  tier: AccommodationTier;
  addOns: string[];
  insurance: string;
  status: "upcoming" | "past";
  total: number;
  bookedOn: string;
}

export const USER_PROFILE = {
  name: "Mohamed Wahib",
  email: "mwhyb133@gmail.com",
  phone: "+20 100 123 4567",
  country: "Egypt",
  plan: "REAORI Gold",
  memberSince: "2024",
  initials: "MW",
};

export const BOOKINGS: BookingEntry[] = [
  {
    id: "bk-01",
    slug: "japan",
    code: "REA-JP-2411",
    date: "Apr 14, 2026",
    travelers: { adults: 2, children: 0 },
    tier: "comfort",
    addOns: ["transfer", "tour"],
    insurance: "premium",
    status: "upcoming",
    total: 4620,
    bookedOn: "Jan 22, 2026",
  },
  {
    id: "bk-02",
    slug: "paris",
    code: "REA-FR-2502",
    date: "Jun 02, 2026",
    travelers: { adults: 2, children: 1 },
    tier: "luxury",
    addOns: ["transfer", "photo"],
    insurance: "basic",
    status: "upcoming",
    total: 2710,
    bookedOn: "Feb 10, 2026",
  },
  {
    id: "bk-03",
    slug: "emirates",
    code: "REA-AE-2389",
    date: "Nov 18, 2025",
    travelers: { adults: 3, children: 2 },
    tier: "budget",
    addOns: ["transfer"],
    insurance: "none",
    status: "past",
    total: 3840,
    bookedOn: "Aug 03, 2025",
  },
  {
    id: "bk-04",
    slug: "barcelona",
    code: "REA-ES-2301",
    date: "May 09, 2025",
    travelers: { adults: 2, children: 0 },
    tier: "comfort",
    addOns: [],
    insurance: "basic",
    status: "past",
    total: 1890,
    bookedOn: "Mar 15, 2025",
  },
];

export const EMERGENCY = {
  international: "112",
  helpLine: "+20 100 500 5050",
  police: "999",
  ambulance: "998",
  visaNote:
    "Visa rules shift fast. We track 120+ passport types and email you the moment anything changes.",
  tips: [
    { title: "Cash vs card", body: "Carry 20% cash for street food, tips and remote ATMs; cards everywhere else." },
    { title: "Hidden fees", body: "Always choose 'convert in local currency' — the home-currency rate is 3–6% worse." },
    { title: "SIM first", body: "Activate an eSIM at the airport gate so maps work before you leave the terminal." },
  ],
  embassies: [
    { country: "Egypt", contact: "Main HQ · +20 100 500 5050 · 24/7 traveler hotline" },
    { country: "Emergency Line", contact: "International SOS partner · English & Arabic" },
  ],
};

/* ------------------------------------------------------------------ */
/* AI Planner presets                                                  */
/* ------------------------------------------------------------------ */

export const PLANNER_BUDGETS = [
  { id: "smart", label: "Smart & cozy", min: 900, max: 1400, blurb: "Comfort stays, essentials with light add-ons." },
  { id: "balanced", label: "Balanced", min: 1401, max: 2200, blurb: "4-star comfort, 1–2 signature experiences." },
  { id: "luxe", label: "Luxe", min: 2201, max: 9999, blurb: "Best-in-class hotels, private guides, zero worries." },
] as const;

export type PlannerBudget = (typeof PLANNER_BUDGETS)[number]["id"];

export const PLANNER_STYLES = [
  { id: "solo", label: "Solo Explorer", emoji: "🧳", desc: "Me-time, photography light, hostel→4* mix." },
  { id: "family", label: "Family & Kids", emoji: "👨‍👩‍👧‍👦", desc: "Pacing with kid-friendly stops and buffer hours." },
  { id: "adventure", label: "Adventure", emoji: "⛰️", desc: "Hikes, dune jumps, active mornings every day." },
  { id: "romance", label: "Romance", emoji: "💑", desc: "Sunset slots, quiet corners, dinner reservations." },
] as const;

export type PlannerStyle = (typeof PLANNER_STYLES)[number]["id"];

interface PlannerActivity {
  morning: string;
  afternoon: string;
  evening: string;
}

const STYLE_POOLS: Record<PlannerStyle, PlannerActivity[]> = {
  solo: [
    { morning: "Golden-hour photo walk", afternoon: "Independent museum pass", evening: "Rooftop sunset with a 35mm film roll" },
    { morning: "Coffee-shop crawl + sketch", afternoon: "Hidden-garden reading break", evening: "Late-night food alley" },
  ],
  family: [
    { morning: "Hands-on science museum", afternoon: "Park + play lunch", evening: "Family-friendly dinner show" },
    { morning: "Aquarium / zoo morning", afternoon: "Ice cream + market bingo", evening: "Movie under the stars" },
  ],
  adventure: [
    { morning: "Dawn hike / dune jump", afternoon: "Kayak or canyon run", evening: "Recovery stretch + local grill" },
    { morning: "Cycle the rim trail", afternoon: "Canyoning / cable luge", evening: "Stargazing campfire" },
  ],
  romance: [
    { morning: "Breakfast at the viewpoint", afternoon: "Couples spa block", evening: "Candlelit dinner by the water" },
    { morning: "Old-town stroll, no map", afternoon: "Wine / tea terrace", evening: "Private sunset cruise" },
  ],
};

export interface PlannedDay {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  meals: number;
}

export interface PlanResult {
  title: string;
  styleLabel: string;
  budgetLabel: string;
  days: PlannedDay[];
  estPerPerson: number;
}

export function generateItinerary(
  style: PlannerStyle,
  dayCount: number,
  budget: PlannerBudget
): PlanResult {
  const pool = STYLE_POOLS[style];
  const budgetMeta = PLANNER_BUDGETS.find((b) => b.id === budget)!;
  const styleMeta = PLANNER_STYLES.find((s) => s.id === style)!;
  const dayRate = budget === "luxe" ? 310 : style === "adventure" ? 260 : 220;

  const days = Array.from({ length: dayCount }, (_, i) => {
    const act = pool[i % pool.length];
    return {
      day: i + 1,
      title:
        i === 0
          ? "Arrival & first taste"
          : i === dayCount - 1
            ? "Slow morning & send-off"
            : `Day ${i + 1} · local rhythm`,
      morning: act.morning,
      afternoon: act.afternoon,
      evening: act.evening,
      meals: i === dayCount - 1 ? 1 : 3,
    } satisfies PlannedDay;
  });

  const mid = Math.floor(dayCount / 2);
  days[mid] = {
    ...days[mid],
    title: "Signature experience",
    morning: "GUIDED: once-in-a-lifetime landmark with local storyteller",
    afternoon: "Hands-on workshop (ceramics / cooking / drones)",
    evening: days[mid].evening,
  };

  return {
    title: `${styleMeta.label} · ${dayCount} days`,
    styleLabel: styleMeta.label,
    budgetLabel: budgetMeta.label,
    days,
    estPerPerson: Math.round(dayCount * dayRate * (budget === "luxe" ? 1.5 : 1)),
  };
}

/* ------------------------------------------------------------------ */
/* Map pins                                                            */
/* ------------------------------------------------------------------ */

export const MAP_PINS = Object.entries(DESTINATION_EXTRA).map(([slug, extra]) => ({
  slug,
  name: slug === "paris" ? "Paris" : slug.charAt(0).toUpperCase() + slug.slice(1),
  x: extra.map.x,
  y: extra.map.y,
  price: extra.map.price,
}));

export const MAP_THEME = {
  ocean: "#0b1020",
  land: "#121a2e",
  grid: "rgba(255,255,255,0.04)",
};