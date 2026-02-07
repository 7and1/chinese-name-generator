"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnalyzeForm } from "@/components/analyze/analyze-form";
import { AnalyzeResults } from "@/components/analyze/analyze-results";
import type { ChineseCharacter, NameScore } from "@/lib/types";

interface AnalyzeResultsData {
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
}

export function AnalyzeFormWrapper() {
  const [result, setResult] = useState<AnalyzeResultsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    fullName: string;
    birthDate?: string;
    birthHour?: number;
  }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error(
          responseData.error?.message || "Failed to analyze name",
        );
      }

      setResult(responseData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnalyzeForm onSubmit={handleSubmit} loading={loading} />
      <AnalyzeResults result={result} loading={loading} error={error} />
    </>
  );
}

export function PageTitle() {
  const t = useTranslations("analyze");
  return t("title");
}

export function PageSubtitle() {
  const t = useTranslations("analyze");
  return t("subtitle");
}
