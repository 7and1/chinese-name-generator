#!/usr/bin/env tsx
/**
 * Download critical Chinese language datasets from various sources
 *
 * Downloads top 10 data sources for Chinese name generation:
 * - chinese-poetry (Tang/Song poetry)
 * - chinese-xinhua (dictionary data)
 * - ChineseNames (surname statistics)
 * - Kangxi dictionary data
 * - HSK frequency lists
 * - CC-CEDICT
 * - Chinese Text Project samples
 * - Idioms data
 * - Classics data
 * - Unihan database
 */

import { promises as fs } from "fs";
import { join } from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================================
// Configuration
// ============================================================================

const DATA_DIR = join(__dirname, "../data/raw");
const MAX_CONCURRENT_DOWNLOADS = 3;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;

interface DatasetSource {
  name: string;
  url: string;
  filename: string;
  expectedSize?: number;
  description: string;
}

// Critical data sources
const DATASETS: DatasetSource[] = [
  {
    name: "chinese-poetry",
    url: "https://github.com/chinese-poetry/chinese-poetry/archive/refs/heads/master.zip",
    filename: "chinese-poetry.zip",
    expectedSize: 50 * 1024 * 1024, // 50MB
    description: "Tang/Sang poetry, Shi Jing, Chu Ci",
  },
  {
    name: "chinese-xinhua",
    url: "https://github.com/pwxcoo/chinese-xinhua/archive/refs/heads/master.zip",
    filename: "chinese-xinhua.zip",
    expectedSize: 10 * 1024 * 1024, // 10MB
    description: "Xinhua dictionary with idioms and words",
  },
  {
    name: "ChineseNames_Raw",
    url: "https://raw.githubusercontent.com/CN-Collector/ChineseNames/master/data/surnames.json",
    filename: "surnames-raw.json",
    expectedSize: 100 * 1024, // 100KB
    description: "Chinese surname frequency statistics",
  },
  {
    name: "Unihan_IRGSources",
    url: "https://www.unicode.org/Public/UCD/latest/ucd/Unihan_IRGSources.txt",
    filename: "unihan-irg.txt",
    expectedSize: 5 * 1024 * 1024, // 5MB
    description: "Kangxi radical and stroke count data",
  },
  {
    name: "Unihan_Readings",
    url: "https://www.unicode.org/Public/UCD/latest/ucd/Unihan_Readings.txt",
    filename: "unihan-readings.txt",
    expectedSize: 8 * 1024 * 1024, // 8MB
    description: "Pinyin readings for all CJK characters",
  },
  {
    name: "cedict_ts",
    url: "https://github.com/fcsa/cedict/archive/refs/heads/master.zip",
    filename: "cedict.zip",
    expectedSize: 2 * 1024 * 1024, // 2MB
    description: "CC-CEDICT Chinese-English dictionary",
  },
  {
    name: "hsk-words",
    url: "https://raw.githubusercontent.com/fishroot/hsk-words/master/hsk_words.json",
    filename: "hsk-words.json",
    expectedSize: 50 * 1024, // 50KB
    description: "HSK vocabulary lists with frequency",
  },
  {
    name: "chengyu-idioms",
    url: "https://raw.githubusercontent.com/fmunkert/chinese-idioms/master/idioms.json",
    filename: "idioms-raw.json",
    expectedSize: 500 * 1024, // 500KB
    description: "Chinese idioms (chengyu) with explanations",
  },
  {
    name: "chinese-classics",
    url: "https://raw.githubusercontent.com/James-Yu/Yijing-Data/master/data/yijing.json",
    filename: "yijing.json",
    expectedSize: 200 * 1024, // 200KB
    description: "I Ching hexagram data",
  },
  {
    name: "BaiJiaXing",
    url: "https://raw.githubusercontent.com/zhajijun/Hanzi-feature/master/data/BaiJiaXing.txt",
    filename: "baijiaxing.txt",
    expectedSize: 10 * 1024, // 10KB
    description: "Hundred Family Surnames",
  },
];

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format bytes to human readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Create directory if it doesn't exist
 */
async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    // Ignore if already exists
  }
}

/**
 * Download a single file with retry logic
 */
