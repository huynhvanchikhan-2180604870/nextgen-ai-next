// API Configuration for Next.js
export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://nextgen-ai-backend-teov.onrender.com/api/v1",
  WS_URL:
    process.env.NEXT_PUBLIC_WS_URL ||
    "https://nextgen-ai-backend-teov.onrender.com",
  TIMEOUT: 30000, // 30 seconds for production
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second delay between retries
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY_OTP: "/auth/verify-otp",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    GOOGLE_LOGIN: "/auth/google",
    GITHUB_LOGIN: "/auth/github",
    PROFILE: "/users/profile",
  },

  // Projects
  PROJECTS: {
    LIST: "/projects",
    DETAIL: "/projects/:id",
    CREATE: "/projects",
    UPDATE: "/projects/:id",
    DELETE: "/projects/:id",
    CATEGORIES: "/projects/categories",
    SEARCH: "/projects/search",
    FEATURED: "/projects/featured",
  },

  // AI Planner
  AI_PLANNER: {
    SESSIONS: "/ai-planner/sessions",
    SESSION_DETAIL: "/ai-planner/sessions/:id",
    GENERATE_PLAN: "/ai-planner/sessions/:id/generate",
    CHAT: "/ai-planner/sessions/:id/chat",
    RECOMMENDATIONS: "/ai-planner/recommendations",
  },

  // Wallet
  WALLET: {
    BALANCE: "/wallet/balance",
    TOP_UP: "/wallet/top-up",
    TRANSACTIONS: "/wallet/transactions",
    PAYMENT_METHODS: "/wallet/payment-methods",
    VNPAY_CALLBACK: "/wallet/vnpay/callback",
    MOMO_CALLBACK: "/wallet/momo/callback",
    PAYPAL_CALLBACK: "/wallet/paypal/callback",
  },

  // User Dashboard
  USER: {
    PROFILE: "/users/profile",
    VAULT: "/users/vault",
    FAVORITES: "/users/favorites",
    STATS: "/users/stats",
  },

  // Utility
  UTILITY: {
    UPLOAD: "/utility/upload",
    SEARCH_SUGGESTIONS: "/utility/search-suggestions",
    STATS: "/utility/stats",
    HEALTH: "/health",
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: "/notifications",
    UNREAD_COUNT: "/notifications/unread-count",
    MARK_READ: "/notifications/:id/read",
    MARK_ALL_READ: "/notifications/mark-all-read",
    DELETE: "/notifications/:id",
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.",
  TIMEOUT_ERROR: "Yêu cầu quá thời gian. Vui lòng thử lại.",
  UNAUTHORIZED: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  FORBIDDEN: "Bạn không có quyền truy cập tài nguyên này.",
  NOT_FOUND: "Không tìm thấy dữ liệu yêu cầu.",
  SERVER_ERROR: "Lỗi máy chủ. Vui lòng thử lại sau.",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
  UNKNOWN_ERROR: "Đã xảy ra lỗi không xác định.",
};
