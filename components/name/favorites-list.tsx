"use client";

import { useState, useEffect } from "react";
import { Download, Trash2, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "./favorite-button";
import {
  getFavorites,
  clearFavorites,
  downloadFavorites,
} from "@/lib/storage/favorites";
import type { FavoriteName, ExportFormat } from "@/lib/types/favorites";

interface FavoritesListProps {
  className?: string;
}

export function FavoritesList({ className }: FavoritesListProps) {
  const [favorites, setFavorites] = useState<FavoriteName[]>([]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("json");

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    setFavorites(getFavorites());
  };

  const handleExport = (format: ExportFormat) => {
    downloadFavorites(format);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all favorites?")) {
      clearFavorites();
      setFavorites([]);
    }
  };

  const handleFavoriteToggle = () => {
    loadFavorites();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  if (favorites.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Favorites</CardTitle>
          <CardDescription>
            Your favorite names will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No favorites yet</p>
            <p className="text-sm mt-2">
              Generate names and click the heart icon to save your favorites
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Favorites</CardTitle>
              <CardDescription>{favorites.length} names saved</CardDescription>
            </div>
            <div className="flex gap-2">
              <select
                value={exportFormat}
                onChange={(e) =>
                  setExportFormat(e.target.value as ExportFormat)
                }
                className="px-3 py-2 border rounded-md bg-background text-sm"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="txt">TXT</option>
              </select>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport(exportFormat)}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" variant="destructive" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {favorites.map((name) => (
              <Card key={name.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        {name.fullName}
                        <span className="text-sm font-normal text-muted-foreground ml-3">
                          {name.pinyin}
                        </span>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {name.explanation}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div
                          className={`text-2xl font-bold ${getScoreColor(name.score.overall)}`}
                        >
                          {name.score.overall}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {name.score.rating}
                        </div>
                      </div>
                      <FavoriteButton
                        name={name}
                        variant="ghost"
                        size="icon"
                        onToggle={handleFavoriteToggle}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                    <div>
                      <div className="text-muted-foreground">BaZi</div>
                      <div className="font-semibold">
                        {name.score.baziScore}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Wuge</div>
                      <div className="font-semibold">
                        {name.score.wugeScore}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Phonetic</div>
                      <div className="font-semibold">
                        {name.score.phoneticScore}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Meaning</div>
                      <div className="font-semibold">
                        {name.score.meaningScore}
                      </div>
                    </div>
                  </div>
                  {name.source && (
                    <div className="mt-3 rounded-lg border p-2 text-xs text-muted-foreground">
                      {name.source.type === "poetry" && name.source.title && (
                        <span>
                          Poetry Source:{" "}
                          <span className="font-medium">
                            {name.source.title}
                          </span>
                          {name.source.quote && ` · ${name.source.quote}`}
                        </span>
                      )}
                      {name.source.type === "idiom" && name.source.title && (
                        <span>
                          Idiom Source:{" "}
                          <span className="font-medium">
                            {name.source.title}
                          </span>
                          {name.source.quote && ` · ${name.source.quote}`}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
