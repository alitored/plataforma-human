// src/utils/transformCursos.ts
import { Course } from "../types/Course";
import { normalizeImage } from "./coursesMapper"; // reutilizamos la función

// Helpers locales (podrías importarlos de coursesMapper si los exportás)
function toUUID(id: string): string {
  const clean = (id ?? "").replace(/[^a-zA-Z0-9]/g, "");
  const padded = (clean + "0".repeat(32)).slice(0, 32);
  return `${padded.substring(0, 8)}-${padded.substring(8, 12)}-${padded.substring(
    12, 16
  )}-${padded.substring(16, 20)}-${padded.substring(20)}`;
}

function toStringArray(input: unknown): string[] {
  if (Array.isArray(input)) return input.map((m) => String(m).trim()).filter(Boolean);
  const s = String(input ?? "").trim();
  if (!s) return [];
  return s.split(",").map((m) => m.trim()).filter(Boolean);
}

function toBooleanYesOrTrue(input: unknown): boolean {
  if (input === true) return true;
  const s = String(input ?? "").toLowerCase().trim();
  return s === "yes" || s === "true";
}

export function transformCursos(row: any): Course {
  return {
    id: row.id ?? toUUID(row.notion_url ?? ""),
    nombre: row.Nombre?.trim() || "Curso sin nombre",
    descripcion: row.Descripcion?.trim() || "Descripción pendiente",
    horas: Number.parseInt(String(row.Horas ?? "0"), 10) || 0,
    modulos: toStringArray(row.Modulos),
    categoria: row.Categoria?.trim() || "General",
    imagen: normalizeImage(row.Imagen_Destacada),
    destacado: toBooleanYesOrTrue(row.Destacado),
    profesores: toStringArray(row.Profesores),
  };
}
