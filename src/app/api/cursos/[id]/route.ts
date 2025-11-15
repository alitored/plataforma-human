// src/app/api/cursos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// ----------------------
// Variables de entorno
// ----------------------
const NOTION_TOKEN: string = process.env.NOTION_TOKEN!;
const DATABASE_ID: string = process.env.NOTION_DATABASE_ID!;

if (!NOTION_TOKEN) throw new Error("Falta NOTION_TOKEN en variables de entorno");
if (!DATABASE_ID) throw new Error("Falta NOTION_DATABASE_ID en variables de entorno");

// Inicializamos Notion
const notion = new Client({ auth: NOTION_TOKEN });

// ----------------------
// Tipado del curso
// ----------------------
type Curso = {
  id: string;
  nombre: string;
  descripcion: string;
  profesores: string[];
  fecha_inicio: string;
  horas?: number;
  modulos?: string[];
  categoria?: string;
};

// ----------------------
// Función inline: getCursoPorId
// ----------------------
async function getCursoPorId(id: string): Promise<Curso | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id });
    const props = (page as any).properties;

    const curso: Curso = {
      id: page.id,
      nombre: props.Nombre?.rich_text?.[0]?.plain_text || "",
      descripcion: props.Descripcion?.rich_text?.[0]?.plain_text || "",
      profesores: props.Profesores?.multi_select?.map((p: any) => p.name) || [],
      fecha_inicio: props.Fecha_inicio?.date?.start || "",
      horas: props.Horas?.number || 0,
      modulos: props.Modulos?.multi_select?.map((m: any) => m.name) || [],
      categoria: props.Categoria?.select?.name || "",
    };

    return curso;
  } catch {
    return null;
  }
}

// ----------------------
// Endpoint GET
// ----------------------
export async function GET(_request: NextRequest, { params }: { params: any }) {
  const id = params.id as string;
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
