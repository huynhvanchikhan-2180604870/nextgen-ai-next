"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRegister } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const registerMutation = useRegister();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Tên là bắt buộc";
    else if (formData.name.trim().length < 2)
      newErrors.name = "Tên phải có ít nhất 2 ký tự";

    if (!formData.email) newErrors.email = "Email là bắt buộc";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";

    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
    else if (formData.password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu không khớp";

    if (!agreedToTerms)
      newErrors.terms = "Bạn phải đồng ý với điều khoản sử dụng";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await registerMutation.mutateAsync({
        fullName: formData.name.trim(),
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        if (result.requiresVerification) {
          router.push(
            `/auth/verify-otp?email=${encodeURIComponent(formData.email)}`
          );
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
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
            Đăng ký
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Tham gia vũ trụ code ngay hôm nay ✨
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-black/40 text-white border transition-all focus:outline-none focus:ring-2 focus:ring-neon-blue ${
                  errors.name ? "border-red-500" : "border-white/20"
                }`}
                placeholder="Nguyễn Văn A"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

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
                  className={`w-full px-4 py-3 rounded-lg bg-black/40 text-white border pr-12 transition-all focus:outline-none focus:ring-2 focus:ring-neon-purple ${
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
                  className={`w-full px-4 py-3 rounded-lg bg-black/40 text-white border pr-12 transition-all focus:outline-none focus:ring-2 focus:ring-neon-purple ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-white/20"
                  }`}
                  placeholder="••••••••"
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

            {/* Terms */}
            <div>
              <label className="flex items-start space-x-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 text-neon-blue border-gray-400 rounded focus:ring-neon-blue"
                />
                <span>
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-neon-blue hover:text-neon-purple">
                    Điều khoản sử dụng
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-neon-blue hover:text-neon-purple">
                    Chính sách bảo mật
                  </a>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-400 text-sm mt-1">{errors.terms}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full py-3 rounded-lg font-semibold text-lg text-black bg-gradient-to-r from-neon-blue to-neon-purple shadow-lg hover:opacity-90 transition-all duration-300"
            >
              {registerMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Đang tạo tài khoản...</span>
                </div>
              ) : (
                "🚀 Tạo tài khoản"
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
              <span>Đăng ký với Google</span>
            </button>
            <button className="w-full px-4 py-3 rounded-lg bg-[#24292f] text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-3">
              <FaGithub className="text-2xl" />
              <span>Đăng ký với GitHub</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-400 mt-6">
            Đã có tài khoản?{" "}
            <Link
              href="/auth/login"
              className="text-neon-blue hover:text-neon-purple font-semibold"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
