"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const loginMutation = useLogin();
  const router = useRouter();
  const searchParams = useSearchParams();

  // nếu có param ?from=/dashboard thì redirect về đó, mặc định "/"
  const from = searchParams.get("from") || "/";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) return;

    try {
      const result = await loginMutation.mutateAsync(formData);

      if (result.success) {
        setTimeout(() => {
          router.replace(from);
        }, 500);
      }
    } catch (error) {
      console.error("🔐 Login error:", error);
    }
  };

  return (
    <div className="min-h-screen tech-universe-bg flex items-center justify-center px-4 mt-10">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-neon-green/20 rounded-full blur-2xl animate-float"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white font-bold text-2xl">N</span>
            </motion.div>
            <h1 className="text-3xl font-bold font-display neon-text mb-2">
              Đăng nhập
            </h1>
            <p className="text-gray-400">Chào mừng trở lại vũ trụ code</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="tech-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`tech-input ${errors.email ? "border-red-500" : ""}`}
                placeholder="your@email.com"
                disabled={loginMutation.isPending}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="tech-label">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`tech-input pr-12 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                  disabled={loginMutation.isPending}
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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-neon-blue bg-transparent border-gray-300 rounded focus:ring-neon-blue"
                />
                <span className="ml-2 text-sm text-gray-300">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-neon-blue hover:text-neon-purple transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full tech-button py-3 text-lg disabled:opacity-50"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                "🚀 Đăng nhập"
              )}
            </button>

            {/* Error */}
            {loginMutation.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-400 text-sm text-center">
                  {loginMutation.error.message}
                </p>
              </motion.div>
            )}
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">hoặc</span>
            <div className="flex-1 border-t border-white/20"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full px-4 py-3 glass rounded-lg text-white font-semibold hover:shadow-neon transition-all duration-300 flex items-center justify-center space-x-2">
              <span>🔍</span>
              <span>Đăng nhập với Google</span>
            </button>
            <button className="w-full px-4 py-3 glass rounded-lg text-white font-semibold hover:shadow-neon transition-all duration-300 flex items-center justify-center space-x-2">
              <span>🐙</span>
              <span>Đăng nhập với GitHub</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Chưa có tài khoản?{" "}
              <Link
                href="/auth/register"
                className="text-neon-blue hover:text-neon-purple font-semibold"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
