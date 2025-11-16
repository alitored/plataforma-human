// src/utils/transformCursos.ts
import { Course } from "../types/Course";
import { normalizeImage } from "./coursesMapper"; // reutilizá la función si ya la tenés

export function transformCursos(row: any): Course {
  return {
    id: row.id ?? "",
    nombre: row.Nombre?.trim() || "Curso sin nombre",
    descripcion: row.Descripcion?.trim() || "Descripción pendiente",
    horas: Number.parseInt(row.Horas ?? "0", 10) || 0,
    modulos: row.Modulos
      ? String(row.Modulos).split(",").map((m: string) => m.trim())
      : [],
    categoria: row.Categoria?.trim() || "General",
    imagen: normalizeImage(row.Imagen_Destacada),
    destacado:
      String(row.Destacado ?? "").toLowerCase().trim() === "yes" ||
      row.Destacado === true,
    profesores: row.Profesores
      ? String(row.Profesores).split(",").map((p: string) => p.trim())
      : [],
  };
}
