"use client";

import { useState } from 'react';
import { Course } from "@/types/Course";
import CourseEnrollmentForm from './CourseEnrollmentForm';
import { CourseViewConfig } from '@/config/courseView';
import {
  CalendarIcon,
  UserIcon,
  CreditCardIcon,
  AcademicCapIcon,
  ClockIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface Props extends Partial<Course> {}

export default function CourseTemplate({
  id = "",
  nombre = "Curso",
  descripcion = "",
  fecha_inicio,
  profesores = [],
  horas = 0,
  modulos = [],
  categoria = "General",
  imagen,
  destacado = false,
  modalidad = "",
  forma_pago = "",
  fechas_modulos = "",
  programa = "",
  content = [],
}: Props) {
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const { detail } = CourseViewConfig;

  let fechaLegible: string | null = null;
  if (fecha_inicio) {
    try {
      const d = new Date(fecha_inicio);
      fechaLegible = Number.isNaN(d.getTime()) ? null : d.toLocaleDateString("es-AR");
    } catch {
      fechaLegible = null;
    }
  }

  const profesoresList = Array.isArray(profesores) ? profesores : [];
  const showAcademicCalendar = detail.showFechasModulos && fechas_modulos && fechas_modulos !== programa;
  const showDetailedProgram = detail.showPrograma && programa;
  const shouldShowCombinedSection = showAcademicCalendar || showDetailedProgram;

  return (
    <article className="space-y-8">
      <section className="relative rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <AcademicCapIcon className="w-4 h-4" />
              Curso profesional
            </span>
            {destacado && (
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 bg-amber-400 px-3 py-1.5 rounded-full">
                ⭐ Destacado
              </span>
            )}
          </div>

          <div className="space-y-4">
            {detail.showNombre && (
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                {nombre}
              </h1>
            )}
            {detail.showDescripcion && descripcion && (
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl">
                {descripcion}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {fechaLegible && (
              <div className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                <CalendarIcon className="w-6 h-6 text-white flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-white/70 font-medium">Inicia</p>
                  <p className="text-base font-semibold truncate">{fechaLegible}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
              <ClockIcon className="w-6 h-6 text-white flex-shrink-0" />
              <div>
                <p className="text-xs text-white/70 font-medium">Duración</p>
                <p className="text-base font-semibold">{horas} horas</p>
              </div>
            </div>

            {detail.showProfesores && profesoresList.length > 0 && (
              <div className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
                <UserIcon className="w-6 h-6 text-white flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-white/70 font-medium">Profesor{profesoresList.length > 1 ? 'es' : ''}</p>
                  <p className="text-base font-semibold truncate">
                    {profesoresList.join(", ")}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/20">
              <TagIcon className="w-6 h-6 text-white flex-shrink-0" />
              <div>
                <p className="text-xs text-white/70 font-medium">Categoría</p>
                <p className="text-base font-semibold">{categoria}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {detail.showImagen && imagen && (
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={imagen}
                alt={nombre}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
              />
            </div>
          )}

          {modalidad && (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AcademicCapIcon className="w-6 h-6 text-emerald-600" />
                Modalidad del Curso
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {modalidad}
              </div>
            </div>
          )}

          {detail.showModulosList && modulos.length > 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Estructura del Curso ({modulos.length} módulos)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modulos.map((modulo, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                        {modulo}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {shouldShowCombinedSection && (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                {showAcademicCalendar && showDetailedProgram 
                  ? "Calendario Académico y Programa" 
                  : showAcademicCalendar 
                    ? "Calendario Académico" 
                    : "Programa Detallado"}
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line bg-blue-50 p-4 rounded-lg">
                {showAcademicCalendar && fechas_modulos}
                {showAcademicCalendar && showDetailedProgram && (
                  <>
                    <div className="my-6 border-t border-gray-300"></div>
                    <div className="mt-6">
                      {programa}
                    </div>
                  </>
                )}
                {showDetailedProgram && !showAcademicCalendar && programa}
              </div>
            </div>
          )}

          {Array.isArray(content) && content.length > 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenido del Curso</h2>
              <div className="space-y-4">
                {content.map((block, index) => {
                  if (!block || !block.content) return null;
                  
                  switch (block.type) {
                    case 'heading_1':
                      return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{block.content}</h1>;
                    case 'heading_2':
                      return <h2 key={index} className="text-2xl font-bold text-gray-800 mt-6 mb-3">{block.content}</h2>;
                    case 'heading_3':
                      return <h3 key={index} className="text-xl font-semibold text-gray-700 mt-4 mb-2">{block.content}</h3>;
                    case 'quote':
                      return (
                        <blockquote key={index} className="border-l-4 border-emerald-500 pl-4 italic text-gray-600 my-4 bg-emerald-50 p-4 rounded-r-lg">
                          {block.content}
                        </blockquote>
                      );
                    case 'code':
                      return (
                        <pre key={index} className="bg-gray-800 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto text-sm">
                          <code>{block.content}</code>
                        </pre>
                      );
                    case 'divider':
                      return <hr key={index} className="my-8 border-gray-200" />;
                    default:
                      return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{block.content}</p>;
                  }
                })}
              </div>
            </div>
          )}

          {(!content || (Array.isArray(content) && content.length === 0)) && (
            <div className="rounded-2xl bg-gray-50 p-6 border border-gray-200">
              <p className="text-gray-500 text-center italic">
                No hay contenido adicional disponible para este curso.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200 sticky top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen del Curso</h3>
            
            <div className="space-y-4">
              {fechaLegible && (
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha de inicio</p>
                    <p className="font-semibold text-gray-900">{fechaLegible}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <ClockIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">Duración total</p>
                  <p className="font-semibold text-gray-900">{horas} horas</p>
                </div>
              </div>

              {detail.showProfesores && profesoresList.length > 0 && (
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Profesor{profesoresList.length > 1 ? 'es' : ''}</p>
                    <p className="font-semibold text-gray-900">{profesoresList.join(", ")}</p>
                  </div>
                </div>
              )}

              {forma_pago && (
                <div className="flex items-center gap-3">
                  <CreditCardIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Forma de pago</p>
                    <p className="font-semibold text-gray-900">{forma_pago}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button 
                onClick={() => setShowEnrollmentForm(true)}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🎓 Inscribirme Ahora
              </button>
              
              <a
                href="/cursos"
                className="block w-full text-center text-emerald-700 hover:text-emerald-800 font-medium py-2 px-4 rounded-xl border-2 border-emerald-200 hover:border-emerald-300 transition-all duration-200"
              >
                ← Volver a Cursos
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border border-blue-200">
            <h4 className="font-bold text-blue-900 text-lg mb-2">¿Necesitas más información?</h4>
            <p className="text-blue-800 text-sm mb-4">
              Contactanos para resolver todas tus dudas sobre este curso.
            </p>
            <button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-medium py-2 px-4 rounded-xl border border-blue-300 transition-colors">
              📞 Contactar
            </button>
          </div>
        </aside>
      </section>

      {showEnrollmentForm && (
        <CourseEnrollmentForm 
          course={{
            id,
            nombre,
            descripcion,
            categoria,
            horas,
            fecha_inicio,
            profesores: profesoresList,
            modalidad,
            forma_pago
          }}
          onClose={() => setShowEnrollmentForm(false)}
        />
      )}
    </article>
  );
}