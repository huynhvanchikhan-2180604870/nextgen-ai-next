"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { useAuth, useLogout } from "../../hooks/useAuth.js";
import LoadingSpinner from "../ui/LoadingSpinner.jsx";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, isAuthenticated, clearAuthData } = useAuth();
  const logoutMutation = useLogout();
  const router = useRouter();
  const pathname = usePathname();

  // Debug user data
  console.log("🔍 Navbar - User data:", {
    user,
    isAuthenticated,
    userFullName: user?.fullName,
    userName: user?.name,
    userEmail: user?.email,
  });

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      router.push("/");
      setIsProfileOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleClearAuth = () => {
    clearAuthData();
    router.push("/");
    setIsProfileOpen(false);
    console.log("🧹 Đã xóa dữ liệu auth cũ, vui lòng refresh trang");
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 rounded-[17px] m-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold transition-all duration-300"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-display inline-block min-w-[20ch] text-center">
              <TypeAnimation
                sequence={["NextGen AI ✨", 2000, "Buy Smart Source 🚀", 2000]}
                speed={50}
                repeat={Infinity}
                wrapper="span"
              />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive("/")
                  ? "text-neon-blue bg-white/10 shadow-neon"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Trang chủ
            </Link>
            <Link
              href="/explore"
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive("/explore")
                  ? "text-neon-blue bg-white/10 shadow-neon"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Khám phá
            </Link>
            <Link
              href="/planner"
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive("/planner")
                  ? "text-neon-blue bg-white/10 shadow-neon"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              AI Planner
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive("/about")
                  ? "text-neon-blue bg-white/10 shadow-neon"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              Giới thiệu
            </Link>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.fullName?.charAt(0) ||
                        user?.name?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                  <span className="text-sm">
                    {user?.fullName || user?.name || "User"}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-card border border-white/20 shadow-lg">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Hồ sơ cá nhân
                      </Link>
                      <Link
                        href="/vault"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Kho dự án
                      </Link>
                      <Link
                        href="/ideas"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        💡 Ý tưởng
                      </Link>
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Yêu thích
                      </Link>
                      <Link
                        href="/wallet"
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Ví tiền
                      </Link>
                      <hr className="my-1 border-white/10" />
                      <button
                        onClick={handleClearAuth}
                        className="block w-full text-left px-4 py-2 text-sm text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                      >
                        🧹 Xóa dữ liệu cũ
                      </button>
                      <button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {logoutMutation.isPending ? (
                          <div className="flex items-center space-x-2">
                            <LoadingSpinner size="sm" color="white" />
                            <span>Đang đăng xuất...</span>
                          </div>
                        ) : (
                          "Đăng xuất"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg hover:shadow-neon transition-all duration-300"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden glass-card border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-lg text-base ${
                  isActive("/")
                    ? "text-neon-blue bg-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/explore"
                className={`block px-3 py-2 rounded-lg text-base ${
                  isActive("/explore")
                    ? "text-neon-blue bg-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Khám phá
              </Link>
              <Link
                href="/ideas"
                className={`block px-3 py-2 rounded-lg text-base ${
                  isActive("/ideas")
                    ? "text-neon-blue bg-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Ý tưởng
              </Link>
              <Link
                href="/planner"
                className={`block px-3 py-2 rounded-lg text-base ${
                  isActive("/planner")
                    ? "text-neon-blue bg-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                AI Planner
              </Link>
              <Link
                href="/about"
                className={`block px-3 py-2 rounded-lg text-base ${
                  isActive("/about")
                    ? "text-neon-blue bg-white/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Giới thiệu
              </Link>

              {isAuthenticated ? (
                <>
                  <hr className="my-2 border-white/10" />
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-lg text-base text-gray-300 hover:text-white hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hồ sơ cá nhân
                  </Link>
                  <Link
                    href="/vault"
                    className="block px-3 py-2 rounded-lg text-base text-gray-300 hover:text-white hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kho dự án
                  </Link>
                  <Link
                    href="/favorites"
                    className="block px-3 py-2 rounded-lg text-base text-gray-300 hover:text-white hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Yêu thích
                  </Link>
                  <Link
                    href="/wallet"
                    className="block px-3 py-2 rounded-lg text-base text-gray-300 hover:text-white hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Ví tiền
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="block w-full text-left px-3 py-2 rounded-lg text-base text-red-400 hover:text-red-300 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {logoutMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" color="white" />
                        <span>Đang đăng xuất...</span>
                      </div>
                    ) : (
                      "Đăng xuất"
                    )}
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-2 border-white/10" />
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 rounded-lg text-base text-gray-300 hover:text-white hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 rounded-lg text-base bg-gradient-to-r from-neon-blue to-neon-purple text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
