
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";
import { env } from "@/lib/env";
import { notFound } from "next/navigation";
import { JsonLd, generateArticleSchema } from "@/components/seo/json-ld";
import { Breadcrumb } from "@/components/seo/breadcrumb";
import { generatePageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const BLOG_ARTICLES: Record<
  string,
  {
    title: { zh: string; en: string; ja?: string; ko?: string };
    description: { zh: string; en: string; ja?: string; ko?: string };
    content: { zh: string; en: string; ja?: string; ko?: string };
    date: string;
    category: string;
    author: string;
  }
> = {
  "how-to-choose-chinese-baby-name": {
    title: {
      zh: "如何给宝宝起一个好名字？全面指南",
      en: "How to Choose a Good Chinese Baby Name? A Complete Guide",
    },
    description: {
      zh: "从八字分析、五行搭配、五格剖象到音韵美感，全面解析中文起名的要点和方法，帮助您为宝宝起一个吉祥美好的名字。",
      en: "A comprehensive guide to Chinese naming covering BaZi analysis, Five Elements, Wuge numerology, and phonetic harmony.",
    },
    date: "2024-01-15",
    category: "起名技巧",
    author: "Chinese Name Generator Team",
    content: {
      zh: `
# 如何给宝宝起一个好名字？

给孩子起名是每个父母都要面对的重要任务。一个好听、有寓意、与八字相合的名字，能够陪伴孩子一生。

## 一、了解八字分析

八字，又称四柱，是根据出生年月日时计算出的五行能量分布。通过分析八字的强弱，可以确定孩子五行中需要补益的部分。

### 如何计算八字？

1. 年柱：根据出生年份确定
2. 月柱：根据出生月份确定
3. 日柱：根据出生日期确定
4. 时柱：根据出生时辰确定

## 二、五行补益原则

五行相生相克是起名的重要依据：
- 金生水、水生木、木生火、火生土、土生金
- 金克木、木克土、土克水、水克火、火克金

如果孩子八字中某五行偏弱，可以在名字中选用对应五行的字来补足。

## 三、五格剖象分析

五格剖象通过姓名笔画数理来判断吉凶：

1. **天格**：代表祖先运、先天运
2. **人格**：代表主运、核心性格
3. **地格**：代表前运、基础运
4. **外格**：代表副运、社交运
5. **总格**：代表总运、晚运

## 四、音韵美感

好的名字应该：
- 声调起伏有致
- 避免拗口难读
- 没有不良谐音

## 五、推荐名字

根据以上原则，以下是一些吉祥的名字示例：

**男宝宝**：
- 浩然（五行：水，寓意：正大刚直）
- 梓睿（五行：木火，寓意：聪明睿智）
- 铭宇（五行：金土，寓意：气宇轩昂）

**女宝宝**：
- 诗涵（五行：金水，寓意：诗情画意）
- 雨萱（五行：木木，寓意：快乐无忧）
- 梦琪（五行：木木，寓意：美玉无瑕）

使用我们的起名工具，可以根据您孩子的具体情况，生成更个性化的名字建议。
      `,
      en: `
# How to Choose a Good Chinese Baby Name?

Naming your child is one of the most important decisions you'll make as a parent. A beautiful, meaningful, and harmonious name will accompany them throughout their life.

## 1. Understanding BaZi Analysis

BaZi (Four Pillars) is the Five Elements energy distribution calculated from the birth date and time. By analyzing the strength of these elements, you can determine which elements need strengthening.

### How to Calculate BaZi?

1. **Year Pillar**: Determined by birth year
2. **Month Pillar**: Determined by birth month
3. **Day Pillar**: Determined by birth date
4. **Hour Pillar**: Determined by birth hour

## 2. Five Elements Balance

The generative and controlling relationships of Five Elements are crucial for naming:

- Metal generates Water, Water generates Wood, Wood generates Fire, Fire generates Earth, Earth generates Metal
- Metal controls Wood, Wood controls Earth, Earth controls Water, Water controls Fire, Fire controls Metal

If a certain element is weak in your child's BaZi, choose characters with that element to strengthen it.

## 3. Wuge Numerology Analysis

Wuge (Five Grids) determines auspiciousness through stroke counts:

1. **Heaven Grid**: Ancestral fortune
2. **Human Grid**: Main fortune, core personality
3. **Earth Grid**: Early fortune
4. **Outer Grid**: Social fortune
5. **Total Grid**: Overall fortune

## 4. Phonetic Beauty

A good name should be:
- Varied in tone patterns
- Easy to pronounce
- Free of negative homophones

## 5. Recommended Names

**Boys**:
- Haoran (Water): Vast and magnanimous
- Zirui (Wood-Fire): Intelligent and wise
- Mingyu (Metal-Earth): Dignified appearance

**Girls**:
- Shihan (Metal-Water): Poetic and artistic
- Yuxuan (Wood-Wood): Happy and carefree
- Mengqi (Wood-Wood): Beautiful and precious

Use our naming tool for personalized suggestions based on your child's specific situation.
      `,
    },
  },
  "five-elements-naming-guide": {
    title: {
      zh: "五行起名：金木水火土的奥秘",
      en: "Five Elements Naming: The Secrets of Metal, Wood, Water, Fire, Earth",
    },
    description: {
      zh: "详解五行相生相克原理，教你如何根据宝宝八字选择合适的五行汉字，达到五行平衡。",
      en: "Understanding Five Elements relationships and selecting characters based on your baby's BaZi for harmony.",
    },
    date: "2024-01-20",
    category: "五行起名",
    author: "Chinese Name Generator Team",
    content: {
      zh: `
# 五行起名详解

五行理论是中国传统文化的核心，也是起名的重要依据。通过五行的相生相克，可以为孩子选择一个平衡和谐的名字。

## 五行基础知识

五行即金、木、水、火、土，它们之间存在相生相克的关系：

### 相生关系
- 金生水：金属熔化成液体，金能生水
- 水生木：水滋养万物，水能生木
- 木生火：木燃烧生火
- 火生土：燃烧后化为灰烬
- 土生金：金属蕴藏于土中

### 相克关系
- 金克木：金属可以砍伐树木
- 木克土：树木根系可以破土
- 土克水：土可以阻挡水流
- 水克火：水可以灭火
- 火克金：火可以熔化金属

## 如何根据五行起名

### 1. 分析八字五行

首先需要计算孩子的八字，统计各五行的数量：

- 如果某个五行偏弱（0-1个），需要用对应五行的字来补足
- 如果某个五行过旺（4个以上），需要用克制的五行来平衡

### 2. 选择合适的汉字

不同五行的汉字举例：

**金**：鑫、锐、铭、锦、钢、钰、银
**木**：林、森、杰、梓、楠、柏、松、竹
**水**：海、涵、泽、浩、洋、淼、清、洁
**火**：炎、烨、焱、煜、晖、晨、昊、星
**土**：坤、培、坚、城、圣、佳、宇、轩

### 3. 注意五行搭配

名字中五行的搭配也很重要：
- 相生搭配：金水、水木、木火、火土、土金（吉）
- 相克搭配：金木、木土、土水、水火、火金（慎用）

## 五行起名示例

假设一个男宝宝八字分析结果：金1个、木0个、水2个、火1个、土2个。

**分析**：五行缺木，需要补木。

**推荐名字**：
- 梓睿（木火）：梓补木，睿属火，木火相生
- 森宇（木土）：森补木，宇属土，木克土（适度）
- 柏然（木金）：柏补木，然属金，金克木（适度）
      `,
      en: `
# Five Elements Naming Guide

Five Elements theory is central to Chinese culture and an important basis for naming. Through the generative and controlling relationships of the Five Elements, you can choose a balanced and harmonious name for your child.

## Five Elements Basics

The Five Elements are Metal, Wood, Water, Fire, and Earth. They have generative and controlling relationships:

### Generative Relationships
- Metal generates Water
- Water generates Wood
- Wood generates Fire
- Fire generates Earth
- Earth generates Metal

### Controlling Relationships
- Metal controls Wood
- Wood controls Earth
- Earth controls Water
- Water controls Fire
- Fire controls Metal

## How to Name by Five Elements

### 1. Analyze BaZi Five Elements

First calculate your child's BaZi and count the elements:

- If an element is weak (0-1), use characters of that element to strengthen
- If an element is too strong (4+), use controlling elements to balance

### 2. Choose Appropriate Characters

**Metal**: Xin, Rui, Ming, Jin, Gang
**Wood**: Lin, Sen, Jie, Zi, Nan
**Water**: Hai, Han, Ze, Hao, Yang
**Fire**: Yan, Ye, Xi, Yu, Hui
**Earth**: Kun, Pei, Jian, Cheng, Sheng

### 3. Note Element Combinations

Element combinations in names matter:
- Generative: Metal-Water, Water-Wood, Wood-Fire, Fire-Earth, Earth-Metal (Auspicious)
- Controlling: Metal-Wood, Wood-Earth, Earth-Water, Water-Fire, Fire-Metal (Use carefully)

## Five Elements Naming Example

A baby boy's BaZi analysis shows: Metal 1, Wood 0, Water 2, Fire 1, Earth 2.

**Analysis**: Missing Wood, need to strengthen Wood.

**Recommended Names**:
- Zirui (Wood-Fire): Zi strengthens Wood, Rui belongs to Fire, Wood generates Fire
- Senyu (Wood-Earth): Sen strengthens Wood, Yu belongs to Earth
- Boran (Wood-Metal): Bo strengthens Wood, Ran belongs to Metal
      `,
    },
  },
  // SEO: Add more blog articles with full content for SEO
  "chinese-surname-culture": {
    title: {
      zh: "中国姓氏文化：百家姓背后的故事",
      en: "Chinese Surname Culture: Stories Behind the Hundred Family Surnames",
    },
    description: {
      zh: "探索中国姓氏的起源、分布和历史文化意义，了解您的姓氏背后的故事，包括李、王、张、刘、陈等大姓的来源。",
      en: "Explore the origins, distribution, and cultural significance of Chinese surnames including Li, Wang, Zhang, Liu, Chen and more.",
    },
    date: "2024-01-25",
    category: "姓氏文化",
    author: "Chinese Name Generator Team",
    content: {
      zh: `
# 中国姓氏文化：百家姓背后的故事

中国姓氏文化源远流长，承载着中华民族的历史记忆和血脉传承。了解姓氏文化，不仅能够追溯家族渊源，还能从中汲取文化养分。

## 姓氏的起源

中国姓氏的来源多种多样，主要包括：

### 1. 以图腾为姓
远古时期，各个部落以动植物为图腾，这些图腾后来演变为姓氏。如：熊、牛、马、羊、龙等。

### 2. 以封国为姓
周朝分封诸侯，诸侯国灭亡后，国人以国为姓。如：齐、鲁、晋、宋、陈等。

### 3. 以官职为姓
古代官职后来演变为姓氏。如：司马、司徒、司空、尉迟等。

### 4. 以居地为姓
以居住地的地名、山名、水名为姓。如：东郭、西门、南宫等。

### 5. 以职业为姓
以从事的职业为姓氏。如：陶、屠、巫、卜等。

## 中国大姓的故事

### 李姓
李姓是中国第一大姓，人口约9500万。起源有三：1. 出自嬴姓，颛顼之后皋陶任大理；2. 商末理利贞避难改为李；3. 少数民族改姓。

**历史名人**：李白、李清照、李时珍、李大钊

### 王姓
王姓是中国第二大姓，起源复杂：1. 出自姬姓，周灵王太子晋；2. 出自子姓，商纣王叔父比干；3. 出自妫姓，齐王田和之后。

**历史名人**：王羲之、王安石、王昭君、王阳明

### 张姓
张姓起源：1. 出自姬姓，黄帝之孙挥发明弓箭，赐姓张；2. 少数民族改姓。

**历史名人**：张仲景、张之洞、张骞、张学良

## 姓氏的地域分布

中国姓氏分布有明显的地域特征：
- 北方：王、张、李、刘
- 南方：陈、林、黄、郑
- 广东：陈、李、黄、张
- 福建：陈、林、黄、吴

了解您的姓氏文化，可以更好地传承家族精神。
      `,
      en: `
# Chinese Surname Culture: Stories Behind the Hundred Family Surnames

Chinese surname culture has a long history, carrying the historical memory and bloodline of the Chinese nation. Understanding surname culture helps trace family origins and gain cultural insights.

## Origins of Chinese Surnames

Chinese surnames come from various sources:

### 1. Totem-based Surnames
Ancient tribes adopted animals and plants as totems, which later became surnames such as Xiong (bear), Niu (cow), Ma (horse).

### 2. State-based Surnames
After the fall of feudal states, people took the state name as their surname: Qi, Lu, Jin, Song, Chen.

### 3. Official Title-based Surnames
Ancient official positions became surnames: Sima, Situ, Sikong, Yuchi.

### 4. Location-based Surnames
Named after residence locations: Dongguo (east wall), Ximen (west gate), Nangong (south palace).

### 5. Profession-based Surnames
Based on occupations: Tao (potter), Tu (butcher), Wu (shaman), Bu (diviner).

## Stories of Major Chinese Surnames

### Li (李)
Li is China's most common surname with about 95 million people. Origins: 1. From Ying surname, Gaoyao served as Dali; 2. Li Lizhen changed surname to Li; 3. Minority name changes.

**Famous People**: Li Bai, Li Qingzhao, Li Shizhen, Li Dazhao

### Wang (王)
Wang is the second most common surname. Origins: 1. From Ji surname, Crown Prince Jin of Zhou Ling Wang; 2. From Zi surname, Bigan of Shang; 3. From Gui surname, Tian He of Qi.

**Famous People**: Wang Xizhi, Wang Anshi, Wang Zhaojun, Wang Yangming

### Zhang (张)
Zhang surname origins: 1. From Ji surname, Hui (grandson of Yellow Emperor) invented bow and arrow; 2. Minority name changes.

**Famous People**: Zhang Zhongjing, Zhang Zhidong, Zhang Qian, Zhang Xueliang

## Geographic Distribution

Chinese surnames show distinct regional patterns:
- Northern China: Wang, Zhang, Li, Liu
- Southern China: Chen, Lin, Huang, Zheng
- Guangdong: Chen, Li, Huang, Zhang
- Fujian: Chen, Lin, Huang, Wu

Understanding your surname culture helps preserve family heritage.
      `,
    },
  },
  "poetry-inspired-names": {
    title: {
      zh: "诗词起名：从诗经楚辞中寻找灵感",
      en: "Poetry-Inspired Names: Finding Inspiration from Classic Chinese Poetry",
    },
    description: {
      zh: "《诗经》《楚辞》《唐诗》《宋词》中蕴含着丰富的起名素材，教你如何从古典诗词中汲取灵感，为宝宝起一个富有文化底蕴的名字。",
      en: "Discover naming inspiration from the Book of Songs, Chu Ci, Tang Poetry, and Song Lyrics for culturally rich names.",
    },
    date: "2024-02-01",
    category: "诗词起名",
    author: "Chinese Name Generator Team",
    content: {
      zh: `
# 诗词起名：从诗经楚辞中寻找灵感

中国古典诗词是取之不尽的起名宝库。从《诗经》《楚辞》到唐诗宋词，古人留下了无数优美的篇章，其中蕴含着丰富的起名素材。

## 诗经起名

《诗经》是中国最早的诗歌总集，分为风、雅、颂三部分，共305篇。

### 诗经名句精选

1. **窈窕淑女，君子好逑**
   - 可取名：窈、淑、君
   - 寓意：美好贤淑的女子，是君子的好配偶

2. **桃之夭夭，灼灼其华**
   - 可取名：桃、灼、华
   - 寓意：像桃花一样美丽

3. **青青子衿，悠悠我心**
   - 可取名：子衿、悠悠
   - 寓意：思念情深

4. **如切如磋，如琢如磨**
   - 可取名：切、磋、琢、磨
   - 寓意：不断修养、精益求精

## 楚辞起名

《楚辞》是中国第一部浪漫主义诗歌总集，充满神话色彩和想象力。

### 楚辞名句精选

1. **路漫漫其修远兮，吾将上下而求索**
   - 可取名：修远、求索
   - 寓意：追求真理、不断探索

2. **举世皆浊我独清，众人皆醉我独醒**
   - 可取名：独清、独醒
   - 寓意：保持清醒、不同流合污

3. **抚长剑兮玉珥，璆锵鸣兮琳琅**
   - 可取名：璆、琳、琅
   - 寓意：美玉般高洁

## 唐诗起名

唐诗是中国诗歌的巅峰，意境深远，用词优美。

### 唐诗名句精选

1. **海上生明月，天涯共此时**
   - 可取名：明月、天涯
   - 寓意：光明远大、胸怀宽广

2. **大漠孤烟直，长河落日圆**
   - 可取名：长河、落日
   - 寓意：雄浑壮阔

3. **会当凌绝顶，一览众山小**
   - 可取名：凌绝、一览
   - 寓意：志向高远

## 宋词起名

宋词以婉约见长，情感细腻，意境优美。

### 宋词名句精选

1. **但愿人长久，千里共婵娟**
   - 可取名：长久、婵娟
   - 寓意：美好长久

2. **无可奈何花落去，似曾相识燕归来**
   - 可取名：相识、归来
   - 寓意：美好重现

## 诗词起名建议

1. **注意音律**：选择读音优美的字
2. **注意寓意**：选择含义吉祥的字
3. **注意搭配**：确保与姓氏搭配和谐
4. **避免生僻**：不要选择过于生僻的字

使用我们的起名工具，可以根据诗词为您推荐更多优美名字。
      `,
      en: `
# Poetry-Inspired Names: Finding Inspiration from Classic Chinese Poetry

Classical Chinese poetry is an inexhaustible treasure trove for naming. From the Book of Songs and Chu Ci to Tang Poetry and Song Lyrics, ancient poets left countless beautiful works containing rich naming materials.

## Naming from Book of Songs (Shijing)

The Book of Songs is China's earliest poetry collection, divided into Feng, Ya, and Song sections, with 305 poems.

### Selected Verses

1. **"Yao tiao shu nv, jun zi hao qiu"**
   - Names: Yao, Shu, Jun
   - Meaning: Beautiful and virtuous lady, a gentleman's good match

2. **"Tao zhi yao yao, zhuo zhuo qi hua"**
   - Names: Tao, Zhuo, Hua
   - Meaning: Beautiful as peach blossoms

3. **"Qing qing zi jin, you you wo xin"**
   - Names: Zijin, Youyou
   - Meaning: Deep affection and longing

## Naming from Chu Ci

Chu Ci is China's first collection of romantic poetry, full of mythological elements.

### Selected Verses

1. **"Lu man man qi xiu yuan xi"**
   - Names: Xiuyuan
   - Meaning: Pursuing truth, constant exploration

2. **"Ju shi jie zhuo wo du qing"**
   - Names: Duqing
   - Meaning: Maintaining clarity and purity

## Naming from Tang Poetry

Tang Poetry represents the peak of Chinese poetry.

### Selected Verses

1. **"Hai shang sheng ming yue"**
   - Names: Mingyue
   - Meaning: Bright and radiant

2. **"Hui dang ling jue ding"**
   - Names: Lingjue
   - Meaning: High aspirations

## Naming from Song Lyrics

Song Ci is known for its graceful style and delicate emotions.

### Selected Verses

1. **"Dan yuan ren chang jiu"**
   - Names: Changjiu
   - Meaning: Long-lasting beauty and happiness

## Tips for Poetry-Inspired Naming

1. Consider phonetics - choose characters with beautiful sounds
2. Consider meaning - select auspicious characters
3. Consider combinations - ensure harmony with surname
4. Avoid obscurity - don't choose overly rare characters

Use our naming tool for more poetry-inspired recommendations.
      `,
    },
  },
  "wuge-numerology-explained": {
    title: {
      zh: "五格剖象详解：天格人格地格外格总格",
      en: "Understanding Wuge Numerology: Heaven, Human, Earth, Outer, and Total Grids",
    },
    description: {
      zh: "深入解析五格剖象姓名学，包括五格的计算方法和81数理吉凶解释，帮助您选择数理吉祥的好名字。",
      en: "An in-depth look at Wuge numerology including calculation methods and 81 numerology meanings for auspicious naming.",
    },
    date: "2024-02-10",
    category: "五格剖象",
    author: "Chinese Name Generator Team",
    content: {
      zh: `
# 五格剖象详解：天格人格地格外格总格

五格剖象姓名学是一种通过姓名笔画数理来判断吉凶的学问。它将姓名分为五个"格"，每个格代表不同的运势。

## 五格的含义

### 1. 天格
- **代表**：祖先运、先天运、前运
- **计算**：姓氏笔画+1（单姓）或姓氏笔画之和（复姓）
- **影响**：影响青少年时期的运势

### 2. 人格
- **代表**：主运、核心性格、中心运
- **计算**：姓氏最后字+名字第一字的笔画之和
- **影响**：最重要的一格，影响一生运势

### 3. 地格
- **代表**：前运、基础运、中年运
- **计算**：名字笔画之和（单名+1）
- **影响**：影响中年以前运势

### 4. 外格
- **代表**：副运、社交运、外部运
- **计算**：总格-人格+1（单名）或名字笔画+姓氏首字+1
- **影响**：影响人际关系和社交

### 5. 总格
- **代表**：总运、晚运
- **计算**：姓氏和名字的笔画总和
- **影响**：影响中年以后运势

## 81数理吉凶

五格的计算结果是1-81之间的数字，每个数字都有特定的吉凶含义。

### 吉祥数字（部分）
- 1：太极之数，万物开泰
- 3：吉祥如意，繁荣兴家
- 5：种竹成林，福禄长寿
- 6：安稳吉庆，百事如意
- 7：刚毅果断，勇往直前
- 8：坚刚至毅，功成名就
- 13：智谋超群，学识渊博
- 15：福寿双全，德望高大
- 16：贵人相助，名利双收
- 21：明月中天，万物明朗
- 23：旭日东升，壮丽壮观
- 24：家门余庆，金钱丰盈
- 25：资性英敏，有奇特之才
- 31：智勇双全，意志坚固
- 32：宝马金鞍，侥幸多望
- 33：旭日升天，名闻天下
- 35：温和平静，优雅发展
- 37：权威显达，吉人天相
- 39：富贵荣华，变化无穷
- 41：德望高大，忠孝俱全
- 45：新生泰和，万事如意
- 47：开花之象，大业发达
- 48：青松立鹤，智谋兼备
- 52：草木逢春，得君而行
- 57：游走四方，做生意大吉
- 61：牡丹芙蓉，名利双收
- 63：富贵长寿，逢凶化吉
- 65：富贵长寿，公侯之数
- 67：富贵荣华，事事通达
- 68：思虑周详，计划力行
- 81：万物回春，大吉大利

### 不吉数字（部分）
- 2：虚弱不定，分离之象
- 4：坎坷不平，苦难折磨
- 9：虽有成功能，难望成功
- 10：万事终局，衰落颓废
- 12：掘井无泉，薄弱无力
- 14：孤独寂寞，难享天伦
- 19：多难智能，难保平安
- 20：物将坏之象，分裂灭亡
- 22：秋草逢霜，怀才不遇
- 26：变怪奇异，豪杰气概
- 27：欲望无足，诽谤嫉妒
- 28：家亲缘薄，飘泊离乡
- 30：沉浮不定，吉凶难分
- 34：破家之数，见识宏大
- 36：波澜重叠，侠肝义胆
- 40：退安保吉，谨慎从事
- 42：寒蝉悲柳，艺胆才能
- 43：花果虽秀，稀薄之数
- 44：须眉难展，力量有限
- 46：载宝沉舟，浪里淘金
- 49：吉凶难分，艰辛备尝
- 50：小舟入海，吉凶参半
- 53：外表光鲜，内心忧愁
- 54：石上载花，成败难定
- 55：外美内苦，多难之数
- 56：浪里行舟，历尽艰辛
- 58：晚运凄凉，困苦之数
- 59：寒雪悲松，屡遭失败
- 60：无谋无勇，黑暗不明
- 62：衰败之象，运途不正
- 64：骨肉分离，孤独悲凄
- 66：进退失守，艰难困苦
- 69：非业非力，精神不安
- 70：残菊逢霜，沉沦之数
- 71：万死一生，终身受困
- 72：劳苦劳碌，先苦后甜
- 73：志高力微，努力吉运
- 74：沉沦难起，困苦之数
- 75：守则可安，进取遭难
- 76：倾覆离散，骨肉分离
- 77：吉凶难分，家庭有亏
- 78：晚运凄凉，贫困之数
- 79：精神不安，难得安宁
- 80：一生困苦，难得幸福

## 五格起名建议

1. **人格最重要**：人格代表核心性格，应选择吉数
2. **三才相生**：天格、人格、地格的五行关系应相生
3. **总格吉祥**：总格影响晚运，应选择吉数
4. **避免全凶**：五格不宜全部为凶数
5. **结合八字**：五格应与八字五行配合

使用我们的起名工具，可以自动计算五格并推荐吉祥名字。
      `,
      en: `
# Understanding Wuge Numerology: Heaven, Human, Earth, Outer, and Total Grids

Wuge numerology is a Chinese naming practice that determines auspiciousness through stroke counts. It divides a name into five "grids," each representing different fortunes.

## The Five Grids Explained

### 1. Heaven Grid (Tian Ge)
- **Represents**: Ancestral fortune, innate luck, early fortune
- **Calculation**: Surname strokes + 1 (single) or sum (compound)
- **Influence**: Affects fortune during youth

### 2. Human Grid (Ren Ge)
- **Represents**: Main fortune, core personality, center destiny
- **Calculation**: Sum of last surname char + first given name char
- **Influence**: Most important grid, affects entire life

### 3. Earth Grid (Di Ge)
- **Represents**: Early fortune, foundation luck, middle-age fortune
- **Calculation**: Sum of given name strokes (+1 for single)
- **Influence**: Affects fortune before middle age

### 4. Outer Grid (Wai Ge)
- **Represents**: Auxiliary fortune, social luck, external fortune
- **Calculation**: Total Grid - Human Grid + 1, or given name + first surname char + 1
- **Influence**: Affects interpersonal relationships

### 5. Total Grid (Zong Ge)
- **Represents**: Total fortune, late fortune
- **Calculation**: Sum of all surname and given name strokes
- **Influence**: Affects fortune after middle age

## 81 Numerology Meanings

Each grid calculation results in a number from 1-81, with specific meanings.

### Auspicious Numbers (Selected)
- 1: Supreme beginning, all things prosper
- 3: Auspicious and prosperous
- 5: Bamboo growing into forest, fortune and longevity
- 6: Peaceful and auspicious
- 7: Determined and courageous
- 8: Strong and successful
- 13: Outstanding wisdom
- 15: Both fortune and longevity
- 16: Help from nobles
- 21: Bright moon in sky
- 23: Rising sun
- 24: Family blessings
- 31: Wise and brave
- 32: Precious horse with golden saddle
- 33: Rising sun, famous worldwide
- 37: Authority and success
- 41: High virtue and loyalty
- 48: Green pine and crane
- 61: Peony and lotus, fortune and fame
- 63: Fortune and longevity
- 81: All things returning to life

### Inauspicious Numbers (Selected)
- 2: Weak and unstable
- 4: Rough and difficult
- 9: Hard to achieve success
- 10: Ending phase, decline
- 12: Digging well without water
- 14: Lonely and isolated
- 19: Talented but troubled
- 22: Late autumn frost
- 26: Strange and unusual
- 27: Endless desires
- 34: Broken family
- 40: Need caution
- 44: Limited capability
- 49: Good and bad mixed
- 50: Small boat in ocean
- 56: Boat in waves
- 64: Separation from family
- 70: Withered chrysanthemum
- 78: Desolate fortune

## Wuge Naming Tips

1. **Human Grid is Key**: Should be an auspicious number
2. **Three Elements Harmony**: Heaven, Human, Earth grids should have generative relationships
3. **Total Grid Auspicious**: Affects late fortune
4. **Avoid All Inauspicious**: Don't have all five grids as bad numbers
5. **Combine with BaZi**: Coordinate with Five Elements analysis

Use our naming tool to automatically calculate Wuge and get auspicious name recommendations.
      `,
    },
  },
  "boy-vs-girl-naming": {
    title: {
      zh: "男孩女孩起名有何不同？",
      en: "Differences Between Naming Boys and Girls in Chinese Culture",
    },
    description: {
      zh: "男宝宝和女宝宝起名各有侧重，从用字选择到寓意表达都有不同的讲究。了解男孩女孩起名的差异，为宝宝选择合适的名字。",
      en: "Different considerations for naming boys and girls, from character selection to meaning expression in Chinese naming culture.",
    },
    date: "2024-02-15",
    category: "起名技巧",
    author: "Chinese Name Generator Team",
    content: {
      zh: `
# 男孩女孩起名有何不同？

在中国传统文化中，男孩和女孩的起名有不同的侧重点和讲究。了解这些差异，能够更好地为孩子选择合适的名字。

## 男孩起名特点

### 用字偏好
男孩名字多用阳刚、大气、有力量感的字：
- **志向类**：志、远、宏、伟、博、宇、轩
- **品德类**：德、仁、义、礼、信、诚、正
- **才华类**：才、智、慧、聪、明、哲、睿
- **力量类**：强、刚、毅、勇、威、武、龙
- **自然类**：山、海、天、云、雷、松、柏

### 寓意特点
- 体现远大志向
- 表达品德高尚
- 展现才华智慧
- 寄托家族期望

### 男孩起名示例
- 浩然：正大刚直，浩气长存
- 梓睿：聪明睿智，学识渊博
- 铭宇：气宇轩昂，铭记于心
- 景行：高山仰止，景行行止
- 瑞霖：祥瑞降临，恩泽如雨

## 女孩起名特点

### 用字偏好
女孩名字多用柔美、优雅、有诗意的字：
- **美丽类**：美、丽、秀、妍、婷、嫣、娇
- **柔美类**：柔、婉、娴、静、雅、淑、惠
- **花草类**：花、兰、梅、菊、荷、莉、薇
- **珍贵类**：玉、珍、珠、宝、琪、瑶、琳
- **诗情类**：诗、琴、棋、书、画、韵、艺

### 寓意特点
- 体现美丽优雅
- 表达温柔贤淑
- 展现才艺气质
- 寄托美好祝愿

### 女孩起名示例
- 诗涵：诗情画意，涵养深厚
- 雨萱：清新如雨，快乐无忧
- 梦琪：美玉无瑕，如梦如幻
- 雅静：优雅文静，知书达理
- 语嫣：笑语嫣然，美丽动人

## 男女通用的起名原则

虽然男女起名有差异，但以下原则都适用：

### 1. 五行平衡
根据宝宝八字选择合适五行的字

### 2. 音韵美感
名字读起来要好听，避免不良谐音

### 3. 五格吉祥
姓名五格数理要吉利

### 4. 寓意美好
名字要有积极正面的含义

### 5. 避免生僻
不要用过于生僻的字

### 6. 考虑搭配
名字要与姓氏搭配和谐

## 起名注意事项

1. **不要太刻意区分**：有些字男女都适用
2. **避免过于俗套**：不要用太俗气的字
3. **考虑时代感**：名字要有时代特色
4. **尊重传统**：可以参考传统起名方法
5. **考虑未来发展**：名字要适合孩子一生

使用我们的起名工具，可以根据性别、八字等条件为您推荐合适的名字。
      `,
      en: `
# Differences Between Naming Boys and Girls in Chinese Culture

In traditional Chinese culture, there are different considerations for naming boys and girls. Understanding these differences helps in choosing appropriate names.

## Boy Naming Characteristics

### Character Preferences
Boy names use masculine, grand, and powerful characters:
- **Aspirational**: Zhi (ambition), Yuan (far), Hong (grand), Wei (great), Bo (broad)
- **Virtue**: De (virtue), Ren (benevolence), Yi (righteousness), Li (courtesy), Xin (trust)
- **Talent**: Cai (talent), Zhi (wisdom), Cong (smart), Ming (bright), Rui (wise)
- **Strength**: Qiang (strong), Gang (firm), Yong (brave), Wei (power), Wu (martial), Long (dragon)
- **Nature**: Shan (mountain), Hai (sea), Tian (sky), Yun (cloud), Lei (thunder), Song (pine)

### Meaning Characteristics
- Reflect high aspirations
- Express noble character
- Showcase talent and wisdom
- Convey family expectations

### Boy Name Examples
- Haoran: Vast and magnanimous
- Zirui: Intelligent and wise
- Mingyu: Dignified appearance
- Jingxing: Lofty ideals
- Ruilin: Auspicious blessing

## Girl Naming Characteristics

### Character Preferences
Girl names use feminine, elegant, and poetic characters:
- **Beauty**: Mei (beautiful), Li (lovely), Xiu (elegant), Yan (pretty), Ting (graceful)
- **Gentleness**: Rou (gentle), Wan (graceful), Xian (refined), Jing (quiet), Ya (elegant), Shu (virtuous)
- **Flowers**: Hua (flower), Lan (orchid), Mei (plum), Ju (chrysanthemum), He (lotus), Li (jasmine)
- **Precious**: Yu (jade), Zhen (treasure), Zhu (pearl), Qi (fine jade), Yao (gem), Lin (beautiful jade)
- **Arts**: Shi (poetry), Qin (zither), Qi (chess), Shu (calligraphy), Hua (painting), Yun (rhyme)

### Meaning Characteristics
- Reflect beauty and elegance
- Express gentleness and virtue
- Showcase artistic temperament
- Convey best wishes

### Girl Name Examples
- Shihan: Poetic and artistic
- Yuxuan: Fresh and carefree
- Mengqi: Beautiful as jade
- Yajing: Elegant and quiet
- Yuyan: Beautiful and charming

## Universal Naming Principles

While there are differences, these principles apply to both:

### 1. Five Elements Balance
Choose characters based on BaZi analysis

### 2. Phonetic Beauty
Name should sound pleasant without negative homophones

### 3. Auspicious Wuge
All five grids should be favorable

### 4. Positive Meaning
Name should have positive significance

### 5. Avoid Obscurity
Don't use overly rare characters

### 6. Consider Combinations
Name should harmonize with surname

## Naming Considerations

1. Don't over-differentiate - some characters work for both genders
2. Avoid clichés - don't use overly common characters
3. Consider the times - names should reflect contemporary values
4. Respect tradition - reference traditional naming methods
5. Consider future - name should serve throughout life

Use our naming tool for personalized recommendations based on gender, BaZi, and other factors.
      `,
    },
  },
  "avoiding-bad-homophones": {
    title: {
      zh: "起名避坑：如何避免不良谐音",
      en: "Naming Pitfalls: How to Avoid Negative Homophones",
    },
    description: {
      zh: "起名时一定要检查谐音，避免与贬义词或尴尬词汇谐音造成不必要的困扰。教你如何检查和避免不良谐音。",
      en: "Always check homophones when naming to avoid awkward or negative associations. Learn how to check and avoid bad homophones.",
    },
    date: "2024-02-20",
    category: "音韵起名",
    author: "Chinese Name Generator Team",
    content: {
      zh: `
# 起名避坑：如何避免不良谐音

起名时检查谐音是非常重要的一步。一个听起来很好、寓意优美的名字，如果与不良词汇谐音，可能会给孩子带来不必要的困扰。

## 什么是谐音问题？

谐音是指字音相同或相近而字不同的现象。在起名中，我们需要特别注意以下几种情况：

### 1. 与贬义词谐音
名字听起来像不好的词汇：
- "范统" → "饭桶"（没能力的人）
- "吴仁耀" → "无人要"（没人想要）
- "杜琦" → "肚脐"（身体部位）
- "甄香" → "真香"（网络梗）
- "史珍香" → "屎真香"（粗俗）

### 2. 与尴尬词汇谐音
名字听起来像令人尴尬的词汇：
- "苟日" → "狗日"（骂人话）
- "尤利" → "油腻"（贬义词）
- "范晔" → "犯夜"（犯法）
- "沈京兵" → "神经病"（精神疾病）

### 3. 与不雅事物谐音
- "杨伟" → "阳痿"（疾病）
- "朱头" → "猪头"（骂人）
- "朱大肠" → "猪大肠"（食物，尴尬）

## 如何检查谐音？

### 方法一：方言检查
1. 用普通话读几遍
2. 用家乡方言读几遍
3. 询问他人意见

### 方法二：场景模拟
想象在以下场景中名字会被怎样称呼：
- 学校点名
- 自我介绍
- 老师呼叫
- 面试场合

### 方法三：网络搜索
把名字放在网上搜索，看是否有不良联想

### 方法四：工具辅助
使用起名工具的谐音检查功能

## 常见谐音陷阱

### 1. 双字组合陷阱
- 姓氏+名字组合后产生谐音
- 名字两字之间产生谐音
- 名字与常见词汇谐音

### 2. 多音字陷阱
- 字有多个读音，容易读错
- 不同读音产生不同谐音

### 3. 方言陷阱
- 普通话没问题，方言有问题
- 方言差异导致不同谐音

## 避免谐音的建议

### 1. 多读几遍
用不同的声调、速度读名字

### 2. 询问他人
让家人朋友帮忙检查

### 3. 考虑未来
想想名字在孩子长大后是否合适

### 4. 使用工具
利用起名工具的谐音检查功能

### 5. 延迟决定
选好名字后，放几天再决定

## 良好谐音的例子

正面的谐音可以带来好处：

- "钱进" → "前进"（积极向上）
- "郝运" → "好运"（吉祥）
- "夏天" → "添加"（增加，中性偏正面）

使用我们的起名工具，可以自动检查谐音并推荐安全的好名字。
      `,
      en: `
# Naming Pitfalls: How to Avoid Negative Homophones

Checking homophones is crucial when choosing a name. A name that looks beautiful and meaningful can cause unnecessary trouble if it sounds like negative words.

## What Are Homophone Issues?

Homophones are words that sound the same but have different meanings. In naming, watch out for:

### 1. Negative Word Homophones
Names that sound like negative terms:
- "Fan Tong" → "饭桶" (Rice bucket = useless person)
- "Wu Renyao" → "无人要" (Nobody wants)
- "Du Qi" → "肚脐" (Belly button)

### 2. Awkward Word Homophones
Names that sound like awkward terms:
- "Gou Ri" → "狗日" (Profanity)
- "You Li" → "油腻" (Greasy = annoying)
- "Fan Ye" → "犯夜" (Breaking curfew)

### 3. Inappropriate Association Homophones
- "Yang Wei" → "阳痿" (Medical condition)
- "Zhu Tou" → "猪头" (Pig head = idiot)

## How to Check Homophones?

### Method 1: Dialect Check
1. Read in Mandarin several times
2. Read in local dialect
3. Ask others for opinions

### Method 2: Scenario Simulation
Imagine the name being called in:
- Roll call at school
- Self-introduction
- Teacher addressing
- Job interviews

### Method 3: Online Search
Search the name online for negative associations

### Method 4: Tool Assistance
Use naming tools with homophone checking

## Common Homophone Traps

### 1. Two-Character Combination Traps
- Surname + given name creates homophone
- Between name characters creates homophone
- Name matches common vocabulary

### 2. Multi-Pronunciation Character Traps
- Characters with multiple readings
- Different readings create different homophones

### 3. Dialect Traps
- Fine in Mandarin, problematic in dialect
- Regional differences create different homophones

## Tips to Avoid Homophones

### 1. Read Multiple Times
Use different tones and speeds

### 2. Ask Others
Let family and friends check

### 3. Consider Future
Think about whether the name suits adult life

### 4. Use Tools
Utilize homophone checking features

### 5. Delay Decision
Choose a name, wait a few days, then decide

## Positive Homophone Examples

Good homophones can be beneficial:

- "Qian Jin" → "前进" (Move forward)
- "Hao Yun" → "好运" (Good luck)
- "Xia Tian" → "添加" (Add - neutral/positive)

Use our naming tool to automatically check homophones and get safe, beautiful name recommendations.
      `,
    },
  },
  "meaningful-characters": {
    title: {
      zh: "起名用字：这些寓意美好的汉字值得收藏",
      en: "Naming Characters: Beautiful Characters with Auspicious Meanings",
    },
    description: {
      zh: "精选100个寓意美好、适合起名的汉字，附详细解释和五行属性，为您的宝宝起名提供灵感和参考。",
      en: "A curated list of 100 beautiful characters with auspicious meanings for naming, including detailed explanations and Five Elements attributes.",
    },
    date: "2024-02-25",
    category: "用字选择",
    author: "Chinese Name Generator Team",
    content: {
      zh: `
# 起名用字：这些寓意美好的汉字值得收藏

起名选字是关键一步。一个寓意美好的字，能够为名字增色添彩。本文精选适合起名的汉字，按五行分类，供您参考。

## 金属性汉字

金属性字代表坚强、果断、珍贵：

### 男孩用字
- **铭**：铭记、铭刻，寓意铭记恩德、志向远大
- **锐**：锐利、敏锐，寓意锐意进取、思维敏捷
- **锦**：锦缎、精美，寓意前程似锦
- **钰**：珍宝，寓意珍贵如玉
- **钦**：尊敬、佩服，寓意受人尊敬

### 女孩用字
- **钰**：美玉，寓意珍贵美好
- **铃**：铃铛，寓意声音悦耳、活泼可爱
- **诗**：诗歌，寓意文雅有才华
- **静**：安静、宁静，寓意端庄娴静
- **舒**：舒展、舒适，寓意生活舒心

## 木属性汉字

木属性字代表生长、繁荣、正直：

### 男孩用字
- **梓**：梓树，寓意茁壮成长、有用之才
- **杰**：杰出、优秀，寓意才华横溢
- **柏**：柏树，寓意坚贞不屈、四季常青
- **松**：松树，寓意坚韧不拔、气节高尚
- **林**：森林，寓意生机勃勃

### 女孩用字
- **若**：像、如，寓意美好如画
- **芷**：香草，寓意品德高尚
- **萱**：萱草，寓意快乐无忧
- **菲**：花草香气，寓意气质高雅
- **柔**：温柔、柔和，寓意温柔贤淑

## 水属性汉字

水属性字代表智慧、流动、柔和：

### 男孩用字
- **浩**：浩大、广阔，寓意胸怀宽广
- **涵**：包容、涵养，寓意有涵养、有内涵
- **泽**：恩泽、润泽，寓意恩泽深厚
- **清**：清澈、纯净，寓意清白纯正
- **洋**：海洋、广阔，寓意博大胸怀

### 女孩用字
- **涵**：涵养，寓意有修养有内涵
- **洁**：纯洁、干净，寓意纯洁无瑕
- **漫**：浪漫、漫溢，寓意浪漫优雅
- **溪**：溪水，寓意清澈纯净
- **沁**：沁人心脾，寓意清新宜人

## 火属性汉字

火属性字代表热情、光明、向上：

### 男孩用字
- **煜**：照耀、光辉，寓意光辉灿烂
- **晖**：阳光、光辉，寓意阳光开朗
- **晨**：早晨、黎明，寓意朝气蓬勃
- **昊**：广大的天，寓意胸怀宽广
- **昱**：光明、明亮，寓意光明磊落

### 女孩用字
- **灵**：灵气、聪慧，寓意聪慧过人
- **暖**：温暖、暖和，寓意温暖人心
- **昕**：黎明、明亮，寓意充满希望
- **恬**：恬静、安宁，寓意恬静美好
- **煜**：照耀，寓意光彩照人

## 土属性汉字

土属性字代表稳重、包容、厚重：

### 男孩用字
- **宇**：宇宙、屋檐，寓意气宇轩昂
- **轩**：高大的车，寓意气度不凡
- **坤**：大地，寓意厚德载物
- **辰**：时光、星辰，寓意前程似锦
- **远**：远大、遥远，寓意志向远大

### 女孩用字
- **佳**：美好、优秀，寓意才貌双全
- **依**：依靠、依恋，寓意温柔可人
- **婉**：温婉、婉约，寓意温柔婉约
- **娴**：娴熟、文雅，寓意端庄贤淑
- **恩**：恩惠、恩泽，寓意心怀感恩

## 选字注意事项

1. **注意音律**：选择读音优美的字
2. **注意搭配**：确保与姓氏和其他字搭配和谐
3. **注意生僻**：避免过于生僻的字
4. **注意寓意**：选择寓意积极正面的字
5. **注意五行**：根据八字选择合适五行的字

使用我们的起名工具，可以根据五行、寓意等条件为您智能推荐合适的汉字。
      `,
      en: `
# Naming Characters: Beautiful Characters with Auspicious Meanings

Choosing the right characters is key to a good name. This selection of beautiful characters organized by Five Elements provides inspiration for your baby's name.

## Metal Element Characters

Metal represents strength, decisiveness, and preciousness:

### For Boys
- **Ming** (铭): Engrave,铭记恩德、remember kindness
- **Rui** (锐): Sharp,敏锐进取、sharp and progressive
- **Jin** (锦): Brocade,前程似锦、bright future
- **Yu** (钰): Precious jade,珍贵如玉、precious as jade
- **Qin** (钦): Respect,受人尊敬、respected by others

### For Girls
- **Yu** (钰): Beautiful jade,珍贵美好、precious and beautiful
- **Ling** (铃): Bell,声音悦耳、pleasant sound
- **Shi** (诗): Poetry,文雅才华、elegant and talented
- **Jing** (静): Quiet,端庄娴静、dignified and quiet
- **Shu** (舒): Comfortable,生活舒心、comfortable life

## Wood Element Characters

Wood represents growth, prosperity, and integrity:

### For Boys
- **Zi** (梓): Catalpa tree,茁壮成长、thriving growth
- **Jie** (杰): Outstanding,才华横溢、overflowing talent
- **Bai** (柏): Cypress,坚贞不屈、unwavering integrity
- **Song** (松): Pine,坚韧不拔、persevering
- **Lin** (林): Forest,生机勃勃、full of vitality

### For Girls
- **Ruo** (若): Like,美好如画、beautiful as painting
- **Zhi** (芷): Angelica,品德高尚、noble character
- **Xuan** (萱): Daylily,快乐无忧、happy and carefree
- **Fei** (菲): Fragrant,气质高雅、elegant temperament
- **Rou** (柔): Gentle,温柔贤淑、gentle and virtuous

## Water Element Characters

Water represents wisdom, flow, and gentleness:

### For Boys
- **Hao** (浩): Vast,胸怀宽广、broad-minded
- **Han** (涵): Contain,有涵养、cultivated
- **Ze** (泽): Benefit,恩泽深厚、deep kindness
- **Qing** (清): Clear,清白纯正、pure and clean
- **Yang** (洋): Ocean,博大胸怀、broad mind

### For Girls
- **Han** (涵): Cultivated,有修养、refined
- **Jie** (洁): Clean,纯洁无瑕、pure and flawless
- **Man** (漫): Romantic,浪漫优雅、romantic and elegant
- **Xi** (溪): Stream,清澈纯净、clear and pure
- **Qin** (沁): Refreshing,清新宜人、fresh and pleasant

## Fire Element Characters

Fire represents passion, brightness, and upward movement:

### For Boys
- **Yu** (煜): Shine,光辉灿烂、radiant
- **Hui** (晖): Sunshine,阳光开朗、sunny and cheerful
- **Chen** (晨): Morning,朝气蓬勃、full of vitality
- **Hao** (昊): Vast sky,胸怀宽广、broad-minded
- **Yu** (昱): Bright,光明磊落、bright and open

### For Girls
- **Ling** (灵): Smart,聪慧过人、exceptionally smart
- **Nuan** (暖): Warm,温暖人心、heartwarming
- **Xin** (昕): Dawn,充满希望、full of hope
- **Tian** (恬): Quiet,恬静美好、quiet and beautiful
- **Yu** (煜): Shine,光彩照人、radiant

## Earth Element Characters

Earth represents stability, tolerance, and substance:

### For Boys
- **Yu** (宇): Universe,气宇轩昂、dignified appearance
- **Xuan** (轩): High,气度不凡、extraordinary bearing
- **Kun** (坤): Earth,厚德载物、great virtue
- **Chen** (辰): Time,前程似锦、bright future
- **Yuan** (远): Distant,志向远大、lofty aspirations

### For Girls
- **Jia** (佳): Excellent,才貌双全、talented and beautiful
- **Yi** (依): Rely,温柔可人、gentle and pleasant
- **Wan** (婉): Graceful,温柔婉约、gentle and graceful
- **Xian** (娴): Refined,端庄贤淑、dignified and virtuous
- **En** (恩): Kindness,心怀感恩、grateful heart

## Character Selection Tips

1. Check phonetics - choose characters with beautiful sounds
2. Check combinations - ensure harmony with surname and other characters
3. Avoid obscurity - don't use overly rare characters
4. Check meanings - choose positive, auspicious characters
5. Match Five Elements - select based on BaZi analysis

Use our naming tool for intelligent character recommendations based on Five Elements, meanings, and other criteria.
      `,
    },
  },
  "bazi-calculator-guide": {
    title: {
      zh: "八字起名计算器：如何分析宝宝的五行喜忌",
      en: "BaZi Calculator: How to Analyze Your Baby's Five Elements",
    },
    description: {
      zh: "手把手教您计算宝宝八字，分析五行强弱，确定喜用神和忌神，科学地为宝宝起一个与命理相合的好名字。",
      en: "Step-by-step guide to calculating BaZi and determining favorable and unfavorable elements for auspicious naming.",
    },
    date: "2024-03-01",
    category: "八字起名",
    author: "Chinese Name Generator Team",
    content: {
      zh: `
# 八字起名计算器：如何分析宝宝的五行喜忌

八字起名是中国传统起名的核心方法之一。通过分析宝宝的八字，可以确定五行喜忌，从而选择合适的汉字起名。

## 什么是八字？

八字，又称四柱，是根据出生年月日时计算出的八个字，每个字由一个天干和一个地支组成：

- **年柱**：出生年份（如：甲子、乙丑）
- **月柱**：出生月份
- **日柱**：出生日期
- **时柱**：出生时辰

## 天干地支与五行

### 十天干
- **金**：庚、辛
- **木**：甲、乙
- **水**：壬、癸
- **火**：丙、丁
- **土**：戊、己

### 十二地支
- **金**：申、酉
- **木**：寅、卯
- **水**：亥、子
- **火**：巳、午
- **土**：辰、戌、丑、未

## 计算八字五行

### 步骤一：确定年柱
根据出生年份查万年历确定年干支。

例如：2024年出生，年柱为甲辰。

### 步骤二：确定月柱
根据年干和出生月份确定月干支。

### 步骤三：确定日柱
根据出生日期查万年历确定日干支。

### 步骤四：确定时柱
根据日干和出生时辰确定时干支。

## 分析五行强弱

统计八字中各五行的数量：

### 示例分析
假设八字为：甲辰、丙寅、壬申、乙亥

- **金**：申（1个）
- **木**：甲、寅、乙、亥（4个）
- **水**：壬、亥（2个）
- **火**：丙（1个）
- **土**：辰（1个）

**分析结果**：木旺（4个），金、火、土偏弱（各1个）。

## 确定喜用神

### 喜神
需要补益的五行称为喜神。本例中，金、火、土偏弱，需要补益。

### 用神
对命局最有利的五行。本例中，土可以泄木生金，为最佳选择。

### 忌神
需要避免的五行。本例中，木已经过旺，不宜再加。

## 根据喜用神起名

### 补金
选择金属性的字：铭、锐、锦、钰、钦等

### 补火
选择火属性的字：煜、晖、晨、昊、昱等

### 补土
选择土属性的字：宇、轩、坤、辰、远等

## 起名示例

根据上述八字，五行喜土、金。

**推荐名字**：
- 钰轩（土金）：土金相生，吉祥
- 铭宇（金土）：金土相生，补益命局
- 锦辰（金土）：金土搭配，平衡五行

## 注意事项

1. **准确八字**：确保出生时间准确，时辰影响时柱
2. **综合分析**：结合五格数理、音韵美感
3. **适度补益**：不要过度补益某五行
4. **考虑性别**：男孩女孩用字有差异
5. **避免生僻**：选择常用字，方便使用

使用我们的起名工具，可以自动计算八字五行，分析喜忌，推荐合适的名字。
      `,
      en: `
# BaZi Calculator: How to Analyze Your Baby's Five Elements

BaZi naming is one of the core methods in traditional Chinese naming. By analyzing your baby's BaZi, you can determine favorable and unfavorable elements for naming.

## What is BaZi?

BaZi (Eight Characters), also known as Four Pillars, consists of eight characters calculated from birth date and time. Each pillar has one Heavenly Stem and one Earthly Branch:

- **Year Pillar**: Birth year
- **Month Pillar**: Birth month
- **Day Pillar**: Birth date
- **Hour Pillar**: Birth hour

## Heavenly Stems, Earthly Branches & Five Elements

### Ten Heavenly Stems
- **Metal**: Geng, Xin
- **Wood**: Jia, Yi
- **Water**: Ren, Gui
- **Fire**: Bing, Ding
- **Earth**: Wu, Ji

### Twelve Earthly Branches
- **Metal**: Shen, You
- **Wood**: Yin, Mao
- **Water**: Hai, Zi
- **Fire**: Si, Wu
- **Earth**: Chen, Xu, Chou, Wei

## Calculating BaZi Five Elements

### Step 1: Determine Year Pillar
Check the perpetual calendar for birth year.

Example: 2024 birth = Jia Chen year pillar.

### Step 2: Determine Month Pillar
Based on year stem and birth month.

### Step 3: Determine Day Pillar
Check perpetual calendar for birth date.

### Step 4: Determine Hour Pillar
Based on day stem and birth hour.

## Analyzing Five Elements Strength

Count each element in the eight characters:

### Example Analysis
BaZi: Jia Chen, Bing Yin, Ren Shen, Yi Hai

- **Metal**: Shen (1)
- **Wood**: Jia, Yin, Yi, Hai (4)
- **Water**: Ren, Hai (2)
- **Fire**: Bing (1)
- **Earth**: Chen (1)

**Result**: Wood strong (4), Metal/Fire/Earth weak (1 each).

## Determining Favorable Elements

### Favorable Elements (Xi Shen)
Elements needing strengthening: Metal, Fire, Earth.

### Useful Element (Yong Shen)
Most beneficial element: Earth (drains Wood, generates Metal).

### Avoid Element (Ji Shen)
Element to avoid: Wood (already too strong).

## Naming Based on Favorable Elements

### Strengthen Metal
Choose Metal characters: Ming, Rui, Jin, Yu, Qin

### Strengthen Fire
Choose Fire characters: Yu, Hui, Chen, Hao, Yu

### Strengthen Earth
Choose Earth characters: Yu, Xuan, Kun, Chen, Yuan

## Naming Example

Based on above BaZi, needs Earth and Metal.

**Recommended Names**:
- Yuxuan (Earth-Metal): Earth generates Metal
- Mingyu (Metal-Earth): Metal-Earth combination
- Jinchen (Metal-Earth): Metal-Earth balance

## Important Notes

1. **Accurate BaZi**: Ensure accurate birth time
2. **Comprehensive Analysis**: Combine with Wuge, phonetics
3. **Moderate Strengthening**: Don't over-strengthen any element
4. **Consider Gender**: Different characters for boys/girls
5. **Avoid Obscurity**: Choose common characters

Use our naming tool to automatically calculate BaZi, analyze favorable elements, and recommend suitable names.
      `,
    },
  },
  "modern-vs-traditional-naming": {
    title: {
      zh: "传统起名vs现代起名：哪种更适合你的宝宝？",
      en: "Traditional vs Modern Naming: Which Approach Suits Your Baby?",
    },
    description: {
      zh: "对比分析传统起名方法和现代起名趋势，帮助您在传承文化与时代表达之间找到平衡，为宝宝做出最佳选择。",
      en: "Comparing traditional naming methods with modern trends to help you find balance between cultural heritage and contemporary expression.",
    },
    date: "2024-03-10",
    category: "起名趋势",
    author: "Chinese Name Generator Team",
    content: {
      zh: `
# 传统起名vs现代起名：哪种更适合你的宝宝？

起名是一门艺术，也是一门科学。传统起名方法蕴含着深厚的文化底蕴，而现代起名趋势则反映了时代的变化。如何选择，需要父母认真考虑。

## 传统起名方法

### 特点
1. **注重八字五行**：根据生辰八字分析五行强弱
2. **讲究五格数理**：姓名笔画数理要吉利
3. **遵循族谱字辈**：按族谱规定取字辈名
4. **引用经典诗词**：从诗经、楚辞等典籍中取名
5. **寄托美好寓意**：名字包含父母的期望

### 优点
- **文化传承**：承载传统文化内涵
- **寓意深刻**：名字有深层的含义
- **家族认同**：增强家族凝聚力
- **稳定持久**：经得起时间考验

### 缺点
- **过于复杂**：计算方法繁琐
- **限制较多**：需要遵循诸多规则
- **可能过时**：部分观念与现代脱节
- **同质化**：容易与他人重名

## 现代起名方法

### 特点
1. **追求个性**：希望名字独一无二
2. **注重音韵**：名字读起来好听
3. **简化笔画**：选择笔画简单的字
4. **中西结合**：考虑英文名的谐音
5. **时尚新颖**：紧跟时代潮流

### 优点
- **个性鲜明**：更容易被人记住
- **简洁实用**：方便书写和记忆
- **时代感强**：符合现代审美
- **自由度高**：选择空间大

### 缺点
- **文化缺失**：可能缺乏文化底蕴
- **寓意浅显**：名字含义可能不够深刻
- **不够庄重**：可能显得随意
- **易受潮流影响**：可能很快过时

## 如何选择？

### 选择传统起名的情况
- 重视家族传统
- 希望名字有文化内涵
- 相信命理八字
- 住在传统氛围浓厚的地区

### 选择现代起名的情况
- 追求个性表达
- 希望名字简洁易记
- 生活在国际化环境
- 不受传统观念束缚

## 折中方案

传统与现代结合，取长补短：

1. **保留传统元素**：考虑八字、五行
2. **融入现代审美**：选择音韵优美的字
3. **平衡寓意与音韵**：既要有意义，又要好听
4. **考虑实用性**：避免生僻字，方便使用

## 起名建议

### 无论选择哪种方式，都要注意：

1. **避免极端**：不要过于传统或过于新潮
2. **考虑孩子**：名字要适合孩子一生
3. **征求意见**：多听家人朋友意见
4. **反复斟酌**：选好名字后多读几遍
5. **相信直觉**：最终选择您最喜欢的名字

## 传统与现代结合的例子

**传统元素+现代审美**：
- 浩然（经典寓意，现代音韵）
- 诗涵（文化底蕴，清新悦耳）
- 梓睿（五行平衡，时尚简洁）
- 钰轩（传统用字，现代搭配）

使用我们的起名工具，可以根据传统方法和现代审美为您推荐合适的名字。
      `,
      en: `
# Traditional vs Modern Naming: Which Approach Suits Your Baby?

Naming is both an art and a science. Traditional methods embody deep cultural heritage, while modern trends reflect contemporary changes. The choice requires careful consideration.

## Traditional Naming Methods

### Characteristics
1. **Emphasizes BaZi Five Elements**: Analyzes strength based on birth data
2. **Values Wuge Numerology**: Stroke counts must be auspicious
3. **Follows Generational Names**: Uses family genealogy
4. **Quotes Classics**: Names from Book of Songs, Chu Ci
5. **Conveys Best Wishes**: Contains parental expectations

### Advantages
- **Cultural Heritage**: Carries traditional cultural meaning
- **Deep Significance**: Names have profound meanings
- **Family Identity**: Strengthens family cohesion
- **Timeless**: Withstands the test of time

### Disadvantages
- **Complex**: Calculation methods are complicated
- **Restrictive**: Many rules to follow
- **May Be Outdated**: Some concepts don't fit modern times
- **Homogenized**: Easy to duplicate names

## Modern Naming Methods

### Characteristics
1. **Pursues Uniqueness**: Wants one-of-a-kind names
2. **Values Phonetics**: Names should sound good
3. **Simplifies Strokes**: Chooses simple characters
4. **East-West Fusion**: Considers English pronunciation
5. **Fashionable**: Follows contemporary trends

### Advantages
- **Distinctive**: Easier to remember
- **Practical**: Easy to write and remember
- **Contemporary**: Fits modern aesthetics
- **Flexible**: Wide range of choices

### Disadvantages
- **Cultural Deficit**: May lack cultural depth
- **Shallow Meaning**: Significance may be less profound
- **Informal**: May seem casual
- **Trend-Dependent**: May quickly become outdated

## How to Choose?

### Choose Traditional When:
- Value family traditions
- Want cultural depth
- Believe in BaZi numerology
- Live in traditional communities

### Choose Modern When:
- Pursue individuality
- Want simple, memorable names
- Live in international environments
- Unbound by tradition

## Balanced Approach

Combine traditional and modern methods:

1. **Keep Traditional Elements**: Consider BaZi, Five Elements
2. **Add Modern Aesthetics**: Choose phonetically pleasing characters
3. **Balance Meaning and Sound**: Both meaningful and pleasant
4. **Consider Practicality**: Avoid obscure characters

## Naming Recommendations

### Regardless of approach:

1. **Avoid Extremes**: Not too traditional or too trendy
2. **Consider the Child**: Name should suit entire life
3. **Seek Opinions**: Listen to family and friends
4. **Reflect Carefully**: Read the chosen name multiple times
5. **Trust Your Intuition**: Choose the name you love most

## Traditional-Modern Fusion Examples

**Traditional Element + Modern Aesthetic**:
- Haoran: Classic meaning, modern phonetics
- Shihan: Cultural depth, fresh and pleasant
- Zirui: Five Elements balance, fashionable and simple
- Yuxuan: Traditional characters, modern combination

Use our naming tool for recommendations that blend traditional wisdom with modern aesthetics.
      `,
    },
  },
};

const SLUGS = Object.keys(BLOG_ARTICLES);

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = BLOG_ARTICLES[slug];

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return generatePageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: article.title,
    description: article.description,
    ogType: "article",
    publishedTime: article.date,
    articleSection: article.category,
    articleTags: [article.category, "Chinese naming", "BaZi", "Five Elements"],
  });
}

