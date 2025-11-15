export default function NotionBlockRenderer({ blocks }: { blocks: any[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={block.id} className="text-gray-200">
                {block.paragraph.rich_text.map((t: any) => t.plain_text).join(" ")}
              </p>
            );
          case "heading_2":
            return (
              <h2 key={block.id} className="text-xl font-bold text-verde-oscuro">
                {block.heading_2.rich_text.map((t: any) => t.plain_text).join(" ")}
              </h2>
            );
          case "bulleted_list_item":
            return (
              <li key={block.id} className="list-disc list-inside text-gray-200">
                {block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join(" ")}
              </li>
            );
          case "image":
            const url = block.image?.file?.url || block.image?.external?.url;
            return (
              <img
                key={block.id}
                src={url}
                alt="Imagen de Notion"
                className="rounded-lg shadow-md"
              />
            );
          case "quote":
            return (
              <blockquote
                key={block.id}
                className="border-l-4 border-emerald-600 pl-4 italic text-gray-300"
              >
                {block.quote.rich_text.map((t: any) => t.plain_text).join(" ")}
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
