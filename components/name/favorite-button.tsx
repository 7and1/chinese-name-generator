"use client";

import { useState, useEffect } from "react";
import { Heart, HeartOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isFavorite, toggleFavorite } from "@/lib/storage/favorites";
import type { GeneratedName } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  name: GeneratedName;
  variant?: "ghost" | "outline" | "default";
  size?: "icon" | "sm" | "default";
  showLabel?: boolean;
  className?: string;
  onToggle?: (isFavorited: boolean) => void;
}

export function FavoriteButton({
  name,
  variant = "ghost",
  size = "icon",
  showLabel = false,
  className,
  onToggle,
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(name.fullName));
  }, [name.fullName]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const newState = toggleFavorite(name);
    setFavorited(newState);
    onToggle?.(newState);
  };

  const Icon = favorited ? Heart : HeartOff;

  if (size === "icon") {
    return (
      <Button
        variant={variant}
        size="icon"
        className={cn(
          "transition-colors",
          favorited &&
            "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950",
          className,
        )}
        onClick={handleToggle}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Icon className="h-4 w-4" fill={favorited ? "currentColor" : "none"} />
      </Button>
    );
  }

  return (
    <Button
      variant={favorited ? "default" : variant}
      size={size === "sm" ? "sm" : "default"}
      className={cn(
        "transition-colors",
        favorited && "bg-red-500 hover:bg-red-600 text-white",
        className,
      )}
      onClick={handleToggle}
    >
      <Icon
        className="h-4 w-4 mr-2"
        fill={favorited ? "currentColor" : "none"}
      />
      {showLabel && (favorited ? "Favorited" : "Favorite")}
    </Button>
  );
}