export default async function BlogArticlePage(props: Props) {
  const params = await props.params;
  setRequestLocale(params.locale);

  const { slug } = params;
  const article = BLOG_ARTICLES[slug];

  if (!article) {
    notFound();
  }

  const isZh = params.locale === "zh";
  const title =
    article.title[params.locale as keyof typeof article.title] ||
    article.title.zh;
  const description =
    article.description[params.locale as keyof typeof article.description] ||
    article.description.zh;
  const content =
    article.content[params.locale as keyof typeof article.content] ||
    article.content.zh;

  // Get related articles
  const relatedSlugs = SLUGS.filter((s) => s !== slug).slice(0, 3);

  // Generate article schema
  const articleSchema = generateArticleSchema({
    headline: title,
    description: description,
    datePublished: article.date,
    author: article.author,
    url: new URL(`/${params.locale}/blog/${slug}`, env.siteUrl).toString(),
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Schema.org structured data */}
      <JsonLd data={articleSchema} />

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto mb-8">
        <Breadcrumb
          locale={params.locale}
          items={[
            { name: isZh ? "首页" : "Home", href: `/${params.locale}` },
            { name: isZh ? "博客" : "Blog", href: `/${params.locale}/blog` },
            { name: title, href: `/${params.locale}/blog/${slug}` },
          ]}
        />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Article Header */}
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                {article.category}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {article.date}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              {title}
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {description}
            </p>

            {/* Article Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {content.split("\n").map((paragraph, idx) => {
                if (paragraph.startsWith("# ")) {
                  const level = paragraph.match(/^#+/)?.[0].length || 1;
                  const text = paragraph.replace(/^#+\s*/, "");
                  const Tag = `h${Math.min(level + 1, 3)}` as
                    | "h1"
                    | "h2"
                    | "h3";
                  return (
                    <Tag
                      key={idx}
                      className="mt-8 mb-4 text-slate-800 dark:text-slate-100"
                    >
                      {text}
                    </Tag>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <li
                      key={idx}
                      className="text-slate-600 dark:text-slate-400"
                    >
                      {paragraph.replace("- ", "")}
                    </li>
                  );
                }
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <strong
                      key={idx}
                      className="text-slate-800 dark:text-slate-200"
                    >
                      {paragraph.replace(/\*\*/g, "")}
                    </strong>
                  );
                }
                if (paragraph.trim() === "") {
                  return <br key={idx} />;
                }
                return (
                  <p
                    key={idx}
                    className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4"
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>
        </article>

        {/* CTA */}
        <Link
          href={`/${params.locale}/generate`}
          className="block mt-8 bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-white text-center hover:opacity-95 transition-opacity"
        >
          <h2 className="text-2xl font-bold mb-2">
            {isZh ? "开始起名" : "Start Naming"}
          </h2>
          <p className="opacity-90">
            {isZh
              ? "使用智能起名工具，为您的宝宝生成完美名字"
              : "Use our smart naming tool to generate perfect names for your baby"}
          </p>
        </Link>

        {/* Related Articles */}
        {relatedSlugs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">
              {isZh ? "相关文章" : "Related Articles"}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedSlugs.map((relatedSlug) => {
                const relatedArticle = BLOG_ARTICLES[relatedSlug];
                if (!relatedArticle) return null;
                return (
                  <Link
                    key={relatedSlug}
                    href={`/${params.locale}/blog/${relatedSlug}`}
                    className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                  >
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {relatedArticle.category}
                    </span>
                    <h3 className="font-semibold mt-3 mb-2 text-slate-800 dark:text-slate-100">
                      {relatedArticle.title[
                        params.locale as keyof typeof relatedArticle.title
                      ] || relatedArticle.title.zh}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {relatedArticle.description[
                        params.locale as keyof typeof relatedArticle.description
                      ] || relatedArticle.description.zh}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
