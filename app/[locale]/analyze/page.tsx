
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/error/loading-skeletons";
import { generateAnalyzeMetadata } from "@/lib/seo/analyze-metadata";
import { AnalyzeFormWrapper, PageTitle, PageSubtitle } from "./analyze-client";

interface AnalyzePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AnalyzePageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  return generateAnalyzeMetadata(locale);
}

export default async function AnalyzePage({ params }: AnalyzePageProps) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <PageTitle />
        </h1>
        <p className="text-muted-foreground">
          <PageSubtitle />
        </p>
      </div>

      <Suspense fallback={<PageSkeleton />}>
        <AnalyzeFormWrapper />
      </Suspense>
    </div>
  );
}
