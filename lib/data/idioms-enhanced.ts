/**
 * Enhanced Chinese Idioms (成语) Database
 *
 * Comprehensive idiom collection with:
 * - Detailed explanations
 * - Historical sources and stories
 * - Usage examples
 * - Cultural context
 *
 * References:
 * - 《成语大词典》上海辞书出版社，2014
 * - 《中华成语词典》商务印书馆，2018
 * - 《成语故事》中华书局，2016
 */

export interface IdiomEnhanced {
  idiom: string;
  pinyin: string;
  meaning: string;
  detailedExplanation: string;
  source: string; // Historical source
  sourceWork?: string; // Specific work
  story: string; // The story behind the idiom
  example?: string; // Usage example
  suitableChars: string[];
  category: "品德" | "才华" | "美好" | "成功" | "自然" | "智慧" | "情感";
  popularity: "high" | "medium" | "low";
}

/**
 * Enhanced idiom database with complete metadata
 */
export const IDIOM_ENHANCED: IdiomEnhanced[] = [
  // ==================== 品德类 (Virtue) ====================
  {
    idiom: "德高望重",
    pinyin: "dé gāo wàng zhòng",
    meaning: "道德高尚，名望很大",
    detailedExplanation: "形容人品德高尚，声望极高，受到大家的尊敬和推崇。",
    source: "《晋书》",
    story:
      "源于古代对圣贤的推崇。古人认为德行与声望是相辅相成的，有德必有望。此成语常用于德高望重的长者或受人敬仰的人物。",
    example: "王老先生德高望重，深受乡邻敬重。",
    suitableChars: ["德", "高", "望", "重"],
    category: "品德",
    popularity: "high",
  },
  {
    idiom: "温文尔雅",
    pinyin: "wēn wén ěr yǎ",
    meaning: "态度温和，举止文雅",
    detailedExplanation:
      "形容人态度温和，举止文雅，表现出良好的教养和文化修养。",
    source: "清·蒲松龄《聊斋志异》",
    story:
      "形容读书人特有的温和气质。古人认为真正的君子应当温和而不暴躁，文雅而不粗俗。",
    example: "他温文尔雅，谈吐不凡。",
    suitableChars: ["温", "文", "雅"],
    category: "品德",
    popularity: "high",
  },
  {
    idiom: "彬彬有礼",
    pinyin: "bīn bīn yǒu lǐ",
    meaning: "形容文雅有礼貌",
    detailedExplanation: "形容人的举止文雅，态度很有礼貌。彬彬形容文雅的样子。",
    source: "《史记·司马相如列传》",
    story:
      "源于儒家对君子礼仪的要求。孔子说：文质彬彬，然后君子。意为文采和质朴配合得当，才是君子。",
    example: "这位服务员彬彬有礼，让人如沐春风。",
    suitableChars: ["彬", "礼"],
    category: "品德",
    popularity: "high",
  },
  {
    idiom: "光明磊落",
    pinyin: "guāng míng lěi luò",
    meaning: "心地光明，胸怀坦荡",
    detailedExplanation: "形容人胸怀坦白，没有私心，行为正大光明。",
    source: "《晋书·石勒载记》",
    story:
      "磊落本指山石众多堆积的样子，引申为胸怀坦荡。光明磊落形容人的品德像日月一样光明，胸怀像山石一样坦荡。",
    example: "他做人光明磊落，从不背后搞小动作。",
    suitableChars: ["光", "明", "磊", "落"],
    category: "品德",
    popularity: "high",
  },
  {
    idiom: "大公无私",
    pinyin: "dà gōng wú sī",
    meaning: "一心为公，没有私心",
    detailedExplanation: "形容办事公正，完全为集体利益着想，没有一点私心杂念。",
    source: "《管子·形势解》",
    story:
      "源于古代对清官的赞誉。大公无私是儒家追求的政治理想，也是评价官员的重要标准。",
    example: "法官大公无私，秉公办案。",
    suitableChars: ["公", "无", "私"],
    category: "品德",
    popularity: "high",
  },
  {
    idiom: "厚德载物",
    pinyin: "hòu dé zài wù",
    meaning: "道德深厚能容万物",
    detailedExplanation:
      "指道德高尚者能承担重大任务。厚形容深厚，载承载，物万物。",
    source: "《周易·坤》",
    story:
      "出自坤卦象辞：地势坤，君子以厚德载物。意为人应效法大地，以深厚的德行承载万物。",
    example: "我们要厚德载物，宽容待人。",
    suitableChars: ["厚", "德", "载"],
    category: "品德",
    popularity: "high",
  },
  {
    idiom: "德才兼备",
    pinyin: "dé cái jiān bèi",
    meaning: "品德和才能都具备",
    detailedExplanation: "既有好的品德，又有出色的才能，是全面发展的优秀人才。",
    source: "元·无名氏《渔樵记》",
    story:
      "古代对人才的最高评价。儒家认为，真正的君子应当德才兼备，德为先，才为辅。",
    example: "这是一位德才兼备的优秀干部。",
    suitableChars: ["德", "才", "兼", "备"],
    category: "品德",
    popularity: "high",
  },
  {
    idiom: "宽宏大量",
    pinyin: "kuān hóng dà liàng",
    meaning: "度量大，能容人",
    detailedExplanation: "形容人度量大，心胸开阔，能够容忍别人的过失。",
    source: "元·无名氏《渔樵记》",
    story:
      "宽宏指度量宏大。古代认为，真正的君子应当有宽广的胸怀，能够包容不同的意见和人。",
    example: "他宽宏大量，从不计较个人得失。",
    suitableChars: ["宽", "宏", "量"],
    category: "品德",
    popularity: "medium",
  },
  {
    idiom: "虚怀若谷",
    pinyin: "xū huái ruò gǔ",
    meaning: "胸怀像山谷一样宽广",
    detailedExplanation: "形容十分谦虚，能容纳别人的意见。",
    source: "《老子》",
    story:
      "老子说：敦兮其若朴，旷兮其若谷。意为人应当像山谷一样空旷，能容纳万物。",
    example: "他虚怀若谷，乐于听取不同意见。",
    suitableChars: ["虚", "怀", "谷"],
    category: "品德",
    popularity: "medium",
  },
  {
    idiom: "正直无私",
    pinyin: "zhèng zhí wú sī",
    meaning: "公正耿直，没有私心",
    detailedExplanation: "形容做人做事公正坦荡，不为私利所动。",
    source: "《左传》",
    story:
      "正直是中华民族的传统美德。古人认为，正直无私是做人的根本，也是为官的准则。",
    example: "他一生正直无私，深受人民爱戴。",
    suitableChars: ["正", "直", "无", "私"],
    category: "品德",
    popularity: "medium",
  },

  // ==================== 才华类 (Talent) ====================
  {
    idiom: "才高八斗",
    pinyin: "cái gāo bā dǒu",
    meaning: "形容人文才极高",
    detailedExplanation: "形容人文才横溢，才华极高。",
    source: "《南史·谢灵运传》",
    story:
      "南朝诗人谢灵运说：天下才有一石，曹子建独占八斗，我得一斗，天下共分一斗。后用才高八斗形容文才出众。",
    example: "李白才高八斗，被誉为诗仙。",
    suitableChars: ["才", "高"],
    category: "才华",
    popularity: "high",
  },
  {
    idiom: "学富五车",
    pinyin: "xué fù wǔ chē",
    meaning: "读书很多，学问渊博",
    detailedExplanation: "形容读书多，学问渊博。",
    source: "《庄子·天下》",
    story:
      "战国时期惠施学问渊博，他读的书要五辆车才能装完。后用学富五车形容学识丰富。",
    example: "这位教授学富五车，是学界泰斗。",
    suitableChars: ["学", "富"],
    category: "才华",
    popularity: "high",
  },
  {
    idiom: "博学多才",
    pinyin: "bó xué duō cái",
    meaning: "学识广博，有多方面的才能",
    detailedExplanation: "形容人学识广博，在多个领域都有才能。",
    source: "《晋书·郤诜传》",
    story:
      "古代对通才的赞誉。儒家强调博学多才，认为君子应当多才多艺，适应社会需要。",
    example: "他博学多才，精通多门外语。",
    suitableChars: ["博", "学", "才"],
    category: "才华",
    popularity: "high",
  },
  {
    idiom: "才华横溢",
    pinyin: "cái huá héng yì",
    meaning: "非常有才华",
    detailedExplanation: "形容才华充分流露出来。",
    source: "清·曾国藩《曾国藩家书》",
    story:
      "横溢本指水满溢出，引申为才华充分展现。形容人的才华像泉水一样自然流露。",
    example: "这位年轻作家才华横溢，作品广受好评。",
    suitableChars: ["才", "华", "溢"],
    category: "才华",
    popularity: "high",
  },
  {
    idiom: "出类拔萃",
    pinyin: "chū lèi bá cuì",
    meaning: "超出同类，高出一般",
    detailedExplanation: "形容人的品德、才能超出同类，非常优秀。",
    source: "《孟子·公孙丑上》",
    story:
      "孟子说：出于其类，拔乎其萃。意为产生于同类之中，但超越了同类，是最优秀的。",
    example: "他在学生中出类拔萃，成绩优异。",
    suitableChars: ["出", "类", "萃"],
    category: "才华",
    popularity: "high",
  },
  {
    idiom: "聪明伶俐",
    pinyin: "cōng míng líng lì",
    meaning: "聪明灵活",
    detailedExplanation: "形容人聪明机灵，反应灵敏。",
    source: "明·冯梦龙《醒世恒言》",
    story: "聪明指智力发达，伶俐指灵活机敏。形容人头脑灵活，反应敏捷。",
    example: "这孩子聪明伶俐，深受老师喜爱。",
    suitableChars: ["聪", "明", "伶", "俐"],
    category: "才华",
    popularity: "high",
  },
  {
    idiom: "独具匠心",
    pinyin: "dú jù jiàng xīn",
    meaning: "具有独特的巧妙心思",
    detailedExplanation: "形容在技术或艺术构思方面有创造性。",
    source: "唐·王士源《孟浩然集序》",
    story: "匠心指巧妙的心思。独具匠心形容在创作或设计上有独特的构思和创新。",
    example: "这件作品独具匠心，令人赞叹。",
    suitableChars: ["独", "匠", "心"],
    category: "才华",
    popularity: "medium",
  },
  {
    idiom: "妙笔生花",
    pinyin: "miào bǐ shēng huā",
    meaning: "形容写作能力极强",
    detailedExplanation: "形容写作能力极强，能写出优美的文章。",
    source: "唐·李白《与韩荆州书》",
    story:
      "传说李白梦笔头生花，从此才华横溢，文思泉涌。后用妙笔生花形容文采斐然。",
    example: "这位作家妙笔生花，著作等身。",
    suitableChars: ["妙", "笔", "花"],
    category: "才华",
    popularity: "medium",
  },

  // ==================== 美好类 (Beauty) ====================
  {
    idiom: "春华秋实",
    pinyin: "chūn huá qiū shí",
    meaning: "春天开花，秋天结果",
    detailedExplanation: "比喻文采和德行。也比喻事物的因果关系。",
    source: "《后汉书》",
    story:
      "春天开花，秋天结果，是自然规律。古人用来比喻文采和德行的关系，有文采必有德行。",
    example: "他春华秋实，既有文采又有德行。",
    suitableChars: ["春", "华", "秋", "实"],
    category: "美好",
    popularity: "high",
  },
  {
    idiom: "花好月圆",
    pinyin: "huā hǎo yuè yuán",
    meaning: "花儿正盛开，月亮正圆满",
    detailedExplanation: "比喻美好圆满。常用于祝福新婚夫妇。",
    source: "宋·晁端礼《行香子》",
    story:
      "花好月圆是中秋节的美景，也是中国人对美好生活的向往。常用于祝贺新婚。",
    example: "祝你们花好月圆，白头偕老。",
    suitableChars: ["花", "月", "圆"],
    category: "美好",
    popularity: "high",
  },
  {
    idiom: "美不胜收",
    pinyin: "měi bù shèng shōu",
    meaning: "美好的东西太多",
    detailedExplanation: "美好的东西太多，一时看不过来。",
    source: "清·钱泳《履园丛话》",
    story: "胜收指全部收纳。美不胜收形容美好的事物太多，让人目不暇接。",
    example: "花园里百花盛开，美不胜收。",
    suitableChars: ["美"],
    category: "美好",
    popularity: "high",
  },
  {
    idiom: "欣欣向荣",
    pinyin: "xīn xīn xiàng róng",
    meaning: "形容草木茂盛",
    detailedExplanation: "比喻事业蓬勃发展，兴旺昌盛。",
    source: "晋·陶渊明《归去来兮辞》",
    story:
      "欣欣形容草木茂盛的样子。欣欣向荣原指草木长得茂盛，后比喻事业发展兴旺。",
    example: "改革开放以来，祖国欣欣向荣。",
    suitableChars: ["欣", "荣"],
    category: "美好",
    popularity: "high",
  },
  {
    idiom: "繁花似锦",
    pinyin: "fán huā sì jǐn",
    meaning: "繁密的花朵像锦绣一样",
    detailedExplanation: "形容美好的事物繁多，像锦绣一样美丽。",
    source: "《警世通言》",
    story: "锦是精美的丝织品。繁花似锦形容花开得茂盛，色彩斑斓，十分美丽。",
    example: "公园里繁花似锦，游人如织。",
    suitableChars: ["繁", "花", "锦"],
    category: "美好",
    popularity: "medium",
  },
  {
    idiom: "如花似玉",
    pinyin: "rú huā sì yù",
    meaning: "像花和玉一样美好",
    detailedExplanation: "形容女子容貌美丽。",
    source: "《诗经·魏风·汾沮洳》",
    story: "古人常用花和玉比喻女子的美丽。如花似玉成为形容美女的经典成语。",
    example: "那姑娘如花似玉，楚楚动人。",
    suitableChars: ["花", "玉"],
    category: "美好",
    popularity: "high",
  },
  {
    idiom: "倾国倾城",
    pinyin: "qīng guó qīng chéng",
    meaning: "美貌能倾覆国家城池",
    detailedExplanation: "形容女子容貌极其美丽。",
    source: "《汉书·外戚传》",
    story: "汉代李延年歌曰：一顾倾人城，再顾倾人国。后用倾国倾城形容绝世美女。",
    example: "她倾国倾城的美貌令人惊艳。",
    suitableChars: ["倾", "国", "城"],
    category: "美好",
    popularity: "high",
  },
  {
    idiom: "风华正茂",
    pinyin: "fēng huá zhèng mào",
    meaning: "青春才华正旺盛",
    detailedExplanation: "形容青年朝气蓬勃，奋发有为。",
    source: "毛泽东《沁园春·长沙》",
    story: "风华指风采和才华。风华正茂形容年轻人正值青春年华，才华横溢。",
    example: "这批年轻人风华正茂，是国家栋梁。",
    suitableChars: ["风", "华", "茂"],
    category: "美好",
    popularity: "high",
  },

  // ==================== 成功类 (Success) ====================
  {
    idiom: "马到成功",
    pinyin: "mǎ dào chéng gōng",
    meaning: "形容迅速取得成功",
    detailedExplanation: "形容工作刚开始就取得成功。",
    source: "元·张国宾《薛仁贵》",
    story: "古代战争以马到敌营为象征，马到成功形容军队一到就取得胜利。",
    example: "祝你们马到成功，旗开得胜！",
    suitableChars: ["马", "功", "成"],
    category: "成功",
    popularity: "high",
  },
  {
    idiom: "一帆风顺",
    pinyin: "yī fān fēng shùn",
    meaning: "船挂着帆顺风行驶",
    detailedExplanation: "比喻非常顺利，没有任何阻碍。",
    source: "清·李渔《怜香伴》",
    story: "一帆风顺本指船帆顺风，航行顺利。后比喻事情发展顺利，没有挫折。",
    example: "祝你一帆风顺，前程似锦。",
    suitableChars: ["帆", "顺"],
    category: "成功",
    popularity: "high",
  },
  {
    idiom: "蒸蒸日上",
    pinyin: "zhēng zhēng rì shàng",
    meaning: "一天比一天好",
    detailedExplanation: "形容事业一天天向上发展。",
    source: "《诗经·周颂·执竞》",
    story: "蒸蒸形容兴盛向上的样子。蒸蒸日上形容事业或生活一天比一天好。",
    example: "公司业务蒸蒸日上，形势喜人。",
    suitableChars: ["蒸"],
    category: "成功",
    popularity: "high",
  },
  {
    idiom: "锦上添花",
    pinyin: "jǐn shàng tiān huā",
    meaning: "在锦上再绣花",
    detailedExplanation: "比喻好上加好，美上加美。",
    source: "宋·黄庭坚《谢薄刺史一百韵》",
    story: "在精美的锦缎上再绣上花朵，比喻已经很好的事情更加美好。",
    example: "这幅画精美绝伦，题字更是锦上添花。",
    suitableChars: ["锦", "花"],
    category: "成功",
    popularity: "high",
  },
  {
    idiom: "百尺竿头",
    pinyin: "bǎi chǐ gān tóu",
    meaning: "更进一步",
    detailedExplanation: "比喻学问、成绩等达到很高程度后继续努力。",
    source: "《景德传灯录》",
    story:
      "百尺竿头，更进一步。原指佛教修行达到极高境界，后泛指在已有成绩上继续努力。",
    example: "祝你百尺竿头，更进一步！",
    suitableChars: ["百", "竿"],
    category: "成功",
    popularity: "medium",
  },
  {
    idiom: "功成名就",
    pinyin: "gōng chéng míng jiù",
    meaning: "功业建成，名声显扬",
    detailedExplanation: "形容功业成就，名望已立。",
    source: "《墨子·修身》",
    story: "功成名就是古代对人生成功的最高评价。功指功业，名指声望。",
    example: "他中年功成名就，荣归故里。",
    suitableChars: ["功", "成", "名", "就"],
    category: "成功",
    popularity: "high",
  },
  {
    idiom: "鹏程万里",
    pinyin: "péng chéng wàn lǐ",
    meaning: "前程远大",
    detailedExplanation: "比喻前程远大，不可限量。",
    source: "《庄子·逍遥游》",
    story: "鹏是传说中的大鸟，一飞万里。鹏程万里比喻前程远大。",
    example: "祝你鹏程万里，前程似锦！",
    suitableChars: ["鹏", "程", "万", "里"],
    category: "成功",
    popularity: "high",
  },
  {
    idiom: "前途无量",
    pinyin: "qián tú wú liàng",
    meaning: "前途不可限量",
    detailedExplanation: "形容前途远大，不可估量。",
    source: "《三国演义》",
    story: "无量指无法计算。前途无量形容人的前途非常远大。",
    example: "这个孩子天赋异禀，前途无量。",
    suitableChars: ["前", "途", "无", "量"],
    category: "成功",
    popularity: "high",
  },

  // ==================== 自然类 (Nature) ====================
  {
    idiom: "山清水秀",
    pinyin: "shān qīng shuǐ xiù",
    meaning: "风景优美",
    detailedExplanation: "形容风景优美，山水秀丽。",
    source: "宋·黄庭坚《谢薄刺史一百韵》",
    story: "山清水秀形容自然环境优美，是描写山水景色的经典成语。",
    example: "我的家乡山清水秀，风景如画。",
    suitableChars: ["山", "清", "秀"],
    category: "自然",
    popularity: "high",
  },
  {
    idiom: "风和日丽",
    pinyin: "fēng hé rì lì",
    meaning: "微风和煦，阳光明丽",
    detailedExplanation: "形容天气晴朗暖和。",
    source: "唐·无名氏《句》",
    story: "形容春天或初夏的好天气，微风和煦，阳光明媚。",
    example: "今天风和日丽，适合郊游。",
    suitableChars: ["风", "和", "丽"],
    category: "自然",
    popularity: "high",
  },
  {
    idiom: "云淡风轻",
    pinyin: "yún dàn fēng qīng",
    meaning: "云淡风也轻",
    detailedExplanation: "形容天气晴好。也比喻对事情不放在心上。",
    source: "宋·程颢《春日偶成》",
    story: "云淡风轻形容春日天气晴好，也形容人的心态轻松淡然。",
    example: "他处事云淡风轻，从容不迫。",
    suitableChars: ["云", "淡", "风", "轻"],
    category: "自然",
    popularity: "high",
  },
  {
    idiom: "春暖花开",
    pinyin: "chūn nuǎn huā kāi",
    meaning: "春天气候温暖，百花盛开",
    detailedExplanation: "形容春景美好。也比喻时机有利。",
    source: "明·朱国祯《涌幢小品》",
    story: "春暖花开是春天的典型景象，象征生机与希望。",
    example: "春暖花开时节，我们去踏青吧。",
    suitableChars: ["春", "暖", "花"],
    category: "自然",
    popularity: "high",
  },
  {
    idiom: "明月清风",
    pinyin: "míng yuè qīng fēng",
    meaning: "月儿明亮，风儿清爽",
    detailedExplanation: "形容夜色美好。也比喻超凡脱俗的境界。",
    source: "《南史·褚彦回传》",
    story: "明月清风是古人向往的清雅境界，象征高洁的品格。",
    example: "亭中明月清风，令人心旷神怡。",
    suitableChars: ["明", "月", "清", "风"],
    category: "自然",
    popularity: "high",
  },
  {
    idiom: "春华秋实",
    pinyin: "chūn huá qiū shí",
    meaning: "春天开花，秋天结果",
    detailedExplanation: "比喻文采和德行。也比喻辛勤耕耘终有收获。",
    source: "《后汉书》",
    story: "春天开花，秋天结果，是自然的规律。古人用来比喻因果关系。",
    example: "多年春华秋实，终于获得成果。",
    suitableChars: ["春", "华", "秋", "实"],
    category: "自然",
    popularity: "medium",
  },

  // ==================== 智慧类 (Wisdom) ====================
  {
    idiom: "明察秋毫",
    pinyin: "míng chá qiū háo",
    meaning: "目光敏锐，能看清极细小的东西",
    detailedExplanation: "形容人精明，目光敏锐，任何细微问题都能看清楚。",
    source: "《孟子·梁惠王上》",
    story: "秋毫是秋天鸟兽身上新长的细毛。明察秋毫形容能看清极细微的事物。",
    example: "这位侦探明察秋毫，破案无数。",
    suitableChars: ["明", "察", "毫"],
    category: "智慧",
    popularity: "medium",
  },
  {
    idiom: "足智多谋",
    pinyin: "zú zhì duō móu",
    meaning: "富有智慧，善于谋划",
    detailedExplanation: "形容人智慧丰富，很会谋划。",
    source: "元·关汉卿《单刀会》",
    story: "足智指智慧充足，多谋指善于谋划。形容人聪明有谋略。",
    example: "诸葛亮足智多谋，是三国时期著名的谋略家。",
    suitableChars: ["足", "智", "谋"],
    category: "智慧",
    popularity: "high",
  },
  {
    idiom: "深思熟虑",
    pinyin: "shēn sī shú lǜ",
    meaning: "深入细致地考虑",
    detailedExplanation: "形容反复深入地思考。",
    source: "《楚辞·九章》",
    story: "深指深入，熟指成熟，虑指考虑。深思熟虑形容思考问题周密深入。",
    example: "这个决定是他深思熟虑后做出的。",
    suitableChars: ["深", "思", "熟", "虑"],
    category: "智慧",
    popularity: "high",
  },
  {
    idiom: "大智若愚",
    pinyin: "dà zhì ruò yú",
    meaning: "大智慧的人不露锋芒",
    detailedExplanation: "指最有智慧的人不露锋芒，表面看起来好像很愚笨。",
    source: "《老子》",
    story: "老子认为，真正的智者不炫耀聪明，反而看起来朴实无华。",
    example: "他大智若愚，从不炫耀自己的才能。",
    suitableChars: ["智", "愚"],
    category: "智慧",
    popularity: "medium",
  },
  {
    idiom: "见多识广",
    pinyin: "jiàn duō shí guǎng",
    meaning: "见得多，知道得广",
    detailedExplanation: "形容阅历深，经验丰富。",
    source: "明·冯梦龙《古今小说》",
    story: "见多指经历丰富，识广指知识广博。形容人阅历深，见识广。",
    example: "他走南闯北，见多识广。",
    suitableChars: ["见", "识"],
    category: "智慧",
    popularity: "high",
  },

  // ==================== 情感类 (Emotion) ====================
  {
    idiom: "心心相印",
    pinyin: "xīn xīn xiāng yìn",
    meaning: "彼此心意相通",
    detailedExplanation: "形容彼此思想感情完全一致，心意相通。",
    source: "《六祖大师法宝坛经》",
    story: "佛教用语，形容心意相通。后用来形容两人感情深厚，心意相通。",
    example: "这对夫妻心心相印，恩爱有加。",
    suitableChars: ["心", "印"],
    category: "情感",
    popularity: "high",
  },
  {
    idiom: "情深似海",
    pinyin: "qíng shēn sì hǎi",
    meaning: "感情像海一样深",
    detailedExplanation: "形容感情非常深厚。",
    source: "明·崔时佩《西厢记》",
    story: "情深似海形容感情像大海一样深广，不可测量。",
    example: "父母情深似海，子女应当感恩。",
    suitableChars: ["情", "深", "海"],
    category: "情感",
    popularity: "high",
  },
  {
    idiom: "依依不舍",
    pinyin: "yī yī bù shě",
    meaning: "舍不得分离",
    detailedExplanation: "形容非常留恋，不忍分离。",
    source: "《诗经·小雅·采薇》",
    story: "依依形容留恋的样子。依依不舍形容舍不得分别的情感。",
    example: "毕业时，同学们依依不舍地告别。",
    suitableChars: ["依", "舍"],
    category: "情感",
    popularity: "high",
  },
  {
    idiom: "喜笑颜开",
    pinyin: "xǐ xiào yán kāi",
    meaning: "心情愉快，满面笑容",
    detailedExplanation: "形容心情愉快，笑容满面。",
    source: "明·冯梦龙《醒世恒言》",
    story: "喜笑形容高兴的样子，颜开指笑容展开。",
    example: "听到好消息，他喜笑颜开。",
    suitableChars: ["喜", "笑", "颜", "开"],
    category: "情感",
    popularity: "high",
  },
  {
    idiom: "心旷神怡",
    pinyin: "xīn kuàng shén yí",
    meaning: "心情舒畅，精神愉快",
    detailedExplanation: "形容心情舒畅，精神愉快。",
    source: "宋·范仲淹《岳阳楼记》",
    story: "心旷指心胸开阔，神怡指精神愉快。形容心情舒畅愉悦。",
    example: "登上山顶，清风拂面，令人心旷神怡。",
    suitableChars: ["心", "旷", "神", "怡"],
    category: "情感",
    popularity: "high",
  },
  {
    idiom: "情深义重",
    pinyin: "qíng shēn yì zhòng",
    meaning: "感情深，情义重",
    detailedExplanation: "形容感情深厚，情义深重。",
    source: "曹雪芹《红楼梦》",
    story: "情深义重形容人与人之间感情深厚，情义深重。",
    example: "两人情深义重，是生死之交。",
    suitableChars: ["情", "深", "义", "重"],
    category: "情感",
    popularity: "medium",
  },
  {
    idiom: "其乐融融",
    pinyin: "qí lè róng róng",
    meaning: "快乐和谐的样子",
    detailedExplanation: "形容快乐和睦的气氛。",
    source: "《左传·隐公元年》",
    story: "融融形容和乐的样子。其乐融融形容相处得非常快乐和谐。",
    example: "一家人团聚，其乐融融。",
    suitableChars: ["乐", "融"],
    category: "情感",
    popularity: "high",
  },
];

/**
 * Get enhanced idioms by category
 */
export function getEnhancedIdiomsByCategory(
  category: IdiomEnhanced["category"],
): IdiomEnhanced[] {
  return IDIOM_ENHANCED.filter((i) => i.category === category);
}

/**
 * Get enhanced idioms by popularity
 */
export function getEnhancedIdiomsByPopularity(
  popularity: "high" | "medium" | "low",
): IdiomEnhanced[] {
  return IDIOM_ENHANCED.filter((i) => i.popularity === popularity);
}

/**
 * Search enhanced idioms
 */
export function searchEnhancedIdioms(keyword: string): IdiomEnhanced[] {
  const lowerKeyword = keyword.toLowerCase();
  return IDIOM_ENHANCED.filter(
    (i) =>
      i.idiom.includes(keyword) ||
      i.meaning.includes(keyword) ||
      i.pinyin.toLowerCase().includes(lowerKeyword) ||
      i.suitableChars.some((c) => c === keyword),
  );
}

/**
 * Get idiom by character
 */
export function getEnhancedIdiomsByCharacter(char: string): IdiomEnhanced[] {
  return IDIOM_ENHANCED.filter((i) => i.suitableChars.includes(char));
}
