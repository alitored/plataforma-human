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
};

function normalizeImage(img?: string): string {
  if (!img) return "/placeholder.jpg";
  const t = img.trim();
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  if (t.startsWith("/")) return t;
  return `/images/${t}`;
}

function toUUID(id: string): string {
  const clean = id.replace(/[^a-zA-Z0-9]/g, "");
  return `${clean.substring(0, 8)}-${clean.substring(8, 12)}-${clean.substring(
    12,
    16
  )}-${clean.substring(16, 20)}-${clean.substring(20)}`;
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
    "horas" in obj
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
  const horasNum = Number.parseInt(String(row.Horas ?? "0"), 10) || 0;

  // Si "Modulos" viene como string separado por comas, lo convertimos en array
  const modulosArr =
    Array.isArray(row["Modulos"])
      ? row["Modulos"].map((m) => String(m).trim())
      : row["Modulos"]
      ? String(row["Modulos"])
          .split(",")
          .map((m) => m.trim())
      : [];

  const destacado =
    row.Destacado === true ||
    String(row.Destacado ?? "").toLowerCase().trim() === "yes";

  return {
    id: toUUID(row.notion_url),
    nombre: row.Nombre?.trim() || "Curso sin nombre",
    descripcion: row.Descripcion?.trim() || "Descripción pendiente",
    horas: horasNum,
    modulos: modulosArr, // 👈 ahora array de strings
    categoria: row["Categoria"]?.trim() || "General",
    imagen: normalizeImage(row.Imagen_Destacada),
    destacado,
    // notion_url: row.notion_url, // opcional: agregar al tipo Course si lo querés conservar
  };
}

// 4) Entrada tolerante: si ya es Course, no lo toques; si es NotionRow, transformalo.
export function normalizeCourseInput(row: any): Course {
  if (isCourse(row)) return row;
  if (isNotionRow(row)) return transformRowFromNotion(row);

  // Último recurso: intentar mapear con claves comunes sin acentos
  const horasNum = Number.parseInt(String(row.horas ?? row.Horas ?? "0"), 10) || 0;

  const modulosArr =
    Array.isArray(row.modulos)
      ? row.modulos.map((m: any) => String(m).trim())
      : Array.isArray(row["Modulos"])
      ? row["Modulos"].map((m: any) => String(m).trim())
      : row.módulos || row["Modulos"]
      ? String(row.módulos ?? row["Modulos"])
          .split(",")
          .map((m: string) => m.trim())
      : [];

  return {
    id: row.id ?? toUUID(row.notion_url ?? ""),
    nombre: row.nombre ?? row.Nombre ?? "Curso sin nombre",
    descripcion: row.descripcion ?? row.Descripcion ?? "Descripción pendiente",
    horas: horasNum,
    modulos: modulosArr, // 👈 array de strings
    categoria: (row.categoria ?? row["Categoria"] ?? "General")?.trim(),
    imagen: normalizeImage(row.imagen ?? row.Imagen_Destacada),
    destacado:
      row.destacado === true ||
      String(row.Destacado ?? "").toLowerCase().trim() === "yes",
    // notion_url: row.notion_url ?? row.NotionURL ?? "", // opcional
  };
}
