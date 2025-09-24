"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { formatVND, formatVNDWithUnit } from "../../utils/currency";

export default function Wallet() {
  const [activeTab, setActiveTab] = useState("balance");
  const [topUpAmount, setTopUpAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("vnpay");

  // Mock data
  const balance = 30000000; // 30M VND
  const transactions = [
    {
      id: 1,
      type: "topup",
      amount: 12000000, // 12M VND
      method: "VNPay",
      status: "completed",
      date: "2024-01-15",
      description: "Nạp tiền vào ví",
    },
    {
      id: 2,
      type: "purchase",
      amount: -720000, // 720K VND
      method: "Wallet",
      status: "completed",
      date: "2024-01-14",
      description: "Mua dự án React Dashboard",
    },
    {
      id: 3,
      type: "topup",
      amount: 24000000, // 24M VND
      method: "MoMo",
      status: "completed",
      date: "2024-01-10",
      description: "Nạp tiền vào ví",
    },
  ];

  const paymentMethods = [
    {
      id: "vnpay",
      name: "VNPay",
      icon: "🏦",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "momo",
      name: "MoMo",
      icon: "💜",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: "💙",
      color: "from-blue-400 to-blue-500",
    },
    {
      id: "stripe",
      name: "Stripe",
      icon: "💳",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  const handleTopUp = () => {
    if (!topUpAmount || topUpAmount <= 0) return;
    console.log("Top up:", topUpAmount, selectedPaymentMethod);
  };

  return (
    <div className="min-h-screen tech-universe-bg pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold font-display neon-text mb-6">
            💳 My Wallet
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Quản lý ví tiền và giao dịch của bạn
          </p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="tech-card p-8 mb-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Số dư hiện tại
            </h2>
            <div className="text-6xl font-bold neon-text mb-4">
              {formatVNDWithUnit(balance)}
            </div>
            <p className="text-gray-400">Có thể sử dụng ngay</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex space-x-4 mb-8"
        >
          {[
            { id: "balance", name: "Số dư", icon: "💰" },
            { id: "topup", name: "Nạp tiền", icon: "📈" },
            { id: "transactions", name: "Giao dịch", icon: "📋" },
            { id: "methods", name: "Phương thức", icon: "💳" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg"
                  : "glass text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Balance */}
          {activeTab === "balance" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="tech-card p-6 text-center">
                <div className="text-3xl mb-4">💰</div>
                <div className="text-2xl font-bold neon-text mb-2">
                  {formatVNDWithUnit(balance)}
                </div>
                <div className="text-gray-400">Số dư khả dụng</div>
              </div>
              <div className="tech-card p-6 text-center">
                <div className="text-3xl mb-4">📊</div>
                <div className="text-2xl font-bold neon-text mb-2">
                  {formatVNDWithUnit(58800000)}
                </div>
                <div className="text-gray-400">Tổng nạp</div>
              </div>
              <div className="tech-card p-6 text-center">
                <div className="text-3xl mb-4">🛒</div>
                <div className="text-2xl font-bold neon-text mb-2">
                  {formatVNDWithUnit(28800000)}
                </div>
                <div className="text-gray-400">Tổng chi</div>
              </div>
            </div>
          )}

          {/* Topup */}
          {activeTab === "topup" && (
            <div className="max-w-md mx-auto">
              <div className="tech-card p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">
                  Nạp tiền vào ví
                </h3>

                <div className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="tech-label">Số tiền (VND)</label>
                    <input
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="tech-input"
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                    />
                  </div>

                  {/* Quick Amounts */}
                  <div>
                    <label className="tech-label">Số tiền nhanh</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        100000, 500000, 1000000, 2000000, 5000000, 10000000,
                      ].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setTopUpAmount(amount.toString())}
                          className="px-3 py-2 glass rounded-lg text-white hover:bg-white/10"
                        >
                          {formatVNDWithUnit(amount)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="tech-label">Phương thức thanh toán</label>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className={`w-full p-3 rounded-lg flex items-center space-x-3 transition-all ${
                            selectedPaymentMethod === method.id
                              ? `bg-gradient-to-r ${method.color} text-white`
                              : "glass text-gray-300 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <span className="text-xl">{method.icon}</span>
                          <span className="font-semibold">{method.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleTopUp}
                    disabled={!topUpAmount || topUpAmount <= 0}
                    className="w-full tech-button py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    💳 Nạp{" "}
                    {topUpAmount ? formatVND(parseInt(topUpAmount)) : "0 ₫"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Transactions */}
          {activeTab === "transactions" && (
            <div className="tech-card p-6">
              <h3 className="text-2xl font-bold text-white mb-6">
                Lịch sử giao dịch
              </h3>

              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 glass rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === "topup"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {transaction.type === "topup" ? "📈" : "🛒"}
                      </div>
                      <div>
                        <div className="text-white font-semibold">
                          {transaction.description}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {transaction.method} • {transaction.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold ${
                          transaction.amount > 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {formatVND(Math.abs(transaction.amount))}
                      </div>
                      <div
                        className={`text-sm ${
                          transaction.status === "completed"
                            ? "text-green-400"
                            : "text-yellow-400"
                        }`}
                      >
                        {transaction.status === "completed"
                          ? "✅ Hoàn thành"
                          : "⏳ Đang xử lý"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Methods */}
          {activeTab === "methods" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentMethods.map((method) => (
                <div key={method.id} className="tech-card p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl">{method.icon}</div>
                    <div>
                      <h4 className="text-xl font-bold text-white">
                        {method.name}
                      </h4>
                      <p className="text-gray-400">Phương thức thanh toán</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg font-semibold hover:shadow-neon">
                      Cài đặt
                    </button>
                    <button className="px-4 py-2 glass text-white rounded-lg font-semibold hover:shadow-neon">
                      Quản lý
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
