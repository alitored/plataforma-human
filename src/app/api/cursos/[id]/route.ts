import { NextRequest, NextResponse } from "next/server";
import { getCursoPorId } from "@/lib/notion/cursos";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ ok: false, error: "Falta parámetro id" }, { status: 400 });
    }

    const curso = await getCursoPorId(id);

    if (!curso) {
      return NextResponse.json({ ok: false, error: "Curso no encontrado" }, { status: 404 });
    }

    // Cache simple de 60 segundos
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
