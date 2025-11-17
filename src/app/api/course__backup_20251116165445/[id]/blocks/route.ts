// src/app/api/course/[id]/blocks/route.ts
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

function normalizeId(raw: unknown): string | null {
  if (!raw) return null;
  const s = String(raw);
  const decoded = decodeURIComponent(s).trim();
  const cleaned = decoded.replace(/[\s\u00A0]+/g, "");
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(cleaned)) {
    return cleaned;
  }
  const onlyHex = cleaned.replace(/-/g, "");
  if (/^[0-9a-fA-F]{32}$/.test(onlyHex)) {
    return `${onlyHex.slice(0,8)}-${onlyHex.slice(8,12)}-${onlyHex.slice(12,16)}-${onlyHex.slice(16,20)}-${onlyHex.slice(20)}`;
  }
  return null;
}

export async function GET(req: Request, context: { params: any }) {
  try {
    const params = await context.params;
    const rawId = params?.id;
    const id = normalizeId(rawId);

    if (!id) {
      return NextResponse.json({ ok: false, error: "Invalid course id" }, { status: 400 });
    }

    // Intentar listar bloques; si Notion responde 404/400 devolver array vacío
    try {
      const response = await notion.blocks.children.list({ block_id: id });
      const blocks = Array.isArray(response.results) ? response.results : [];
      return NextResponse.json({ ok: true, data: { blocks } });
    } catch (err: any) {
      console.warn("Notion blocks list failed for id:", id, err?.message ?? err);
      // devolver consistente aunque Notion no tenga bloques o el id no tenga children
      return NextResponse.json({ ok: true, data: { blocks: [] } });
    }
  } catch (err: any) {
    console.error("Error in /api/course/[id]/blocks:", err);
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
