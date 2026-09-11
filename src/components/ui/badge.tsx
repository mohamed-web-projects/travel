import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "glass" | "gold";
}

const variantClasses = {
  default: "bg-primary/15 text-primary border border-primary/25",
  outline: "border border-hairline text-muted-foreground",
  glass: "bg-white/60 backdrop-blur-md border border-foreground/20 text-foreground dark:bg-black/40 dark:text-white",
  gold: "bg-gold/15 text-gold border border-gold/30",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}