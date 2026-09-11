export type DestinationCategory =
  | "city"
  | "beach"
  | "cruise"
  | "adventure"
  | "cultural"
  | "luxury";

export type AccommodationTier = "budget" | "comfort" | "luxury";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  categories: DestinationCategory[];
  image: string;
  gallery: string[];
  tagline: string;
  description: string;
  rating: number;
  reviewCount: number;
  durationDays: number;
  price: number;
  oldPrice: number;
  includes: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  availableSpots: number;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  trip: string;
  text: string;
  initials: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface GalleryImage {
  src: string;
  title: string;
  width: number;
  height: number;
}

export const CATEGORY_LABELS: Record<DestinationCategory, string> = {
  city: "City Break",
  beach: "Beach & Islands",
  cruise: "Cruise",
  adventure: "Adventure",
  cultural: "Cultural",
  luxury: "Luxury",
};

export const CATEGORY_OPTIONS: DestinationCategory[] = [
  "city",
  "beach",
  "cruise",
  "adventure",
  "cultural",
  "luxury",
];

export const PRICE_RANGES = [
  { id: "all", label: "Any price", min: 0, max: Infinity },
  { id: "budget", label: "Under $1,500", min: 0, max: 1499 },
  { id: "mid", label: "$1,500 – $3,000", min: 1500, max: 3000 },
  { id: "premium", label: "$3,000 – $5,000", min: 3001, max: 5000 },
  { id: "lux", label: "$5,000+", min: 5001, max: Infinity },
];

