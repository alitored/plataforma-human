// src/app/api/cursos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

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

// ✅ GET: obtener curso por id
export async function GET(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

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
