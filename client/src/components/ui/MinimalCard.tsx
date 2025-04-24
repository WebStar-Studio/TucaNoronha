import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

export interface MinimalCardProps extends HTMLAttributes<HTMLDivElement> {}

export const MinimalCard = forwardRef<HTMLDivElement, MinimalCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "bg-white shadow-sm transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl rounded-xl",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

MinimalCard.displayName = "MinimalCard";