export const DESTINATIONS: Destination[] = [
  {
    slug: "china",
    name: "China",
    country: "Beijing · Xi'an · Shanghai",
    categories: ["cultural", "city"],
    image: "/images/section1-1.jpg",
    gallery: [
      "/images/section1-1.jpg",
      "/images/gallery-1.jpg",
      "/images/section2-1.jpg",
      "/images/gallery-2.jpg",
    ],
    tagline: "Ancient walls meet modern skylines",
    description:
      "Walk the Great Wall at sunrise, wander the Forbidden City, and taste your way through buzzing night markets on a fully guided cultural odyssey.",
    rating: 4.9,
    reviewCount: 1120,
    durationDays: 8,
    price: 2490,
    oldPrice: 2990,
    includes: ["Flights", "4★ Hotels", "Daily breakfast", "Guided tours", "Airport transfers"],
    highlights: ["Great Wall", "Forbidden City", "Terracotta Army", "Bund Skyline"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Beijing",
        description: "Private transfer to your hotel. Welcome dinner with Peking duck tasting.",
      },
      {
        day: 2,
        title: "Great Wall of China",
        description: "Full-day hike at Mutianyu with cable car access and a picnic lunch on the wall.",
      },
      {
        day: 3,
        title: "Forbidden City & Tiananmen",
        description: "Guided morning tour of the imperial palace, then the serene Temple of Heaven.",
      },
      {
        day: 4,
        title: "High-speed rail to Xi'an",
        description: "Overnight connection north; afternoon free for the Muslim Quarter bazaar.",
      },
      {
        day: 5,
        title: "Terracotta Army",
        description: "Explore the legendary warriors' pits with an expert archaeologist guide.",
      },
      {
        day: 6,
        title: "Shanghai skyline",
        description: "Fly east, then sunset cruise along the Bund and a tower-top dinner.",
      },
      {
        day: 7,
        title: "Yu Garden & Old Town",
        description: "Classic gardens, silk market shopping, and a farewell dumpling feast.",
      },
      {
        day: 8,
        title: "Departure",
        description: "Airport transfer and return flight home.",
      },
    ],
    availableSpots: 14,
  },
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    categories: ["city", "luxury"],
    image: "/images/section1-2.jpg",
    gallery: [
      "/images/section1-2.jpg",
      "/images/gallery-2.jpg",
      "/images/gallery-3.jpg",
      "/images/section2-2.jpg",
    ],
    tagline: "The city of light, love & fine art",
    description:
      "Skip-the-line museum passes, Seine river cruises, and a private Montmartre food tour in the world's most romantic capital.",
    rating: 4.8,
    reviewCount: 2480,
    durationDays: 5,
    price: 1790,
    oldPrice: 2100,
    includes: ["Flights", "4★ boutique hotel", "Breakfast", "Eiffel Tower access", "Museum passes"],
    highlights: ["Eiffel Tower", "Louvre", "Seine Cruise", "Montmartre"],
    itinerary: [
      { day: 1, title: "Arrival & Rive Gauche", description: "Check in near the Seine, then a sunset walk by Notre-Dame." },
      { day: 2, title: "Louvre & Tuileries", description: "Skip-the-line Mona Lisa visit and fragrant Tuileries gardens." },
      { day: 3, title: "Eiffel Tower & Cruise", description: "Summit climb at golden hour, Seine dinner cruise at dusk." },
      { day: 4, title: "Versailles", description: "Hall of Mirrors, royal gardens, and a marble fountains tour." },
      { day: 5, title: "Departure", description: "Leisurely breakfast, transfers, onward flight." },
    ],
    availableSpots: 9,
  },
  {
    slug: "emirates",
    name: "Emirates",
    country: "Dubai · Abu Dhabi",
    categories: ["luxury", "city"],
    image: "/images/section1-3.jpg",
    gallery: [
      "/images/section1-3.jpg",
      "/images/section2-1.jpg",
      "/images/gallery-1.jpg",
      "/images/img-08.jpg",
    ],
    tagline: "Desert gold beneath glass towers",
    description:
      "Stay in a palm-side resort, ride through red dunes on safari, and take in the Burj Khalifa from the 124th floor.",
    rating: 4.9,
    reviewCount: 1932,
    durationDays: 6,
    price: 3150,
    oldPrice: 3690,
    includes: ["Flights", "5★ resort", "All-day breakfast", "Desert safari", "Burj Khalifa tickets"],
    highlights: ["Burj Khalifa", "Desert Safari", "Palm Jumeirah", "Grand Mosque"],
    itinerary: [
      { day: 1, title: "Arrival in Dubai", description: "Resort check-in on the Palm, sunset at the beach club." },
      { day: 2, title: "Burj Khalifa & Fountain", description: "At the Top observation deck, then the Dubai Mall fountain show." },
      { day: 3, title: "Red Dune Safari", description: "4x4 dune bashing, camel rides, and a BBQ under the stars." },
      { day: 4, title: "Abu Dhabi Day Trip", description: "Sheikh Zayed Grand Mosque and the Louvre Abu Dhabi." },
      { day: 5, title: "Old Dubai & Souks", description: "Abra ride across the creek and spice souk shopping." },
      { day: 6, title: "Departure", description: "Free morning, private airport transfer." },
    ],
    availableSpots: 11,
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    country: "Spain",
    categories: ["city", "beach"],
    image: "/images/section1-4.jpg",
    gallery: [
      "/images/section1-4.jpg",
      "/images/gallery-3.jpg",
      "/images/section2-2.jpg",
      "/images/gallery-2.jpg",
    ],
    tagline: "Gaudí's dream on the Mediterranean",
    description:
      "Sagrada Família by day, tapas bars by night, and golden beaches at dusk — the perfect Catalan escape.",
    rating: 4.8,
    reviewCount: 1745,
    durationDays: 7,
    price: 1980,
    oldPrice: 2300,
    includes: ["Flights", "Design hotel", "Breakfast", "Sagrada Família pass", "Wine tasting"],
    highlights: ["Sagrada Família", "Park Güell", "Gothic Quarter", "Barceloneta Beach"],
    itinerary: [
      { day: 1, title: "Arrival", description: "Gothic Quarter stroll and late-night tapas at La Boqueria." },
      { day: 2, title: "Sagrada Família", description: "Morning masterwork tour, afternoon at Park Güell." },
      { day: 3, title: "Montjuïc & Cable Car", description: "Castle views, Olympic terraces, and the MNAC museum." },
      { day: 4, title: "Costa Brava Day Trip", description: "Coves, clifftops, fresh seafood at Cadaqués." },
      { day: 5, title: "Barceloneta", description: "Beach day, paddleboard hire, sunset paella." },
      { day: 6, title: "El Born & Wine", description: "Designer boutiques, then cellar tasting in Penedès." },
      { day: 7, title: "Departure", description: "Free morning and airport drop-off." },
    ],
    availableSpots: 18,
  },
  {
    slug: "germany",
    name: "Germany",
    country: "Munich · Berlin · Neuschwanstein",
    categories: ["cultural", "city"],
    image: "/images/section1-5.jpg",
    gallery: [
      "/images/section1-5.jpg",
      "/images/gallery-2.jpg",
      "/images/section1-2.jpg",
      "/images/gallery-3.jpg",
    ],
    tagline: "Castles, culture & celebrated engineers",
    description:
      "Tour Neuschwanstein fairy-tale castle, drink in historic beer halls, and trace the Cold War at the Berlin Wall.",
    rating: 4.7,
    reviewCount: 986,
    durationDays: 8,
    price: 2340,
    oldPrice: 2690,
    includes: ["Flights", "3-4★ hotels", "Breakfast", "Train passes", "Castle tickets"],
    highlights: ["Neuschwanstein", "Berlin Wall", "Marienplatz", "Black Forest"],
    itinerary: [
      { day: 1, title: "Munich arrival", description: "Marienplatz glockenspiel and an evening beer-hall dinner." },
      { day: 2, title: "Neuschwanstein", description: "Fairy-tale castle tour and the Hohenschwangau valley." },
      { day: 3, title: "Southern Bavaria", description: "Linderhof palace and an alpine lake picnic." },
      { day: 4, title: "ICE to Berlin", description: "High-speed rail across Germany, evening skyline walk." },
      { day: 5, title: "Berlin Wall & History", description: "East Side Gallery, checkpoint museums, and Reichstag dome." },
      { day: 6, title: "Potsdam Day Trip", description: "Sanssouci palace and Dutch Quarter charm." },
      { day: 7, title: "Kulturbrauerei", description: "East Berlin food tour, currywurst and craft beer." },
      { day: 8, title: "Departure", description: "Transfers home." },
    ],
    availableSpots: 21,
  },
  {
    slug: "qatar",
    name: "Qatar",
    country: "Doha · Katara",
    categories: ["luxury", "cultural"],
    image: "/images/section1-6.jpg",
    gallery: [
      "/images/section1-6.jpg",
      "/images/gallery-1.jpg",
      "/images/section2-1.jpg",
      "/images/img-08.jpg",
    ],
    tagline: "Where tradition meets tomorrow",
    description:
      "Pearl diving heritage, skyline sand dunes, futuristic museums, and market nights in one seamless Arabian journey.",
    rating: 4.8,
    reviewCount: 764,
    durationDays: 5,
    price: 2110,
    oldPrice: 2450,
    includes: ["Flights", "5★ hotel", "Breakfast", "City tours", "Banking culture experience"],
    highlights: ["Souq Waqif", "Museum of Islamic Art", "Katara", "Inland Sea"],
    itinerary: [
      { day: 1, title: "Arrival in Doha", description: "Downtown skyline welcome and corniche promenade walk." },
      { day: 2, title: "Souq Waqif", description: "Spice markets, falconry, and Bedouin courtyard dinner." },
      { day: 3, title: "Museums & Katara", description: "Museum of Islamic Art then Katara Cultural Village." },
      { day: 4, title: "Inland Sea Desert", description: "Dune safari to the breathtaking Khor Al Adaid." },
      { day: 5, title: "Departure", description: "Leisurely breakfast and transfer home." },
    ],
    availableSpots: 8,
  },
  {
    slug: "japan",
    name: "Japan",
    country: "Tokyo · Kyoto · Osaka",
    categories: ["cultural", "city", "adventure"],
    image: "/images/section1-3.jpg",
    gallery: [
      "/images/section1-3.jpg",
      "/images/section1-2.jpg",
      "/images/gallery-3.jpg",
      "/images/section1-1.jpg",
    ],
    tagline: "Neon nights & thousand-year temples",
    description:
      "Bullet trains between three icons — Tokyo's energy, Kyoto's tranquility, and Osaka's street-food soul.",
    rating: 4.9,
    reviewCount: 3021,
    durationDays: 9,
    price: 3890,
    oldPrice: 4490,
    includes: ["Flights", "Ryokan stay", "Bullet train pass", "Temple tours", "Tea ceremony"],
    highlights: ["Bullet Train", "Fushimi Inari", "Shinjuku", "Osaka street food"],
    itinerary: [
      { day: 1, title: "Tokyo arrival", description: "Shinjuku neon and a first izakaya dinner." },
      { day: 2, title: "Shibuya & Harajuku", description: "Scramble crossing, Meiji Shrine, and canalside ramen." },
      { day: 3, title: "Mt Fuji day trip", description: "Hakone cruise and onsen with volcano views." },
      { day: 4, title: "Bullet train to Kyoto", description: "A fluid ride then Gion lanterns in old geisha lanes." },
      { day: 5, title: "Fushimi Inari", description: "Ten thousand torii gates at dawn, then Kiyomizu temple." },
      { day: 6, title: "Arashiyama bamboo", description: "Bamboo grove, monkey park, and riverside picnic." },
      { day: 7, title: "Nara day trip", description: "Bow to sacred deer and towering Great Buddha." },
      { day: 8, title: "Osaka", description: "Dotonbori gyoza, takoyaki, and rooftop skyline drinks." },
      { day: 9, title: "Departure", description: "Kansai airport transfer and flight home." },
    ],
    availableSpots: 6,
  },
  {
    slug: "russia",
    name: "Russia",
    country: "Moscow · St. Petersburg",
    categories: ["cultural", "city"],
    image: "/images/section1-4.jpg",
    gallery: [
      "/images/section1-4.jpg",
      "/images/gallery-1.jpg",
      "/images/section1-5.jpg",
      "/images/gallery-2.jpg",
    ],
    tagline: "Cathedrals, ballet & imperial gold",
    description:
      "Red Square at Christmas lights, the Hermitage's endless halls, and an evening at the Mariinsky ballet.",
    rating: 4.7,
    reviewCount: 612,
    durationDays: 7,
    price: 2280,
    oldPrice: 2600,
    includes: ["Flights", "4★ hotels", "Breakfast", "Underground tour", "Ballet tickets"],
    highlights: ["Red Square", "St Basil's", "Hermitage", "Mariinsky"],
    itinerary: [
      { day: 1, title: "Moscow arrival", description: "Hotel near Red Square, first view of St Basil's at dusk." },
      { day: 2, title: "Kremlin & Armoury", description: "Imperial treasures, cathedrals, and the riverfront." },
      { day: 3, title: "Metro art tour", description: "Palace-like stations and the Stalinist skyscrapers." },
      { day: 4, title: "Overnight train to St Petersburg", description: "A sleek Sapsan ride into imperial Russia." },
      { day: 5, title: "Hermitage", description: "The world's largest art collection, endless galleries." },
      { day: 6, title: "Peterhof & Ballet", description: "Fountain palaces by day, Mariinsky ballet by night." },
      { day: 7, title: "Departure", description: "Canal cruise, transfers, and flight home." },
    ],
    availableSpots: 12,
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    country: "Kuala Lumpur · Langkawi",
    categories: ["beach", "adventure"],
    image: "/images/section1-2.jpg",
    gallery: [
      "/images/section1-2.jpg",
      "/images/section2-2.jpg",
      "/images/gallery-3.jpg",
      "/images/section1-6.jpg",
    ],
    tagline: "Island motorbikes & mangrove jungles",
    description:
      "Petronas views in KL, then island-hopping Langkawi's mangroves, cable cars, and white-sand coves.",
    rating: 4.8,
    reviewCount: 1345,
    durationDays: 8,
    price: 1690,
    oldPrice: 1990,
    includes: ["Flights", "Resort stay", "Breakfast", "Island boat tours", "Cable car"],
    highlights: ["Petronas Towers", "Langkawi Sky Bridge", "Mangrove Safari", "Pantai Cenang"],
    itinerary: [
      { day: 1, title: "KL arrival", description: "Petronas Towers at night and durian desserts." },
      { day: 2, title: "Batu Caves & Old Town", description: "Giant golden statues, hip cafés, and street art." },
      { day: 3, title: "Fly to Langkawi", description: "Jungle-fringed island, sunset beach dinner." },
      { day: 4, title: "Mangrove Safari", description: "Eagles, durian farms, and hidden limestone caves." },
      { day: 5, title: "Sky Bridge & Cable Car", description: "Ride the canopy bridge at 700m above sea." },
      { day: 6, title: "Island hopping", description: "Snorkel clear coves and picnic on Crocodile Island." },
      { day: 7, title: "Free beach day", description: "Kayaking, spa, and street night markets." },
      { day: 8, title: "Departure", description: "Langkawi to home via KL." },
    ],
    availableSpots: 23,
  },
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { src: "/images/gallery-1.jpg", title: "Temple Gardens", width: 1280, height: 1920 },
  { src: "/images/section1-3.jpg", title: "Arabesque Skylines", width: 640, height: 959 },
  { src: "/images/section1-6.jpg", title: "Evening Light", width: 640, height: 854 },
  { src: "/images/section1-1.jpg", title: "Mountain Gate", width: 640, height: 960 },
  { src: "/images/section1-2.jpg", title: "Parisian Dawn", width: 640, height: 960 },
  { src: "/images/section1-5.jpg", title: "Alpine District", width: 640, height: 960 },
  { src: "/images/section1-4.jpg", title: "Mediterranean Coast", width: 569, height: 854 },
  { src: "/images/gallery-2.jpg", title: "Old Town Lane", width: 1279, height: 854 },
  { src: "/images/gallery-3.jpg", title: "Harbor Walk", width: 1276, height: 854 },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "London, UK",
    rating: 5,
    trip: "Japan Explorer",
    text: "The bullet-train itinerary was flawless. Our guide Kyoto even found us a hidden bamboo path the crowds missed. Worth every penny.",
    initials: "SM",
  },
  {
    id: 2,
    name: "Omar Farouk",
    location: "Cairo, EG",
    rating: 5,
    trip: "Emirates Luxury",
    text: "From desert safari to Burj Khalifa at golden hour — every moment felt film-worthy. Transfers were always on time and spotless.",
    initials: "OF",
  },
  {
    id: 3,
    name: "Amelia Chen",
    location: "Singapore, SG",
    rating: 4,
    trip: "Paris City Break",
    text: "Skip-the-line passes are a must and REAORI nailed it. The Seine cruise at dusk was the highlight of our honeymoon.",
    initials: "AC",
  },
  {
    id: 4,
    name: "Lucas Meyer",
    location: "Berlin, DE",
    rating: 5,
    trip: "China Panorama",
    text: "Riding the high-speed rail between three cities took all the stress out of planning. The Terracotta Army guide was fascinating.",
    initials: "LM",
  },
  {
    id: 5,
    name: "Yasmin El-Sayed",
    location: "Dubai, AE",
    rating: 5,
    trip: "Malaysia Escape",
    text: "Mangrove safari and island hopping with two kids — they arranged everything, and the kids talked about it for months.",
    initials: "YE",
  },
  {
    id: 6,
    name: "David Okafor",
    location: "Toronto, CA",
    rating: 4,
    trip: "Barcelona & Coast",
    text: "A perfect blend of Gaudí and beach days. The Costa Brava seafood lunch is still the best meal of my year.",
    initials: "DO",
  },
];

