"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useVerifyOTP } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function VerifyOTPForm() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const verifyOTPMutation = useVerifyOTP();
  const router = useRouter();
  const searchParams = useSearchParams();

  // lấy email từ query string (?email=xxx)
  const email = searchParams.get("email") || "";

  // Kiểm tra email có tồn tại không
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="card-info-glass p-8 rounded-2xl shadow-2xl border border-white/20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-red-500/20 shadow-lg">
              <span className="text-red-400 text-2xl font-extrabold">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Email không hợp lệ
            </h1>
            <p className="text-gray-400 mb-6">
              Không tìm thấy email trong URL. Vui lòng đăng ký lại.
            </p>
            <Link
              href="/auth/register"
              className="px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-300"
            >
              Đăng ký lại
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    if (error) setError("");
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Cho phép paste toàn bộ OTP
  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      setOtp(pasteData.split(""));
      document.getElementById("otp-5")?.focus();
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    try {
      const result = await verifyOTPMutation.mutateAsync({
        email,
        otp: otpString,
      });
      if (result.success) {
        setTimeout(() => router.replace("/"), 500);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
    }
  };

  const handleResendOTP = () => {
    // TODO: Gửi lại OTP
    console.log("Resend OTP");
  };

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
            <h1 className="text-3xl font-bold text-white mb-2">Xác thực OTP</h1>
            <p className="text-gray-400">
              Nhập mã OTP đã gửi đến email của bạn
            </p>
            {email && <p className="text-neon-blue text-sm mt-2">{email}</p>}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 text-center">
                Mã xác thực (6 số)
              </label>
              <div
                className="flex justify-center space-x-3 mt-4"
                onPaste={handlePaste}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-2xl font-bold rounded-lg bg-black/40 text-white border border-white/20 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue focus:ring-opacity-50 transition-all"
                    disabled={verifyOTPMutation.isPending}
                    maxLength={1}
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
              )}
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={
                verifyOTPMutation.isPending || otp.join("").length !== 6
              }
              className="w-full py-3 rounded-lg font-semibold text-lg text-black bg-gradient-to-r from-neon-blue to-neon-purple shadow-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyOTPMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <LoadingSpinner size="sm" color="white" />
                  <span>Đang xác thực...</span>
                </div>
              ) : (
                "🔐 Xác thực"
              )}
            </motion.button>

            {/* Error */}
            {verifyOTPMutation.error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg"
              >
                <p className="text-red-400 text-sm text-center">
                  {verifyOTPMutation.error.message}
                </p>
              </motion.div>
            )}
          </form>

          {/* Resend */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Không nhận được mã?{" "}
              <button
                onClick={handleResendOTP}
                className="text-neon-blue hover:text-neon-purple font-semibold"
              >
                Gửi lại
              </button>
            </p>
          </div>

          {/* Back to Login */}
          <div className="text-center mt-4">
            <Link
              href="/auth/login"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyOTP() {
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
      <VerifyOTPForm />
    </Suspense>
  );
}
