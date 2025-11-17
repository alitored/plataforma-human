// src/utils/transformCursos.ts
import { Course } from "../types/Course";
import { normalizeImage, toUUID, toStringArray, toBoolean } from "./coursesMapper";

export function transformCursos(row: any): Course {
  return {
    id: row.id ?? toUUID(row.notion_url ?? ""),
    nombre: String(row.Nombre ?? "Curso sin nombre").trim(),
    descripcion: String(row.Descripcion ?? "Descripción pendiente").trim(),
    horas: Number.parseInt(String(row.Horas ?? "0"), 10) || 0,
    modulos: toStringArray(row.Modulos),
    categoria: String(row.Categoria ?? "General").trim(),
    imagen: normalizeImage(row.Imagen_Destacada),
    destacado: toBoolean(row.Destacado),
    profesores: toStringArray(row.Profesores),
  };
}
