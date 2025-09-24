import { useEffect, useRef } from "react";

const MarkdownRenderer = ({ content, className = "" }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      // Parse markdown-like content and convert to HTML
      let html = content
        // Headers
        .replace(
          /^### (.*$)/gim,
          '<h3 class="text-base font-semibold mb-2 mt-4 text-gray-900 dark:text-white">$1</h3>'
        )
        .replace(
          /^## (.*$)/gim,
          '<h2 class="text-lg font-bold mb-3 mt-5 text-gray-900 dark:text-white">$1</h2>'
        )
        .replace(
          /^# (.*$)/gim,
          '<h1 class="text-xl font-bold mb-4 mt-6 text-gray-900 dark:text-white">$1</h1>'
        )

        // Bold text
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>'
        )

        // Italic text
        .replace(
          /\*(.*?)\*/g,
          '<em class="italic text-gray-700 dark:text-gray-300">$1</em>'
        )

        // Code blocks
        .replace(
          /```([\s\S]*?)```/g,
          '<pre class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-lg my-3 overflow-x-auto text-sm border border-gray-200 dark:border-gray-700"><code>$1</code></pre>'
        )

        // Inline code
        .replace(
          /`([^`]+)`/g,
          '<code class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm border border-gray-200 dark:border-gray-700">$1</code>'
        )

        // Lists
        .replace(
          /^\* (.*$)/gim,
          '<li class="ml-4 mb-1 text-gray-700 dark:text-gray-300 text-sm">• $1</li>'
        )
        .replace(
          /^- (.*$)/gim,
          '<li class="ml-4 mb-1 text-gray-700 dark:text-gray-300 text-sm">• $1</li>'
        )

        // Numbered lists
        .replace(
          /^(\d+)\. (.*$)/gim,
          '<li class="ml-4 mb-1 text-gray-700 dark:text-gray-300 text-sm">$1. $2</li>'
        )

        // Line breaks
        .replace(
          /\n\n/g,
          '</p><p class="mb-3 text-gray-700 dark:text-gray-300 text-sm">'
        )
        .replace(/\n/g, "<br>");

      // Wrap in paragraph if not already wrapped
      if (!html.startsWith("<")) {
        html = `<p class="mb-3 text-gray-700 dark:text-gray-300 text-sm">${html}</p>`;
      }

      contentRef.current.innerHTML = html;
    }
  }, [content]);

  return (
    <div
      ref={contentRef}
      className={`prose prose-invert max-w-none ${className}`}
      style={{
        fontSize: "14px",
        lineHeight: "1.6",
      }}
    />
  );
};

export default MarkdownRenderer;
