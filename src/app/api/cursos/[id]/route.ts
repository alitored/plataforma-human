// src/app/api/cursos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { RouteHandlerContext } from "next/dist/server/web/route-handler-context";

// Simulación de acceso a datos (reemplazá con Notion, Supabase, DB propia)
async function getCursoPorId(id: string) {
  return {
    id,
    nombre: "Curso ejemplo",
    descripcion: "Descripción breve del curso",
    profesores: ["Docente 1", "Docente 2"],
    fecha_inicio: "2025-12-01",
  };
}

async function crearCurso(data: any) {
  return { id: "nuevo-id", ...data };
}

async function actualizarCurso(id: string, data: any) {
  return { id, ...data };
}

async function borrarCurso(id: string) {
  return { id, deleted: true };
}

// ✅ GET: obtener curso por id
export async function GET(
  request: NextRequest,
  context: RouteHandlerContext
): Promise<NextResponse> {
  try {
    const { id } = (await context.params) as { id: string };

    if (!id) {
      return NextResponse.json({ ok: false, error: "Falta parámetro id" }, { status: 400 });
    }

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

// ✅ POST: crear curso
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const nuevoCurso = await crearCurso(body);
    return NextResponse.json({ ok: true, data: nuevoCurso }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Error interno", detail: (err as Error).message },
      { status: 500 }
    );
  }
}

// ✅ PUT: actualizar curso por id
export async function PUT(
  request: NextRequest,
  context: RouteHandlerContext
): Promise<NextResponse> {
  try {
    const { id } = (await context.params) as { id: string };
    const body = await request.json();
    const cursoActualizado = await actualizarCurso(id, body);
    return NextResponse.json({ ok: true, data: cursoActualizado }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Error interno", detail: (err as Error).message },
      { status: 500 }
    );
  }
}

// ✅ DELETE: borrar curso por id
export async function DELETE(
  request: NextRequest,
  context: RouteHandlerContext
): Promise<NextResponse> {
  try {
    const { id } = (await context.params) as { id: string };
    const resultado = await borrarCurso(id);
    return NextResponse.json({ ok: true, data: resultado }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Error interno", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
