"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useRegister } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Register = () => {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên là bắt buộc";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

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

    if (!agreedToTerms) {
      newErrors.terms = "Bạn phải đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (registerMutation.isPending) return;

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
    <div className="min-h-screen tech-universe-bg flex items-center justify-center px-4 mt-[100px]">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-blue/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-neon-green/20 rounded-full blur-2xl animate-float"></div>
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
              Đăng ký
            </h1>
            <p className="text-gray-400">Tham gia vũ trụ code ngay hôm nay</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="tech-label">Họ và tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`tech-input ${errors.name ? "border-red-500" : ""}`}
                placeholder="Nguyễn Văn A"
                disabled={registerMutation.isPending}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

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
                disabled={registerMutation.isPending}
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
                  disabled={registerMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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
              <label className="tech-label">Xác nhận mật khẩu</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`tech-input pr-12 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                  disabled={registerMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
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

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 text-neon-blue bg-transparent border-gray-300 rounded focus:ring-neon-blue focus:ring-2 mt-1"
                />
                <span className="text-sm text-gray-300">
                  Tôi đồng ý với{" "}
                  <a
                    href="#"
                    className="text-neon-blue hover:text-neon-purple transition-colors"
                  >
                    Điều khoản sử dụng
                  </a>{" "}
                  và{" "}
                  <a
                    href="#"
                    className="text-neon-blue hover:text-neon-purple transition-colors"
                  >
                    Chính sách bảo mật
                  </a>
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-400 text-sm mt-1">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full tech-button py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Đang tạo tài khoản...</span>
                </div>
              ) : (
                "🚀 Tạo tài khoản"
              )}
            </button>

            {/* Error Message */}
            {registerMutation.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-400 text-sm text-center">
                  {registerMutation.error.message}
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
              <span>Đăng ký với Google</span>
            </button>
            <button className="w-full px-4 py-3 glass rounded-lg text-white font-semibold hover:shadow-neon transition-all duration-300 flex items-center justify-center space-x-2">
              <span>🐙</span>
              <span>Đăng ký với GitHub</span>
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-400">
              Đã có tài khoản?{" "}
              <Link
                href="/auth/login"
                className="text-neon-blue hover:text-neon-purple transition-colors font-semibold"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
