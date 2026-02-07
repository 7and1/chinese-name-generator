"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NameCard } from "@/components/name/name-card";
import {
  GeneratingAnimation,
  NameCardGridSkeleton,
} from "@/components/name/loading-skeletons";
import type { GeneratedName } from "@/lib/types";
import { List, TrendingUp } from "lucide-react";

interface GenerateResultsProps {
  results: GeneratedName[];
  loading: boolean;
  error: string | null;
}

export function GenerateResults({
  results,
  loading,
  error,
}: GenerateResultsProps) {
  const t = useTranslations();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [loading]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-destructive/20 p-2">
                <svg
                  className="h-5 w-5 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-destructive">
                  Generation Failed
                </h3>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <GeneratingAnimation progress={progress} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NameCardGridSkeleton count={2} />
        </motion.div>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-full bg-muted p-4 mb-4"
            >
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </motion.div>
            <p className="text-muted-foreground text-center max-w-md">
              {t("generate.noResults")}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Sort results by score
  const sortedResults = [...results].sort(
    (a, b) => b.score.overall - a.score.overall,
  );

  // Get top names
  const topNames = sortedResults.slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4 md:mb-6">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold"
        >
          {t("generate.results")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-muted-foreground"
        >
          {t("generate.resultsCount", { count: results.length })}
        </motion.p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">List View</span>
            <span className="sm:hidden">List</span>
          </TabsTrigger>
          <TabsTrigger value="top" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Top Picks</span>
            <span className="sm:hidden">Top</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4 mt-0">
          <AnimatePresence mode="popLayout">
            {sortedResults.map((name, index) => (
              <NameCard
                key={`${name.fullName}-${index}`}
                name={name}
                index={index}
                showVisualization={false}
              />
            ))}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="top" className="space-y-4 mt-0">
          <div className="grid sm:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {topNames.map((name, index) => (
                <motion.div
                  key={`${name.fullName}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <NameCard
                    name={name}
                    index={index}
                    showVisualization={true}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
