"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NameScore, ChineseCharacter, BaZiChart } from "@/lib/types";
import { ResultsSkeleton } from "@/components/error/loading-skeletons";
import { LoadingSpinner } from "@/components/error/loading-skeletons";

interface AnalyzeResultsProps {
  result: {
    fullName: string;
    surname: string;
    givenName: string;
    pinyin: string;
    characters: ChineseCharacter[];
    score: NameScore;
    baziAnalysis: {
      dayMaster: string;
      elements: Record<string, number>;
      favorableElements: string[];
      unfavorableElements: string[];
      pillars: {
        year: { stem: string; branch: string };
        month: { stem: string; branch: string };
        day: { stem: string; branch: string };
        hour: { stem: string; branch: string };
      };
    } | null;
  } | null;
  loading?: boolean;
  error?: string | null;
}

export function AnalyzeResults({
  result,
  loading,
  error,
}: AnalyzeResultsProps) {
  const t = useTranslations("analyze.results");
  const common = useTranslations("common");

  if (loading) {
    return <ResultsSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <p className="font-semibold">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <LoadingSpinner text={t("enterName")} />
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-blue-600 dark:text-blue-400";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-green-100 dark:bg-green-900/30";
    if (score >= 80) return "bg-blue-100 dark:bg-blue-900/30";
    if (score >= 70) return "bg-yellow-100 dark:bg-yellow-900/30";
    return "bg-gray-100 dark:bg-gray-800/30";
  };

  const getElementVariant = (
    element: string,
  ): "metal" | "wood" | "water" | "fire" | "earth" => {
    const variants: Record<
      string,
      "metal" | "wood" | "water" | "fire" | "earth"
    > = {
      金: "metal",
      木: "wood",
      水: "water",
      火: "fire",
      土: "earth",
      Metal: "metal",
      Wood: "wood",
      Water: "water",
      Fire: "fire",
      Earth: "earth",
    };
    return variants[element] || "default";
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className={getScoreBgColor(result.score.overall)}>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mb-4">
              <h2 className="text-4xl font-bold mb-2">
                {result.fullName}
                <span className="text-xl font-normal text-muted-foreground ml-3">
                  {result.pinyin}
                </span>
              </h2>
            </div>
            <div
              className={`text-6xl font-bold mb-2 ${getScoreColor(result.score.overall)}`}
            >
              {result.score.overall}
            </div>
            <div className="text-xl text-muted-foreground">
              {result.score.rating}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Breakdown */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{t("baziScore")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-4xl font-bold text-center ${getScoreColor(result.score.baziScore)}`}
            >
              {result.score.baziScore}
            </div>
            {result.baziAnalysis && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                {t("favorableElements")}:{" "}
                {result.baziAnalysis.favorableElements.join("、")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">{t("wugeScore")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-4xl font-bold text-center ${getScoreColor(result.score.wugeScore)}`}
            >
              {result.score.wugeScore}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              {t("threeGrids")}: {result.score.breakdown.wuge.tianGe}/
              {result.score.breakdown.wuge.renGe}/
              {result.score.breakdown.wuge.diGe}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">{t("phoneticScore")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-4xl font-bold text-center ${getScoreColor(result.score.phoneticScore)}`}
            >
              {result.score.phoneticScore}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              {t("tonePattern")}:{" "}
              {result.score.breakdown.phonetics.tonePattern.join("-")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">{t("meaningScore")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-4xl font-bold text-center ${getScoreColor(result.score.meaningScore)}`}
            >
              {result.score.meaningScore}
            </div>
            <p className="text-sm text-muted-foreground text-center mt-2">
              {t("basedOnMeaning")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Character Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t("characterDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {result.characters.map((char, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="text-center mb-3">
                  <div className="text-5xl font-bold mb-1">{char.char}</div>
                  <div className="text-sm text-muted-foreground">
                    {char.pinyin}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("fiveElement")}:
                    </span>
                    <Badge
                      variant={getElementVariant(char.fiveElement)}
                      className="font-medium"
                    >
                      {char.fiveElement}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("radical")}:
                    </span>
                    <span>{char.radical}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("strokes")}:
                    </span>
                    <span>{char.strokeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("kangxiStrokes")}:
                    </span>
                    <span>{char.kangxiStrokeCount}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="text-muted-foreground mb-1">
                      {t("meaning")}:
                    </div>
                    <div>{char.meaning}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* BaZi Analysis */}
      {result.baziAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>{t("baziAnalysis")}</CardTitle>
            <CardDescription>{t("baziDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Four Pillars */}
            <div>
              <h4 className="font-semibold mb-3">{t("fourPillars")}</h4>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("yearPillar")}
                  </div>
                  <div className="text-xl font-bold">
                    {result.baziAnalysis.pillars.year.stem}
                    {result.baziAnalysis.pillars.year.branch}
                  </div>
                </div>
                <div className="text-center border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("monthPillar")}
                  </div>
                  <div className="text-xl font-bold">
                    {result.baziAnalysis.pillars.month.stem}
                    {result.baziAnalysis.pillars.month.branch}
                  </div>
                </div>
                <div className="text-center border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("dayPillar")}
                  </div>
                  <div className="text-xl font-bold">
                    {result.baziAnalysis.pillars.day.stem}
                    {result.baziAnalysis.pillars.day.branch}
                  </div>
                </div>
                <div className="text-center border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("hourPillar")}
                  </div>
                  <div className="text-xl font-bold">
                    {result.baziAnalysis.pillars.hour.stem}
                    {result.baziAnalysis.pillars.hour.branch}
                  </div>
                </div>
              </div>
            </div>

            {/* Day Master */}
            <div>
              <h4 className="font-semibold mb-2">{t("dayMaster")}</h4>
              <div className="text-2xl font-bold">
                {result.baziAnalysis.dayMaster}
              </div>
            </div>

            {/* Five Elements Balance */}
            <div>
              <h4 className="font-semibold mb-3">
                {t("fiveElementsDistribution")}
              </h4>
              <div className="space-y-2">
                {Object.entries(result.baziAnalysis.elements).map(
                  ([element, count]) => (
                    <div key={element} className="flex items-center gap-3">
                      <div className="w-12 text-sm font-medium">{element}</div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6">
                        <div
                          className="bg-primary h-6 rounded-full flex items-center justify-center text-xs text-white"
                          style={{ width: `${(count / 8) * 100}%` }}
                        >
                          {count > 0 && count}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Favorable/Unfavorable Elements */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">{t("favorableElements")}</h4>
                <div className="flex gap-2 flex-wrap">
                  {result.baziAnalysis.favorableElements.map((element) => (
                    <Badge key={element} variant={getElementVariant(element)}>
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  {t("unfavorableElements")}
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {result.baziAnalysis.unfavorableElements.map((element) => (
                    <Badge key={element} variant="destructive">
                      {element}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
