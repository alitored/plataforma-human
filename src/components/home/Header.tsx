"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-indigo-600 font-extrabold text-xl flex items-center justify-center rounded-xl shadow">
            PH
          </div>
          <h1 className="text-white font-bold tracking-tight text-lg">
            PlataformaHuman
          </h1>
        </div>

        {/* Nav */}
        <ul className="flex items-center gap-8 text-sm font-semibold">
          <Link href="#cursos" className="text-slate-200 hover:text-white transition">
            Cursos
          </Link>
          <Link href="#itinerarios" className="text-slate-200 hover:text-white transition">
            Itinerarios
          </Link>
        </ul>

        {/* Button */}
        <button className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition">
          Entrar
        </button>
      </nav>
    </header>
  );
}
