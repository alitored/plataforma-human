// src/app/api/cursos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// ----------------------
// Variables de entorno
// ----------------------
const NOTION_TOKEN: string = process.env.NOTION_TOKEN!;
if (!NOTION_TOKEN) throw new Error("Falta NOTION_TOKEN en variables de entorno");

// Inicializamos Notion
const notion = new Client({ auth: NOTION_TOKEN });

// ----------------------
// Tipado del curso (alineado con la UI)
// ----------------------
interface Course {
  id: string;
  nombre: string;
  descripcion?: string;
  fecha_inicio?: string;
  profesores: string[];      // aseguramos array
  horas?: number;
  modulos: string[];         // aseguramos array
  categoria?: string;
  imagen?: string;
  destacado?: boolean;
  modalidad?: string;
  forma_pago?: string;
  fechas_modulos?: string;
  programa?: string;
}

// ----------------------
// Función inline: getCursoPorId
// ----------------------
async function getCursoPorId(id: string): Promise<Course | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const props = (page as any).properties;

    const curso: Course = {
      id: page.id,
      // Si en Notion "Nombre" fuera Title, podrías usar props.Nombre?.title?.[0]?.plain_text
      nombre: props.Nombre?.rich_text?.[0]?.plain_text || "",
      descripcion: props.Descripcion?.rich_text?.[0]?.plain_text || "",
      profesores: props.Profesores?.multi_select?.map((p: any) => p.name) || [],
      fecha_inicio: props.Fecha_inicio?.date?.start || "",
      horas: props.Horas?.number || 0,
      modulos: props.Modulos?.multi_select?.map((m: any) => m.name) || [],
      categoria: props.Categoria?.select?.name || "",
      imagen: props.Imagen?.url || "",
      destacado: props.Destacado?.checkbox || false,
      modalidad: props.Modalidad?.rich_text?.[0]?.plain_text || "",
      forma_pago: props.Forma_pago?.rich_text?.[0]?.plain_text || "",
      fechas_modulos: props.Fechas_modulos?.rich_text?.[0]?.plain_text || "",
      programa: props.Programa?.rich_text?.[0]?.plain_text || "",
    };

    return curso;
  } catch {
    return null;
  }
}

// ----------------------
// Endpoint GET
// ----------------------
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ ok: false, error: "Falta parámetro id" }, { status: 400 });
  }

  try {
    const curso = await getCursoPorId(id);
    if (!curso) {
      return NextResponse.json({ ok: false, error: "Curso no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: curso }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Error interno", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
