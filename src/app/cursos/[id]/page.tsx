// src/app/cursos/[id]/page.tsx - VERSIÓN LIMPIA (mejora de texto de módulos, sin CourseSchedule)
import React from "react";
import { notFound } from "next/navigation";
import CourseTemplate from "@/components/CourseTemplate";
import { Course } from "@/types/Course";

async function getCourse(id: string): Promise<Course | null> {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const cleanBase = base.replace(/\/$/, "");
    
    const response = await fetch(`${cleanBase}/api/courses/${encodeURIComponent(id)}`, {
      cache: "no-store"
    });
    
    if (!response.ok) return null;
    
    const result = await response.json();
    return result.ok ? result.data : null;
  } catch (error) {
    return null;
  }
}

/**
 * Mejora y normaliza texto de programa/fechas_modulos para una salida más legible.
 * - Si recibe un array estructurado, lo convierte a un string con separadores y saltos.
 * - Si recibe un texto largo, resalta líneas que empiecen con "Semana" y añade saltos de línea.
 * - Devuelve null si no hay nada que procesar.
 */
function formatProgramForDisplay(input: any): string | null {
  if (!input) return null;

  // Si ya es array de módulos (con semanas), generar texto legible
  if (Array.isArray(input) && input.length > 0 && typeof input[0] === "object") {
    return input
      .map((m: any, mi: number) => {
        const title = m.title ?? m.nombre ?? `Módulo ${mi + 1}`;
        const period = m.period ? `Fechas: ${m.period}` : "";
        const weeks = Array.isArray(m.weeks)
          ? m.weeks
              .map((w: any, wi: number) => {
                const label = w.label ?? `Semana ${wi + 1}`;
                const wtitle = w.title ?? w.titulo ?? "";
                const dates = w.dates ? ` — ${w.dates}` : "";
                return `- ${label}: ${wtitle}${dates}`;
              })
              .join("\n")
          : "";
        return `${title}\n${period}\n${weeks}`.trim();
      })
      .join("\n\n");
  }

  // Si es un string con JSON embebido
  if (typeof input === "string") {
    // try parse JSON first
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed) || typeof parsed === "object") {
        return formatProgramForDisplay(parsed);
      }
    } catch {
      // no es JSON, continuar
    }

    // Normalizar saltos, convertir viñetas y resaltar "Semana" como encabezado
    const lines = input.replace(/\r/g, "").split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    // Convertir patrones comunes en una salida ordenada
    const processedLines = lines.map((line) => {
      // viñetas con • o -
      if (/^[\u2022\-\*]\s*/.test(line)) {
        return line.replace(/^[\u2022\-\*]\s*/, "- ");
      }
      // líneas que empiezan por "Semana" asegurarlas como encabezado
      if (/^Semana\s*\d+/i.test(line)) {
        return line; // se mantendrá como entrada destacada
      }
      return line;
    });

    // Agrupar por bloques que empiezan por "Módulo" o "Módulo X"
    const blocks: string[] = [];
    let current: string[] = [];
    processedLines.forEach((ln) => {
      if (/^Módulo\s*\d+/i.test(ln) && current.length > 0) {
        blocks.push(current.join("\n"));
        current = [ln];
      } else {
        current.push(ln);
      }
    });
    if (current.length > 0) blocks.push(current.join("\n"));

    return blocks.join("\n\n");
  }

  // Si es un objeto con keys esperables
  if (typeof input === "object") {
    // evaluar posibles propiedades
    if (Array.isArray((input as any).modules) || Array.isArray((input as any).modulos)) {
      return formatProgramForDisplay((input as any).modules ?? (input as any).modulos);
    }
  }

  return null;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CoursePage(props: Props) {
  const params = await props.params;
  const course = await getCourse(params.id);
  
  if (!course) {
    notFound();
  }

  // Mejoramos la salida del programa/fechas y la pasamos como `programa` a CourseTemplate.
  // Si CourseTemplate ya renderiza HTML desde `programa`, ahora recibirá una versión más limpia.
  const rawProgram = (course as any).fechas_modulos ?? (course as any).programa ?? (course as any).cronograma;
  const programaMejorado = formatProgramForDisplay(rawProgram);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <CourseTemplate
          nombre={course.nombre}
          descripcion={course.descripcion}
          fecha_inicio={course.fecha_inicio}
          profesores={course.profesores}
          horas={course.horas}
          modulos={course.modulos}
          categoria={course.categoria}
          imagen={course.imagen}
          destacado={course.destacado}
          modalidad={course.modalidad}
          forma_pago={course.forma_pago}
          fechas_modulos={course.fechas_modulos}
          // si CourseTemplate usa `programa` como texto, le pasamos la versión mejorada
          programa={programaMejorado ?? course.programa}
        />
      </div>
    </main>
  );
}
