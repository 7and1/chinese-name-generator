import Link from "next/link";
import { CHINESE_SURNAMES } from "@/lib/data/surnames";
import { getCharactersByElement } from "@/lib/data/characters";
import { FIVE_ELEMENTS, FIVE_ELEMENT_INFO } from "@/lib/data/elements";
import type { FiveElement } from "@/lib/types";

interface SurnameInternalLinksProps {
  locale: string;
  currentSurname: string;
  dominantElement: FiveElement;
}

export function SurnameInternalLinks({
  locale,
  currentSurname,
  dominantElement,
}: SurnameInternalLinksProps) {
  const isZh = locale === "zh";

  // Get top surnames with same element
  const sameElementSurnames = CHINESE_SURNAMES.filter((s) => {
    const element = getElementByStroke(s.strokeCount);
    return element === dominantElement && s.surname !== currentSurname;
  }).slice(0, 6);

  // Get characters suitable for this element
  const suitableCharacters = getCharactersByElement(dominantElement).slice(
    0,
    8,
  );

  const getElementByStroke = (strokes: number): FiveElement => {
    const mod = strokes % 5;
    const elements: FiveElement[] = ["金", "木", "水", "火", "土"];
    return elements[mod];
  };

  const elementInfo = FIVE_ELEMENT_INFO[dominantElement];

  return (
    <section className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mb-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <span className="w-1 h-8 bg-indigo-600 rounded-full" />
        {isZh ? "相关链接" : "Related Links"}
      </h2>

      <div className="space-y-6">
        {/* Same Element Surnames */}
        {sameElementSurnames.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
              {isZh
                ? `同样${dominantElement}行的姓氏`
                : `Other ${elementInfo.en} Element Surnames`}
            </h3>
            <div className="flex flex-wrap gap-2">
              {sameElementSurnames.map((s) => (
                <Link
                  key={s.surname}
                  href={`/${locale}/surnames/${s.surname}`}
                  className={`px-4 py-2 rounded-full ${elementInfo.bgColor} ${elementInfo.textColor} font-medium hover:opacity-80 transition-opacity`}
                >
                  {s.surname}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Characters */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
            {isZh
              ? `推荐${dominantElement}行用字`
              : `Recommended ${elementInfo.en} Characters`}
          </h3>
          <div className="flex flex-wrap gap-2">
            {suitableCharacters.map((char) => (
              <Link
                key={char.char}
                href={`/${locale}/elements/${dominantElement}`}
                className={`px-3 py-2 rounded-lg ${elementInfo.bgColor} ${elementInfo.textColor} hover:opacity-80 transition-opacity text-center`}
              >
                <span className="text-lg font-bold">{char.char}</span>
                <span className="text-xs ml-1 opacity-70">{char.pinyin}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <Link
            href={`/${locale}/generate?surname=${encodeURIComponent(currentSurname)}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isZh
              ? `用${currentSurname}姓起名`
              : `Generate ${currentSurname} Names`}
          </Link>
          <Link
            href={`/${locale}/elements/${dominantElement}`}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${elementInfo.bgColor.replace("/30", "")} ${elementInfo.textColor} hover:opacity-80`}
          >
            {isZh
              ? `${dominantElement}行起名`
              : `${elementInfo.en} Element Names`}
          </Link>
          <Link
            href={`/${locale}/surnames`}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-slate-700 dark:text-slate-300"
          >
            {isZh ? "姓氏大全" : "All Surnames"}
          </Link>
        </div>
      </div>
    </section>
  );
}
