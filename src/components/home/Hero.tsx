"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 pt-40 pb-24 grid lg:grid-cols-2 gap-16">

      {/* Text area */}
      <div className="flex flex-col justify-center">
        <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
          Formación profesional con alma humana
        </h2>

        <p className="text-slate-300 mt-6 text-lg max-w-xl">
          Desarrollá tu carrera con cursos y programas prácticos, clases en vivo,
          material descargable e integración completa con Notion y Supabase.
        </p>

        <div className="flex gap-4 mt-8">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-xl shadow-lg font-semibold">
            Comenzar ahora
          </button>

          <button className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-semibold backdrop-blur-xl">
            Ver itinerarios
          </button>
        </div>

        {/* Features */}
        <div className="mt-10 space-y-4">
          {[
            ["✓", "Clases en vivo y on-demand"],
            ["📅", "Gestión de horarios y seguimiento"],
            ["🧠", "Integración con Notion y Supabase"],
          ].map(([icon, text], i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-lg border border-white/10 backdrop-blur-xl">
              <span className="text-emerald-400 text-xl">{icon}</span>
              <p className="text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-xl">
        <Image
          src="/images/hero.webp"
          alt="Hero"
          width={800}
          height={600}
          className="rounded-2xl object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4 text-sm text-white flex justify-between">
          <span>12 horas</span>
          <span>8 módulos</span>
        </div>
      </div>
    </section>
  );
}