export const FAQS: FaqItem[] = [
  {
    id: 1,
    question: "How do flexible booking and refunds work?",
    answer:
      "Every package is covered by our 48-hour free-cancellation window before departure. After that, we offer travel credit or a full refund if we cancel the itinerary for operational reasons.",
  },
  {
    id: 2,
    question: "Are flights really included in the package price?",
    answer:
      "Yes. The price shown is per person including return international flights, airport transfers, and all ground transport between destinations on the itinerary.",
  },
  {
    id: 3,
    question: "Can I customize the itinerary or hotel tier?",
    answer:
      "Absolutely. Use the budget calculator to pick a comfort tier, add nights, or swap any day for a free day — our advisors will re-price your trip in real time.",
  },
  {
    id: 4,
    question: "What is included in guided tours?",
    answer:
      "English-speaking local guides, skip-the-line tickets, licensed transport, and most entry fees. What is not included: personal meals (except where noted) and optional gratuities.",
  },
  {
    id: 5,
    question: "Do you offer travel insurance?",
    answer:
      "We bundle a basic medical + baggage policy at checkout. We strongly recommend upgrading to full coverage, including trip cancellation, available as an add-on.",
  },
  {
    id: 6,
    question: "What happens if a destination changes its entry rules?",
    answer:
      "Our operations team monitors visa and entry requirements daily. We contact you at least 14 days before travel with any updates and assist with visa documentation.",
  },
];

