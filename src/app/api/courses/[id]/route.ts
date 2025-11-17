// src/app/api/courses/[id]/route.ts
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import type { PageObjectResponse, SelectPropertyItemObjectResponse, FilesPropertyItemObjectResponse, RichTextItemResponse, TitlePropertyValue } from "@notionhq/client/build/src/api-endpoints";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const notion = NOTION_TOKEN ? new Client({ auth: NOTION_TOKEN }) : null;

export type ApiCourse = {
  id: string;
  nombre: string;
  descripcion: string;
  horas: number;
  modulos: string[];
  categoria: string | null;
  imagen: string | null;
  destacado: boolean;
  fecha_inicio: string | null;
  profesores: string[];
  modalidad: string;
  forma_pago: string | null;
  fechas_modulos: string;
  programa: string;
};

function normalizeId(raw: unknown): string | null {
  if (!raw) return null;
  const s = String(raw).trim();
  const cleaned = decodeURIComponent(s).replace(/[#?].*$/, "").replace(/\s+/g, "");
  if (/^[0-9a-fA-F-]{36}$/.test(cleaned) && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleaned)) {
    return cleaned.toLowerCase();
  }
  const onlyHex = cleaned.replace(/[^0-9a-fA-F]/g, "");
  if (/^[0-9a-fA-F]{32}$/.test(onlyHex)) {
    return `${onlyHex.slice(0,8)}-${onlyHex.slice(8,12)}-${onlyHex.slice(12,16)}-${onlyHex.slice(16,20)}-${onlyHex.slice(20,32)}`.toLowerCase();
  }
  return null;
}

function safeTextFromTitle(titleBlock: TitlePropertyValue["title"] | any): string {
  try { return (titleBlock?.[0]?.plain_text ?? "").trim(); } catch { return ""; }
}

function safeRichTextToString(rich: RichTextItemResponse[] | any): string {
  try {
    if (!rich) return "";
    const text = Array.isArray(rich) ? rich.map((r: any) => r?.plain_text ?? "").join(" ") : String(rich);
    return text.replace(/\s{2,}/g, " ").trim();
  } catch { return ""; }
}

function safeSelectName(sel: SelectPropertyItemObjectResponse["select"] | any): string | null {
  try { return (sel?.name ?? null) || null; } catch { return null; }
}

function safeFilesFirstUrl(files: FilesPropertyItemObjectResponse["files"] | any): string | null {
  try {
    const first = Array.isArray(files) ? files[0] : files?.[0];
    return first?.file?.url ?? first?.external?.url ?? null;
  } catch { return null; }
}

function normalizeModulosField(field: any): string[] {
  if (Array.isArray(field)) {
    return field.map((f: any, i: number) => typeof f === "string" ? f : (f?.name ?? f?.title ?? `Módulo ${i + 1}`));
  }
  const n = Number(field);
  if (!Number.isNaN(n) && Number.isFinite(n) && n > 0) {
    return Array.from({ length: Math.floor(n) }, (_, i) => `Módulo ${i + 1}`);
  }
  if (typeof field === "string") {
    const parts = field.split(/\r?\n|,|;/).map(s => s.trim()).filter(Boolean);
    if (parts.length) return parts;
  }
  return [];
}

function resolveProp<T = any>(props: Record<string, any>, keys: string[]): T | undefined {
  for (const k of keys) {
    if (props[k] !== undefined) return props[k];
  }
  return undefined;
}

export async function GET(req: Request, context: { params?: any }) {
  try {
    const params = await context.params;
    const rawId = params?.id;
    const id = normalizeId(rawId);

    if (!id) {
      return NextResponse.json({ ok: false, error: "Invalid course id", rawId }, { status: 400 });
    }

    console.log("🔍 API Individual - Buscando curso ID:", id);

    if (!notion) {
      // Fallback mínimo en dev o sin NOTION_TOKEN
      return NextResponse.json({
        ok: true,
        data: {
          id,
          nombre: "Curso (detalle no disponible)",
          descripcion: "",
          horas: 0,
          modulos: [],
          categoria: null,
          imagen: null,
          destacado: false,
          fecha_inicio: null,
          profesores: [],
          modalidad: "",
          forma_pago: null,
          fechas_modulos: "",
          programa: "",
        } satisfies ApiCourse,
      });
    }

    try {
      const page = await notion.pages.retrieve({ page_id: id });

      if (!("properties" in page)) {
        console.warn("⚠️ Página sin propiedades (PartialPageObjectResponse). Devuelvo objeto mínimo.");
        return NextResponse.json({
          ok: true,
          data: {
            id: (page as any).id ?? id,
            nombre: "Curso sin propiedades",
            descripcion: "",
            horas: 0,
            modulos: [],
            categoria: null,
            imagen: null,
            destacado: false,
            fecha_inicio: null,
            profesores: [],
            modalidad: "",
            forma_pago: null,
            fechas_modulos: "",
            programa: "",
          } satisfies ApiCourse,
        });
      }

      const props = (page as PageObjectResponse).properties ?? {};
      console.log("🔍 Props Notion:", Object.keys(props));

      // Resolver nombres alternativos por seguridad
      const Nombre = resolveProp(props, ["Nombre", "Title", "name", "titulo"]);
      const Descripcion = resolveProp(props, ["Descripcion", "Descripción", "Description"]);
      const Horas = resolveProp(props, ["Horas", "Duración", "Duration"]);
      const Modulos = resolveProp(props, ["Modulos", "Módulos", "Modules"]);
      const Categoria = resolveProp(props, ["Categoria", "Categoría", "Category"]);
      const ImagenDestacada = resolveProp(props, ["Imagen_Destacada", "Imagen Destacada", "Cover", "Imagen"]);
      const Destacado = resolveProp(props, ["Destacado", "Featured"]);
      const FechaInicio = resolveProp(props, ["FechaInicio", "Fecha Inicio", "Start", "Inicio"]);
      const Profesores = resolveProp(props, ["Profesores", "Teachers", "Docentes"]);
      const Modalidad = resolveProp(props, ["Modalidad", "Mode"]);
      const FormaPago = resolveProp(props, ["FormaPago", "Forma de pago", "Payment"]);
      const FechasModulos = resolveProp(props, ["FechasModulos", "Fechas Módulos", "Cronograma"]);
      const Programa = resolveProp(props, ["Programa", "Syllabus", "Contenido"]);

      const modulos = normalizeModulosField(
        Modulos?.number ?? Modulos?.rich_text ?? Modulos
      );

      const imagenUrl = safeFilesFirstUrl(ImagenDestacada?.files ?? ImagenDestacada);

      const course: ApiCourse = {
        id: page.id,
        nombre: safeTextFromTitle(Nombre?.title) || "Curso sin título",
        descripcion: safeRichTextToString(Descripcion?.rich_text),
        horas: Number(Horas?.number ?? 0) || 0,
        modulos,
        categoria: safeSelectName(Categoria?.select),
        imagen: imagenUrl ?? null,
        destacado: Boolean(Destacado?.checkbox ?? false),
        fecha_inicio: FechaInicio?.date?.start ?? null,
        profesores: Array.isArray(Profesores?.multi_select)
          ? Profesores.multi_select.map((p: any) => p.name ?? "").filter(Boolean)
          : [],
        modalidad: safeRichTextToString(Modalidad?.rich_text),
        forma_pago: safeSelectName(FormaPago?.select),
        fechas_modulos: safeRichTextToString(FechasModulos?.rich_text),
        programa: safeRichTextToString(Programa?.rich_text),
      };

      console.log("✅ Curso procesado:", {
        nombre: course.nombre,
        horas: course.horas,
        profesores: course.profesores.length,
        destacado: course.destacado,
      });

      return NextResponse.json({ ok: true, data: course });
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      const isNotFound =
        msg?.includes("Not Found") || msg?.includes("object_not_found") || msg?.includes("path_failed");
      console.warn("❌ Notion retrieve failed:", id, msg);
      return NextResponse.json({ ok: false, error: isNotFound ? "Notion page not found" : "Upstream error", id }, { status: isNotFound ? 404 : 502 });
    }
  } catch (err: any) {
    console.error("💥 Error in /api/courses/[id]:", err);
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
