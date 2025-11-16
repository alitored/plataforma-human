// src/utils/coursesMapper.ts
import { Course } from "../types/Course";

type NotionRow = {
  notion_url: string;
  Nombre: string;
  Descripcion?: string;
  Horas?: string | number;
  "Modulos"?: string | string[];       // puede venir como CSV o array
  "Categoria"?: string;
  Imagen_Destacada?: string;
  Destacado?: string | boolean;
  Profesores?: string | string[];      // opcional: CSV o array de nombres
};

function normalizeImage(img?: string): string {
  if (!img) return "/placeholder.jpg";
  const t = img.trim();
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  if (t.startsWith("/")) return t;
  return `/images/${t}`;
}

function toUUID(id: string): string {
  const clean = (id ?? "").replace(/[^a-zA-Z0-9]/g, "");
  if (clean.length < 32) {
    // fallback determinista: pad right con '0' hasta 32
    const padded = (clean + "0".repeat(32)).slice(0, 32);
    return `${padded.substring(0, 8)}-${padded.substring(8, 12)}-${padded.substring(
      12, 16
    )}-${padded.substring(16, 20)}-${padded.substring(20)}`;
  }
  return `${clean.substring(0, 8)}-${clean.substring(8, 12)}-${clean.substring(
    12, 16
  )}-${clean.substring(16, 20)}-${clean.substring(20)}`;
}

function toNumberSafe(value: unknown, defaultValue = 0): number {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(n) ? n : defaultValue;
}

function toStringArrayFromCsvOrArray(input: unknown): string[] {
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

// 1) Detecta si el objeto ya es Course (schema de la app)
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
    Array.isArray(obj.profesores) // aseguramos array
  );
}

// 2) Detecta si el objeto viene del export de Notion (columnas con acentos)
function isNotionRow(obj: any): obj is NotionRow {
  return (
    obj &&
    typeof obj.notion_url === "string" &&
    ("Nombre" in obj || "Imagen_Destacada" in obj || "Categoria" in obj)
  );
}

// 3) Transforma SOLO cuando sea NotionRow
export function transformRowFromNotion(row: NotionRow): Course {
  const horasNum = toNumberSafe(row.Horas, 0);
  const modulosArr = toStringArrayFromCsvOrArray(row["Modulos"]);
  const destacado = toBooleanYesOrTrue(row.Destacado);
  const profesoresArr = toStringArrayFromCsvOrArray(row.Profesores);

  return {
    id: toUUID(row.notion_url),
    nombre: row.Nombre?.trim() || "Curso sin nombre",
    descripcion: row.Descripcion?.trim() || "Descripción pendiente",
    horas: horasNum,
    modulos: modulosArr, // string[]
    categoria: row["Categoria"]?.trim() || "General",
    imagen: normalizeImage(row.Imagen_Destacada),
    destacado,
    profesores: profesoresArr, // string[]
    // Si quisieras conservar notion_url, agrégalo a Course y descomenta:
    // notion_url: row.notion_url,
  };
}

// 4) Entrada tolerante: si ya es Course, no lo toques; si es NotionRow, transformalo; si no, normaliza.
export function normalizeCourseInput(row: any): Course {
  if (isCourse(row)) return row;
  if (isNotionRow(row)) return transformRowFromNotion(row);

  const horasNum = toNumberSafe(row.horas ?? row.Horas, 0);
  const modulosArr =
    Array.isArray(row.modulos)
      ? row.modulos.map((m: any) => String(m).trim()).filter(Boolean)
      : toStringArrayFromCsvOrArray(row["Modulos"] ?? row.módulos);

  const profesoresArr =
    Array.isArray(row.profesores)
      ? row.profesores.map((p: any) => String(p).trim()).filter(Boolean)
      : toStringArrayFromCsvOrArray(row.Profesores ?? row.profesoresCsv);

  const destacado =
    row.destacado === true || toBooleanYesOrTrue(row.Destacado ?? row.destacado);

  return {
    id: row.id ?? toUUID(row.notion_url ?? row.NotionURL ?? ""),
    nombre: (row.nombre ?? row.Nombre ?? "Curso sin nombre")?.trim(),
    descripcion: (row.descripcion ?? row.Descripcion ?? "Descripción pendiente")?.trim(),
    horas: horasNum,
    modulos: modulosArr, // string[]
    categoria: (row.categoria ?? row["Categoria"] ?? "General")?.trim(),
    imagen: normalizeImage(row.imagen ?? row.Imagen_Destacada),
    destacado,
    profesores: profesoresArr, // string[]
    // notion_url: row.notion_url ?? row.NotionURL ?? "", // opcional
  };
}
