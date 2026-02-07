"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FiveElement, Gender } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface GenerateFormProps {
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  surname: string;
  onSurnameChange: (value: string) => void;
  gender: Gender;
  onGenderChange: (value: Gender) => void;
  birthDate: string;
  onBirthDateChange: (value: string) => void;
  birthHour: number | undefined;
  onBirthHourChange: (value: number | undefined) => void;
  characterCount: 1 | 2;
  onCharacterCountChange: (value: 1 | 2) => void;
  style: "classic" | "modern" | "poetic" | "elegant";
  onStyleChange: (value: "classic" | "modern" | "poetic" | "elegant") => void;
  source: "any" | "poetry" | "classics" | "idioms";
  onSourceChange: (value: "any" | "poetry" | "classics" | "idioms") => void;
  preferredElements: FiveElement[];
  onPreferredElementsChange: (value: FiveElement[]) => void;
  avoidElements: FiveElement[];
  onAvoidElementsChange: (value: FiveElement[]) => void;
  maxResults: number;
  onMaxResultsChange: (value: number) => void;
  loading?: boolean;
}

const fiveElements: FiveElement[] = ["金", "木", "水", "火", "土"];

const elementColors: Record<FiveElement, string> = {
  金: "bg-yellow-500 hover:bg-yellow-600 text-white",
  木: "bg-green-600 hover:bg-green-700 text-white",
  水: "bg-blue-500 hover:bg-blue-600 text-white",
  火: "bg-red-500 hover:bg-red-600 text-white",
  土: "bg-amber-600 hover:bg-amber-700 text-white",
};

