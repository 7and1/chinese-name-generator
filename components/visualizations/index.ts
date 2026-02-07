// Lazy-loaded chart components for better bundle splitting
export { LazyScoreRadarChart as ScoreRadarChart } from "./lazy-score-radar-chart";
export { LazyFiveElementsChart as FiveElementsChart } from "./lazy-five-elements-chart";
// Re-export types and utilities
export { elementColors, elementOrder } from "./five-elements-chart";
