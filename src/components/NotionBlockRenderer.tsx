// src/components/NotionBlockRenderer.tsx
import React, { useMemo } from "react";

type NotionBlock = any;

export default function NotionBlockRenderer({ blocks }: { blocks?: NotionBlock[] }) {
  const safeBlocks = Array.isArray(blocks) ? blocks : [];

  const nodes = useMemo(() => {
    const result: React.ReactNode[] = [];
    // accumulate list items to group contiguous list blocks
    let listBuffer: { type: "bulleted" | "numbered"; items: NotionBlock[] } | null = null;

    const flushList = () => {
      if (!listBuffer) return;
      const { type, items } = listBuffer;
      if (type === "bulleted") {
        result.push(
          <ul key={`ul-${items[0]?.id ?? Math.random()}`} className="list-disc list-inside space-y-1">
            {items.map((b) => (
              <li key={b.id} className="text-gray-200">
                {(b.bulleted_list_item?.rich_text ?? []).map((t: any) => t.plain_text).join(" ")}
              </li>
            ))}
          </ul>
        );
      } else {
        result.push(
          <ol key={`ol-${items[0]?.id ?? Math.random()}`} className="list-decimal list-inside space-y-1">
            {items.map((b) => (
              <li key={b.id} className="text-gray-200">
                {(b.numbered_list_item?.rich_text ?? []).map((t: any) => t.plain_text).join(" ")}
              </li>
            ))}
          </ol>
        );
      }
      listBuffer = null;
    };

    for (const block of safeBlocks) {
      const type = block?.type;

      // Handle list grouping
      if (type === "bulleted_list_item" || type === "numbered_list_item") {
        const currentType = type === "bulleted_list_item" ? "bulleted" : "numbered";
        if (!listBuffer) {
          listBuffer = { type: currentType, items: [block] };
        } else if (listBuffer.type === currentType) {
          listBuffer.items.push(block);
        } else {
          flushList();
          listBuffer = { type: currentType, items: [block] };
        }
        continue;
      }

      // If we encounter a non-list block, flush any buffered list first
      if (listBuffer) flushList();

      switch (type) {
        case "paragraph": {
          const text = (block.paragraph?.rich_text ?? []).map((t: any) => t.plain_text).join(" ");
          result.push(
            <p key={block.id} className="text-gray-200">
              {text}
            </p>
          );
          break;
        }
        case "heading_1": {
          const text = (block.heading_1?.rich_text ?? []).map((t: any) => t.plain_text).join(" ");
          result.push(
            <h1 key={block.id} className="text-2xl font-bold text-verde-oscuro">
              {text}
            </h1>
          );
          break;
        }
        case "heading_2": {
          const text = (block.heading_2?.rich_text ?? []).map((t: any) => t.plain_text).join(" ");
          result.push(
            <h2 key={block.id} className="text-xl font-bold text-verde-oscuro">
              {text}
            </h2>
          );
          break;
        }
        case "heading_3": {
          const text = (block.heading_3?.rich_text ?? []).map((t: any) => t.plain_text).join(" ");
          result.push(
            <h3 key={block.id} className="text-lg font-semibold text-verde-oscuro">
              {text}
            </h3>
          );
          break;
        }
        case "quote": {
          const text = (block.quote?.rich_text ?? []).map((t: any) => t.plain_text).join(" ");
          result.push(
            <blockquote key={block.id} className="border-l-4 border-emerald-600 pl-4 italic text-gray-300">
              {text}
            </blockquote>
          );
          break;
        }
        case "code": {
          const text = (block.code?.rich_text ?? []).map((t: any) => t.plain_text).join("");
          const lang = block.code?.language ?? "text";
          result.push(
            <pre key={block.id} className="bg-gray-800 rounded p-3 overflow-auto text-sm">
              <code data-lang={lang} className="whitespace-pre-wrap">
                {text}
              </code>
            </pre>
          );
          break;
        }
        case "image": {
          const url = block.image?.file?.url ?? block.image?.external?.url ?? "";
          result.push(
            <div key={block.id} className="rounded-lg overflow-hidden">
              {url ? (
                // use native img for simplicity; if you want next/image, switch here and handle unoptimized or remotePatterns
                <img src={url} alt={block.image?.caption?.[0]?.plain_text ?? "Imagen de Notion"} className="rounded-lg shadow-md w-full" loading="lazy" />
              ) : (
                <div className="bg-gray-800 text-gray-400 p-4 rounded">Imagen no disponible</div>
              )}
            </div>
          );
          break;
        }
        default: {
          // fallback: try to display plain_text if present
          const text =
            (block?.paragraph?.rich_text ?? block?.heading_2?.rich_text ?? block?.quote?.rich_text ?? [])
              .map((t: any) => t.plain_text)
              .join(" ");
          if (text) {
            result.push(
              <p key={block.id} className="text-gray-200">
                {text}
              </p>
            );
          } else {
            // keep trace in DOM for debugging (optional)
            result.push(null);
          }
        }
      }
    }

    // flush any remaining list
    if (listBuffer) flushList();

    return result;
  }, [safeBlocks]);

  if (safeBlocks.length === 0) {
    return <div className="text-center text-gray-500">Contenido del curso pendiente.</div>;
  }

  return <div className="space-y-4">{nodes}</div>;
}
