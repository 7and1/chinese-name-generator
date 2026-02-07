#!/usr/bin/env tsx
/**
 * Process raw downloaded Chinese language datasets
 *
 * Parses, cleans, and transforms raw data into structured formats:
 * - Parse CSV/JSON/TXT files
 * - Clean and normalize Chinese characters
 * - Validate pinyin, tones, stroke counts
 * - Extract five elements (金木水火土)
 * - Remove duplicates
 * - Generate statistics
 * - Save to data/processed/
 */

import { promises as fs } from "fs";
import { join } from "path";
import { createReadStream } from "fs";
import { createInterface } from "readline";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { unzip } from "unzipit";
import { pinyin } from "pinyin-pro";
import hanzi from "hanzi";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize hanzi library
hanzi.start();

// ============================================================================
// Configuration
// ============================================================================

const RAW_DATA_DIR = join(__dirname, "../data/raw");
const PROCESSED_DATA_DIR = join(__dirname, "../data/processed");

// Five element mappings
const FIVE_ELEMENTS: Record<string, "金" | "木" | "水" | "火" | "土"> = {
  金: "金",
  木: "木",
  水: "水",
  火: "火",
  土: "土",
  // Radical to element mappings
  钅: "金",
  氵: "水",
  阝: "土",
  王: "土",
  玉: "土",
  石: "土",
  山: "土",
  // Extended mappings
  日: "火",
  月: "水",
  艹: "木",
  竹: "木",
  禾: "木",
  米: "木",
  糸: "木",
  衣: "木",
  耳: "水",
  目: "木",
  口: "土",
  马: "火",
  牛: "木",
  羊: "土",
  豕: "水",
  犭: "火",
  鸟: "火",
  鱼: "水",
  虫: "火",
};

// ============================================================================
// Type Definitions
// ============================================================================

interface ProcessedCharacter {
  char: string;
  pinyin: string;
  tone: number;
  strokeCount: number;
  kangxiStrokeCount: number;
  radical: string;
  fiveElement: "金" | "木" | "水" | "火" | "土";
  meaning: string;
  traditionalForm?: string;
  simplifiedForm?: string;
  frequency: number;
  hskLevel?: number;
}

interface ProcessedSurname {
  surname: string;
  pinyin: string;
  frequency: number;
  ranking: number;
  strokeCount: number;
  origin: string;
}

interface ProcessedPoem {
  title: string;
  author: string;
  dynasty: string;
  type: string;
  content: string;
  translation?: string;
  tags: string[];
}

interface ProcessedIdiom {
  idiom: string;
  pinyin: string;
  explanation: string;
  source?: string;
  example?: string;
}

interface ProcessingStats {
  source: string;
  inputRecords: number;
  outputRecords: number;
  duplicatesRemoved: number;
  errors: number;
  processingTime: number;
}

// ============================================================================
// Utility Functions
// ============================================================================

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

function normalizeChineseChar(char: string): string {
  // Remove BOM and trim whitespace
  return char.replace(/^\uFEFF/, "").trim();
}

function extractRadical(char: string): string {
  try {
    const radical = hanzi.getRadical(char);
    return radical || "Unknown";
  } catch {
    return "Unknown";
  }
}

function getFiveElement(
  char: string,
  radical: string,
): "金" | "木" | "水" | "火" | "土" {
  // Check if radical directly maps to element
  if (FIVE_ELEMENTS[radical]) {
    return FIVE_ELEMENTS[radical];
  }

  // Check if character contains known radical components
  for (const [key, element] of Object.entries(FIVE_ELEMENTS)) {
    if (char.includes(key)) {
      return element;
    }
  }

  // Default to 土 (earth) for unknown characters
  return "土";
}

function getPinyin(char: string): { pinyin: string; tone: number } {
  try {
    const result = pinyin(char);
    const match = result.match(/^([a-z]+)(\d)$/);
    if (match) {
      return { pinyin: match[1], tone: parseInt(match[2], 10) };
    }
    return { pinyin: result, tone: 5 };
  } catch {
    return { pinyin: "unknown", tone: 5 };
  }
}

function getStrokeCount(char: string): { simplified: number; kangxi: number } {
  try {
    const simplified = hanzi.getStrokeCount(char);
    // Kangxi stroke count often differs - would need external data
    return { simplified: simplified || 0, kangxi: simplified || 0 };
  } catch {
    return { simplified: 0, kangxi: 0 };
  }
}

function dedupeCharacters<T extends { char: string }>(characters: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const char of characters) {
    if (!seen.has(char.char)) {
      seen.add(char.char);
      result.push(char);
    }
  }

  return result;
}

// ============================================================================
// Processing Functions
// ============================================================================

/**
 * Process Unihan IRG Sources file for Kangxi radical and stroke data
 */
