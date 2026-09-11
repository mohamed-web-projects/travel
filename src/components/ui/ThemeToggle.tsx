"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-xl border border-hairline text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground",
        className
      )}
    >
      <span className="relative h-5 w-5">
        <Sun
          className="absolute inset-0 h-5 w-5 transition-all duration-300"
          style={{
            transform: theme === "dark" ? "scale(1) rotate(0)" : "scale(0) rotate(-90deg)",
            opacity: theme === "dark" ? 1 : 0,
          }}
        />
        <Moon
          className="absolute inset-0 h-5 w-5 transition-all duration-300"
          style={{
            transform: theme === "light" ? "scale(1) rotate(0)" : "scale(0) rotate(90deg)",
            opacity: theme === "light" ? 1 : 0,
          }}
        />
      </span>
    </button>
  );
}