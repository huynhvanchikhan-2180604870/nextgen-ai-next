# VND Currency Formatting Guide

## Tổng quan

Toàn bộ ứng dụng NextGen AI đã được cập nhật để sử dụng tiền tệ VND (Việt Nam Đồng) thay vì USD.

## Các thay đổi chính

### 1. Utility Functions (`src/utils/currency.js`)

- `formatVND(amount, showSymbol)` - Format số tiền VND với dấu phân cách hàng nghìn
- `formatVNDWithUnit(amount)` - Format với đơn vị (K, triệu, tỷ)
- `formatSavings(originalPrice, currentPrice)` - Hiển thị số tiền tiết kiệm
- `formatDiscount(originalPrice, currentPrice)` - Hiển thị phần trăm giảm giá
- `parseCurrency(currencyString)` - Parse chuỗi tiền tệ thành số
- `convertUSDToVND(usdAmount, rate)` - Chuyển đổi USD sang VND
- `convertVNDToUSD(vndAmount, rate)` - Chuyển đổi VND sang USD

### 2. PriceDisplay Component (`src/components/ui/PriceDisplay.jsx`)

Component chính để hiển thị giá cả với các tính năng:

- Hiển thị giá chính
- Hiển thị giá gốc (nếu có giảm giá)
- Hiển thị phần trăm giảm giá
- Hiển thị số tiền tiết kiệm
- Nhiều kích thước khác nhau (sm, md, lg, xl, 2xl)

### 3. Các trang đã được cập nhật

#### SpaceProjectCard (`src/components/ui/SpaceProjectCard.jsx`)

- Sử dụng `PriceDisplay` component
- Hiển thị giá VND với format đẹp

#### Explore Page (`src/app/explore/page.jsx`)

- Hiển thị giá dự án trong VND
- Sử dụng `PriceDisplay` component

#### Project Detail Page (`src/app/project/[...id]/page.jsx`)

- Hiển thị giá chi tiết với giảm giá
- Sử dụng `PriceDisplay` component

#### Wallet Page (`src/app/wallet/page.jsx`)

- Số dư hiển thị bằng VND
- Giao dịch hiển thị bằng VND
- Nạp tiền với số tiền VND (100K, 500K, 1M, 2M, 5M, 10M)

#### Vault Page (`src/app/vault/page.jsx`)

- Tổng giá trị dự án bằng VND
- Sử dụng `PriceWithUnit` component

#### Favorites Page (`src/app/favorites/page.jsx`)

- Tổng giá trị yêu thích bằng VND
- Sử dụng `PriceWithUnit` component

## Cách sử dụng

### 1. Import utility functions

```javascript
import { formatVND, formatVNDWithUnit, formatSavings } from "../utils/currency";
```

### 2. Sử dụng PriceDisplay component

```javascript
import PriceDisplay from "../components/ui/PriceDisplay";

<PriceDisplay
  price={project.price}
  originalPrice={project.originalPrice}
  size="lg"
  showSavings={true}
  showDiscount={true}
/>;
```

### 3. Sử dụng PriceWithUnit component

```javascript
import { PriceWithUnit } from "../components/ui/PriceDisplay";

<PriceWithUnit price={totalValue} />;
```

## Ví dụ format

### formatVND

- `formatVND(1000000)` → "1.000.000 ₫"
- `formatVND(25000000)` → "25.000.000 ₫"

### formatVNDWithUnit

- `formatVNDWithUnit(1000000)` → "1.0 triệu ₫"
- `formatVNDWithUnit(1000000000)` → "1.0 tỷ ₫"
- `formatVNDWithUnit(500000)` → "500.0K ₫"

### formatSavings

- `formatSavings(50000000, 40000000)` → "Tiết kiệm 10.000.000 ₫"

### formatDiscount

- `formatDiscount(50000000, 40000000)` → "-20%"

## Lưu ý

- Tất cả giá cả trong database đã được chuyển đổi sang VND
- Tỷ giá mặc định: 1 USD = 24,000 VND
- Sử dụng dấu phân cách hàng nghìn theo chuẩn Việt Nam
- Ký hiệu tiền tệ: ₫ (dong symbol)
