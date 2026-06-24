// Renders an inline script that runs synchronously during HTML parsing (before
// first paint) on hard loads, while avoiding React's dev warning about <script>
// tags: it emits `text/javascript` on the server (executes) and `text/plain`
// on the client render (inert). See Next.js "Preventing flash before hydration".
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
