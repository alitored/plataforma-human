// src/app/api/cursos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

async function getCursoPorId(id: string) {
  // Reemplazar con fetch real (Notion, Supabase, DB)
  return {
    id,
    nombre: "Curso ejemplo",
    descripcion: "Descripción breve del curso",
    profesores: ["Docente 1", "Docente 2"],
    fecha_inicio: "2025-12-01",
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

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
