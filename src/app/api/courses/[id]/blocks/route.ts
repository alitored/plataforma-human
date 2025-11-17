// src/app/api/courses/[id]/blocks/route.ts
import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

function normalizeId(raw: unknown): string | null {
  if (!raw) return null;
  const s = String(raw);
  const decoded = decodeURIComponent(s).trim();
  const cleaned = decoded.replace(/\s+/g, "");
  // uuid with dashes
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(cleaned)) {
    return cleaned;
  }
  // raw hex without dashes -> add dashes
  const onlyHex = cleaned.replace(/-/g, "");
  if (/^[0-9a-fA-F]{32}$/.test(onlyHex)) {
    return `${onlyHex.slice(0,8)}-${onlyHex.slice(8,12)}-${onlyHex.slice(12,16)}-${onlyHex.slice(16,20)}-${onlyHex.slice(20)}`;
  }
  return null;
}

export async function GET(req: Request, context: { params?: any }) {
  try {
    const params = await context.params;
    const rawId = params?.id;
    const id = normalizeId(rawId);

    if (!id) {
      return NextResponse.json({ ok: false, error: "Invalid course id", rawId }, { status: 400 });
    }

    try {
      // list children blocks in Notion; if Notion errors, return empty array to avoid breaking UI
      const response = await notion.blocks.children.list({ block_id: id });
      const blocks = Array.isArray(response.results) ? response.results : [];
      return NextResponse.json({ ok: true, data: { blocks } });
    } catch (e: any) {
      console.warn("Notion blocks list failed for id:", id, e?.message ?? e);
      // return consistent shape even if Notion fails
      return NextResponse.json({ ok: true, data: { blocks: [] } });
    }
  } catch (err: any) {
    console.error("Error in /api/courses/[id]/blocks:", err);
    return NextResponse.json({ ok: false, error: String(err?.message ?? err) }, { status: 500 });
  }
}