export function GenerateForm({
  onSubmit,
  surname,
  onSurnameChange,
  gender,
  onGenderChange,
  birthDate,
  onBirthDateChange,
  birthHour,
  onBirthHourChange,
  characterCount,
  onCharacterCountChange,
  style,
  onStyleChange,
  source,
  onSourceChange,
  preferredElements,
  onPreferredElementsChange,
  avoidElements,
  onAvoidElementsChange,
  maxResults,
  onMaxResultsChange,
  loading = false,
}: GenerateFormProps) {
  const t = useTranslations();

  const toggleElement = (element: FiveElement, isPreferred: boolean) => {
    if (isPreferred) {
      const newList = preferredElements.includes(element)
        ? preferredElements.filter((e) => e !== element)
        : [...preferredElements, element];
      onPreferredElementsChange(newList);
    } else {
      const newList = avoidElements.includes(element)
        ? avoidElements.filter((e) => e !== element)
        : [...avoidElements, element];
      onAvoidElementsChange(newList);
    }
  };

  const genders: Gender[] = ["male", "female", "neutral"];
  const styles: Array<"classic" | "modern" | "poetic" | "elegant"> = [
    "classic",
    "modern",
    "poetic",
    "elegant",
  ];
  const sources: Array<"any" | "poetry" | "classics" | "idioms"> = [
    "any",
    "poetry",
    "classics",
    "idioms",
  ];

  const hasAdvancedOptions =
    birthDate ||
    birthHour !== undefined ||
    style !== "classic" ||
    source !== "any" ||
    preferredElements.length > 0 ||
    avoidElements.length > 0 ||
    maxResults !== 20;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t("generate.options")}
          </CardTitle>
          <CardDescription>{t("generate.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Required Fields */}
            <div className="space-y-5">
              {/* Surname */}
              <div className="space-y-2">
                <Label htmlFor="surname" className="text-sm font-medium">
                  {t("generate.form.surnameLabel")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="surname"
                  type="text"
                  value={surname}
                  onChange={(e) => onSurnameChange(e.target.value)}
                  placeholder={t("generate.form.surnamePlaceholder")}
                  maxLength={2}
                  required
                  disabled={loading}
                  className="h-11"
                />
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("generate.form.genderLabel")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  {genders.map((g) => (
                    <Button
                      key={g}
                      type="button"
                      variant={gender === g ? "default" : "outline"}
                      onClick={() => onGenderChange(g)}
                      className="flex-1 h-11"
                      disabled={loading}
                    >
                      {t(`common.${g}`)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Character Count */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("generate.characterCount")}
                </Label>
                <div className="flex gap-2">
                  {[1, 2].map((count) => (
                    <Button
                      key={count}
                      type="button"
                      variant={characterCount === count ? "default" : "outline"}
                      onClick={() => onCharacterCountChange(count as 1 | 2)}
                      className="flex-1 h-11"
                      disabled={loading}
                    >
                      {count === 1
                        ? t("generate.characterCounts.one")
                        : t("generate.characterCounts.two")}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Options Accordion */}
            <Accordion
              type="single"
              collapsible
              defaultValue={hasAdvancedOptions ? "advanced" : undefined}
              className="w-full"
            >
              <AccordionItem
                value="advanced"
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {t("generate.advancedOptions") || "Advanced Options"}
                    </span>
                    {hasAdvancedOptions && (
                      <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                        {
                          [
                            birthDate,
                            birthHour,
                            style !== "classic",
                            source !== "any",
                            preferredElements.length,
                            avoidElements.length,
                            maxResults !== 20,
                          ].filter(Boolean).length
                        }
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-4 space-y-5">
                  {/* Birth Date & Time */}
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                    <div className="space-y-2">
                      <Label
                        htmlFor="birthDate"
                        className="text-sm font-medium"
                      >
                        {t("generate.form.birthDateLabel")}
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={birthDate}
                        onChange={(e) => onBirthDateChange(e.target.value)}
                        disabled={loading}
                        className="h-10"
                      />
                    </div>

                    <AnimatePresence>
                      {birthDate && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <Label
                            htmlFor="birthHour"
                            className="text-sm font-medium"
                          >
                            {t("generate.form.birthHourLabel")}
                          </Label>
                          <select
                            id="birthHour"
                            value={birthHour ?? ""}
                            onChange={(e) =>
                              onBirthHourChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              )
                            }
                            className={cn(
                              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                              "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
                              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
                              "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            )}
                            disabled={loading}
                          >
                            <option value="">
                              {t("generate.form.birthHourUnknown")}
                            </option>
                            {Array.from({ length: 12 }, (_, i) => i * 2).map(
                              (hour) => (
                                <option key={hour} value={hour}>
                                  {t("generate.form.birthHourRange", {
                                    start: hour,
                                    end: hour + 2,
                                  })}
                                </option>
                              ),
                            )}
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <p className="text-xs text-muted-foreground">
                      {t("generate.form.birthDateHint")}
                    </p>
                  </div>

                  {/* Style */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {t("generate.style")}
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {styles.map((s) => (
                        <Button
                          key={s}
                          type="button"
                          variant={style === s ? "default" : "outline"}
                          onClick={() => onStyleChange(s)}
                          className="text-xs h-10"
                          disabled={loading}
                        >
                          {t(`generate.styles.${s}`)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Source */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      {t("generate.source")}
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {sources.map((s) => (
                        <Button
                          key={s}
                          type="button"
                          variant={source === s ? "default" : "outline"}
                          onClick={() => onSourceChange(s)}
                          className="text-xs h-10"
                          disabled={loading}
                        >
                          {t(`generate.sources.${s}`)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Five Elements */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        {t("generate.preferredElements")}
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {fiveElements.map((element) => (
                          <Button
                            key={element}
                            type="button"
                            size="sm"
                            variant={
                              preferredElements.includes(element)
                                ? "default"
                                : "outline"
                            }
                            onClick={() => toggleElement(element, true)}
                            disabled={loading}
                            className={cn(
                              "h-9 px-3",
                              preferredElements.includes(element) &&
                                elementColors[element],
                            )}
                          >
                            {element}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        {t("generate.avoidElements")}
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {fiveElements.map((element) => (
                          <Button
                            key={element}
                            type="button"
                            size="sm"
                            variant={
                              avoidElements.includes(element)
                                ? "destructive"
                                : "outline"
                            }
                            onClick={() => toggleElement(element, false)}
                            disabled={loading}
                            className="h-9 px-3"
                          >
                            {element}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Max Results */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        {t("generate.maxResults")}
                      </Label>
                      <span className="text-sm font-medium tabular-nums text-primary">
                        {maxResults}
                      </span>
                    </div>
                    <Slider
                      value={[maxResults]}
                      onValueChange={(value) => onMaxResultsChange(value[0])}
                      min={10}
                      max={50}
                      step={10}
                      disabled={loading}
                      className="w-full"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={loading || !surname}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("generate.generating")}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {t("generate.startGeneration")}
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
