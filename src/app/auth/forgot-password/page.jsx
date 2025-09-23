"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useForgotPassword } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const forgotPasswordMutation = useForgotPassword();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email là bắt buộc");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email không hợp lệ");
      return;
    }

    try {
      const result = await forgotPasswordMutation.mutateAsync(email);
      if (result.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen tech-universe-bg flex items-center justify-center px-4">
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
          <div className="glass-card p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-neon-green to-neon-blue rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white font-bold text-2xl">✓</span>
            </motion.div>

            <h1 className="text-3xl font-bold font-display neon-text mb-4">
              Email đã được gửi!
            </h1>

            <p className="text-gray-400 mb-6">
              Chúng tôi đã gửi link đặt lại mật khẩu đến email{" "}
              <span className="text-neon-blue">{email}</span>
            </p>

            <p className="text-gray-400 text-sm mb-6">
              Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để đặt lại mật
              khẩu.
            </p>

            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="w-full tech-button py-3 text-lg block text-center"
              >
                🔙 Quay lại đăng nhập
              </Link>

              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full px-6 py-3 glass text-white rounded-xl font-semibold hover:shadow-neon transition-all duration-300"
              >
                Gửi lại email
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen tech-universe-bg flex items-center justify-center px-4">
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
              <span className="text-white font-bold text-2xl">🔑</span>
            </motion.div>
            <h1 className="text-3xl font-bold font-display neon-text mb-2">
              Quên mật khẩu?
            </h1>
            <p className="text-gray-400">
              Đừng lo lắng! Chúng tôi sẽ giúp bạn đặt lại mật khẩu
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="tech-label">Email đăng ký</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={`tech-input ${error ? "border-red-500" : ""}`}
                placeholder="your@email.com"
                disabled={forgotPasswordMutation.isPending}
              />
              {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={forgotPasswordMutation.isPending}
              className="w-full tech-button py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forgotPasswordMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Đang gửi email...</span>
                </div>
              ) : (
                "📧 Gửi link đặt lại"
              )}
            </button>

            {forgotPasswordMutation.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-400 text-sm text-center">
                  {forgotPasswordMutation.error.message}
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
};

export default ForgotPassword;
