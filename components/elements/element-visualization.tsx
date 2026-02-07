import Link from "next/link";
import { FIVE_ELEMENT_INFO } from "@/lib/data/elements";
import type { FiveElement } from "@/lib/types";

interface ElementVisualizationProps {
  currentElement: FiveElement;
  locale: string;
}

export function ElementVisualization({
  currentElement,
  locale,
}: ElementVisualizationProps) {
  const isZh = locale === "zh";
  const elements: FiveElement[] = ["金", "木", "水", "火", "土"];

  // Element cycle order (generates: wood->fire->earth->metal->water->wood)
  const cycleOrder: FiveElement[] = ["木", "火", "土", "金", "水"];

  return (
    <section className="max-w-5xl mx-auto mb-12">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <span className="w-1 h-8 bg-cyan-600 rounded-full" />
        {isZh ? "五行相生相克图" : "Five Elements Cycle"}
      </h2>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
        {/* Cycle Visualization */}
        <div className="relative">
          {/* Generation Cycle (outer) */}
          <div className="mb-6">
            <h3 className="text-center text-sm font-semibold text-green-600 dark:text-green-400 mb-4 uppercase tracking-wider">
              {isZh ? "相生循环" : "Generation Cycle"}
            </h3>
            <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap">
              {cycleOrder.map((e, idx) => {
                const info = FIVE_ELEMENT_INFO[e];
                const nextE = cycleOrder[(idx + 1) % cycleOrder.length];
                const isCurrent = e === currentElement;

                return (
                  <div key={e} className="flex items-center">
                    <Link
                      href={`/${locale}/elements/${e}`}
                      className={`relative p-4 md:p-6 rounded-xl text-center transition-all ${
                        isCurrent
                          ? `ring-2 ring-offset-2 ${info.textColor.replace("text-", "ring-")} shadow-lg scale-110`
                          : "hover:scale-105"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${info.color} rounded-xl`}
                      />
                      <div className="relative z-10 text-white">
                        <div className="text-3xl md:text-4xl font-bold">
                          {e}
                        </div>
                      </div>
                    </Link>
                    {idx < cycleOrder.length - 1 && (
                      <div className="text-green-500 text-2xl hidden md:block">
                        &rarr;
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              {isZh
                ? "木生火 火生土 土生金 金生水 水生木"
                : "Wood -> Fire -> Earth -> Metal -> Water -> Wood"}
            </p>
          </div>

          {/* Control Cycle */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-center text-sm font-semibold text-red-600 dark:text-red-400 mb-4 uppercase tracking-wider">
              {isZh ? "相克关系" : "Control Cycle"}
            </h3>
            <div className="grid grid-cols-5 gap-2 md:gap-4 max-w-2xl mx-auto">
              {elements.map((e) => {
                const info = FIVE_ELEMENT_INFO[e];
                const isCurrent = e === currentElement;

                return (
                  <Link
                    key={e}
                    href={`/${locale}/elements/${e}`}
                    className={`p-3 md:p-4 rounded-lg text-center transition-all ${
                      isCurrent
                        ? `ring-2 ring-offset-2 ${info.textColor.replace("text-", "ring-")} shadow-lg`
                        : "hover:scale-105"
                    }`}
                  >
                    <div
                      className={`bg-gradient-to-br ${info.color} p-3 md:p-4 rounded-lg text-white`}
                    >
                      <div className="text-2xl font-bold">{e}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              {isZh
                ? "金克木 木克土 土克水 水克火 火克金"
                : "Metal > Wood > Earth > Water > Fire > Metal"}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            {isZh ? "相生" : "Generates"}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            {isZh ? "相克" : "Controls"}
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 ring-2 ring-blue-500 rounded-full" />
            {isZh ? "当前" : "Current"}
          </div>
        </div>
      </div>
    </section>
  );
}
