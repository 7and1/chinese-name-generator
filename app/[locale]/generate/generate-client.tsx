"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { GenerateForm } from "@/components/name/generate-form";
import { GenerateResults } from "@/components/name/generate-results";
import type { FiveElement, Gender, GeneratedName } from "@/lib/types";

export default function GenerateClient() {
  const t = useTranslations();
  const searchParams = useSearchParams();

  // Form state
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState<Gender>("neutral");
  const [birthDate, setBirthDate] = useState("");
  const [birthHour, setBirthHour] = useState<number | undefined>(undefined);
  const [characterCount, setCharacterCount] = useState<1 | 2>(2);
  const [style, setStyle] = useState<
    "classic" | "modern" | "poetic" | "elegant"
  >("classic");
  const [source, setSource] = useState<
    "any" | "poetry" | "classics" | "idioms"
  >("any");
  const [preferredElements, setPreferredElements] = useState<FiveElement[]>([]);
  const [avoidElements, setAvoidElements] = useState<FiveElement[]>([]);
  const [maxResults, setMaxResults] = useState(20);

  // Results state
  const [results, setResults] = useState<GeneratedName[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = searchParams.get("source");
    if (s === "poetry" || s === "classics" || s === "idioms" || s === "any") {
      setSource(s);
    }
    const st = searchParams.get("style");
    if (
      st === "classic" ||
      st === "modern" ||
      st === "poetic" ||
      st === "elegant"
    ) {
      setStyle(st);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const payload = {
        surname,
        gender,
        birthDate: birthDate || undefined,
        birthHour: birthHour,
        characterCount,
        style,
        source,
        preferredElements:
          preferredElements.length > 0 ? preferredElements : undefined,
        avoidElements: avoidElements.length > 0 ? avoidElements : undefined,
        maxResults,
      };

      const response = await fetch("/api/generate/name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Failed to generate names");
      }

      setResults(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t("generate.title")}
        </h1>
        <p className="text-muted-foreground">{t("generate.subtitle")}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <GenerateForm
            onSubmit={handleSubmit}
            surname={surname}
            onSurnameChange={setSurname}
            gender={gender}
            onGenderChange={setGender}
            birthDate={birthDate}
            onBirthDateChange={setBirthDate}
            birthHour={birthHour}
            onBirthHourChange={setBirthHour}
            characterCount={characterCount}
            onCharacterCountChange={setCharacterCount}
            style={style}
            onStyleChange={setStyle}
            source={source}
            onSourceChange={setSource}
            preferredElements={preferredElements}
            onPreferredElementsChange={setPreferredElements}
            avoidElements={avoidElements}
            onAvoidElementsChange={setAvoidElements}
            maxResults={maxResults}
            onMaxResultsChange={setMaxResults}
            loading={loading}
          />
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          <GenerateResults results={results} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
