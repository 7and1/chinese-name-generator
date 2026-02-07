/**
 * Enhanced Poetry Database with Complete Metadata
 *
 * This file contains poetry entries with full cultural context,
 * historical background, and naming themes.
 *
 * References:
 * - 《诗经译注》程俊英，中华书局，2015
 * - 《楚辞选》陆侃如，上海古籍出版社，2018
 * - 《唐诗三百首》蘅塘退士，中华书局，1959
 * - 《宋词三百首》朱孝臧，中华书局，1962
 */

export interface PoetryVerseEnhanced {
  id: string;
  source: "诗经" | "楚辞" | "唐诗" | "宋词";
  title: string;
  author?: string;
  dynasty: string;
  era: string; // Historical period
  verse: string;
  fullContext?: string; // Full poem excerpt
  translation: string;
  keywords: string[];
  suitableChars: string[];
  culturalContext: string;
  nameThemes: string[]; // beauty, wisdom, strength, virtue, etc.
  popularity: "high" | "medium" | "low"; // For name usage
}

/**
 * Enhanced poetry database with complete metadata
 */
export const POETRY_ENHANCED: PoetryVerseEnhanced[] = [
  // ==================== 诗经 (Book of Songs) ====================
  {
    id: "shijing-e001",
    source: "诗经",
    title: "关雎",
    dynasty: "周",
    era: "西周初年 (c. 11th century BCE)",
    verse: "窈窕淑女，君子好逑",
    fullContext: "关关雎鸠，在河之洲。窈窕淑女，君子好逑。",
    translation: "Beautiful and virtuous lady, a gentleman's perfect match",
    keywords: ["窈窕", "淑女", "君子", "好逑"],
    suitableChars: ["窈", "窕", "淑", "君", "好", "逑"],
    culturalContext:
      "《诗经》开篇之作，描写青年男女真挚纯洁的爱情。窈窕形容女子文静美好，淑指品德善良。此诗奠定了中国爱情诗的传统。",
    nameThemes: ["beauty", "virtue", "love", "elegance"],
    popularity: "high",
  },
  {
    id: "shijing-e002",
    source: "诗经",
    title: "桃夭",
    dynasty: "周",
    era: "西周 (c. 10th century BCE)",
    verse: "桃之夭夭，灼灼其华",
    fullContext: "桃之夭夭，灼灼其华。之子于归，宜其室家。",
    translation: "Peach trees blooming young and fresh, brilliantly flowering",
    keywords: ["桃", "夭夭", "灼灼", "华"],
    suitableChars: ["桃", "夭", "灼", "华", "宜", "家"],
    culturalContext:
      "祝贺女子出嫁的经典诗篇。以桃花盛开比喻新娘的年轻貌美，充满生机与活力。灼灼形容花开得鲜艳灿烂。",
    nameThemes: ["beauty", "youth", "vitality", "marriage"],
    popularity: "high",
  },
  {
    id: "shijing-e003",
    source: "诗经",
    title: "采薇",
    dynasty: "周",
    era: "西周 (c. 8th century BCE)",
    verse: "昔我往矣，杨柳依依",
    fullContext: "昔我往矣，杨柳依依。今我来思，雨雪霏霏。",
    translation:
      "When I left, willows were gently swaying; now I return, snow falls heavily",
    keywords: ["杨柳", "依依", "雨雪", "霏霏"],
    suitableChars: ["杨", "柳", "依", "雨", "雪", "霏"],
    culturalContext:
      "描写征夫返乡的感怀诗。以杨柳依依象征惜别之情，雨雪霏霏渲染归途艰辛，表达对故乡的深切眷恋。",
    nameThemes: ["longing", "gentleness", "memory", "perseverance"],
    popularity: "high",
  },
  {
    id: "shijing-e004",
    source: "诗经",
    title: "蒹葭",
    dynasty: "周",
    era: "春秋 (c. 7th-6th century BCE)",
    verse: "蒹葭苍苍，白露为霜",
    fullContext: "蒹葭苍苍，白露为霜。所谓伊人，在水一方。",
    translation:
      "Reeds lush and gray, white dew turns to frost; the one I long for is across the water",
    keywords: ["蒹葭", "苍苍", "白露", "霜", "伊人"],
    suitableChars: ["蒹", "葭", "苍", "露", "霜", "伊"],
    culturalContext:
      "一首追寻意中人的抒情诗。蒹葭苍苍描绘秋日萧瑟景象，白露为霜渲染凄清氛围，表达执着追求与求而不得的惆怅。",
    nameThemes: ["persistence", "purity", "longing", "autumn"],
    popularity: "high",
  },
  {
    id: "shijing-e005",
    source: "诗经",
    title: "静女",
    dynasty: "周",
    era: "春秋 (c. 7th-6th century BCE)",
    verse: "静女其姝，俟我于城隅",
    fullContext: "静女其姝，俟我于城隅。爱而不见，搔首踟蹰。",
    translation:
      "The quiet maiden so beautiful, waits for me at the city corner",
    keywords: ["静女", "姝", "城隅"],
    suitableChars: ["静", "姝", "城", "隅"],
    culturalContext:
      "描写男女幽会的爱情诗。静女形容娴静美丽的女子，姝指美好。表达了真挚细腻的爱情。",
    nameThemes: ["beauty", "quietness", "love", "purity"],
    popularity: "medium",
  },
  {
    id: "shijing-e006",
    source: "诗经",
    title: "木瓜",
    dynasty: "周",
    era: "春秋 (c. 7th-6th century BCE)",
    verse: "投我以木瓜，报之以琼琚",
    fullContext: "投我以木瓜，报之以琼琚。匪报也，永以为好也。",
    translation:
      "You gave me a quince, I respond with jade; not as repayment, but for eternal friendship",
    keywords: ["木瓜", "琼琚"],
    suitableChars: ["琼", "琚", "永", "好"],
    culturalContext:
      "表达友情与礼尚往来的诗篇。琼琚指美玉，象征珍贵的情谊。匪报也，永以为好也表达了以心换心的真挚情感。",
    nameThemes: ["friendship", "gratitude", "precious", "sincerity"],
    popularity: "medium",
  },
  {
    id: "shijing-e007",
    source: "诗经",
    title: "鹿鸣",
    dynasty: "周",
    era: "西周 (c. 10th-8th century BCE)",
    verse: "呦呦鹿鸣，食野之苹",
    fullContext: "呦呦鹿鸣，食野之苹。我有嘉宾，鼓瑟吹笙。",
    translation:
      "Deer call softly, eating wild apples; I have honored guests, play the se and sheng",
    keywords: ["鹿鸣", "苹", "嘉宾"],
    suitableChars: ["鹿", "鸣", "苹", "嘉", "宾"],
    culturalContext:
      "宴请宾客的诗歌，是周代贵族宴会的乐歌。呦呦鹿鸣象征和谐友爱，鼓瑟吹笙描写宴乐场面，表达热情好客之道。",
    nameThemes: ["harmony", "gathering", "peace", "hospitality"],
    popularity: "medium",
  },
  {
    id: "shijing-e008",
    source: "诗经",
    title: "淇奥",
    dynasty: "周",
    era: "春秋 (c. 7th-6th century BCE)",
    verse: "有匪君子，如切如磋，如琢如磨",
    fullContext: "瞻彼淇奥，绿竹猗猗。有匪君子，如切如磋，如琢如磨。",
    translation:
      "The elegant gentleman, like carved jade, like polished gem, constantly improving",
    keywords: ["君子", "切磋", "琢磨"],
    suitableChars: ["君", "匪", "切", "磋", "琢", "磨", "淇"],
    culturalContext:
      "赞美君子的品德修养。如切如磋比喻精益求精的治学态度，如琢如磨形容不断锤炼的修身过程，是儒家修身思想的体现。",
    nameThemes: ["cultivation", "excellence", "gentleman", "self-improvement"],
    popularity: "medium",
  },
  {
    id: "shijing-e009",
    source: "诗经",
    title: "凯风",
    dynasty: "周",
    era: "春秋 (c. 7th-6th century BCE)",
    verse: "凯风自南，吹彼棘心",
    fullContext: "凯风自南，吹彼棘心。棘心夭夭，母氏劬劳。",
    translation:
      "Gentle warm breeze from the south, blows the thorn branches; mother's toil is great",
    keywords: ["凯风", "棘心"],
    suitableChars: ["凯", "南", "棘", "心"],
    culturalContext:
      "歌颂母爱的诗篇。凯风比喻母爱的温暖和煦，棘心喻指子女，表达了子女对母亲的感恩之情。",
    nameThemes: ["maternal-love", "warmth", "gratitude", "filial"],
    popularity: "medium",
  },
  {
    id: "shijing-e010",
    source: "诗经",
    title: "小星",
    dynasty: "周",
    era: "春秋 (c. 7th-6th century BCE)",
    verse: "嘒彼小星，三五在东",
    fullContext: "嘒彼小星，三五在东。肃肃宵征，夙夜在公。",
    translation: "Twinkling little stars, three or five in the eastern sky",
    keywords: ["小星", "嘒"],
    suitableChars: ["星", "嘒", "肃", "公"],
    culturalContext:
      "描写小吏辛勤工作的诗篇。以小星比喻身份卑微但尽职尽责的人，表达对勤勉工作的赞美。",
    nameThemes: ["diligence", "humility", "duty", "persistence"],
    popularity: "low",
  },
  {
    id: "shijing-e011",
    source: "诗经",
    title: "柏舟",
    dynasty: "周",
    era: "春秋 (c. 7th-6th century BCE)",
    verse: "泛彼柏舟，亦泛其流",
    fullContext: "泛彼柏舟，亦泛其流。耿耿不寐，如有隐忧。",
    translation:
      "That cypress boat drifts, floating on the current; sleepless through the night",
    keywords: ["柏舟", "泛"],
    suitableChars: ["柏", "舟", "泛", "耿"],
    culturalContext:
      "表达内心忧思的诗篇。柏舟漂流比喻处境动荡，耿耿不寐形容忧心忡忡，表达了坚守节操的精神。",
    nameThemes: ["integrity", "perseverance", "solitude", "strength"],
    popularity: "low",
  },
  {
    id: "shijing-e012",
    source: "诗经",
    title: "硕人",
    dynasty: "周",
    era: "春秋 (c. 7th-6th century BCE)",
    verse: "硕人其颀，衣锦褧衣",
    fullContext: "硕人其颀，衣锦褧衣。齐侯之子，卫侯之妻。",
    translation: "The tall and graceful lady, wearing embroidered robes",
    keywords: ["硕人", "颀"],
    suitableChars: ["硕", "颀", "锦"],
    culturalContext:
      "赞美庄姜美貌的诗篇。硕人其颀形容身材高挑优美，衣锦褧衣描写华贵服饰，是古典美女描写的经典。",
    nameThemes: ["beauty", "elegance", "nobility", "grace"],
    popularity: "medium",
  },

  // ==================== 楚辞 (Songs of Chu) ====================
  {
    id: "chuci-e001",
    source: "楚辞",
    title: "离骚",
    author: "屈原",
    dynasty: "战国",
    era: "楚国 (c. 3rd century BCE)",
    verse: "路漫漫其修远兮，吾将上下而求索",
    fullContext:
      "朝发轫于苍梧兮，夕余至乎县圃。欲少留此灵琐兮，日忽忽其将暮。吾令羲和弭节兮，望崦嵫而勿迫。路漫漫其修远兮，吾将上下而求索。",
    translation: "The road is long and distant, I will seek high and low",
    keywords: ["漫漫", "修远", "求索"],
    suitableChars: ["漫", "修", "远", "求", "索"],
    culturalContext:
      "屈原代表作《离骚》中的名句。表达了诗人追求真理、永不言弃的精神，是中国文化中执着追求精神的象征。",
    nameThemes: ["persistence", "truth-seeking", "courage", "ambition"],
    popularity: "high",
  },
  {
    id: "chuci-e002",
    source: "楚辞",
    title: "离骚",
    author: "屈原",
    dynasty: "战国",
    era: "楚国 (c. 3rd century BCE)",
    verse: "唯草木之零落兮，恐美人之迟暮",
    fullContext: "日月忽其不淹兮，春与秋其代序。唯草木之零落兮，恐美人之迟暮。",
    translation:
      "Grass and trees wither and fall, I fear the beauty's late years",
    keywords: ["草木", "零落", "美人", "迟暮"],
    suitableChars: ["零", "落", "美", "迟", "暮"],
    culturalContext:
      "表达对时光流逝的忧虑。以草木零落比喻岁月催人，恐美人之迟暮表达对才德之士不被重用的担忧。",
    nameThemes: ["time", "beauty", "urgency", "aspiration"],
    popularity: "medium",
  },
  {
    id: "chuci-e003",
    source: "楚辞",
    title: "九歌·湘君",
    author: "屈原",
    dynasty: "战国",
    era: "楚国 (c. 3rd century BCE)",
    verse: "采薜荔兮水中，搴芙蓉兮木末",
    fullContext:
      "君不行兮夷犹，蹇谁留兮中洲？美要眇兮宜修，沛吾乘兮桂舟。令沅湘兮无波，使江水兮安流。采薜荔兮水中，搴芙蓉兮木末。",
    translation: "Gathering figs in water, picking lotus from tree tops",
    keywords: ["薜荔", "芙蓉"],
    suitableChars: ["薜", "荔", "芙", "蓉"],
    culturalContext:
      "湘君是祭祀湘水之神的歌辞。以采薜荔、搴芙蓉表达对爱情的执着追求，充满浪漫主义色彩。",
    nameThemes: ["love", "pursuit", "beauty", "nature"],
    popularity: "high",
  },
  {
    id: "chuci-e004",
    source: "楚辞",
    title: "九歌·山鬼",
    author: "屈原",
    dynasty: "战国",
    era: "楚国 (c. 3rd century BCE)",
    verse: "既含睇兮又宜笑，子慕予兮善窈窕",
    fullContext:
      "若有人兮山之阿，被薜荔兮带女萝。既含睇兮又宜笑，子慕予兮善窈窕。",
    translation:
      "Eyes glancing and smiling beautifully, admired for grace and charm",
    keywords: ["含睇", "宜笑", "窈窕"],
    suitableChars: ["睇", "宜", "笑", "窈", "窕"],
    culturalContext:
      "描写山鬼女神美丽的诗篇。含睇形容眼神含情，宜笑描写笑靥如花，是中国古典美的经典描写。",
    nameThemes: ["beauty", "charm", "mystery", "nature"],
    popularity: "high",
  },
  {
    id: "chuci-e005",
    source: "楚辞",
    title: "九章·橘颂",
    author: "屈原",
    dynasty: "战国",
    era: "楚国 (c. 3rd century BCE)",
    verse: "苏世独立，横而不流兮",
    fullContext:
      "嗟尔幼志，有以异兮。独立不迁，岂不可喜兮？深固难徙，更壹志兮。绿叶素荣，纷其可喜兮。苏世独立，横而不流兮。",
    translation: "Standing alone in the world, not going with the flow",
    keywords: ["独立", "横而不流"],
    suitableChars: ["苏", "独", "立", "横"],
    culturalContext:
      "以橘树比喻高尚品格。苏世独立表达不随波逐流、坚守节操的精神，是屈原人格理想的写照。",
    nameThemes: ["integrity", "independence", "virtue", "strength"],
    popularity: "medium",
  },
  {
    id: "chuci-e006",
    source: "楚辞",
    title: "远游",
    author: "屈原",
    dynasty: "战国",
    era: "楚国 (c. 3rd century BCE)",
    verse: "内惟省以端操兮，求正气之所由",
    fullContext: "内惟省以端操兮，求正气之所由。漠虚静以恬愉兮，澹无为而自得。",
    translation:
      "Reflecting within to cultivate character, seeking the source of righteous qi",
    keywords: ["端操", "正气"],
    suitableChars: ["端", "操", "正", "气"],
    culturalContext:
      "描写修身养性的诗篇。表达了内省自修、追求正气的道德追求，体现了道家与儒家思想的融合。",
    nameThemes: ["cultivation", "virtue", "introspection", "harmony"],
    popularity: "low",
  },

  // ==================== 唐诗 (Tang Poetry) ====================
  {
    id: "tang-e001",
    source: "唐诗",
    title: "静夜思",
    author: "李白",
    dynasty: "唐",
    era: "盛唐 (726年)",
    verse: "床前明月光，疑是地上霜",
    fullContext: "床前明月光，疑是地上霜。举头望明月，低头思故乡。",
    translation:
      "Bright moonlight before my bed, suspected to be frost on the ground",
    keywords: ["明月", "霜", "故乡"],
    suitableChars: ["明", "月", "霜", "乡"],
    culturalContext:
      "李白最脍炙人口的思乡之作。以明月光引发思乡之情，表达了游子对故乡的深切思念，是中华文化中思乡的典型意象。",
    nameThemes: ["homesickness", "moon", "purity", "memory"],
    popularity: "high",
  },
  {
    id: "tang-e002",
    source: "唐诗",
    title: "将进酒",
    author: "李白",
    dynasty: "唐",
    era: "盛唐 (752年)",
    verse: "天生我材必有用，千金散尽还复来",
    fullContext:
      "君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复来。",
    translation:
      "Heaven made my talents, they must have purpose; gold scattered will return",
    keywords: ["天生", "有用", "千金"],
    suitableChars: ["天", "材", "用", "金"],
    culturalContext:
      "李白豪放诗风的代表作。表达了自信豁达的人生态度，体现了盛唐时代的精神风貌。",
    nameThemes: ["confidence", "talent", "generosity", "optimism"],
    popularity: "high",
  },
  {
    id: "tang-e003",
    source: "唐诗",
    title: "早发白帝城",
    author: "李白",
    dynasty: "唐",
    era: "盛唐 (759年)",
    verse: "两岸猿声啼不住，轻舟已过万重山",
    fullContext:
      "朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。",
    translation:
      "Monkey cries cease on both banks, light boat has passed ten thousand mountains",
    keywords: ["轻舟", "万重山"],
    suitableChars: ["轻", "舟", "万", "山"],
    culturalContext:
      "描写长江三峡行船的诗篇。轻舟已过万重山比喻困难迅速被克服，表达轻快喜悦的心情。",
    nameThemes: ["freedom", "speed", "overcoming", "joy"],
    popularity: "high",
  },
  {
    id: "tang-e004",
    source: "唐诗",
    title: "春晓",
    author: "孟浩然",
    dynasty: "唐",
    era: "盛唐 (c. 8th century)",
    verse: "春眠不觉晓，处处闻啼鸟",
    fullContext: "春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。",
    translation:
      "Sleeping in spring unaware of dawn, everywhere hear birds singing",
    keywords: ["春晓", "啼鸟", "花落"],
    suitableChars: ["春", "晓", "闻", "啼", "花"],
    culturalContext:
      "描写春日清晨的诗篇。以啼鸟、风雨、花落等意象描绘春日美好景象，表达对自然的热爱和对生命的感悟。",
    nameThemes: ["spring", "nature", "life", "beauty"],
    popularity: "high",
  },
  {
    id: "tang-e005",
    source: "唐诗",
    title: "登鹳雀楼",
    author: "王之涣",
    dynasty: "唐",
    era: "盛唐 (c. 8th century)",
    verse: "欲穷千里目，更上一层楼",
    fullContext: "白日依山尽，黄河入海流。欲穷千里目，更上一层楼。",
    translation: "To see a thousand miles, ascend one more story",
    keywords: ["千里", "更上"],
    suitableChars: ["穷", "千", "里", "更", "楼"],
    culturalContext:
      "描写登高远眺的诗篇。欲穷千里目更上一层楼寓意不断进取、永不停歇的精神，是励志名句。",
    nameThemes: ["ambition", "progress", "vision", "perseverance"],
    popularity: "high",
  },
  {
    id: "tang-e006",
    source: "唐诗",
    title: "相思",
    author: "王维",
    dynasty: "唐",
    era: "盛唐 (c. 8th century)",
    verse: "红豆生南国，春来发几枝",
    fullContext: "红豆生南国，春来发几枝。愿君多采撷，此物最相思。",
    translation:
      "Red beans grow in the southern land, how many branches in spring? Pick plenty, for they represent longing",
    keywords: ["红豆", "南国", "相思"],
    suitableChars: ["红", "豆", "南", "相", "思"],
    culturalContext:
      "描写爱情的经典诗篇。红豆成为中国文化中相思的象征，表达深切的思念之情。",
    nameThemes: ["love", "longing", "romance", "faithfulness"],
    popularity: "high",
  },
  {
    id: "tang-e007",
    source: "唐诗",
    title: "送元二使安西",
    author: "王维",
    dynasty: "唐",
    era: "盛唐 (c. 8th century)",
    verse: "劝君更尽一杯酒，西出阳关无故人",
    fullContext:
      "渭城朝雨浥轻尘，客舍青青柳色新。劝君更尽一杯酒，西出阳关无故人。",
    translation:
      "I urge you to drink one more cup of wine; west of Yangguan, there are no old friends",
    keywords: ["阳关", "故人"],
    suitableChars: ["劝", "酒", "阳", "故"],
    culturalContext:
      "送别友人的名篇。表达了深厚的友情和离别的惆怅，阳关三叠由此而来。",
    nameThemes: ["friendship", "farewell", "sorrow", "loyalty"],
    popularity: "high",
  },
  {
    id: "tang-e008",
    source: "唐诗",
    title: "江雪",
    author: "柳宗元",
    dynasty: "唐",
    era: "中唐 (c. 9th century)",
    verse: "孤舟蓑笠翁，独钓寒江雪",
    fullContext: "千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。",
    translation:
      "A solitary boat with an old man in straw rain gear, fishing alone in the cold river snow",
    keywords: ["孤舟", "独钓", "寒江"],
    suitableChars: ["孤", "舟", "独", "钓", "寒", "江"],
    culturalContext:
      "描写雪景与孤独的诗篇。以孤舟独钓表现清高孤傲的品格，表达不畏严寒、坚守节操的精神。",
    nameThemes: ["solitude", "perseverance", "purity", "independence"],
    popularity: "medium",
  },
  {
    id: "tang-e009",
    source: "唐诗",
    title: "游子吟",
    author: "孟郊",
    dynasty: "唐",
    era: "中唐 (c. 9th century)",
    verse: "谁言寸草心，报得三春晖",
    fullContext:
      "慈母手中线，游子身上衣。临行密密缝，意恐迟迟归。谁言寸草心，报得三春晖。",
    translation:
      "Who says the heart of inch-tall grass can repay the sunshine of three spring months?",
    keywords: ["寸草心", "三春晖"],
    suitableChars: ["寸", "草", "心", "春", "晖"],
    culturalContext:
      "歌颂母爱的千古名篇。以寸草心比喻子女微薄的孝心，三春晖比喻母爱深厚，表达了子女对母亲恩情的感激。",
    nameThemes: ["maternal-love", "gratitude", "filial", "warmth"],
    popularity: "high",
  },
  {
    id: "tang-e010",
    source: "唐诗",
    title: "赋得古原草送别",
    author: "白居易",
    dynasty: "唐",
    era: "中唐 (788年)",
    verse: "离离原上草，一岁一枯荣",
    fullContext:
      "离离原上草，一岁一枯荣。野火烧不尽，春风吹又生。远芳侵古道，晴翠接荒城。又送王孙去，萋萋满别情。",
    translation:
      "Lush grass on the plain, withers and flourishes yearly; fire cannot destroy it, spring wind brings it back",
    keywords: ["原上草", "枯荣", "春风"],
    suitableChars: ["离", "原", "草", "荣", "春"],
    culturalContext:
      "描写野草生命力的诗篇。野火烧不尽春风吹又生比喻顽强的生命力，是励志名句。",
    nameThemes: ["resilience", "life", "renewal", "perseverance"],
    popularity: "high",
  },
  {
    id: "tang-e011",
    source: "唐诗",
    title: "望月怀远",
    author: "张九龄",
    dynasty: "唐",
    era: "盛唐 (c. 8th century)",
    verse: "海上生明月，天涯共此时",
    fullContext: "海上生明月，天涯共此时。情人怨遥夜，竟夕起相思。",
    translation:
      "Bright moon rises over the sea, sharing this moment across the world",
    keywords: ["明月", "天涯"],
    suitableChars: ["明", "月", "天", "涯"],
    culturalContext:
      "描写望月怀远的诗篇。以明月寄托对远方亲友的思念，表达天涯共此时的情怀。",
    nameThemes: ["longing", "unity", "moon", "connection"],
    popularity: "high",
  },
  {
    id: "tang-e012",
    source: "唐诗",
    title: "枫桥夜泊",
    author: "张继",
    dynasty: "唐",
    era: "中唐 (c. 8th century)",
    verse: "姑苏城外寒山寺，夜半钟声到客船",
    fullContext:
      "月落乌啼霜满天，江枫渔火对愁眠。姑苏城外寒山寺，夜半钟声到客船。",
    translation:
      "Outside Suzhou lies Cold Mountain Temple; midnight bell reaches the passenger boat",
    keywords: ["寒山寺", "钟声"],
    suitableChars: ["姑", "苏", "寒", "钟"],
    culturalContext:
      "描写羁旅乡愁的诗篇。以钟声、霜天、江枫等意象渲染羁旅之愁，是唐诗中的经典。",
    nameThemes: ["sorrow", "travel", "night", "homesickness"],
    popularity: "medium",
  },
  {
    id: "tang-e013",
    source: "唐诗",
    title: "题都城南庄",
    author: "崔护",
    dynasty: "唐",
    era: "中唐 (c. 8th-9th century)",
    verse: "人面桃花相映红",
    fullContext:
      "去年今日此门中，人面桃花相映红。人面不知何处去，桃花依旧笑春风。",
    translation:
      "Beautiful face and peach blossoms reflected red; the face is gone, but peach blossoms still smile in spring breeze",
    keywords: ["人面", "桃花"],
    suitableChars: ["面", "桃", "花", "红"],
    culturalContext:
      "描写爱情与失去的诗篇。人面桃花成为美好事物的代名词，表达物是人非的感慨。",
    nameThemes: ["beauty", "love", "loss", "memory"],
    popularity: "high",
  },

  // ==================== 宋词 (Song Lyrics) ====================
  {
    id: "song-e001",
    source: "宋词",
    title: "水调歌头",
    author: "苏轼",
    dynasty: "宋",
    era: "北宋 (1076年)",
    verse: "但愿人长久，千里共婵娟",
    fullContext:
      "人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。",
    translation:
      "Wish that people may live long, sharing the moon's beauty across a thousand miles",
    keywords: ["长久", "千里", "婵娟"],
    suitableChars: ["长", "久", "千", "里", "婵", "娟"],
    culturalContext:
      "苏轼中秋词的代表作。表达了豁达的人生态度和对美好祝愿，婵娟成为月亮的美称。",
    nameThemes: ["longing", "blessing", "moon", "optimism"],
    popularity: "high",
  },
  {
    id: "song-e002",
    source: "宋词",
    title: "水调歌头",
    author: "苏轼",
    dynasty: "宋",
    era: "北宋 (1076年)",
    verse: "明月几时有，把酒问青天",
    fullContext: "明月几时有？把酒问青天。不知天上宫阙，今夕是何年。",
    translation:
      "When will the bright moon appear? Raising my cup, I ask the blue sky",
    keywords: ["明月", "青天"],
    suitableChars: ["明", "月", "青", "天"],
    culturalContext:
      "苏轼中秋词的开篇。以问月表达对人生哲理的思考，充满浪漫主义色彩。",
    nameThemes: ["contemplation", "moon", "philosophy", "beauty"],
    popularity: "high",
  },
  {
    id: "song-e003",
    source: "宋词",
    title: "念奴娇·赤壁怀古",
    author: "苏轼",
    dynasty: "宋",
    era: "北宋 (1082年)",
    verse: "大江东去，浪淘尽，千古风流人物",
    fullContext:
      "大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。",
    translation:
      "The great river flows east, waves washing away all heroic figures through the ages",
    keywords: ["大江", "风流"],
    suitableChars: ["江", "东", "流"],
    culturalContext:
      "苏轼豪放词的代表作。借赤壁古战场抒发历史感慨，表达了豁达豪迈的人生态度。",
    nameThemes: ["history", "heroism", "grandeur", "time"],
    popularity: "high",
  },
  {
    id: "song-e004",
    source: "宋词",
    title: "江城子",
    author: "苏轼",
    dynasty: "宋",
    era: "北宋 (1075年)",
    verse: "千里孤坟，无处话凄凉",
    fullContext: "十年生死两茫茫，不思量，自难忘。千里孤坟，无处话凄凉。",
    translation:
      "A thousand miles away, a lonely grave; nowhere to speak of my sorrow",
    keywords: ["千里", "孤坟", "凄凉"],
    suitableChars: ["千", "里", "孤", "凉"],
    culturalContext:
      "苏轼悼念亡妻之作。表达了深沉的悲痛和绵绵不绝的思念，是悼亡词的经典。",
    nameThemes: ["love", "loss", "sorrow", "memory"],
    popularity: "medium",
  },
  {
    id: "song-e005",
    source: "宋词",
    title: "虞美人",
    author: "李煜",
    dynasty: "宋",
    era: "南唐灭亡后 (c. 978年)",
    verse: "春花秋月何时了，往事知多少",
    fullContext:
      "春花秋月何时了？往事知多少。小楼昨夜又东风，故国不堪回首月明中。",
    translation:
      "When will spring flowers and autumn moon end? How many past events to remember",
    keywords: ["春花", "秋月"],
    suitableChars: ["春", "花", "秋", "月"],
    culturalContext:
      "李煜亡国后的代表作。以春花秋月对比亡国之痛，表达了深沉的故国之思。",
    nameThemes: ["sorrow", "memory", "loss", "nostalgia"],
    popularity: "high",
  },
  {
    id: "song-e006",
    source: "宋词",
    title: "虞美人",
    author: "李煜",
    dynasty: "宋",
    era: "南唐灭亡后 (c. 978年)",
    verse: "问君能有几多愁，恰似一江春水向东流",
    fullContext:
      "雕栏玉砌应犹在，只是朱颜改。问君能有几多愁，恰似一江春水向东流。",
    translation:
      "Ask how much sorrow I have? Just like a river of spring water flowing east",
    keywords: ["愁", "一江春水"],
    suitableChars: ["愁", "江", "春"],
    culturalContext:
      "李煜词中最著名的名句。以春水东流比喻愁绪绵绵不绝，是愁绪描写的经典。",
    nameThemes: ["sorrow", "emotion", "depth", "melancholy"],
    popularity: "high",
  },
  {
    id: "song-e007",
    source: "宋词",
    title: "声声慢",
    author: "李清照",
    dynasty: "宋",
    era: "南宋 (c. 12th century)",
    verse: "寻寻觅觅，冷冷清清，凄凄惨惨戚戚",
    fullContext: "寻寻觅觅，冷冷清清，凄凄惨惨戚戚。乍暖还寒时候，最难将息。",
    translation:
      "Searching and seeking, cold and desolate, miserable and sorrowful",
    keywords: ["寻觅", "凄清"],
    suitableChars: ["寻", "觅", "冷", "清", "凄"],
    culturalContext:
      "李清照晚年代表作。以叠字渲染孤独凄凉的心境，表达国破家亡后的哀愁。",
    nameThemes: ["sorrow", "loneliness", "melancholy", "loss"],
    popularity: "high",
  },
  {
    id: "song-e008",
    source: "宋词",
    title: "一剪梅",
    author: "李清照",
    dynasty: "宋",
    era: "南宋 (c. 12th century)",
    verse: "此情无计可消除，才下眉头，却上心头",
    fullContext:
      "花自飘零水自流，一种相思，两处闲愁。此情无计可消除，才下眉头，却上心头。",
    translation:
      "This love cannot be dispelled; just leaves the brows, yet rises to the heart",
    keywords: ["相思", "眉头", "心头"],
    suitableChars: ["相", "思", "眉", "心", "头"],
    culturalContext:
      "描写相思之苦的名篇。才下眉头却上心头生动刻画了相思之情难以排遣的状态。",
    nameThemes: ["love", "longing", "sorrow", "romance"],
    popularity: "high",
  },
  {
    id: "song-e009",
    source: "宋词",
    title: "醉花阴",
    author: "李清照",
    dynasty: "宋",
    era: "北宋 (c. 12th century)",
    verse: "莫道不消魂，帘卷西风，人比黄花瘦",
    fullContext:
      "薄雾浓云愁永昼，瑞脑销金兽。佳节又重阳，玉枕纱厨，半夜凉初透。东篱把酒黄昏后，有暗香盈袖。莫道不消魂，帘卷西风，人比黄花瘦。",
    translation:
      "Don't say I'm not soul-stricken; west wind rolls the curtain, I'm thinner than yellow flowers",
    keywords: ["消魂", "黄花"],
    suitableChars: ["消", "魂", "黄", "花"],
    culturalContext:
      "李清照重阳思念丈夫之作。人比黄花瘦成为形容相思之苦的经典比喻。",
    nameThemes: ["love", "longing", "sorrow", "elegance"],
    popularity: "high",
  },
  {
    id: "song-e010",
    source: "宋词",
    title: "满江红",
    author: "岳飞",
    dynasty: "宋",
    era: "南宋 (c. 12th century)",
    verse: "莫等闲，白了少年头，空悲切",
    fullContext: "三十功名尘与土，八千里路云和月。莫等闲，白了少年头，空悲切。",
    translation:
      "Don't idle away time; when youth's head turns white, vainly sorrow",
    keywords: ["少年", "功名"],
    suitableChars: ["等", "闲", "少", "年", "功", "名"],
    culturalContext:
      "岳飞抗金词作的名句。劝诫人们珍惜时光、及时奋斗，是励志名句。",
    nameThemes: ["determination", "youth", "ambition", "patriotism"],
    popularity: "high",
  },
  {
    id: "song-e011",
    source: "宋词",
    title: "满江红",
    author: "岳飞",
    dynasty: "宋",
    era: "南宋 (c. 12th century)",
    verse: "壮志饥餐胡虏肉，笑谈渴饮匈奴血",
    fullContext:
      "靖康耻，犹未雪。臣子恨，何时灭！驾长车，踏破贺兰山缺。壮志饥餐胡虏肉，笑谈渴饮匈奴血。",
    translation:
      "With ambition, I'd eat the enemy's meat; laughing, I'd drink their blood",
    keywords: ["壮志"],
    suitableChars: ["壮", "志"],
    culturalContext:
      "岳飞表达抗金决心的名句。壮志饥餐胡虏肉表现了强烈的爱国情怀和战斗意志。",
    nameThemes: ["patriotism", "courage", "determination", "strength"],
    popularity: "medium",
  },
  {
    id: "song-e012",
    source: "宋词",
    title: "青玉案",
    author: "辛弃疾",
    dynasty: "宋",
    era: "南宋 (c. 12th century)",
    verse: "众里寻他千百度，蓦然回首，那人却在，灯火阑珊处",
    fullContext:
      "东风夜放花千树，更吹落，星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。蛾儿雪柳黄金缕，笑语盈盈暗香去。众里寻他千百度，蓦然回首，那人却在，灯火阑珊处。",
    translation:
      "Searching for her a thousand times in the crowd; suddenly looking back, she is there where lights are dim",
    keywords: ["寻觅", "灯火阑珊"],
    suitableChars: ["众", "寻", "蓦", "然", "阑", "珊"],
    culturalContext:
      "辛弃疾婉约词的代表作。众里寻他千百度描写执着追求，灯火阑珊处营造朦胧意境。",
    nameThemes: ["romance", "pursuit", "discovery", "beauty"],
    popularity: "high",
  },
  {
    id: "song-e013",
    source: "宋词",
    title: "鹊桥仙",
    author: "秦观",
    dynasty: "宋",
    era: "北宋 (c. 11th-12th century)",
    verse: "两情若是久长时，又岂在朝朝暮暮",
    fullContext:
      "纤云弄巧，飞星传恨，银汉迢迢暗度。金风玉露一相逢，便胜却人间无数。柔情似水，佳期如梦，忍顾鹊桥归路。两情若是久长时，又岂在朝朝暮暮。",
    translation:
      "If love lasts long, why must we be together morning and evening?",
    keywords: ["久长", "朝朝暮暮"],
    suitableChars: ["久", "长", "朝", "暮"],
    culturalContext:
      "秦观描写牛郎织女爱情的名篇。两情若是久长时表达了超越时空的真爱观。",
    nameThemes: ["love", "eternity", "devotion", "romance"],
    popularity: "high",
  },
  {
    id: "song-e014",
    source: "宋词",
    title: "雨霖铃",
    author: "柳永",
    dynasty: "宋",
    era: "北宋 (c. 11th-12th century)",
    verse: "多情自古伤离别，更那堪，冷落清秋节",
    fullContext:
      "寒蝉凄切，对长亭晚，骤雨初歇。都门帐饮无绪，留恋处，兰舟催发。执手相看泪眼，竟无语凝噎。念去去，千里烟波，暮霭沉沉楚天阔。多情自古伤离别，更那堪，冷落清秋节。",
    translation:
      "Lovers have always grieved at parting; how much more in this desolate autumn season",
    keywords: ["多情", "离别", "清秋"],
    suitableChars: ["多", "情", "离", "别", "清", "秋"],
    culturalContext:
      "柳永婉约词的代表作。多情自古伤离别道出了离别的普遍痛苦，是离别词的经典。",
    nameThemes: ["parting", "sorrow", "autumn", "emotion"],
    popularity: "medium",
  },
];

/**
 * Get enhanced poetry by source
 */
export function getEnhancedPoetryBySource(
  source: PoetryVerseEnhanced["source"],
): PoetryVerseEnhanced[] {
  return POETRY_ENHANCED.filter((p) => p.source === source);
}

/**
 * Get enhanced poetry by name theme
 */
export function getEnhancedPoetryByTheme(theme: string): PoetryVerseEnhanced[] {
  return POETRY_ENHANCED.filter((p) => p.nameThemes.includes(theme));
}

/**
 * Get enhanced poetry by popularity
 */
export function getEnhancedPoetryByPopularity(
  popularity: "high" | "medium" | "low",
): PoetryVerseEnhanced[] {
  return POETRY_ENHANCED.filter((p) => p.popularity === popularity);
}

/**
 * Search enhanced poetry
 */
export function searchEnhancedPoetry(keyword: string): PoetryVerseEnhanced[] {
  const lowerKeyword = keyword.toLowerCase();
  return POETRY_ENHANCED.filter(
    (p) =>
      p.verse.includes(keyword) ||
      p.title.includes(keyword) ||
      p.culturalContext.includes(keyword) ||
      p.nameThemes.some((t) => t.toLowerCase().includes(lowerKeyword)),
  );
}
