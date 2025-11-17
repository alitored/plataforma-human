// src/components/CourseCard.tsx - VERSIÓN MEJORADA
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ClockIcon, 
  TagIcon, 
  AcademicCapIcon,
  StarIcon 
} from "@heroicons/react/24/outline";

type Course = {
  id: string;
  nombre?: string;
  descripcion?: string;
  imagen?: string;
  modulos?: string[];
  horas?: number;
  categoria?: string;
  destacado?: boolean;
};

export default function CourseCard({ course }: { course: Course }) {
  const modCount = Array.isArray(course.modulos) ? course.modulos.length : 0;
  const router = useRouter();
  const target = `/cursos/${encodeURIComponent(String(course.id))}`;

  const navigate = () => router.push(target);
  
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate();
    }
  };

  const nombre = course.nombre ?? "(sin nombre)";
  const descripcion = course.descripcion ?? "Descripción no disponible";
  const imagen = course.imagen ?? "/placeholder.jpg";
  const horas = course.horas ?? 0;
  const categoria = course.categoria ?? "General";

  return (
    <article
      className={`
        group relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-out
        ${course.destacado
          ? "bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 hover:shadow-2xl hover:scale-105"
          : "bg-white border border-gray-200 hover:shadow-xl hover:-translate-y-2"
        }
      `}
    >
      {/* Featured Badge */}
      {course.destacado && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            <StarIcon className="w-3 h-3" />
            Destacado
          </div>
        </div>
      )}

      {/* Clickable Area */}
      <div
        role="button"
        tabIndex={0}
        onClick={navigate}
        onKeyDown={onKey}
        className="cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-500/20 rounded-2xl"
      >
        <div className="flex flex-col h-full">
          {/* Image Section */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={imagen}
              alt={nombre}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-tight">
                  {nombre}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {descripcion}
                </p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
                  <ClockIcon className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">{horas}h</span>
                </span>

                <span className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
                  <AcademicCapIcon className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{modCount} mods</span>
                </span>

                <span className="inline-flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full ml-auto">
                  <TagIcon className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">{categoria}</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); navigate(); }}
                  className={`
                    px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200
                    ${course.destacado
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md"
                      : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-600 hover:to-cyan-600 shadow-md"
                    }
                  `}
                >
                  Comenzar
                </button>

                <Link
                  href={target}
                  className="text-gray-600 hover:text-emerald-700 font-medium text-sm transition-colors underline-offset-4 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Ver detalle →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}