/**
 * Utility functions for currency formatting
 */

/**
 * Format number to Vietnamese currency (VND)
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show currency symbol
 * @returns {string} Formatted currency string
 */
export const formatVND = (amount, showSymbol = true) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "0 ₫";
  }

  // Format with thousands separator
  const formatted = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return showSymbol ? `${formatted} ₫` : formatted;
};

/**
 * Format number to Vietnamese currency with unit
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with unit
 */
export const formatVNDWithUnit = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "0 ₫";
  }

  if (amount >= 1000000000) {
    return `${(amount / 1000000000).toFixed(1)} tỷ ₫`;
  } else if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)} triệu ₫`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K ₫`;
  } else {
    return formatVND(amount);
  }
};

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;

  // Remove all non-numeric characters except decimal point
  const cleaned = currencyString.replace(/[^\d.,]/g, "");

  // Handle Vietnamese number format (comma as thousand separator)
  const normalized = cleaned.replace(/\./g, "").replace(",", ".");

  return parseFloat(normalized) || 0;
};

/**
 * Convert USD to VND (approximate rate)
 * @param {number} usdAmount - USD amount
 * @param {number} rate - Exchange rate (default: 24,000 VND/USD)
 * @returns {number} VND amount
 */
export const convertUSDToVND = (usdAmount, rate = 24000) => {
  return Math.round(usdAmount * rate);
};

/**
 * Convert VND to USD (approximate rate)
 * @param {number} vndAmount - VND amount
 * @param {number} rate - Exchange rate (default: 24,000 VND/USD)
 * @returns {number} USD amount
 */
export const convertVNDToUSD = (vndAmount, rate = 24000) => {
  return Math.round((vndAmount / rate) * 100) / 100;
};

/**
 * Get currency symbol
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = () => "₫";

/**
 * Get currency code
 * @returns {string} Currency code
 */
export const getCurrencyCode = () => "VND";

/**
 * Format price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice) => {
  if (minPrice === maxPrice) {
    return formatVND(minPrice);
  }
  return `${formatVND(minPrice)} - ${formatVND(maxPrice)}`;
};

/**
 * Format discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current price
 * @returns {string} Formatted discount percentage
 */
export const formatDiscount = (originalPrice, currentPrice) => {
  if (originalPrice <= currentPrice) return "0%";

  const discount = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100
  );
  return `-${discount}%`;
};

/**
 * Format savings amount
 * @param {number} originalPrice - Original price
 * @param {number} currentPrice - Current price
 * @returns {string} Formatted savings
 */
export const formatSavings = (originalPrice, currentPrice) => {
  const savings = originalPrice - currentPrice;
  return savings > 0 ? `Tiết kiệm ${formatVND(savings)}` : "";
};
