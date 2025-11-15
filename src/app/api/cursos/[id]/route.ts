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
export type Curso = {
  id: string;              // ahora usamos page.id de Notion
  nombre: string;
  descripcion: string;
  profesores: string[];
  fecha_inicio: string;
  horas?: number;
  modulos?: string[];
  categoria?: string;
};

// ----------------------
// Cache en memoria
// ----------------------
const cursoCache: Record<string, Curso> = {};

// ----------------------
// Helpers Notion
// ----------------------
async function getCursoPorId(id: string): Promise<Curso | null> {
  if (cursoCache[id]) return cursoCache[id];

  const page = await notion.pages.retrieve({ page_id: id });
  const props = (page as any).properties;

  const curso: Curso = {
    id: page.id,
    nombre: props.Nombre?.title?.[0]?.plain_text || "",
    descripcion: props.Descripcion?.rich_text?.[0]?.plain_text || "",
    profesores: props.Profesores?.multi_select?.map((p: any) => p.name) || [],
    fecha_inicio: props.Fecha_inicio?.date?.start || "",
    horas: props.Horas?.number || 0,
    modulos: props.Modulos?.multi_select?.map((m: any) => m.name) || [],
    categoria: props.Categoria?.select?.name || "",
  };

  cursoCache[id] = curso;
  return curso;
}

async function createCurso(curso: Omit<Curso, "id">): Promise<Curso> {
  const response = await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties: {
      Nombre: { title: [{ text: { content: curso.nombre } }] },
      Descripcion: { rich_text: [{ text: { content: curso.descripcion } }] },
      Profesores: { multi_select: (curso.profesores || []).map(p => ({ name: p })) },
      Fecha_inicio: curso.fecha_inicio ? { date: { start: curso.fecha_inicio } } : undefined,
      Horas: curso.horas ? { number: curso.horas } : undefined,
      Modulos: { multi_select: (curso.modulos || []).map(m => ({ name: m })) },
      Categoria: curso.categoria ? { select: { name: curso.categoria } } : undefined,
    },
  });

  const nuevoCurso: Curso = {
    ...curso,
    id: response.id, // usamos el page.id de Notion
  };

  cursoCache[nuevoCurso.id] = nuevoCurso;
  return nuevoCurso;
}

async function updateCurso(curso: Curso): Promise<Curso | null> {
  // buscamos el curso por page.id
  const page = await notion.pages.retrieve({ page_id: curso.id }).catch(() => null);
  if (!page) return null;

  await notion.pages.update({
    page_id: curso.id,
    properties: {
      Nombre: { title: [{ text: { content: curso.nombre } }] },
      Descripcion: { rich_text: [{ text: { content: curso.descripcion } }] },
      Profesores: { multi_select: (curso.profesores || []).map(p => ({ name: p })) },
      Fecha_inicio: curso.fecha_inicio ? { date: { start: curso.fecha_inicio } } : undefined,
      Horas: curso.horas ? { number: curso.horas } : undefined,
      Modulos: { multi_select: (curso.modulos || []).map(m => ({ name: m })) },
      Categoria: curso.categoria ? { select: { name: curso.categoria } } : undefined,
    },
  });

  cursoCache[curso.id] = curso;
  return curso;
}

async function deleteCurso(id: string): Promise<boolean> {
  const page = await notion.pages.retrieve({ page_id: id }).catch(() => null);
  if (!page) return false;

  await notion.pages.update({ page_id: id, archived: true });
  delete cursoCache[id];
  return true;
}

// ----------------------
// ENDPOINTS
// ----------------------
export async function GET(_request: NextRequest, { params }: { params: any }) {
  const id = params.id as string;
  if (!id) return NextResponse.json({ ok: false, error: "Falta parámetro id" }, { status: 400 });

  try {
    const curso = await getCursoPorId(id);
    if (!curso) return NextResponse.json({ ok: false, error: "Curso no encontrado" }, { status: 404 });

    return NextResponse.json({ ok: true, data: curso }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error interno", detail: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const curso: Omit<Curso, "id"> = {
      nombre: body.nombre || "",
      descripcion: body.descripcion || "",
      profesores: body.profesores || [],
      fecha_inicio: body.fecha_inicio || "",
      horas: body.horas || 0,
      modulos: body.modulos || [],
      categoria: body.categoria || "",
    };

    const nuevoCurso = await createCurso(curso);
    return NextResponse.json({ ok: true, data: nuevoCurso }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error interno", detail: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const id = params.id as string;
    const body = await request.json();

    const curso: Curso = {
      id,
      nombre: body.nombre || "",
      descripcion: body.descripcion || "",
      profesores: body.profesores || [],
      fecha_inicio: body.fecha_inicio || "",
      horas: body.horas || 0,
      modulos: body.modulos || [],
      categoria: body.categoria || "",
    };

    const actualizado = await updateCurso(curso);
    if (!actualizado) return NextResponse.json({ ok: false, error: "Curso no encontrado" }, { status: 404 });

    return NextResponse.json({ ok: true, data: actualizado }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error interno", detail: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: any }) {
  const id = params.id as string;
  if (!id) return NextResponse.json({ ok: false, error: "Falta parámetro id" }, { status: 400 });

  try {
    const eliminado = await deleteCurso(id);
    if (!eliminado) return NextResponse.json({ ok: false, error: "Curso no encontrado" }, { status: 404 });

    return NextResponse.json({ ok: true, data: { id } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error interno", detail: (err as Error).message }, { status: 500 });
  }
}
