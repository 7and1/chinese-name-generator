/**
 * Core type definitions for the Chinese Name Generator application
 */

// ============================================================================
// Five Elements (五行)
// ============================================================================

export type FiveElement = "金" | "木" | "水" | "火" | "土"; // Metal, Wood, Water, Fire, Earth

export type FiveElementEN = "Metal" | "Wood" | "Water" | "Fire" | "Earth";

export interface FiveElementBalance {
  金: number; // Metal
  木: number; // Wood
  水: number; // Water
  火: number; // Fire
  土: number; // Earth
}

// ============================================================================
// BaZi (八字 / Four Pillars)
// ============================================================================

export type HeavenlyStem =
  | "甲"
  | "乙"
  | "丙"
  | "丁"
  | "戊"
  | "己"
  | "庚"
  | "辛"
  | "壬"
  | "癸";

export type EarthlyBranch =
  | "子"
  | "丑"
  | "寅"
  | "卯"
  | "辰"
  | "巳"
  | "午"
  | "未"
  | "申"
  | "酉"
  | "戌"
  | "亥";

export interface Pillar {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
}

export interface BaZiChart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  dayMaster: HeavenlyStem;
  elements: FiveElementBalance;
  favorableElements: FiveElement[];
  unfavorableElements: FiveElement[];
}

// ============================================================================
// Wuge (五格 / Five Grids) - Name Numerology
// ============================================================================

export interface WugeGrid {
  tianGe: number; // 天格 Heaven Grid
  renGe: number; // 人格 Human Grid
  diGe: number; // 地格 Earth Grid
  waiGe: number; // 外格 Outer Grid
  zongGe: number; // 总格 Total Grid
}

export interface WugeAnalysis extends WugeGrid {
  tianGeInterpretation: NumerologyInterpretation;
  renGeInterpretation: NumerologyInterpretation;
  diGeInterpretation: NumerologyInterpretation;
  waiGeInterpretation: NumerologyInterpretation;
  zongGeInterpretation: NumerologyInterpretation;
  sancai: SancaiAnalysis; // 三才 Three Talents
  overallScore: number;
}

export interface NumerologyInterpretation {
  number: number;
  fortune: "吉" | "凶" | "半吉" | "大吉" | "大凶"; // Lucky, Unlucky, Half-lucky, Very Lucky, Very Unlucky
  meaning: string;
  description: string;
}

export interface SancaiAnalysis {
  heaven: "金" | "木" | "水" | "火" | "土";
  human: "金" | "木" | "水" | "火" | "土";
  earth: "金" | "木" | "水" | "火" | "土";
  compatibility: "相生" | "相克" | "同类";
  interpretation: string;
  score: number;
}

// ============================================================================
// Character (汉字)
// ============================================================================

export interface ChineseCharacter {
  char: string;
  pinyin: string;
  tone: number; // 1-4, 5 for neutral
  strokeCount: number;
  kangxiStrokeCount: number; // 康熙字典笔画数
  radical: string;
  fiveElement: FiveElement;
  meaning: string;
  traditionalForm?: string;
  simplifiedForm?: string;
  frequency: number; // Usage frequency ranking
  hskLevel?: number; // HSK level (1-6)
}

// ============================================================================
// Poetry & Literature
// ============================================================================

export type Dynasty =
  | "先秦"
  | "汉"
  | "魏晋"
  | "南北朝"
  | "隋"
  | "唐"
  | "宋"
  | "元"
  | "明"
  | "清"
  | "现代";

export type PoetryType = "诗经" | "楚辞" | "唐诗" | "宋词" | "宋诗" | "元曲";

export interface Poem {
  id: string;
  title: string;
  author: string;
  dynasty: Dynasty;
  type: PoetryType;
  content: string;
  translation?: string;
  tags: string[];
}

export interface IdiomInfo {
  idiom: string;
  pinyin: string;
  explanation: string;
  source?: string;
  example?: string;
}

// ============================================================================
// Name Generation
// ============================================================================

export type Gender = "male" | "female" | "neutral";

export interface NameGenerationOptions {
  surname: string;
  gender: Gender;
  birthDate?: Date;
  birthHour?: number; // 0-23
  preferredElements?: FiveElement[];
  avoidElements?: FiveElement[];
  style?: "classic" | "modern" | "poetic" | "elegant";
  source?: "poetry" | "classics" | "idioms" | "any";
  characterCount?: 1 | 2; // Single or double given name
  maxResults?: number;
}

export interface GeneratedName {
  fullName: string;
  surname: string;
  givenName: string;
  pinyin: string;
  characters: ChineseCharacter[];
  score: NameScore;
  source?: {
    type: "poetry" | "classic" | "idiom" | "custom";
    title?: string;
    author?: string;
    quote?: string;
  };
  explanation: string;
}

export interface NameScore {
  overall: number; // 0-100
  rating: string; // 优秀/良好/一般/较差
  baziScore: number; // BaZi compatibility
  wugeScore: number; // Five Grids score
  phoneticScore: number; // Phonetic harmony
  meaningScore: number; // Character meaning quality
  breakdown: {
    bazi?: BaZiChart;
    wuge: WugeAnalysis;
    phonetics: PhoneticAnalysis;
  };
}

export interface PhoneticAnalysis {
  tonePattern: number[]; // Array of tone numbers
  toneHarmony: number; // 0-100 score
  hasHomophone: boolean; // Sounds like inappropriate words
  homophoneWarnings: string[];
  readability: number; // 0-100
}

// ============================================================================
// I Ching (易经)
// ============================================================================

export interface Hexagram {
  number: number; // 1-64
  chinese: string; // e.g., "乾"
  pinyin: string;
  english: string;
  binary: string; // e.g., "111111"
  judgment: string; // 卦辞
  image: string; // 象辞
  lines: HexagramLine[];
}

export interface HexagramLine {
  position: number; // 1-6 (bottom to top)
  type: "阴" | "阳"; // Yin or Yang
  changing: boolean;
  text: string; // 爻辞
}

// ============================================================================
// Surname Data
// ============================================================================

export interface SurnameInfo {
  surname: string;
  pinyin: string;
  frequency: number; // National frequency percentage
  ranking: number; // National ranking
  origin: string;
  originDetails?: string; // Detailed historical origin
  famousPersons?: string[];
  famousPersonsDetails?: FamousPersonDetail[];
  strokeCount: number;
  regionalDistribution?: RegionalDistribution;
  notableBranches?: string[]; // Notable clan branches (郡望)
}

export interface FamousPersonDetail {
  name: string;
  era?: string; // Historical period
  title?: string; // Title or description
  achievement: string; // Major achievement
}

export interface RegionalDistribution {
  provinces: string[]; // Provinces with highest concentration
  description: string; // Description of distribution pattern
  historicalRegions?: string[]; // Historical regions (郡望)
  overseas?: string[]; // Countries/regions with significant diaspora
}

// ============================================================================
// Database Models
// ============================================================================

export interface DBCharacter extends ChineseCharacter {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DBPoem extends Poem {
  createdAt: Date;
  updatedAt: Date;
}

export interface DBNameScoreCache {
  id: number;
  fullName: string;
  scoreData: NameScore;
  createdAt: Date;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export type GenerateNameResponse = APIResponse<GeneratedName[]>;
export type AnalyzeNameResponse = APIResponse<NameScore>;
export type SearchPoetryResponse = APIResponse<Poem[]>;
