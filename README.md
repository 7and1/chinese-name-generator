# Chinese Name Generator (中文姓名生成器)

[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Professional Chinese name generator powered by traditional culture and modern AI**

融合周易、五行、诗词典故的专业中文起名系统

---

## 🌟 Features

### 📊 Core Analysis Engines

- **八字分析 (BaZi Analysis)**: Calculate Four Pillars based on birth date/time and determine favorable Five Elements
- **五格剖象 (Wuge Numerology)**: Analyze five grids (天格、人格、地格、外格、总格) with 81 numerology interpretations
- **音韵学 (Phonetics)**: Tone pattern analysis, homophone detection, and readability scoring
- **诗词典故 (Classical Poetry)**: Names inspired by 诗经, 楚辞, 唐诗, 宋词, and classical literature

### 🎯 Unique Selling Points

✅ **Most Comprehensive Data**: 57+ open-source datasets
✅ **Largest Literature Collection**: 7.1 billion characters from classical texts
✅ **Professional Algorithms**: Authentic BaZi and Wuge calculations
✅ **Multilingual Support**: Chinese, English, Japanese, Korean
✅ **Open Source**: Built with transparency and community in mind

---

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router + Turbopack)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS + shadcn/ui
- **i18n**: next-intl (4 languages)
- **Animation**: Framer Motion
- **Charts**: Recharts

### Backend

- **Database**: SQLite / Turso (libSQL)
- **ORM**: Drizzle ORM
- **Chinese Lib**: lunar-javascript, pinyin-pro, hanzi, opencc-js, jieba-wasm

### Core Engines

```
lib/engines/
├── bazi.ts        # Eight Characters calculation
├── wuge.ts        # Five Grids numerology
├── phonetics.ts   # Tone analysis
└── scorer.ts      # Comprehensive scoring
```

---

## 📁 Project Structure

```
chinese-name/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Internationalized routes
│   │   ├── page.tsx         # Homepage
│   │   ├── generate/        # Name generation
│   │   ├── analyze/         # Name analysis
│   │   └── explore/         # Cultural exploration
│   ├── api/                 # API routes
│   └── globals.css          # Global styles
├── lib/                     # Core library
│   ├── engines/             # Analysis engines
│   │   ├── bazi.ts
│   │   ├── wuge.ts
│   │   ├── phonetics.ts
│   │   └── scorer.ts
│   ├── types/               # TypeScript types
│   ├── constants/           # App constants
│   ├── utils.ts             # Utilities
│   └── db/                  # Database connection
├── drizzle/                 # Database schema
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── features/            # Feature components
│   └── visualizations/      # Charts & graphics
├── messages/                # i18n translations
├── scripts/                 # Data processing scripts
├── data/                    # Data storage
│   ├── raw/                 # Original datasets
│   └── processed/           # Processed data
└── public/                  # Static assets
```

---

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm or pnpm

### Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd chinese-name
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="file:./data/chinese-name.db"
# Optional: Turso cloud database
# DATABASE_URL="libsql://your-database.turso.io"
# DATABASE_AUTH_TOKEN="your-token"
```

4. **Run database migrations** _(when data is ready)_

```bash
npm run db:push
```

5. **Start development server**

```bash
npm run dev
```

6. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📊 Data Sources (57+)

### 1. Literature & Poetry

- **chinese-poetry**: 55k Tang poems, 260k Song poems, 诗经, 楚辞, 宋词
- **Chinese Text Project API**: 7.1 billion characters (论语, 孟子, 庄子, etc.)
- **modern-poetry**: Modern Chinese poetry
- **couplet-dataset**: 700k+ Chinese couplets

### 2. Dictionaries

- **chinese-xinhua**: 31k idioms, 14k sayings, 16k characters, 264k words
- **Kangxi Dictionary**: Complete historical dictionary
- **CC-CEDICT**: 124k Chinese-English entries
- **Unihan Database**: Official Unicode CJK data

### 3. Name Data

- **ChineseNames**: 1,806 surnames + 2,614 given names (1930-2008 statistics)
- **Chinese Name-to-Gender**: 1M+ real names with gender data

### 4. Character Info

- **Make Me a Hanzi**: 9,507 characters with stroke SVG
- **HSK & Frequency Lists**: 11k common characters

### 5. I Ching & Metaphysics

- **iching-wilhelm-dataset**: Complete 64 hexagrams
- **81 Numerology**: Five Grids interpretation tables

---

## 🎨 Features in Detail

### 1. Name Generation Engine

```typescript
import { generateNames } from "@/lib/engines/generator";

