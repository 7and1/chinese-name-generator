/**
 * Types for favorites functionality
 */

import type { GeneratedName } from "./index";

export interface FavoriteName extends GeneratedName {
  id: string;
  favoritedAt: string;
  notes?: string;
}

export interface FavoritesStorage {
  favorites: FavoriteName[];
  lastUpdated: string;
}

export interface FavoritesExport {
  names: FavoriteName[];
  exportDate: string;
  version: string;
}

export type ExportFormat = "json" | "csv" | "txt";
