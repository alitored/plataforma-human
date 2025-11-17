// src/app/api/courses/[id]/route.ts
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const notion = NOTION_TOKEN ? new Client({ auth: NOTION_TOKEN }) : null;

// Accepts both dashed UUID and 32-char hex; returns dashed UUID or null
function normalizeId(raw: unknown): string | null {
  if (!raw) return null;
  const s = String(raw).trim();
  const cleaned = decodeURIComponent(s).replace(/\s+/g, "");
  // already dashed UUID
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(cleaned)) {
    return cleaned.toLowerCase();
  }
  // 32 hex without dashes -> insert dashes
  const onlyHex = cleaned.replace(/[^0-9a-fA-F]/g, "");
  if (/^[0-9a-fA-F]{32}$/.test(onlyHex)) {
    return `${onlyHex.slice(0,8)}-${onlyHex.slice(8,12)}-${onlyHex.slice(12,16)}-${onlyHex.slice(16,20)}-${onlyHex.slice(20,32)}`.toLowerCase();
  }
  return null;
}

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
    return first?.file?.url ?? first?.external?.url ?? null;
  } catch {
    return null;
  }
}

function normalizeModulosField(field: any): string[] {
  if (Array.isArray(field)) {
    return field.map((f: any, i: number) => {
      if (typeof f === "string") return f;
      return f?.name ?? f?.title ?? `Modulo ${i + 1}`;
    });
  }

  const n = Number(field);
  if (!Number.isNaN(n) && Number.isFinite(n) && n > 0) {
    return Array.from({ length: Math.max(0, Math.floor(n)) }, (_, i) => `Modulo ${i + 1}`);
  }

  if (typeof field === "string") {
    const parts = field
      .split(/\r?\n|,|;/)
      .map(s => s.trim())
      .filter(Boolean);
    if (parts.length) return parts;
  }

  return [];
}

// Función segura para acceder a propiedades de Notion
function getSafeProperties(page: any): any {
  try {
    // Para diferentes tipos de respuesta de Notion
    if ('properties' in page) {
      return page.properties;
    }
    
    // Si es una respuesta parcial, intentamos acceder de otra manera
    if (page.object === 'page') {
      // En algunos casos puede que necesitemos hacer un cast
      return (page as any).properties || {};
    }
    
    return {};
  } catch {
    return {};
  }
}

// Sintaxis correcta para Next.js 16
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // IMPORTANTE: await params en Next.js 16
    const params = await context.params;
    const { id: rawId } = params;
    const id = normalizeId(rawId);

    if (!id) {
      return NextResponse.json({ 
        ok: false, 
        error: "Invalid course id", 
        rawId 
      }, { status: 400 });
    }

    console.log("🔍 API Individual - Buscando curso ID:", id);

    // If Notion client configured, try to retrieve page
    if (notion) {
      try {
        const page = await notion.pages.retrieve({ page_id: id });
        const props = getSafeProperties(page);

        console.log("🔍 Propiedades de Notion encontradas:", Object.keys(props));

        // PROCESAR LOS CAMPOS COMO EN LA API DE LISTA
        const rawModulos = props.Modulos?.number ?? props.Modulos?.rich_text ?? props.Modulos ?? null;
        const modulos = normalizeModulosField(rawModulos);
        
        // Manejo seguro de la imagen
        let imagenUrl = null;
        try {
          const imagenFiles = props.Imagen_Destacada?.files ?? props.Imagen_Destacada;
          imagenUrl = safeFilesFirstUrl(imagenFiles);
        } catch (e) {
          console.warn("⚠️ Error al procesar imagen:", e);
        }

        const course = {
          id: page.id,
          nombre: safeTextFromTitle(props.Nombre?.title) || "Curso sin título",
          descripcion: safeRichTextToString(props.Descripcion?.rich_text),
          horas: Number(props.Horas?.number ?? 0) || 0,
          modulos: modulos || [],
          categoria: safeSelectName(props.Categoria?.select) ?? "General",
          imagen: imagenUrl ?? "/placeholder.jpg",
          destacado: Boolean(props.Destacado?.checkbox ?? false),
          fecha_inicio: props.FechaInicio?.date?.start ?? null,
          profesores: Array.isArray(props.Profesores?.multi_select) ? 
            props.Profesores.multi_select.map((p: any) => p.name ?? "").filter(Boolean) : [],
          modalidad: safeRichTextToString(props.Modalidad?.rich_text),
          forma_pago: safeSelectName(props.FormaPago?.select),
          fechas_modulos: safeRichTextToString(props.FechasModulos?.rich_text),
          programa: safeRichTextToString(props.Programa?.rich_text),
        };

        console.log("✅ Curso procesado - Datos:", {
          nombre: course.nombre,
          descripcion: course.descripcion?.substring(0, 50) + "...",
          horas: course.horas,
          profesores: course.profesores,
          modalidad: course.modalidad ? "PRESENTE" : "NO",
          fechas_modulos: course.fechas_modulos ? "PRESENTE" : "NO"
        });

        return NextResponse.json({ ok: true, data: course });

      } catch (e: any) {
        console.warn("❌ Notion retrieve failed for id:", id, e?.message ?? e);
        
        // Verificar si es error de tipo (TypeError) o de Notion
        if (e instanceof TypeError) {
          return NextResponse.json({ 
            ok: false, 
            error: "Type error accessing Notion properties",
            details: e.message 
          }, { status: 500 });
        }
        
        return NextResponse.json({ 
          ok: false, 
          error: "Notion page not found", 
          id 
        }, { status: 404 });
      }
    }

    // Fallback: return a safe minimal course object so UI can render
    return NextResponse.json({
      ok: true,
      data: {
        id,
        nombre: "Curso (detalle no disponible en dev)",
        descripcion: "",
        profesores: [],
        modulos: [],
      },
    });
  } catch (err: any) {
    console.error("💥 Error in /api/courses/[id]:", err);
    return NextResponse.json({ 
      ok: false, 
      error: String(err?.message ?? err) 
    }, { status: 500 });
  }
}