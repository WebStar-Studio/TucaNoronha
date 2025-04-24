import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

export interface BorderedCardProps extends HTMLAttributes<HTMLDivElement> {}

export const BorderedCard = forwardRef<HTMLDivElement, BorderedCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "bg-white shadow-md border border-gray-100 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl rounded-xl",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

BorderedCard.displayName = "BorderedCard";
