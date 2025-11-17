// src/utils/coursesMapper.ts
import { Course } from "../types/Course";

export type NotionRow = {
  notion_url?: string;
  Nombre?: string;
  Descripcion?: string;
  Horas?: string | number;
  Modulos?: string | string[] | number;
  Categoria?: string;
  Imagen_Destacada?: string;
  Destacado?: string | boolean;
  Profesores?: string | string[];
};

export function normalizeImage(img?: string): string {
  if (!img) return "/placeholder.jpg";
  const t = String(img).trim();
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  if (t.startsWith("/")) return t;
  return `/images/${t}`;
}

export function toUUID(id: string = ""): string {
  const clean = String(id ?? "").replace(/[^a-zA-Z0-9]/g, "");
  const padded = (clean + "0".repeat(32)).slice(0, 32);
  return `${padded.substring(0, 8)}-${padded.substring(8, 12)}-${padded.substring(12, 16)}-${padded.substring(16, 20)}-${padded.substring(20)}`;
}

export function toStringArray(input: unknown): string[] {
  if (Array.isArray(input)) return input.map((m) => String(m).trim()).filter(Boolean);

  if (typeof input === "number" && Number.isFinite(input) && input > 0) {
    return Array.from({ length: Math.floor(input) }, (_, i) => `Modulo ${i + 1}`);
  }

  const s = String(input ?? "").trim();
  if (!s) return [];

  if (s.startsWith("[") && s.endsWith("]")) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.map((x) => String(x).trim()).filter(Boolean);
    } catch {}
  }

  return s.split(/\r?\n|,|;/).map((m) => m.trim()).filter(Boolean);
}

export function toBoolean(input: unknown): boolean {
  if (input === true) return true;
  const s = String(input ?? "").toLowerCase().trim();
  return s === "yes" || s === "true";
}

export function transformRowFromNotion(row: NotionRow): Course {
  return {
    id: toUUID(String(row.notion_url ?? "")),
    nombre: String(row.Nombre ?? "Curso sin nombre").trim(),
    descripcion: String(row.Descripcion ?? "Descripcion pendiente").trim(),
    horas: Number.parseInt(String(row.Horas ?? "0"), 10) || 0,
    modulos: toStringArray(row.Modulos),
    categoria: String(row.Categoria ?? "General").trim(),
    imagen: normalizeImage(row.Imagen_Destacada),
    destacado: toBoolean(row.Destacado),
    profesores: toStringArray(row.Profesores),
  };
}