export const ACCOMMODATION_TIERS: Record<
  AccommodationTier,
  { label: string; dailyBase: number; multiplier: number; description: string }
> = {
  budget: { label: "Budget", dailyBase: 40, multiplier: 0.8, description: "Clean 3★ stays, great value" },
  comfort: { label: "Comfort", dailyBase: 85, multiplier: 1, description: "4★ hotels with breakfast" },
  luxury: { label: "Luxury", dailyBase: 190, multiplier: 1.45, description: "5★ resorts & suites" },
};

export const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
  { id: "duration", label: "Duration" },
] as const;

export type SortId = (typeof SORT_OPTIONS)[number]["id"];

export type NavLink = {
  label: string;
  href: string;
  isPage: boolean;
  section?: string;
};

export const NAV_LINKS = [
  { label: "Home", href: "/", isPage: false, section: "hero" },
  { label: "Destinations", href: "/map", isPage: true },
  { label: "Tours", href: "/#tours", isPage: false, section: "tours" },
  { label: "Info", href: "/#info", isPage: false, section: "info" },
  { label: "Planner", href: "/planner", isPage: true },
  { label: "Gallery", href: "/gallery", isPage: true },
  { label: "Contact", href: "/#contact", isPage: false, section: "contact" },
] satisfies NavLink[];

export const CONTACT_INFO = {
  name: "Mohamed Wahib",
  email: "mwhyb133@gmail.com",
  address: "Kafr Elsheikh, Egypt",
  socials: [
    { label: "Facebook", href: "#" },
    { label: "Twitter", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "TikTok", href: "#" },
    { label: "Instagram", href: "#" },
  ],
};

export const HERO_IMAGES = [
  { src: "/images/landing.jpg", alt: "Tropical escape at golden hour" },
  { src: "/images/section2-1.jpg", alt: "Cruise ship on open water" },
  { src: "/images/section2.jpg", alt: "Coastal paradise" },
];