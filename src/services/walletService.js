import { API_ENDPOINTS } from "../config/api.js";
import { api } from "./apiClient.js";

// Wallet Service
export const walletService = {
  // Get wallet balance
  async getBalance() {
    try {
      const response = await api.get(API_ENDPOINTS.WALLET.BALANCE);
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy số dư ví thất bại");
    }
  },

  // Top up wallet
  async topUp(amount, paymentMethod, paymentData = {}) {
    try {
      const response = await api.post(API_ENDPOINTS.WALLET.TOP_UP, {
        amount,
        paymentMethod,
        ...paymentData,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Nạp tiền vào ví thất bại");
    }
  },

  // Get transaction history
  async getTransactions(page = 1, limit = 10, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      // Add filters
      if (filters.type) queryParams.append("type", filters.type);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);

      const url = `${
        API_ENDPOINTS.WALLET.TRANSACTIONS
      }?${queryParams.toString()}`;
      const response = await api.get(url);
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy lịch sử giao dịch thất bại");
    }
  },

  // Get payment methods
  async getPaymentMethods() {
    try {
      const response = await api.get(API_ENDPOINTS.WALLET.PAYMENT_METHODS);
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy phương thức thanh toán thất bại");
    }
  },

  // Add payment method
  async addPaymentMethod(paymentMethodData) {
    try {
      const response = await api.post(
        API_ENDPOINTS.WALLET.PAYMENT_METHODS,
        paymentMethodData
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Thêm phương thức thanh toán thất bại");
    }
  },

  // Update payment method
  async updatePaymentMethod(methodId, updateData) {
    try {
      const response = await api.put(
        `${API_ENDPOINTS.WALLET.PAYMENT_METHODS}/${methodId}`,
        updateData
      );
      return response;
    } catch (error) {
      throw new Error(
        error.message || "Cập nhật phương thức thanh toán thất bại"
      );
    }
  },

  // Delete payment method
  async deletePaymentMethod(methodId) {
    try {
      const response = await api.delete(
        `${API_ENDPOINTS.WALLET.PAYMENT_METHODS}/${methodId}`
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Xóa phương thức thanh toán thất bại");
    }
  },

  // Create VNPay payment
  async createVNPayPayment(amount, orderInfo) {
    try {
      const response = await api.post("/wallet/vnpay/create", {
        amount,
        orderInfo,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Tạo thanh toán VNPay thất bại");
    }
  },

  // Create MoMo payment
  async createMoMoPayment(amount, orderInfo) {
    try {
      const response = await api.post("/wallet/momo/create", {
        amount,
        orderInfo,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Tạo thanh toán MoMo thất bại");
    }
  },

  // Create PayPal payment
  async createPayPalPayment(amount, orderInfo) {
    try {
      const response = await api.post("/wallet/paypal/create", {
        amount,
        orderInfo,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Tạo thanh toán PayPal thất bại");
    }
  },

  // Create Stripe payment
  async createStripePayment(amount, orderInfo) {
    try {
      const response = await api.post("/wallet/stripe/create", {
        amount,
        orderInfo,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Tạo thanh toán Stripe thất bại");
    }
  },

  // Verify payment callback
  async verifyPaymentCallback(paymentMethod, callbackData) {
    try {
      const endpoint =
        paymentMethod === "vnpay"
          ? API_ENDPOINTS.WALLET.VNPAY_CALLBACK
          : paymentMethod === "momo"
          ? API_ENDPOINTS.WALLET.MOMO_CALLBACK
          : API_ENDPOINTS.WALLET.PAYPAL_CALLBACK;

      const response = await api.post(endpoint, callbackData);
      return response;
    } catch (error) {
      throw new Error(error.message || "Xác thực thanh toán thất bại");
    }
  },

  // Request refund
  async requestRefund(transactionId, reason) {
    try {
      const response = await api.post("/wallet/refund", {
        transactionId,
        reason,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Yêu cầu hoàn tiền thất bại");
    }
  },

  // Get refund status
  async getRefundStatus(refundId) {
    try {
      const response = await api.get(`/wallet/refund/${refundId}`);
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy trạng thái hoàn tiền thất bại");
    }
  },

  // Get wallet statistics
  async getWalletStats(period = "month") {
    try {
      const response = await api.get(`/wallet/stats?period=${period}`);
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy thống kê ví thất bại");
    }
  },

  // Transfer to another user
  async transferToUser(userId, amount, note) {
    try {
      const response = await api.post("/wallet/transfer", {
        userId,
        amount,
        note,
      });
      return response;
    } catch (error) {
      throw new Error(error.message || "Chuyển tiền thất bại");
    }
  },

  // Get transfer history
  async getTransferHistory(page = 1, limit = 10) {
    try {
      const response = await api.get(
        `/wallet/transfers?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      throw new Error(error.message || "Lấy lịch sử chuyển tiền thất bại");
    }
  },
};
