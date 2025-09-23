"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function Providers({ children }) {
  // ✅ Khởi tạo QueryClient chỉ 1 lần
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 phút, tránh refetch liên tục
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools chỉ bật ở môi trường dev */}
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
