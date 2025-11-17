// src/app/api/courses/route.ts
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_COURSES_DB_ID = process.env.NOTION_COURSES_DB_ID;

const notion = NOTION_TOKEN ? new Client({ auth: NOTION_TOKEN }) : null;

function safeTextFromTitle(titleBlock: any): string {
  try {
    return titleBlock?.[0]?.plain_text ?? "";
  } catch {
    return "";
  }
}

function safeRichTextToString(rich: any): string {
  try {
    if (!rich) return "";
    if (Array.isArray(rich)) return rich.map((r: any) => r?.plain_text ?? "").join(" ");
    return String(rich);
  } catch {
    return "";
  }
}

function safeSelectName(sel: any): string | null {
  try {
    return sel?.name ?? null;
  } catch {
    return null;
  }
}

function safeFilesFirstUrl(files: any): string | null {
  try {
    const first = files?.[0];
    // Notion can return external or file; check both
    return first?.file?.url ?? first?.external?.url ?? null;
  } catch {
    return null;
  }
}

function normalizeModulosField(field: any): string[] {
  // If it's already an array (e.g., relation or multi-select), map to strings
  if (Array.isArray(field)) {
    return field.map((f: any, i: number) => {
      if (typeof f === "string") return f;
      // objects with name or title
      return f?.name ?? f?.title ?? `Modulo ${i + 1}`;
    });
  }

  // If Notion stores a number in number property
  const n = Number(field);
  if (!Number.isNaN(n) && Number.isFinite(n) && n > 0) {
    return Array.from({ length: Math.max(0, Math.floor(n)) }, (_, i) => `Modulo ${i + 1}`);
  }

  // If it's a rich_text with numbers or comma-separated string, try to parse lines
  if (typeof field === "string") {
    const parts = field
      .split(/\r?\n|,|;/)
      .map(s => s.trim())
      .filter(Boolean);
    if (parts.length) return parts;
  }

  // Default fallback: empty array
  return [];
}

export async function GET() {
  if (!notion || !NOTION_COURSES_DB_ID) {
    // If Notion not configured, return an empty list but keep response consistent
    return NextResponse.json({ ok: true, data: [] });
  }

  try {
    const response = await notion.databases.query({ database_id: NOTION_COURSES_DB_ID });

    const courses = (response.results ?? []).map((row: any) => {
      const props = row.properties ?? {};

      // Normalize modulos: accept number, array or string and always return array
      const rawModulos = props.Modulos?.number ?? props.Modulos?.rich_text ?? props.Modulos ?? null;
      const modulos = normalizeModulosField(rawModulos);

      const imagenUrl = safeFilesFirstUrl(props.Imagen_Destacada?.files ?? props.Imagen_Destacada);

      return {
        id: row.id,
        nombre: safeTextFromTitle(props.Nombre?.title),
        descripcion: safeRichTextToString(props.Descripcion?.rich_text),
        horas: Number(props.Horas?.number ?? 0) || 0,
        modulos, // siempre array
        categoria: safeSelectName(props.Categoria?.select) ?? "General",
        imagen: imagenUrl ?? "/placeholder.jpg",
        destacado: Boolean(props.Destacado?.checkbox ?? false),

        // Campos extendidos con defensiva
        fecha_inicio: props.FechaInicio?.date?.start ?? null,
        profesores: Array.isArray(props.Profesores?.multi_select) ? props.Profesores.multi_select.map((p: any) => p.name ?? "") : [],
        modalidad: safeRichTextToString(props.Modalidad?.rich_text),
        forma_pago: safeSelectName(props.FormaPago?.select),
        fechas_modulos: safeRichTextToString(props.FechasModulos?.rich_text),
        programa: safeRichTextToString(props.Programa?.rich_text),
      };
    });

    return NextResponse.json({ ok: true, data: courses });
  } catch (error) {
    console.error("Error cargando cursos:", error);
    return NextResponse.json({ ok: false, error: "Error al cargar cursos" }, { status: 500 });
  }
}
