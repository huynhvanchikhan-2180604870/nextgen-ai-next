"use client";

import {
  formatDiscount,
  formatSavings,
  formatVND,
  formatVNDWithUnit,
} from "../../utils/currency";

/**
 * Component to display price in VND format
 */
const PriceDisplay = ({
  price,
  originalPrice,
  showSavings = true,
  showDiscount = true,
  size = "lg",
  className = "",
}) => {
  if (!price && price !== 0) {
    return <span className="text-gray-400">Liên hệ</span>;
  }

  const hasDiscount = originalPrice && originalPrice > price;
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
    "2xl": "text-4xl",
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Main Price */}
      <div className="flex items-center gap-2">
        <span className={`font-bold text-neon-green ${sizeClasses[size]}`}>
          {formatVND(price)}
        </span>
        {hasDiscount && showDiscount && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {formatDiscount(originalPrice, price)}
          </span>
        )}
      </div>

      {/* Original Price */}
      {hasDiscount && (
        <div className="text-gray-500 line-through text-sm">
          {formatVND(originalPrice)}
        </div>
      )}

      {/* Savings */}
      {hasDiscount && showSavings && (
        <div className="text-green-400 text-sm">
          {formatSavings(originalPrice, price)}
        </div>
      )}
    </div>
  );
};

/**
 * Component to display price with unit (e.g., 30M ₫)
 */
export const PriceWithUnit = ({ price, className = "" }) => {
  if (!price && price !== 0) {
    return <span className="text-gray-400">Liên hệ</span>;
  }

  return (
    <span className={`font-bold text-neon-green ${className}`}>
      {formatVNDWithUnit(price)}
    </span>
  );
};

/**
 * Component to display price range
 */
export const PriceRange = ({ minPrice, maxPrice, className = "" }) => {
  if (!minPrice && !maxPrice) {
    return <span className="text-gray-400">Liên hệ</span>;
  }

  if (minPrice === maxPrice) {
    return <PriceWithUnit price={minPrice} className={className} />;
  }

  return (
    <span className={`font-bold text-neon-green ${className}`}>
      {formatVND(minPrice)} - {formatVND(maxPrice)}
    </span>
  );
};

export default PriceDisplay;
