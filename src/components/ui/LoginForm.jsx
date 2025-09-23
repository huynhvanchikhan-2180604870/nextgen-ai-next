"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useLogin } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const loginMutation = useLogin();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email là bắt buộc";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";

    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
    else if (formData.password.length < 6)
      newErrors.password = "Mật khẩu ít nhất 6 ký tự";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const result = await loginMutation.mutateAsync(formData);
      if (result.success) setTimeout(() => router.replace(from), 500);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Neon background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-neon-blue/30 blur-3xl rounded-full animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-neon-purple/20 blur-3xl rounded-full animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mt-[100px] mb-[100px]"
      >
        <div className="card-info-glass p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Logo */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-tr from-neon-blue to-neon-purple shadow-lg shadow-neon-blue/40">
            <span className="text-white text-2xl font-extrabold">N</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-white mb-2">
            Đăng nhập
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Chào mừng bạn quay lại 🚀
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-black/40 text-white border transition-all focus:outline-none focus:ring-2 focus:ring-neon-blue ${
                  errors.email ? "border-red-500" : "border-white/20"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-black/40 text-white border transition-all focus:outline-none focus:ring-2 focus:ring-neon-purple pr-12 ${
                    errors.password ? "border-red-500" : "border-white/20"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  className="mr-2 w-4 h-4 rounded border-gray-400 focus:ring-neon-blue"
                />
                Ghi nhớ đăng nhập
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-neon-blue hover:text-neon-purple"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3 rounded-lg font-semibold text-lg text-black bg-gradient-to-r from-neon-blue to-neon-purple shadow-lg hover:opacity-90 transition-all duration-300"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                "🚀 Đăng nhập"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20" />
            <span className="px-4 text-gray-400 text-sm">hoặc</span>
            <div className="flex-1 border-t border-white/20" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full px-4 py-3 rounded-lg bg-white text-black font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-3">
              <FcGoogle className="text-2xl" />
              <span>Đăng nhập với Google</span>
            </button>
            <button className="w-full px-4 py-3 rounded-lg bg-[#24292f] text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-3">
              <FaGithub className="text-2xl" />
              <span>Đăng nhập với GitHub</span>
            </button>
          </div>

          {/* Sign Up */}
          <p className="text-center text-gray-400 mt-6">
            Chưa có tài khoản?{" "}
            <Link
              href="/auth/register"
              className="text-neon-blue hover:text-neon-purple font-semibold"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
