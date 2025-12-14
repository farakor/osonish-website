"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, index) => {
        const value = index + 1;
        const filled = value <= rating;
        const partiallyFilled = value > rating && value - 1 < rating;
        const fillPercentage = partiallyFilled
          ? ((rating - (value - 1)) * 100).toFixed(0)
          : filled
          ? "100"
          : "0";

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(value)}
            disabled={!interactive}
            className={cn(
              "relative",
              interactive &&
                "cursor-pointer hover:scale-110 transition-transform"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                "text-muted-foreground",
                filled && "fill-primary text-primary"
              )}
            />
            {partiallyFilled && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star
                  className={cn(sizeClasses[size], "fill-primary text-primary")}
                />
              </div>
            )}
          </button>
        );
      })}
      {showValue && (
        <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

