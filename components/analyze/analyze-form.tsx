"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";

const analyzeFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(4, "Name must be at most 4 characters")
    .regex(/^[\u4e00-\u9fa5]+$/, "Name must contain only Chinese characters"),
  birthDate: z.string().optional(),
  birthHour: z.number().min(0).max(22).optional(),
});

type AnalyzeFormValues = z.infer<typeof analyzeFormSchema>;

interface FormErrors {
  fullName?: string;
  birthDate?: string;
  birthHour?: string;
}

interface AnalyzeFormProps {
  onSubmit: (data: AnalyzeFormValues) => void;
  loading?: boolean;
}

export function AnalyzeForm({ onSubmit, loading }: AnalyzeFormProps) {
  const t = useTranslations("analyze.form");
  const common = useTranslations("common");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthHour, setBirthHour] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: string | number | undefined) => {
    const newErrors = { ...errors };

    if (field === "fullName") {
      const strValue = value as string;
      if (!strValue || strValue.length < 2) {
        newErrors.fullName = t("errors.nameTooShort");
      } else if (strValue.length > 4) {
        newErrors.fullName = t("errors.nameTooLong");
      } else if (!/^[\u4e00-\u9fa5]+$/.test(strValue)) {
        newErrors.fullName = t("errors.nameNotChinese");
      } else {
        delete newErrors.fullName;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "fullName") {
      validateField(field, fullName);
    }
  };

  const handleNameChange = (value: string) => {
    setFullName(value);
    if (touched.fullName) {
      validateField("fullName", value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ fullName: true, birthDate: true, birthHour: true });

    // Validate using Zod
    const result = analyzeFormSchema.safeParse({
      fullName,
      birthDate: birthDate || undefined,
      birthHour,
    });

    if (!result.success) {
      const newErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        if (field === "fullName") {
          if (issue.code === "too_small") {
            newErrors.fullName = t("errors.nameTooShort");
          } else if (issue.code === "too_big") {
            newErrors.fullName = t("errors.nameTooLong");
          } else if (issue.code === "custom" || issue.message.includes("Chinese")) {
            newErrors.fullName = t("errors.nameNotChinese");
          } else {
            newErrors.fullName = issue.message;
          }
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  const isFormValid = fullName.length >= 2 && fullName.length <= 4 && /^[\u4e00-\u9fa5]+$/.test(fullName);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Full Name Input */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                {t("fullNameLabel")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={() => handleBlur("fullName")}
                placeholder={t("fullNamePlaceholder")}
                minLength={2}
                maxLength={4}
                required
                disabled={loading}
                aria-invalid={touched.fullName && !!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : "fullName-hint"}
                className={touched.fullName && errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {touched.fullName && errors.fullName ? (
                <p id="fullName-error" className="text-xs text-destructive" role="alert">
                  {errors.fullName}
                </p>
              ) : (
                <p id="fullName-hint" className="text-xs text-muted-foreground">
                  {t("fullNameHint")}
                </p>
              )}
            </div>

            {/* Birth Date Input */}
            <div className="space-y-2">
              <Label htmlFor="birthDate">
                {common("birthDate")}{" "}
                <span className="text-muted-foreground">
                  ({common("optional")})
                </span>
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                {t("birthDateHint")}
              </p>
            </div>

            {/* Birth Hour Select */}
            <div className="space-y-2">
              <Label htmlFor="birthHour">
                {common("birthHour")}{" "}
                <span className="text-muted-foreground">
                  ({common("optional")})
                </span>
              </Label>
              <Select
                value={birthHour?.toString() || ""}
                onValueChange={(value) =>
                  setBirthHour(value ? Number(value) : undefined)
                }
                disabled={loading || !birthDate}
              >
                <SelectTrigger id="birthHour">
                  <SelectValue
                    placeholder={
                      birthDate ? t("birthHourUnknown") : t("birthDateRequired")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t("birthHourUnknown")}</SelectItem>
                  {Array.from({ length: 12 }, (_, i) => i * 2).map((hour) => (
                    <SelectItem key={hour} value={hour.toString()}>
                      {t("birthHourRange", { start: hour, end: hour + 2 })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full md:w-auto"
          >
            {loading ? t("analyzing") : t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
