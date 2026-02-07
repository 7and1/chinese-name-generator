/**
 * localStorage management for favorite names
 */

import type {
  FavoriteName,
  FavoritesStorage,
  FavoritesExport,
  ExportFormat,
} from "@/lib/types/favorites";
import type { GeneratedName } from "@/lib/types";

export type { ExportFormat };

const STORAGE_KEY = "chinese-name-favorites";
const STORAGE_VERSION = "1.0";

/**
 * Get all favorites from localStorage
 */
export function getFavorites(): FavoriteName[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const data: FavoritesStorage = JSON.parse(stored);
    return data.favorites || [];
  } catch (error) {
    console.error("Failed to get favorites:", error);
    return [];
  }
}

/**
 * Save favorites to localStorage
 */
function saveFavorites(favorites: FavoriteName[]): void {
  if (typeof window === "undefined") return;

  try {
    const data: FavoritesStorage = {
      favorites,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save favorites:", error);
  }
}

/**
 * Add a name to favorites
 */
export function addFavorite(name: GeneratedName): FavoriteName {
  const favorites = getFavorites();
  const favorite: FavoriteName = {
    ...name,
    id: `${name.fullName}-${Date.now()}`,
    favoritedAt: new Date().toISOString(),
  };

  favorites.unshift(favorite);
  saveFavorites(favorites);

  return favorite;
}

/**
 * Remove a name from favorites by ID
 */
export function removeFavorite(id: string): void {
  const favorites = getFavorites();
  const filtered = favorites.filter((f) => f.id !== id);
  saveFavorites(filtered);
}

/**
 * Remove a name from favorites by fullName
 */
export function removeFavoriteByName(fullName: string): void {
  const favorites = getFavorites();
  const filtered = favorites.filter((f) => f.fullName !== fullName);
  saveFavorites(filtered);
}

/**
 * Check if a name is already favorited
 */
export function isFavorite(fullName: string): boolean {
  const favorites = getFavorites();
  return favorites.some((f) => f.fullName === fullName);
}

/**
 * Toggle favorite status
 */
export function toggleFavorite(name: GeneratedName): boolean {
  if (isFavorite(name.fullName)) {
    removeFavoriteByName(name.fullName);
    return false;
  } else {
    addFavorite(name);
    return true;
  }
}

/**
 * Clear all favorites
 */
export function clearFavorites(): void {
  saveFavorites([]);
}

/**
 * Get count of favorites
 */
export function getFavoritesCount(): number {
  return getFavorites().length;
}

/**
 * Export favorites to various formats
 */
export function exportFavorites(format: ExportFormat = "json"): string {
  const favorites = getFavorites();

  const exportData: FavoritesExport = {
    names: favorites,
    exportDate: new Date().toISOString(),
    version: STORAGE_VERSION,
  };

  switch (format) {
    case "json":
      return JSON.stringify(exportData, null, 2);

    case "csv":
      const headers = [
        "Name",
        "Pinyin",
        "Score",
        "Rating",
        "Explanation",
        "FavoritedAt",
      ];
      const rows = favorites.map((f) => [
        f.fullName,
        f.pinyin,
        f.score.overall,
        f.score.rating,
        `"${f.explanation.replace(/"/g, '""')}"`,
        f.favoritedAt,
      ]);
      return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    case "txt":
      return favorites
        .map(
          (f) =>
            `${f.fullName} (${f.pinyin})\n评分: ${f.score.overall} (${f.score.rating})\n解释: ${f.explanation}\n收藏时间: ${f.favoritedAt}\n${"-".repeat(40)}`,
        )
        .join("\n");

    default:
      return JSON.stringify(exportData, null, 2);
  }
}

/**
 * Download favorites as a file
 */
export function downloadFavorites(format: ExportFormat = "json"): void {
  const content = exportFavorites(format);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `chinese-names-favorites-${new Date().toISOString().split("T")[0]}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import favorites from JSON
 */
export function importFavorites(jsonString: string): {
  success: boolean;
  imported: number;
  error?: string;
} {
  try {
    const data: FavoritesExport = JSON.parse(jsonString);
    const existingFavorites = getFavorites();
    const existingNames = new Set(existingFavorites.map((f) => f.fullName));

    const newFavorites = data.names.filter(
      (n) => !existingNames.has(n.fullName),
    );
    const mergedFavorites = [...newFavorites, ...existingFavorites];

    saveFavorites(mergedFavorites);

    return {
      success: true,
      imported: newFavorites.length,
    };
  } catch (error) {
    return {
      success: false,
      imported: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
