// Renders a JSON-LD <script>. `data` is trusted, server-built structured data
// (never raw user input), serialized with JSON.stringify.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
