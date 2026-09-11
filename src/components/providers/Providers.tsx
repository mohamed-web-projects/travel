"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/context/ThemeContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <SettingsProvider>
          <WishlistProvider>
            <AuthProvider>{children}</AuthProvider>
          </WishlistProvider>
        </SettingsProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}