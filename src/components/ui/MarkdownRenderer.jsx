"use client";

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
          '<h3 class="text-base md:text-lg font-semibold mb-2 mt-4 text-white">$1</h3>'
        )
        .replace(
          /^## (.*$)/gim,
          '<h2 class="text-lg md:text-xl font-bold mb-3 mt-5 text-white">$1</h2>'
        )
        .replace(
          /^# (.*$)/gim,
          '<h1 class="text-xl md:text-2xl font-bold mb-4 mt-6 text-white">$1</h1>'
        )

        // Bold text
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="font-semibold text-white">$1</strong>'
        )

        // Italic text
        .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')

        // Code blocks
        .replace(
          /```([\s\S]*?)```/g,
          '<pre class="bg-gray-800 text-green-400 p-2 md:p-3 rounded-lg my-2 md:my-3 overflow-x-auto text-xs md:text-sm"><code>$1</code></pre>'
        )

        // Inline code
        .replace(
          /`([^`]+)`/g,
          '<code class="bg-gray-700 text-green-400 px-1 py-0.5 rounded text-xs md:text-sm">$1</code>'
        )

        // Lists
        .replace(
          /^\* (.*$)/gim,
          '<li class="ml-2 md:ml-4 mb-1 text-gray-200 text-sm md:text-base">• $1</li>'
        )
        .replace(
          /^- (.*$)/gim,
          '<li class="ml-2 md:ml-4 mb-1 text-gray-200 text-sm md:text-base">• $1</li>'
        )

        // Line breaks
        .replace(
          /\n\n/g,
          '</p><p class="mb-2 md:mb-3 text-gray-200 text-sm md:text-base">'
        )
        .replace(/\n/g, "<br>");

      // Wrap in paragraph if not already wrapped
      if (!html.startsWith("<")) {
        html = `<p class="mb-3 text-gray-200">${html}</p>`;
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
