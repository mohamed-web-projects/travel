import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  className?: string;
  size?: number;
  showValue?: boolean;
}

export function StarRating({ rating, className, size = 16, showValue = true }: StarRatingProps) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      <span className="relative inline-flex" style={{ width: size * 5 }}>
        <span className="absolute inset-0 flex" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} style={{ width: size, height: size }} className="text-gold/70" />
          ))}
        </span>
        <span
          className="absolute inset-0 flex overflow-hidden"
          style={{ width: pct }}
          aria-hidden
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              style={{ width: size, height: size }}
              className="shrink-0 fill-gold text-gold"
            />
          ))}
        </span>
      </span>
      {showValue && (
        <span className="text-sm font-bold text-foreground">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}