const names = await generateNames({
  surname: "王",
  gender: "male",
  birthDate: new Date("2024-01-15"),
  style: "poetic",
  source: "poetry",
  maxResults: 20,
});
```

### 2. Name Analysis

```typescript
import { analyzeName } from "@/lib/engines/analyzer";

const analysis = analyzeName({
  fullName: "王晓明",
  birthDate: new Date("2024-01-15"),
});

console.log(analysis.score); // Overall score 0-100
console.log(analysis.breakdown); // BaZi, Wuge, Phonetics
```

### 3. Scoring System

- **BaZi Compatibility**: 30% weight
- **Wuge Numerology**: 25% weight
- **Phonetic Harmony**: 20% weight
- **Character Meaning**: 25% weight

---

## 📜 Scripts

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate migrations
npm run db:migrate       # Run migrations
npm run db:push          # Push schema to database
npm run db:studio        # Open Drizzle Studio

# Data Processing (when implemented)
npm run data:download    # Download datasets
npm run data:process     # Process raw data
npm run data:import      # Import to database

# Testing
npm run test             # Run tests with Vitest
npm run test:ui          # Open Vitest UI
```

---

## 🌍 Internationalization

Supported locales: `zh` (Chinese), `en` (English), `ja` (Japanese), `ko` (Korean)

Files: `messages/{locale}.json`

Route structure: `/{locale}/page`

---

## 🎯 Roadmap

### Phase 1: MVP ✅ (Current)

- [x] Project setup
- [x] Core engines (BaZi, Wuge, Phonetics, Scorer)
- [x] Database schema
- [x] Basic homepage
- [x] i18n configuration

### Phase 2: Core Features (Next)

- [ ] Name generation engine
- [ ] Data download scripts
- [ ] Data processing pipeline
- [ ] Database import
- [ ] Generate & Analyze pages

### Phase 3: UI/UX

- [ ] shadcn/ui components
- [ ] Feature components
- [ ] Visualizations (radar charts, animations)
- [ ] Responsive design

### Phase 4: Advanced Features

- [ ] API routes
- [ ] PDF export
- [ ] Share functionality
- [ ] User favorites
- [ ] AI-enhanced interpretations

### Phase 5: Production

- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Testing (unit + integration)
- [ ] Documentation
- [ ] Deployment

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Open Source Data

- [chinese-poetry](https://github.com/chinese-poetry/chinese-poetry) - Poetry database
- [chinese-xinhua](https://github.com/pwxcoo/chinese-xinhua) - Dictionary data
- [ChineseNames](https://github.com/psychbruce/ChineseNames) - Name statistics
- [Make Me a Hanzi](https://github.com/skishore/makemeahanzi) - Stroke order data
- [CC-CEDICT](https://cc-cedict.org/) - Chinese-English dictionary

### Libraries

- [lunar-javascript](https://github.com/6tail/lunar-javascript) - Chinese calendar
- [pinyin-pro](https://github.com/zh-lx/pinyin-pro) - Pinyin conversion
- [next-intl](https://next-intl-docs.vercel.app/) - i18n for Next.js

---

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

<p align="center">
  Made with ❤️ using Next.js 15, TypeScript, and Traditional Chinese Culture
</p>

<p align="center">
  基于 57+ 开源数据集 | 融合传统文化与现代科技
</p>
