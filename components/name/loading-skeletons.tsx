"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

export function NameCardSkeleton() {
  return (
    <Card className="animate-in fade-in-50 duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right space-y-2">
              <Skeleton className="ml-auto h-8 w-12" />
              <Skeleton className="ml-auto h-4 w-16" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="mx-auto h-4 w-16" />
              <Skeleton className="mx-auto h-5 w-8" />
            </div>
          ))}
        </div>
        <Skeleton className="mt-4 h-16 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function NameCardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <NameCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Basic fields skeleton */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="space-y-2"
            >
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-11 w-full" />
            </motion.div>
          ))}
        </div>
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
          {/* Advanced options skeleton */}
          <Skeleton className="h-5 w-32" />
          {[4, 5, 6, 7, 8].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="space-y-2"
            >
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </motion.div>
          ))}
        </div>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}

export function ResultsHeaderSkeleton() {
  return (
    <div className="mb-4 space-y-2">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
}

interface GeneratingAnimationProps {
  message?: string;
  progress?: number;
}

export function GeneratingAnimation({
  message,
  progress = 0,
}: GeneratingAnimationProps) {
  const steps = [
    { key: "analyzing", label: "Analyzing BaZi..." },
    { key: "wuge", label: "Calculating Wu Ge numerology..." },
    { key: "elements", label: "Matching five elements..." },
    { key: "phonetics", label: "Checking phonetic harmony..." },
    { key: "finalizing", label: "Finalizing your names..." },
  ];

  const currentStep = Math.min(Math.floor(progress / 20), steps.length - 1);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-primary/20 overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-12">
          {/* Animated orb */}
          <div className="relative mb-8">
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/30"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <div className="relative flex h-20 w-20 items-center justify-center">
              {/* Tai Chi-inspired animation */}
              <motion.svg
                className="h-16 w-16 text-primary"
                viewBox="0 0 100 100"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.3"
                />
                <path
                  d="M50 5 A45 45 0 0 1 50 95 A22.5 22.5 0 0 1 50 50 A22.5 22.5 0 0 0 50 5"
                  fill="currentColor"
                  opacity="0.8"
                />
                <circle cx="50" cy="27.5" r="6" fill="white" />
                <circle cx="50" cy="72.5" r="6" fill="white" />
                <circle cx="50" cy="27.5" r="2" fill="black" />
                <circle cx="50" cy="72.5" r="2" fill="currentColor" />
              </motion.svg>
            </div>
          </div>

          {/* Progress text */}
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-medium text-foreground"
          >
            {message || steps[currentStep].label}
          </motion.p>

          {/* Progress bar */}
          <div className="mt-6 w-full max-w-xs space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              {steps.map((step, index) => (
                <motion.span
                  key={step.key}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: index <= currentStep ? 1 : 0.3 }}
                  className={index <= currentStep ? "text-primary" : ""}
                >
                  {index + 1}
                </motion.span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ButtonLoader() {
  return (
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
  );
}
