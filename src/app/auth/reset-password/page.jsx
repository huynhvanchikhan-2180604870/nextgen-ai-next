"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useResetPassword } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const resetPasswordMutation = useResetPassword();

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setErrors({ general: "Token không hợp lệ hoặc đã hết hạn" });
      return;
    }

    if (!validateForm()) return;

    try {
      const result = await resetPasswordMutation.mutateAsync({
        token,
        newPassword: formData.password,
      });

      if (result.success) {
        setTimeout(() => router.replace("/auth/login?reset=success"), 600);
      }
    } catch (error) {
      console.error("Reset password error:", error);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="card-info-glass p-8 rounded-2xl text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-red-400 mb-2">
              Token không hợp lệ
            </h1>
            <p className="text-gray-400 mb-6">
              Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
            </p>
            <Link
              href="/auth/forgot-password"
              className="w-full block py-3 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold hover:opacity-90 transition-all"
            >
              🔄 Yêu cầu link mới
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* background glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-neon-blue/30 blur-3xl rounded-full animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-neon-purple/20 blur-3xl rounded-full animate-pulse-slow" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card-info-glass p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-tr from-neon-blue to-neon-purple shadow-lg">
              <span className="text-white text-2xl font-extrabold">🔐</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Đặt lại mật khẩu
            </h1>
            <p className="text-gray-400">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-black/40 text-white border transition-all focus:outline-none focus:ring-2 focus:ring-neon-blue pr-12 ${
                    errors.password ? "border-red-500" : "border-white/20"
                  }`}
                  placeholder="••••••••"
                  disabled={resetPasswordMutation.isPending}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg bg-black/40 text-white border transition-all focus:outline-none focus:ring-2 focus:ring-neon-purple pr-12 ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-white/20"
                  }`}
                  placeholder="••••••••"
                  disabled={resetPasswordMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full py-3 rounded-lg font-semibold text-lg text-black bg-gradient-to-r from-neon-blue to-neon-purple shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetPasswordMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Đang đặt lại...</span>
                </div>
              ) : (
                "🔐 Đặt lại mật khẩu"
              )}
            </motion.button>

            {/* Error */}
            {(resetPasswordMutation.error || errors.general) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-400 text-sm text-center">
                  {resetPasswordMutation.error?.message || errors.general}
                </p>
              </motion.div>
            )}
          </form>

          {/* Back to Login */}
          <div className="text-center mt-6">
            <Link
              href="/auth/login"
              className="text-neon-blue hover:text-neon-purple transition-colors font-semibold"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
            <p className="text-gray-400">Đang tải...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
