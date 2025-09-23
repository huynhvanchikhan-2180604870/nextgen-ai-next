"use client";

import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: "Khám phá", href: "/explore" },
      { name: "AI Planner", href: "/planner" },
      { name: "Marketplace", href: "/explore" },
      { name: "API Documentation", href: "/docs" },
    ],
    company: [
      { name: "Giới thiệu", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    support: [
      { name: "Trung tâm trợ giúp", href: "/help" },
      { name: "Liên hệ", href: "/contact" },
      { name: "Status", href: "/status" },
      { name: "Community", href: "/community" },
    ],
    legal: [
      { name: "Điều khoản sử dụng", href: "/terms" },
      { name: "Chính sách bảo mật", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "GDPR", href: "/gdpr" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/nextgenai", icon: "🐦" },
    { name: "GitHub", href: "https://github.com/nextgenai", icon: "🐙" },
    { name: "Discord", href: "https://discord.gg/nextgenai", icon: "💬" },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/nextgenai",
      icon: "💼",
    },
  ];

  return (
    <footer className="bg-dark-900/50 border-t border-white/10 mt-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold neon-text hover:animate-glow transition-all duration-300 mb-4"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-display">NextGenAI</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Hành tinh Code & AI - Nơi kết nối những ý tưởng sáng tạo với công
              nghệ tiên tiến. Khám phá, học hỏi và phát triển cùng cộng đồng
              developer hàng đầu Việt Nam.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-neon-blue hover:bg-white/20 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-neon-blue hover:bg-white/20 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-neon-blue hover:bg-white/20 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-neon-blue hover:bg-white/20 transition-all duration-300"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/explore"
                  className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
                >
                  Khám phá dự án
                </Link>
              </li>
              <li>
                <Link
                  href="/planner"
                  className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
                >
                  AI Planner
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
                >
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
                >
                  Liên hệ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
                >
                  Báo lỗi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
                >
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} NextGenAI. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Được xây dựng với</span>
              <div className="flex items-center space-x-1">
                <span className="text-red-400">❤️</span>
                <span className="text-gray-400 text-sm">và</span>
                <span className="text-neon-blue">⚡</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
