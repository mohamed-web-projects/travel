import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Alkatra } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { CurrencyLanguageBar } from "@/components/layout/CurrencyLanguageBar";
import { EmergencyDrawer } from "@/components/layout/EmergencyDrawer";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const alkatra = Alkatra({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alkatra",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reaori.example.com"),
  title: {
    default: "REAORI — Travel & Tourism",
    template: "%s · REAORI",
  },
  description:
    "Curated international tours, luxury escapes and adventure packages. Explore the world in a new way with REAORI.",
  keywords: [
    "travel",
    "tourism",
    "tours",
    "destinations",
    "luxury travel",
    "package holidays",
    "REAORI",
  ],
  openGraph: {
    title: "REAORI — Travel & Tourism",
    description:
      "Curated international tours, luxury escapes and adventure packages.",
    images: ["/images/section2-1.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

const THEME_INIT = `
try{var t=localStorage.getItem("reaori.theme");
var d=t==="light"?false:(t==="dark"||true);
document.documentElement.classList.toggle("dark",d);
document.documentElement.style.colorScheme=d?"dark":"light"}catch(e){}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${alkatra.variable} dark`}>
      <head>
        <Script id="reaori-theme-init" strategy="beforeInteractive">
          {THEME_INIT}
        </Script>
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
          <BackToTop />
          <CurrencyLanguageBar />
          <EmergencyDrawer />
        </Providers>
      </body>
    </html>
  );
}