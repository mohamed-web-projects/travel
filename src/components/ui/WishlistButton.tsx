"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  slug: string;
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({ slug, className, size = "md" }: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const saved = has(slug);

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      className={cn(
        "grid place-items-center rounded-full border backdrop-blur-md transition-colors duration-300",
        size === "sm" ? "h-9 w-9" : "h-10 w-10",
        saved
          ? "border-rose-500/50 bg-rose-500/20 text-rose-400"
          : "border-foreground/20 bg-black/40 text-white hover:bg-black/70 hover:text-rose-300",
        className
      )}
    >
      <Heart
        className={size === "sm" ? "h-4 w-4" : "h-5 w-5"}
        fill={saved ? "currentColor" : "none"}
      />
    </motion.button>
  );
}