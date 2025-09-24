import { Inter } from "next/font/google";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/layout/Footer";
import Navbar from "../components/layout/Navbar";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NextGen AI - Khám phá vũ trụ công nghệ AI",
  description:
    "Nền tảng khám phá và tương tác với các dự án AI tiên tiến nhất. Trải nghiệm không gian công nghệ 3D với AI Planner, Wallet và Marketplace.",
  keywords:
    "AI, Artificial Intelligence, Machine Learning, 3D, Space, Technology, NextGen",
  authors: [{ name: "NextGen AI Team" }],
  creator: "NextGen AI",
  publisher: "NextGen AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://nextgen-ai.vercel.app",
    title: "NextGen AI - Khám phá vũ trụ công nghệ AI",
    description:
      "Nền tảng khám phá và tương tác với các dự án AI tiên tiến nhất. Trải nghiệm không gian công nghệ 3D với AI Planner, Wallet và Marketplace.",
    siteName: "NextGen AI",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NextGen AI - Khám phá vũ trụ công nghệ AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NextGen AI - Khám phá vũ trụ công nghệ AI",
    description:
      "Nền tảng khám phá và tương tác với các dự án AI tiên tiến nhất.",
    images: ["/og-image.jpg"],
    creator: "@nextgenai",
  },
  metadataBase: new URL("http://localhost:3000"),
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} tech-universe-bg min-h-screen`}>
        {/* ✅ Bọc Navbar + children + Footer trong Providers */}
        <ErrorBoundary>
          <Providers>
            <Navbar />
            {children}
            <Footer />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
