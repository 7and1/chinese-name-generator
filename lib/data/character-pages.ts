import { SAMPLE_CHARACTERS } from "./characters";

/**
 * Top 1000 characters for generating SEO pages
 * Derived from character database by frequency and naming suitability
 */
export const TOP_1000_CHARACTERS = SAMPLE_CHARACTERS.slice(0, 1000).map(
  (char) => char.char,
);

/**
 * Get character page list for static generation
 */
export function getCharacterPageParams(): Array<{ char: string }> {
  return TOP_1000_CHARACTERS.map((char) => ({ char }));
}

/**
 * Check if a character has a dedicated page
 */
export function hasCharacterPage(char: string): boolean {
  return TOP_1000_CHARACTERS.includes(char);
}

/**
 * Get character info by character
 */
export function getCharacterInfo(char: string) {
  return SAMPLE_CHARACTERS.find((c) => c.char === char);
}