async function downloadFile(
  source: DatasetSource,
  attempt: number = 1,
): Promise<{ success: boolean; size?: number; error?: string }> {
  const targetPath = join(DATA_DIR, source.filename);

  try {
    console.log(`[${attempt}/${RETRY_ATTEMPTS}] Downloading ${source.name}...`);
    console.log(`  URL: ${source.url}`);
    console.log(`  Target: ${targetPath}`);

    const response = await fetch(source.url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentLength = response.headers.get("content-length");
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;

    if (totalBytes > 0) {
      console.log(`  Size: ${formatBytes(totalBytes)}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body");
    }

    const fileStream = createWriteStream(targetPath);
    let downloadedBytes = 0;
    const startTime = Date.now();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      downloadedBytes += value.length;
      fileStream.write(value);

      if (totalBytes > 0) {
        const percent = ((downloadedBytes / totalBytes) * 100).toFixed(1);
        const elapsed = (Date.now() - startTime) / 1000;
        const speed = formatBytes(downloadedBytes / elapsed);
        process.stdout.write(
          `  Progress: ${percent}% (${formatBytes(downloadedBytes)}/${formatBytes(totalBytes)}) @ ${speed}/s\r`,
        );
      }
    }

    fileStream.close();
    console.log("\n  ✓ Download complete");

    // Verify file size if expected
    const stats = await fs.stat(targetPath);
    if (source.expectedSize && stats.size < source.expectedSize * 0.9) {
      throw new Error(
        `File size ${formatBytes(stats.size)} below expected ${formatBytes(source.expectedSize)}`,
      );
    }

    console.log(`  Verified: ${formatBytes(stats.size)}`);
    return { success: true, size: stats.size };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`  ✗ Error: ${errorMessage}`);

    if (attempt < RETRY_ATTEMPTS) {
      const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(`  Retrying in ${delay}ms...`);
      await sleep(delay);
      return downloadFile(source, attempt + 1);
    }

    return { success: false, error: errorMessage };
  }
}

/**
 * Download multiple datasets with concurrency control
 */
async function downloadAll(
  datasets: DatasetSource[],
  concurrency: number,
): Promise<void> {
  console.log(`\n📦 Starting download of ${datasets.length} datasets`);
  console.log(`📁 Target directory: ${DATA_DIR}`);
  console.log(`🔢 Concurrency: ${concurrency}\n`);

  await ensureDir(DATA_DIR);

  const results: Map<
    string,
    { success: boolean; size?: number; error?: string }
  > = new Map();

  let index = 0;
  const executing: Promise<void>[] = [];

  for (const dataset of datasets) {
    const task = (async () => {
      const result = await downloadFile(dataset);
      results.set(dataset.name, result);

      if (result.success) {
        console.log(`✓ ${dataset.name}: ${formatBytes(result.size || 0)}`);
      } else {
        console.error(`✗ ${dataset.name}: ${result.error}`);
      }
    })();

    executing.push(task);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p === task),
        1,
      );
    }

    index++;
  }

  await Promise.all(executing);

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("DOWNLOAD SUMMARY");
  console.log("=".repeat(60));

  let successCount = 0;
  let totalSize = 0;

  for (const dataset of datasets) {
    const result = results.get(dataset.name);
    if (result?.success) {
      successCount++;
      totalSize += result.size || 0;
      console.log(`✓ ${dataset.name}: ${formatBytes(result.size || 0)}`);
    } else {
      console.error(`✗ ${dataset.name}: ${result?.error || "Unknown error"}`);
    }
  }

  console.log("-".repeat(60));
  console.log(
    `Total: ${successCount}/${datasets.length} successful, ${formatBytes(totalSize)}`,
  );
}

// ============================================================================
// CLI Interface
// ============================================================================

interface CLIArgs {
  help?: boolean;
  dryRun?: boolean;
  filter?: string;
  list?: boolean;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const result: CLIArgs = {};

  for (const arg of args) {
    if (arg === "--help" || arg === "-h") {
      result.help = true;
    } else if (arg === "--dry-run") {
      result.dryRun = true;
    } else if (arg === "--list" || arg === "-l") {
      result.list = true;
    } else if (arg.startsWith("--filter=")) {
      result.filter = arg.split("=")[1];
    }
  }

  return result;
}

function printHelp(): void {
  console.log(`
Chinese Name Generator - Dataset Downloader

USAGE:
  tsx scripts/download-datasets.ts [OPTIONS]

OPTIONS:
  --help, -h          Show this help message
  --list, -l          List available datasets
  --filter=NAME       Download only datasets matching NAME (partial match)
  --dry-run           Show what would be downloaded without downloading

DATASETS:
${DATASETS.map((d) => `  ${d.name.padEnd(20)} ${d.description}`).join("\n")}

EXAMPLES:
  tsx scripts/download-datasets.ts                  # Download all datasets
  tsx scripts/download-datasets.ts --filter=poetry  # Download only poetry-related
  tsx scripts/download-datasets.ts --list           # List all datasets
  tsx scripts/download-datasets.ts --dry-run        # Preview without downloading

OUTPUT:
  Files are saved to: data/raw/
`);
}

function listDatasets(): void {
  console.log("\nAvailable Datasets:\n");
  console.log("-".repeat(80));
  console.log(
    `${"Name".padEnd(25)} ${"Description".padEnd(40)} ${"Size".padEnd(10)}`,
  );
  console.log("-".repeat(80));

  for (const dataset of DATASETS) {
    const size = dataset.expectedSize
      ? formatBytes(dataset.expectedSize)
      : "Unknown";
    console.log(
      `${dataset.name.padEnd(25)} ${dataset.description.padEnd(40)} ${size.padEnd(10)}`,
    );
  }

  console.log("-".repeat(80));
  console.log(`Total: ${DATASETS.length} datasets\n`);
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  const args = parseArgs();

  if (args.help) {
    printHelp();
    return;
  }

  if (args.list) {
    listDatasets();
    return;
  }

  let datasetsToDownload = DATASETS;

  if (args.filter) {
    datasetsToDownload = DATASETS.filter((d) =>
      d.name.toLowerCase().includes(args.filter!.toLowerCase()),
    );
    console.log(`\n🔍 Filter: "${args.filter}"`);
    console.log(`📊 Found ${datasetsToDownload.length} matching datasets\n`);
  }

  if (args.dryRun) {
    console.log("\n🔍 DRY RUN - Showing what would be downloaded:\n");
    listDatasets();
    return;
  }

  await downloadAll(datasetsToDownload, MAX_CONCURRENT_DOWNLOADS);
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
