# 🚀 Dự án mẫu NextGen AI

## 📋 Tổng quan

Bộ dữ liệu dự án mẫu với 10 dự án đa dạng, sử dụng tiếng Việt và tiền tệ VND, phù hợp với thị trường Việt Nam.

## 📁 Files

- `sample-projects.json` - Dữ liệu JSON của tất cả dự án
- `Postman-Collection.json` - Collection Postman để test API
- `add-projects.js` - Script Node.js để tự động thêm dự án
- `SAMPLE-PROJECTS-README.md` - File hướng dẫn này

## 🎯 Danh sách dự án

### 1. Hệ thống quản lý nhà hàng thông minh

- **Giá**: 45,000,000 VND
- **Thời gian**: 3-4 tháng
- **Công nghệ**: React, Node.js, MongoDB, AI/ML
- **Tính năng**: Đặt bàn, thanh toán QR, phân tích doanh thu AI

### 2. Ứng dụng học tiếng Anh với AI

- **Giá**: 35,000,000 VND
- **Thời gian**: 4-5 tháng
- **Công nghệ**: React Native, Python, TensorFlow
- **Tính năng**: Nhận diện giọng nói, chatbot giao tiếp

### 3. Website bán hàng thời trang

- **Giá**: 25,000,000 VND
- **Thời gian**: 2-3 tháng
- **Công nghệ**: Next.js, Node.js, PostgreSQL
- **Tính năng**: AR thử đồ, AI gợi ý phong cách

### 4. App giao đồ ăn nhanh

- **Giá**: 40,000,000 VND
- **Thời gian**: 3-4 tháng
- **Công nghệ**: React Native, Node.js, MongoDB
- **Tính năng**: AI tối ưu tuyến đường, theo dõi real-time

### 5. Hệ thống quản lý bệnh viện

- **Giá**: 60,000,000 VND
- **Thời gian**: 6-8 tháng
- **Công nghệ**: Vue.js, Python, PostgreSQL
- **Tính năng**: AI chẩn đoán hỗ trợ, quản lý bệnh án

### 6. Game mobile RPG Việt Nam

- **Giá**: 80,000,000 VND
- **Thời gian**: 8-12 tháng
- **Công nghệ**: Unity, C#, Photon
- **Tính năng**: Đồ họa 3D, bối cảnh lịch sử VN

### 7. Website tin tức AI

- **Giá**: 30,000,000 VND
- **Thời gian**: 3-4 tháng
- **Công nghệ**: Next.js, Python, MongoDB
- **Tính năng**: AI tổng hợp tin tức, cá nhân hóa

### 8. App quản lý tài chính cá nhân

- **Giá**: 20,000,000 VND
- **Thời gian**: 2-3 tháng
- **Công nghệ**: React Native, Node.js, PostgreSQL
- **Tính năng**: AI phân tích chi tiêu, gợi ý tiết kiệm

### 9. Hệ thống IoT nông nghiệp thông minh

- **Giá**: 70,000,000 VND
- **Thời gian**: 6-8 tháng
- **Công nghệ**: Python, Arduino, React
- **Tính năng**: Cảm biến IoT, AI dự đoán thời tiết

### 10. Website du lịch Việt Nam

- **Giá**: 35,000,000 VND
- **Thời gian**: 4-5 tháng
- **Công nghệ**: Next.js, Node.js, MongoDB
- **Tính năng**: AI gợi ý tour, VR 360 độ

## 🛠️ Cách sử dụng

### Phương pháp 1: Sử dụng Postman

1. Import file `Postman-Collection.json` vào Postman
2. Cập nhật biến `baseUrl` và `accessToken`
3. Chạy từng request để thêm dự án

### Phương pháp 2: Sử dụng Script Node.js

1. Cài đặt dependencies:
   ```bash
   npm install axios
   ```
2. Cập nhật `ACCESS_TOKEN` trong file `add-projects.js`
3. Chạy script:
   ```bash
   node add-projects.js
   ```

### Phương pháp 3: Sử dụng cURL

```bash
curl -X POST http://3.85.2.223/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @sample-projects.json
```

## 📊 Thống kê dự án

- **Tổng số dự án**: 10
- **Giá trung bình**: 42,500,000 VND
- **Thời gian trung bình**: 4.5 tháng
- **Công nghệ phổ biến**: AI/ML, React, Node.js
- **Phân loại**: Web (4), Mobile (3), AI (3)

## 🏷️ Categories được sử dụng

- **Web** (68d343821a3c33bab2329c10): 4 dự án
- **AI** (68d343681a3c33bab2329c0a): 3 dự án
- **Mobile** (68d343771a3c33bab2329c0d): 3 dự án

## 💡 Lưu ý

- Tất cả giá đều tính bằng VND
- Mô tả và tính năng đều bằng tiếng Việt
- Phù hợp với thị trường Việt Nam
- Bao gồm các công nghệ hiện đại: AI, IoT, AR/VR
- Đa dạng về độ phức tạp: từ intermediate đến expert
