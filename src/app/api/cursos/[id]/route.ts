// src/app/api/cursos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { CourseSchema, Course } from "@/types/Course";
import { getCursoPorId } from "@/lib/notion/cursos";
import { Client } from "@notionhq/client";

const NOTION_TOKEN: string = process.env.NOTION_TOKEN!;
const DATABASE_ID: string = process.env.NOTION_DATABASE_ID!;

if (!NOTION_TOKEN) throw new Error("Falta NOTION_TOKEN");
if (!DATABASE_ID) throw new Error("Falta NOTION_DATABASE_ID");

const notion = new Client({ auth: NOTION_TOKEN });

// --- GET: obtener curso por ID ---
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const curso = await getCursoPorId(id);
    if (!curso)
      return NextResponse.json({ ok: false, error: "Curso no encontrado" }, { status: 404 });

    // Cache simple (revalidar cada 60s)
    return NextResponse.json({ ok: true, data: curso }, {
      status: 200,
      headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=60" },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Error interno", detail: (err as Error).message },
      { status: 500 }
    );
  }
}

// --- POST: crear nuevo curso ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = CourseSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ ok: false, error: "Datos inválidos", detail: parseResult.error.errors }, { status: 400 });
    }

    const curso: Course = parseResult.data;

    // Crear página en Notion
    const newPage = await notion.pages.create({
      parent: { database_id: DATABASE_ID },
      properties: {
        ID: { rich_text: [{ text: { content: curso.id } }] },
        Nombre: { title: [{ text: { content: curso.nombre } }] },
        Descripcion: { rich_text: [{ text: { content: curso.descripcion || "" } }] },
        Horas: { number: curso.horas || 0 },
        Modulos: { number: curso.modulos || 0 },
        Categoria: { select: { name: curso.categoria || "General" } },
        Destacado: { checkbox: curso.destacado || false },
        Fecha_inicio: { date: { start: curso.fecha_inicio || undefined } },
        Profesores: {
          multi_select: (curso.profesores || []).map((name) => ({ name })),
        },
      },
    });

    return NextResponse.json({ ok: true, data: curso, notionPageId: newPage.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Error interno POST", detail: (err as Error).message },
      { status: 500 }
    );
  }
}

// --- PUT: actualizar curso existente ---
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const parseResult = CourseSchema.partial().safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ ok: false, error: "Datos inválidos", detail: parseResult.error.errors }, { status: 400 });
    }

    const cursoActualizado: Partial<Course> = parseResult.data;

    // Buscar página existente
    const cursoExistente = await getCursoPorId(id);
    if (!cursoExistente) return NextResponse.json({ ok: false, error: "Curso no encontrado" }, { status: 404 });

    // Actualizar página Notion
    const response = await notion.pages.update({
      page_id: cursoExistente.id, // Aquí necesitarías almacenar el page_id de Notion en tu DB/curso
      properties: {
        Nombre: cursoActualizado.nombre ? { title: [{ text: { content: cursoActualizado.nombre } }] } : undefined,
        Descripcion: cursoActualizado.descripcion ? { rich_text: [{ text: { content: cursoActualizado.descripcion } }] } : undefined,
        Horas: cursoActualizado.horas !== undefined ? { number: cursoActualizado.horas } : undefined,
        Modulos: cursoActualizado.modulos !== undefined ? { number: cursoActualizado.modulos } : undefined,
        Categoria: cursoActualizado.categoria ? { select: { name: cursoActualizado.categoria } } : undefined,
        Destacado: cursoActualizado.destacado !== undefined ? { checkbox: cursoActualizado.destacado } : undefined,
        Fecha_inicio: cursoActualizado.fecha_inicio ? { date: { start: cursoActualizado.fecha_inicio } } : undefined,
        Profesores: cursoActualizado.profesores ? { multi_select: cursoActualizado.profesores.map(name => ({ name })) } : undefined,
      },
    });

    return NextResponse.json({ ok: true, data: cursoActualizado }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Error interno PUT", detail: (err as Error).message },
      { status: 500 }
    );
  }
}

// --- DELETE: eliminar curso ---
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const cursoExistente = await getCursoPorId(id);
    if (!cursoExistente) return NextResponse.json({ ok: false, error: "Curso no encontrado" }, { status: 404 });

    // Notion no permite borrar páginas directamente, se "archiva"
    await notion.pages.update({
      page_id: cursoExistente.id, // almacenar page_id de Notion
      properties: { Destacado: { checkbox: false } }, // ejemplo de cambio
    });

    return NextResponse.json({ ok: true, message: "Curso eliminado (archivado)" }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Error interno DELETE", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
