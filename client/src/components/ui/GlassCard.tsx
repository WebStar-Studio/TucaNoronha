import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "bg-white/70 backdrop-blur-md",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";
