// src/app/api/cursos/[id]/route.ts
import { NextRequest, NextResponse, RouteHandler } from "next/server";
import { Client } from "@notionhq/client";

// Inicializamos Notion
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

type Curso = {
  id: string;
  nombre: string;
  descripcion: string;
  profesores: string[];
  fecha_inicio: string;
};

// GET optimizado con cache
const cursoCache: Record<string, Curso> = {};

async function getCursoPorId(id: string): Promise<Curso | null> {
  if (cursoCache[id]) return cursoCache[id];

  if (!DATABASE_ID) throw new Error("Falta NOTION_DATABASE_ID");

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: { property: "ID", rich_text: { equals: id } },
    page_size: 1,
  });

  if (!response.results.length) return null;

  const page = response.results[0];
  const props = page.properties as any;

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

// Exportamos con tipado RouteHandler
export const GET: RouteHandler = async (request, { params }) => {
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
};