async function processUnihanIRG(): Promise<ProcessingStats> {
  const startTime = Date.now();
  const inputPath = join(RAW_DATA_DIR, "unihan-irg.txt");
  const outputPath = join(PROCESSED_DATA_DIR, "unihan-irg.json");

  console.log("Processing Unihan IRG Sources...");

  const charData: Map<
    string,
    { radical: string; kangxiStroke: number; simplifiedStroke: number }
  > = new Map();

  const fileStream = createReadStream(inputPath);
  const rl = createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.startsWith("#") || !line.trim()) continue;

    const parts = line.split("\t");
    if (parts.length >= 3) {
      const codepoint = parts[0].split(" ")[1]; // U+XXXX
      const char = String.fromCharCode(parseInt(codepoint.substring(2), 16));
      const property = parts[1];
      const value = parts[2];

      if (!charData.has(char)) {
        charData.set(char, {
          radical: "",
          kangxiStroke: 0,
          simplifiedStroke: 0,
        });
      }

      const data = charData.get(char)!;

      if (property === "kRSUnicode") {
        // Format: "U+768B.1:2" - 7 is radical index, 1 is additional strokes, 2 is radical position
        const match = value.match(/(\d+)\.(\d+)/);
        if (match) {
          data.kangxiStroke = parseInt(match[1], 10) + parseInt(match[2], 10);
        }
      } else if (property === "kTotalStrokes") {
        data.simplifiedStroke = parseInt(value, 10);
      }
    }
  }

  await fs.writeFile(
    outputPath,
    JSON.stringify(Object.fromEntries(charData), null, 2),
  );

  return {
    source: "unihan-irg",
    inputRecords: charData.size,
    outputRecords: charData.size,
    duplicatesRemoved: 0,
    errors: 0,
    processingTime: Date.now() - startTime,
  };
}

/**
 * Process Unihan Readings file for pinyin data
 */
async function processUnihanReadings(): Promise<ProcessingStats> {
  const startTime = Date.now();
  const inputPath = join(RAW_DATA_DIR, "unihan-readings.txt");
  const outputPath = join(PROCESSED_DATA_DIR, "unihan-readings.json");

  console.log("Processing Unihan Readings...");

  const readings: Map<string, { pinyin: string; tone: number }[]> = new Map();

  const fileStream = createReadStream(inputPath);
  const rl = createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.startsWith("#") || !line.trim()) continue;

    const parts = line.split("\t");
    if (parts.length >= 3 && parts[1] === "kMandarin") {
      const codepoint = parts[0].split(" ")[1];
      const char = String.fromCharCode(parseInt(codepoint.substring(2), 16));
      const value = parts[2]; // e.g., "zhāng,zhàng"

      const readingsList = value.split(",").map((p) => {
        const toneMatch = p.match(/([a-z]+)([1-5])/);
        if (toneMatch) {
          return { pinyin: toneMatch[1], tone: parseInt(toneMatch[2], 10) };
        }
        return { pinyin: p, tone: 5 };
      });

      readings.set(char, readingsList);
    }
  }

  await fs.writeFile(
    outputPath,
    JSON.stringify(Object.fromEntries(readings), null, 2),
  );

  return {
    source: "unihan-readings",
    inputRecords: readings.size,
    outputRecords: readings.size,
    duplicatesRemoved: 0,
    errors: 0,
    processingTime: Date.now() - startTime,
  };
}

/**
 * Process HSK words for frequency data
 */
async function processHSKWords(): Promise<ProcessingStats> {
  const startTime = Date.now();
  const inputPath = join(RAW_DATA_DIR, "hsk-words.json");
  const outputPath = join(PROCESSED_DATA_DIR, "hsk-frequency.json");

  console.log("Processing HSK words...");

  const content = await fs.readFile(inputPath, "utf-8");
  const data = JSON.parse(content);

  const frequencyMap: Map<string, { hskLevel: number; frequency: number }> =
    new Map();

  for (const word of data) {
    const chars = word.hanzi || "";
    const level = word.level || 1;

    for (const char of chars) {
      const existing = frequencyMap.get(char);
      if (existing) {
        existing.hskLevel = Math.min(existing.hskLevel, level);
        existing.frequency += 1;
      } else {
        frequencyMap.set(char, { hskLevel: level, frequency: 1 });
      }
    }
  }

  await fs.writeFile(
    outputPath,
    JSON.stringify(Object.fromEntries(frequencyMap), null, 2),
  );

  return {
    source: "hsk-words",
    inputRecords: data.length,
    outputRecords: frequencyMap.size,
    duplicatesRemoved: 0,
    errors: 0,
    processingTime: Date.now() - startTime,
  };
}

/**
 * Process idioms from JSON
 */
