import { Course } from "../types/Course";

// Normaliza rutas de imagen sin romper valores existentes
function normalizeImage(img?: string): string {
  if (!img) return "/placeholder.jpg";
  const trimmed = img.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return `/images/${trimmed}`;
}

export function transformRow(row: any): Course {
  return {
    id: toUUID(row.notion_url),
    nombre: row.Nombre?.trim() || "Curso sin nombre",
    descripcion: row.Descripcion?.trim() || "Descripción pendiente",
    horas: Number.parseInt(row.Horas, 10) || 0,
    módulos: Number.parseInt(row.Modulos, 10) || 0,
    categoria: row.Categoria?.trim() || "General",
    imagen: normalizeImage(row.Imagen_Destacada),
    destacado: String(row.Destacado ?? "").toLowerCase().trim() === "yes",
    notion_url: row.notion_url,
  };
}

function toUUID(id: string): string {
  return `${id.substring(0,8)}-${id.substring(8,12)}-${id.substring(12,16)}-${id.substring(16,20)}-${id.substring(20)}`;
}
