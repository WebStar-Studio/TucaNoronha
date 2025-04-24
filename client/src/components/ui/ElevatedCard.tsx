import { cn } from "@/lib/utils";
import { forwardRef, HTMLAttributes } from "react";

export interface ElevatedCardProps extends HTMLAttributes<HTMLDivElement> {}

export const ElevatedCard = forwardRef<HTMLDivElement, ElevatedCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "bg-white shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl rounded-xl",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

ElevatedCard.displayName = "ElevatedCard";