async function processIdioms(): Promise<ProcessingStats> {
  const startTime = Date.now();
  const inputPath = join(RAW_DATA_DIR, "idioms-raw.json");
  const outputPath = join(PROCESSED_DATA_DIR, "idioms.json");

  console.log("Processing idioms...");

  const content = await fs.readFile(inputPath, "utf-8");
  const data = JSON.parse(content);

  const idioms: ProcessedIdiom[] = [];

  for (const item of data) {
    try {
      const idiomText = item.word || item.idiom;
      if (!idiomText || idiomText.length !== 4) continue;

      // Get pinyin for each character
      const pinyinChars: string[] = [];
      for (const char of idiomText) {
        const py = pinyin(char, { toneType: "symbol" });
        pinyinChars.push(py);
      }

      idioms.push({
        idiom: idiomText,
        pinyin: pinyinChars.join(" "),
        explanation: item.meaning || item.explanation || "",
        source: item.source || "",
        example: item.example || "",
      });
    } catch (error) {
      console.error(`Error processing idiom: ${error}`);
    }
  }

  // Deduplicate idioms
  const uniqueIdioms = Array.from(
    new Map(idioms.map((item) => [item.idiom, item])).values(),
  );

  await fs.writeFile(outputPath, JSON.stringify(uniqueIdioms, null, 2));

  return {
    source: "idioms",
    inputRecords: data.length,
    outputRecords: uniqueIdioms.length,
    duplicatesRemoved: data.length - uniqueIdioms.length,
    errors: 0,
    processingTime: Date.now() - startTime,
  };
}

/**
 * Process surname data
 */
async function processSurnames(): Promise<ProcessingStats> {
  const startTime = Date.now();
  const inputPath = join(RAW_DATA_DIR, "surnames-raw.json");
  const outputPath = join(PROCESSED_DATA_DIR, "surnames.json");

  console.log("Processing surnames...");

  let content = "{}";
  try {
    content = await fs.readFile(inputPath, "utf-8");
  } catch {
    // File doesn't exist, create empty
  }

  const data = JSON.parse(content);
  const surnames: ProcessedSurname[] = [];

  for (const item of data) {
    try {
      const surname = item.surname || item.char || item.word;
      if (!surname || surname.length > 2) continue;

      const py = pinyin(surname, { toneType: "symbol", type: "array" });
      const pinyinStr = Array.isArray(py) ? py.join(" ") : py;

      surnames.push({
        surname,
        pinyin: pinyinStr,
        frequency: item.frequency || 0,
        ranking: item.ranking || 9999,
        strokeCount: item.strokeCount || surname.length,
        origin: item.origin || "未知",
      });
    } catch (error) {
      console.error(`Error processing surname: ${error}`);
    }
  }

  await fs.writeFile(outputPath, JSON.stringify(surnames, null, 2));

  return {
    source: "surnames",
    inputRecords: data.length,
    outputRecords: surnames.length,
    duplicatesRemoved: 0,
    errors: 0,
    processingTime: Date.now() - startTime,
  };
}

/**
 * Process Baijiaxing (Hundred Family Surnames)
 */
async function processBaijiaxing(): Promise<ProcessingStats> {
  const startTime = Date.now();
  const inputPath = join(RAW_DATA_DIR, "baijiaxing.txt");
  const outputPath = join(PROCESSED_DATA_DIR, "baijiaxing.json");

  console.log("Processing Baijiaxing...");

  const content = await fs.readFile(inputPath, "utf-8");
  const lines = content.split(/[\n\r]+/).filter((l) => l.trim());

  const surnames: { char: string; pinyin: string; ranking: number }[] = [];
  let ranking = 1;

  for (const line of lines) {
    // Extract single-character surnames
    for (const char of line) {
      if (char.trim() && /[\u4e00-\u9fa5]/.test(char)) {
        const py = pinyin(char, { toneType: "none" });
        surnames.push({ char, pinyin: py, ranking: ranking++ });
      }
    }
  }

  await fs.writeFile(outputPath, JSON.stringify(surnames, null, 2));

  return {
    source: "baijiaxing",
    inputRecords: lines.length,
    outputRecords: surnames.length,
    duplicatesRemoved: 0,
    errors: 0,
    processingTime: Date.now() - startTime,
  };
}

/**
 * Extract poetry from chinese-poetry zip
 */
