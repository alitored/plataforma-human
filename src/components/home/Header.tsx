"use client";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);
  const whatsappHref = "https://wa.me/541157577039";

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-indigo-600 font-extrabold text-xl flex items-center justify-center rounded-xl shadow">
            PH
          </div>
          <h1 className="text-white font-bold tracking-tight text-lg">PlataformaHuman</h1>
        </div>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link href="/" className="text-slate-200 hover:text-white transition">
            Inicio
          </Link>
          <Link href="#cursos" className="text-slate-200 hover:text-white transition">
            Cursos
          </Link>
          <Link href="#itinerarios" className="text-slate-200 hover:text-white transition">
            Itinerarios
          </Link>
        </ul>

        {/* Actions: WhatsApp + Entrar (desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition"
            aria-label="Contactar por WhatsApp"
          >
            {/* simple phone icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12 1.21.44 2.39.94 3.5a2 2 0 0 1-.45 2.11L8.67 11.33a16 16 0 0 0 6 6l1.01-1.01a2 2 0 0 1 2.11-.45c1.11.5 2.29.82 3.5.94A2 2 0 0 1 22 16.92z" />
            </svg>
            WhatsApp
          </a>

          <button className="px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/10 transition">
            Entrar
          </button>
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden flex items-center">
          <button
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className="p-2 rounded-md text-white hover:bg-white/10 transition"
          >
            {open ? (
              // close icon
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // hamburger icon
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-x-0 top-[64px] z-40 transform-gpu transition-all duration-200 ${
          open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="mx-4 mt-4 rounded-xl bg-slate-900/95 border border-white/10 shadow-lg overflow-hidden">
          <div className="flex flex-col divide-y divide-white/5">
            {/* Vertical ordered items */}
            <Link
              href="/"
              className="px-6 py-4 text-lg font-semibold text-slate-100 hover:bg-white/2"
              onClick={() => setOpen(false)}
            >
              Inicio
            </Link>

            <Link
              href="#cursos"
              className="px-6 py-4 text-lg font-semibold text-slate-100 hover:bg-white/2"
              onClick={() => setOpen(false)}
            >
              Cursos
            </Link>

            <Link
              href="#itinerarios"
              className="px-6 py-4 text-lg font-semibold text-slate-100 hover:bg-white/2"
              onClick={() => setOpen(false)}
            >
              Itinerarios
            </Link>

            {/* WhatsApp button inside vertical menu */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 flex items-center gap-3 text-lg font-semibold text-slate-100 hover:bg-white/2"
              onClick={() => setOpen(false)}
              aria-label="Abrir WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 12.1a9 9 0 10-9.9 8.9L21 21l-.9-2.9A8.9 8.9 0 0021 12.1z" />
                <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M17.5 14.5c-.4 0-1-.2-1.6-.6-.6-.4-1-1.1-1.2-1.6-.2-.5 0-.9.4-1.2.3-.2.7-.4 1.1-.5.4-.1.6-.2.8-.3.2-.1.4-.1.7 0 .2.1.4.2.5.3.1.2.2.4.2.7 0 .4-.1.8-.3 1.2-.2.4-.6.8-1 1.1-.4.3-.8.5-1.2.5z" />
              </svg>
              Contactar por WhatsApp
            </a>

            {/* Entrar action */}
            <button
              onClick={() => {
                setOpen(false);
                // navigate/login action if needed
              }}
              className="text-left px-6 py-4 text-lg font-semibold text-slate-100 hover:bg-white/2"
            >
              Entrar
            </button>
          </div>
        </div>
      </div>

      {/* click-away backdrop to close menu */}
      {open && (
        <button
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}
    </header>
  );
}
