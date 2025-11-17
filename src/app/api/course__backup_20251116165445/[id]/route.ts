import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

function normalizeId(raw: unknown): string | null {
  if (!raw) return null;
  const s = String(raw);
  const decoded = decodeURIComponent(s).trim();
  // eliminar posibles saltos de línea u otros whitespace invisibles
  const cleaned = decoded.replace(/[\s\u00A0]+/g, "");
  // si ya tiene guiones y parece UUID, devolverlo
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(cleaned)) {
    return cleaned;
  }
  // si es 32 hex chars sin guiones, insertar guiones
  const onlyHex = cleaned.replace(/-/g, "");
  if (/^[0-9a-fA-F]{32}$/.test(onlyHex)) {
    return `${onlyHex.slice(0,8)}-${onlyHex.slice(8,12)}-${onlyHex.slice(12,16)}-${onlyHex.slice(16,20)}-${onlyHex.slice(20)}`;
  }
  return null;
}

export async function GET(req: Request, context: { params: any }) {
  try {
    // IMPORTANT: context.params is a Promise in App Router runtime
    const params = await context.params;
    const rawId = params?.id;
    const id = normalizeId(rawId);

    if (!id) {
      console.error("Invalid course id received:", { rawId });
      return NextResponse.json({ ok: false, error: "Invalid course id" }, { status: 400 });
    }

    // Debug log local (remover en producción)
    console.info("Fetching Notion blocks for id:", id);

    const response = await notion.blocks.children.list({ block_id: id });

    return NextResponse.json({ ok: true, data: { blocks: response.results } });
  } catch (error: any) {
    console.error("Error cargando curso:", error);
    const message = error?.message ? String(error.message) : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
