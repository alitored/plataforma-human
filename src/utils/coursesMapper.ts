// src/utils/coursesMapper.ts
import { Course } from "../types/Course";

type NotionRow = {
  notion_url: string;
  Nombre: string;
  Descripcion?: string;
  Horas?: string | number;
  "Modulos"?: string | string[];
  "Categoria"?: string;
  Imagen_Destacada?: string;
  Destacado?: string | boolean;
  Profesores?: string | string[];
};

// ----------------------
// Utilidades
// ----------------------
export function normalizeImage(img?: string): string {
  if (!img) return "/placeholder.jpg";
  const t = img.trim();
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  if (t.startsWith("/")) return t;
  return `/images/${t}`;
}

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

function toBoolean(input: unknown): boolean {
  if (input === true) return true;
  const s = String(input ?? "").toLowerCase().trim();
  return s === "yes" || s === "true";
}

// ----------------------
// Detectores
// ----------------------
export function isCourse(obj: any): obj is Course {
  return (
    obj &&
    typeof obj.id === "string" &&
    typeof obj.nombre === "string" &&
    "descripcion" in obj &&
    "categoria" in obj &&
    "imagen" in obj &&
    "modulos" in obj &&
    "horas" in obj &&
    Array.isArray(obj.profesores)
  );
}

function isNotionRow(obj: any): obj is NotionRow {
  return (
    obj &&
    typeof obj.notion_url === "string" &&
    ("Nombre" in obj || "Imagen_Destacada" in obj || "Categoria" in obj)
  );
}

// ----------------------
// Transformadores
// ----------------------
export function transformRowFromNotion(row: NotionRow): Course {
  return {
    id: toUUID(row.notion_url),
    nombre: row.Nombre?.trim() || "Curso sin nombre",
    descripcion: row.Descripcion?.trim() || "Descripción pendiente",
    horas: Number.parseInt(String(row.Horas ?? "0"), 10) || 0,
    modulos: toStringArray(row["Modulos"]),
    categoria: row["Categoria"]?.trim() || "General",
    imagen: normalizeImage(row.Imagen_Destacada),
    destacado: toBoolean(row.Destacado),
    profesores: toStringArray(row.Profesores),
  };
}

export function normalizeCourseInput(row: any): Course {
  if (isCourse(row)) return row;
  if (isNotionRow(row)) return transformRowFromNotion(row);

  return {
    id: row.id ?? toUUID(row.notion_url ?? ""),
    nombre: row.nombre ?? row.Nombre ?? "Curso sin nombre",
    descripcion: row.descripcion ?? row.Descripcion ?? "Descripción pendiente",
    horas: Number.parseInt(String(row.horas ?? row.Horas ?? "0"), 10) || 0,
    modulos: toStringArray(row.modulos ?? row["Modulos"]),
    categoria: (row.categoria ?? row["Categoria"] ?? "General")?.trim(),
    imagen: normalizeImage(row.imagen ?? row.Imagen_Destacada),
    destacado: toBoolean(row.destacado ?? row.Destacado),
    profesores: toStringArray(row.profesores ?? row.Profesores),
  };
}
