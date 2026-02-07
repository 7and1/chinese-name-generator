import Link from "next/link";
import { CHINESE_SURNAMES } from "@/lib/data/surnames";
import { FIVE_ELEMENT_INFO } from "@/lib/data/elements";
import type { ChineseCharacter, FiveElement } from "@/lib/types";

interface ElementInternalLinksProps {
  locale: string;
  currentElement: FiveElement;
  characters: ChineseCharacter[];
}

export function ElementInternalLinks({
  locale,
  currentElement,
  characters,
}: ElementInternalLinksProps) {
  const isZh = locale === "zh";
  const elementInfo = FIVE_ELEMENT_INFO[currentElement];

  // Get top surnames compatible with this element
  const compatibleSurnames = CHINESE_SURNAMES.slice(0, 12);

  return (
    <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">
        {isZh ? "相关链接" : "Related Links"}
      </h2>

      <div className="space-y-4">
        {/* Popular Surnames */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
            {isZh ? "热门姓氏" : "Popular Surnames"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {compatibleSurnames.map((s) => (
              <Link
                key={s.surname}
                href={`/${locale}/surnames/${s.surname}`}
                className="px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                {s.surname}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Link
            href={`/${locale}/generate?element=${encodeURIComponent(currentElement)}`}
            className={`px-4 py-2 ${elementInfo.bgColor.replace("/30", "")} ${elementInfo.textColor} rounded-lg font-medium hover:opacity-80 transition-opacity`}
          >
            {isZh
              ? `生成${currentElement}行名字`
              : `Generate ${elementInfo.en} Names`}
          </Link>
          <Link
            href={`/${locale}/surnames`}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-300"
          >
            {isZh ? "姓氏大全" : "All Surnames"}
          </Link>
          <Link
            href={`/${locale}/elements`}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-300"
          >
            {isZh ? "五行大全" : "All Elements"}
          </Link>
        </div>

        {/* Sample Characters with Links */}
        {characters.length > 0 && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
              {isZh
                ? `${currentElement}行常用字`
                : `Common ${elementInfo.en} Characters`}
            </h3>
            <div className="flex flex-wrap gap-2">
              {characters.slice(0, 8).map((char) => (
                <Link
                  key={char.char}
                  href={`/${locale}/generate?element=${encodeURIComponent(currentElement)}&character=${encodeURIComponent(char.char)}`}
                  className={`px-3 py-2 rounded-lg ${elementInfo.bgColor} ${elementInfo.textColor} hover:opacity-80 transition-opacity text-center`}
                >
                  <span className="font-bold text-lg">{char.char}</span>
                  <span className="text-xs ml-1 opacity-70">{char.pinyin}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