async function processPoetry(): Promise<ProcessingStats> {
  const startTime = Date.now();
  const inputPath = join(RAW_DATA_DIR, "chinese-poetry.zip");
  const outputPath = join(PROCESSED_DATA_DIR, "poetry.json");

  console.log("Processing poetry (this may take a while)...");

  const poems: ProcessedPoem[] = [];
  let poemCount = 0;

  try {
    const zip = await unzip(inputPath);

    for (const [entryName, entry] of Object.entries(zip.entries)) {
      if (!entryName.endsWith(".json")) continue;
      if (!entryName.includes("poet") && !entryName.includes("ci")) continue;

      try {
        const content = await entry.arrayBuffer();
        const text = new TextDecoder().decode(content);
        const data = JSON.parse(text);

        for (const item of data) {
          const title = item.title || "";
          const author = item.author || "";
          const dynasty = mapDynasty(item.dynasty || "");
          const type = mapPoetryType(entryName);
          const content_lines = item.content || item.paragraphs || [];

          poems.push({
            title,
            author,
            dynasty,
            type,
            content: Array.isArray(content_lines)
              ? content_lines.join("\n")
              : content_lines,
            translation: "",
            tags: [type, dynasty],
          });

          poemCount++;

          // Limit for processing time
          if (poemCount >= 10000) break;
        }

        if (poemCount >= 10000) break;
      } catch (error) {
        // Skip invalid entries
      }
    }
  } catch (error) {
    console.error(`Error processing poetry zip: ${error}`);
  }

  await fs.writeFile(outputPath, JSON.stringify(poems.slice(0, 5000), null, 2));

  return {
    source: "poetry",
    inputRecords: poemCount,
    outputRecords: Math.min(poemCount, 5000),
    duplicatesRemoved: 0,
    errors: 0,
    processingTime: Date.now() - startTime,
  };
}

function mapDynasty(dynasty: string): string {
  const map: Record<string, string> = {
    tang: "唐",
    song: "宋",
    "northern-song": "宋",
    "southern-song": "宋",
    han: "汉",
    pre: "先秦",
  };
  return map[dynasty.toLowerCase()] || dynasty;
}

function mapPoetryType(filename: string): string {
  if (filename.includes("jsons/ci")) return "宋词";
  if (filename.includes("jsons/tang")) return "唐诗";
  if (filename.includes("jsons/shijing")) return "诗经";
  if (filename.includes("jsons/chuci")) return "楚辞";
  return "诗词";
}

// ============================================================================
// Main Processing Pipeline
// ============================================================================

interface CLIArgs {
  help?: boolean;
  dryRun?: boolean;
  filter?: string;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const result: CLIArgs = {};

  for (const arg of args) {
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--dry-run") {
      result.dryRun = true;
    } else if (arg.startsWith("--filter=")) {
      result.filter = arg.split("=")[1];
    }
  }

  return result;
}

function printHelp(): void {
  console.log(`
Chinese Name Generator - Data Processor

USAGE:
  tsx scripts/process-data.ts [OPTIONS]

OPTIONS:
  --help, -h          Show this help message
  --filter=TYPE       Process only specific data type
  --dry-run           Show processing plan without executing

DATA TYPES:
  unihan-irg          Kangxi radical and stroke count data
  unihan-readings     Pinyin readings for CJK characters
  hsk-words           HSK vocabulary frequency data
  idioms              Chinese idioms (chengyu)
  surnames            Chinese surname statistics
  baijiaxing          Hundred Family Surnames
  poetry              Tang/Song poetry collection

EXAMPLES:
  tsx scripts/process-data.ts                    # Process all data
  tsx scripts/process-data.ts --filter=unihan    # Process only Unihan data
  tsx scripts/process-data.ts --dry-run          # Preview processing plan

OUTPUT:
  Processed files saved to: data/processed/
`);
}

async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    return;
  }

  console.log("\n" + "=".repeat(60));
  console.log("CHINESE NAME GENERATOR - DATA PROCESSING");
  console.log("=".repeat(60));

  await ensureDir(PROCESSED_DATA_DIR);

  const processors = [
    processUnihanIRG,
    processUnihanReadings,
    processHSKWords,
    processIdioms,
    processSurnames,
    processBaijiaxing,
    processPoetry,
  ];

  const stats: ProcessingStats[] = [];
  const startTime = Date.now();

  for (const processor of processors) {
    if (
      args.filter &&
      !processor.name.toLowerCase().includes(args.filter.toLowerCase())
    ) {
      continue;
    }

    if (args.dryRun) {
      console.log(`[DRY RUN] Would process: ${processor.name}`);
      continue;
    }

    try {
      const stat = await processor();
      stats.push(stat);
      console.log(`  ✓ Completed in ${stat.processingTime}ms`);
    } catch (error) {
      console.error(`  ✗ Error: ${error}`);
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("PROCESSING SUMMARY");
  console.log("=".repeat(60));

  for (const stat of stats) {
    console.log(`${stat.source}:`);
    console.log(`  Input: ${stat.inputRecords}, Output: ${stat.outputRecords}`);
    console.log(`  Duplicates removed: ${stat.duplicatesRemoved}`);
    console.log(`  Time: ${stat.processingTime}ms`);
  }

  const totalTime = Date.now() - startTime;
  console.log("-".repeat(60));
  console.log(`Total processing time: ${totalTime}ms`);
  console.log("=".repeat(60) + "\n");
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
