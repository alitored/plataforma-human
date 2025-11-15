// src/app/api/cursos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

// ----------------------
// Configuración Notion
// ----------------------
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!DATABASE_ID) throw new Error("Falta NOTION_DATABASE_ID");

// ----------------------
// Tipado del curso
// ----------------------
export type Curso = {
  id: string;
  nombre: string;
  descripcion: string;
  profesores: string[];
  fecha_inicio: string;
};

// ----------------------
// Cache simple en memoria
// ----------------------
const cursoCache: Record<string, Curso> = {};

// ----------------------
// Funciones helpers Notion
// ----------------------
async function getCursoPorId(id: string): Promise<Curso | null> {
  if (cursoCache[id]) return cursoCache[id];

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: "ID", rich_text: { equals: id } },
    page_size: 1,
  });

  if (!response.results.length) return null;

  const page = response.results[0] as any; // cast seguro

  if (!page.properties) return null;

  const props = page.properties;

  const curso: Curso = {
    id,
    nombre: props.Nombre?.title?.[0]?.plain_text || "",
    descripcion: props.Descripcion?.rich_text?.[0]?.plain_text || "",
    profesores: props.Profesores?.multi_select?.map((p: any) => p.name) || [],
    fecha_inicio: props.Fecha_inicio?.date?.start || "",
  };

  cursoCache[id] = curso;
  return curso;
}

async function createCurso(curso: Curso): Promise<Curso> {
  await notion.pages.create({
    parent: { database_id: DATABASE_ID },
    properties: {
      ID: { rich_text: [{ text: { content: curso.id } }] },
      Nombre: { title: [{ text: { content: curso.nombre } }] },
      Descripcion: { rich_text: [{ text: { content: curso.descripcion } }] },
      Profesores: { multi_select: curso.profesores.map(p => ({ name: p })) },
      Fecha_inicio: { date: { start: curso.fecha_inicio } },
    },
  });

  cursoCache[curso.id] = curso;
  return curso;
}

async function updateCurso(curso: Curso): Promise<Curso | null> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: "ID", rich_text: { equals: curso.id } },
    page_size: 1,
  });

  if (!response.results.length) return null;

  const pageId = response.results[0].id;

  await notion.pages.update({
    page_id: pageId,
    properties: {
      Nombre: { title: [{ text: { content: curso.nombre } }] },
      Descripcion: { rich_text: [{ text: { content: curso.descripcion } }] },
      Profesores: { multi_select: curso.profesores.map(p => ({ name: p })) },
      Fecha_inicio: { date: { start: curso.fecha_inicio } },
    },
  });

  cursoCache[curso.id] = curso;
  return curso;
}

async function deleteCurso(id: string): Promise<boolean> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: "ID", rich_text: { equals: id } },
    page_size: 1,
  });

  if (!response.results.length) return false;

  const pageId = response.results[0].id;
  await notion.pages.update({ page_id: pageId, archived: true });

  delete cursoCache[id];
  return true;
}

// ----------------------
// ENDPOINTS
// ----------------------
export async function GET(request: NextRequest, { params }: { params: any }) {
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

export async function POST(request: NextRequest, { params }: { params: any }) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ ok: false, error: "Falta id" }, { status: 400 });

    const curso: Curso = {
      id: body.id,
      nombre: body.nombre || "",
      descripcion: body.descripcion || "",
      profesores: body.profesores || [],
      fecha_inicio: body.fecha_inicio || "",
    };

    const nuevoCurso = await createCurso(curso);
    return NextResponse.json({ ok: true, data: nuevoCurso }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error interno", detail: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: any }) {
  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ ok: false, error: "Falta id" }, { status: 400 });

    const curso: Curso = {
      id: body.id,
      nombre: body.nombre || "",
      descripcion: body.descripcion || "",
      profesores: body.profesores || [],
      fecha_inicio: body.fecha_inicio || "",
    };

    const actualizado = await updateCurso(curso);
    if (!actualizado) return NextResponse.json({ ok: false, error: "Curso no encontrado" }, { status: 404 });

    return NextResponse.json({ ok: true, data: actualizado }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Error interno", detail: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: any }) {
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
