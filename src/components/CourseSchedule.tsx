// src/components/CourseSchedule.tsx
import React from "react";

export type WeekItem = { label: string; title: string; dates: string; notes?: string };
export type ModuleItem = { title: string; period: string; weeks: WeekItem[] };

export default function CourseSchedule({ modules }: { modules: ModuleItem[] }) {
  if (!modules || modules.length === 0) {
    return <div className="text-gray-500">No hay cronograma disponible.</div>;
  }
  return (
    <section className="prose prose-invert max-w-none">
      {modules.map((m, mi) => (
        <div key={mi} className="mb-8">
          <h3 className="text-xl md:text-2xl font-semibold mb-2">{m.title}</h3>
          <div className="text-sm text-gray-400 mb-4">{m.period}</div>

          <div className="space-y-4">
            {m.weeks.map((w, wi) => (
              <article key={wi} className="bg-slate-800/40 rounded-lg p-4 md:p-5 border border-slate-700">
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-teal-500 text-white shadow-sm">
                    {w.label}
                  </span>

                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="text-base font-medium">{w.title}</h4>
                      <time className="text-sm text-gray-400">{w.dates}</time>
                    </div>

                    {w.notes && <p className="mt-2 text-sm text-gray-300">{w.notes}</p>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
