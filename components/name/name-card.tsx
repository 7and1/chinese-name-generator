"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FavoriteButton } from "@/components/name/favorite-button";
import { ShareButton } from "@/components/name/share-button";
import { ScoreRadarChart } from "@/components/visualizations";
import type { GeneratedName } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NameCardProps {
  name: GeneratedName;
  index: number;
  showVisualization?: boolean;
}

export function NameCard({
  name,
  index,
  showVisualization = false,
}: NameCardProps) {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{ minHeight: isExpanded ? "auto" : "280px" }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/50 h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl md:text-3xl min-h-[2.5rem]">
                {name.fullName}
                <span className="text-sm md:text-base font-normal text-muted-foreground ml-2 md:ml-3 block sm:inline">
                  {name.pinyin}
                </span>
              </CardTitle>
              <CardDescription className="mt-2 text-sm md:text-base line-clamp-2 min-h-[2.5rem]">
                {name.explanation}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
              <div className="text-right min-w-[4rem]">
                <div
                  className={cn(
                    "text-2xl md:text-3xl font-bold tabular-nums",
                    getScoreColor(name.score.overall),
                  )}
                >
                  {name.score.overall}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {name.score.rating}
                </div>
              </div>
              <div className="flex gap-1">
                <FavoriteButton name={name} />
                <ShareButton name={name} />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
            <ScoreItem
              label={t("generate.scores.bazi")}
              value={name.score.baziScore}
            />
            <ScoreItem
              label={t("generate.scores.wuge")}
              value={name.score.wugeScore}
            />
            <ScoreItem
              label={t("generate.scores.phonetic")}
              value={name.score.phoneticScore}
            />
            <ScoreItem
              label={t("generate.scores.meaning")}
              value={name.score.meaningScore}
            />
          </div>

          {/* Expandable Details */}
          <div className="border-t pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between hover:bg-muted/50"
            >
              <span>{isExpanded ? "Hide details" : "Show details"}</span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 space-y-4 overflow-hidden"
              >
                {/* Radar Chart Visualization */}
                {showVisualization && (
                  <div className="rounded-lg border bg-muted/30 p-4 min-h-[200px]">
                    <h4 className="text-sm font-medium mb-4 text-center">
                      Score Breakdown
                    </h4>
                    <ScoreRadarChart score={name.score} />
                  </div>
                )}

                {/* Source Information */}
                {name.source && (
                  <div className="rounded-lg border p-3 md:p-4 text-sm text-muted-foreground">
                    {name.source.type === "poetry" &&
                    name.source.title &&
                    name.source.quote ? (
                      <div>
                        <span className="font-medium text-foreground">
                          {t("generate.source.poetrySource")}:
                        </span>{" "}
                        {name.source.title}
                        <blockquote className="mt-2 pl-4 border-l-2 border-primary italic">
                          &ldquo;{name.source.quote}&rdquo;
                        </blockquote>
                        {name.source.author && (
                          <p className="mt-1 text-xs">
                            by {name.source.author}
                          </p>
                        )}
                      </div>
                    ) : null}
                    {name.source.type === "idiom" && name.source.title ? (
                      <div>
                        <span className="font-medium text-foreground">
                          {t("generate.source.idiomSource")}:
                        </span>{" "}
                        {name.source.title}
                        {name.source.quote && (
                          <p className="mt-1">
                            &ldquo;{name.source.quote}&rdquo;
                          </p>
                        )}
                      </div>
                    ) : null}
                    {name.source.type === "classic" && name.source.title ? (
                      <div>
                        <span className="font-medium text-foreground">
                          Source:
                        </span>{" "}
                        {name.source.title}
                        {name.source.quote && (
                          <p className="mt-1">
                            &ldquo;{name.source.quote}&rdquo;
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}

                {/* Character Details */}
                <div className="rounded-lg border p-3 md:p-4">
                  <h4 className="text-sm font-medium mb-3">
                    Character Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {name.characters.map((char, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-md bg-muted/50 p-2 min-h-[4rem]"
                      >
                        <span className="text-2xl font-bold">{char.char}</span>
                        <div className="text-xs min-w-0 flex-1">
                          <p className="text-muted-foreground">{char.pinyin}</p>
                          <p className="font-medium truncate">{char.meaning}</p>
                          <p className="text-muted-foreground">
                            Element: {char.fiveElement} Strokes:{" "}
                            {char.kangxiStrokeCount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Source Quick View */}
          {!isExpanded && name.source && (
            <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground min-h-[2.5rem] flex items-center">
              {name.source.type === "poetry" && name.source.title && (
                <div className="truncate">
                  From{" "}
                  <span className="font-medium text-foreground">
                    {name.source.title}
                  </span>
                  {name.source.author && ` by ${name.source.author}`}
                </div>
              )}
              {name.source.type === "idiom" && name.source.title && (
                <div className="truncate">
                  From idiom{" "}
                  <span className="font-medium text-foreground">
                    {name.source.title}
                  </span>
                </div>
              )}
              {name.source.type === "classic" && name.source.title && (
                <div className="truncate">
                  From{" "}
                  <span className="font-medium text-foreground">
                    {name.source.title}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ScoreItemProps {
  label: string;
  value: number;
}

function ScoreItem({ label, value }: ScoreItemProps) {
  const getColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="rounded-lg bg-muted/30 p-2 md:p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("text-lg md:text-xl font-semibold", getColor(value))}>
        {value}
      </div>
    </div>
  );
}
