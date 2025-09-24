# WebSocket Debug Guide

## Tổng quan

Hệ thống WebSocket đã được cải thiện với các tính năng debug và fallback để xử lý các vấn đề kết nối với backend Render.

## Các thành phần chính

### 1. WebSocketDebugger Component

- **Vị trí**: `src/components/debug/WebSocketDebugger.jsx`
- **Chức năng**: Hiển thị trạng thái kết nối WebSocket và cho phép test kết nối
- **Tính năng**:
  - Hiển thị trạng thái kết nối real-time
  - Test kết nối WebSocket
  - Hiển thị thông tin debug
  - Chỉ hiển thị khi có lỗi hoặc disconnected

### 2. ConnectionStatus Component

- **Vị trí**: `src/components/ui/ConnectionStatus.jsx`
- **Chức năng**: Hiển thị trạng thái kết nối cho người dùng
- **Tính năng**:
  - Hiển thị trạng thái kết nối
  - Thông báo lỗi
  - Tự động ẩn khi kết nối thành công

### 3. WebSocket Test Utility

- **Vị trí**: `src/utils/websocketTest.js`
- **Chức năng**: Test kết nối WebSocket trước khi sử dụng
- **Tính năng**:
  - Test kết nối với timeout
  - Kiểm tra hỗ trợ WebSocket
  - Đưa ra khuyến nghị kết nối

### 4. Fallback Service

- **Vị trí**: `src/services/fallbackService.js`
- **Chức năng**: Cung cấp chức năng thay thế khi WebSocket không khả dụng
- **Tính năng**:
  - Mô phỏng các chức năng WebSocket
  - Xử lý AI chat
  - Thông báo hệ thống

## Cách sử dụng

### 1. Kiểm tra trạng thái kết nối

```javascript
import { useWebSocket } from "../hooks/useWebSocket.js";

const { connectionStatus, error, socketId } = useWebSocket();
```

### 2. Test kết nối WebSocket

```javascript
import { testWebSocketConnection } from "../utils/websocketTest.js";

const result = await testWebSocketConnection();
console.log(result);
```

### 3. Sử dụng WebSocket Service

```javascript
import websocketService from "../services/websocketService.js";

// Kết nối
websocketService.connect(token);

// Gửi tin nhắn AI
websocketService.sendAIMessage(sessionId, message);

// Tham gia session AI
websocketService.joinAISession(sessionId);
```

## Cấu hình WebSocket

### API Configuration

```javascript
// src/config/api.js
export const API_CONFIG = {
  WS_URL: "https://nextgen-ai-backend-teov.onrender.com",
  WS_CONFIG: {
    transports: ["polling", "websocket"],
    timeout: 10000,
    forceNew: true,
    autoConnect: false,
  },
};
```

### Environment Variables

```bash
NEXT_PUBLIC_API_URL=https://nextgen-ai-backend-teov.onrender.com/api/v1
NEXT_PUBLIC_WS_URL=https://nextgen-ai-backend-teov.onrender.com
```

## Xử lý lỗi

### 1. WebSocket Connection Failed

- Hệ thống tự động chuyển sang Fallback Service
- Hiển thị thông báo cho người dùng
- Các chức năng AI vẫn hoạt động (mô phỏng)

### 2. Connection Timeout

- Test kết nối với timeout 5 giây
- Tự động fallback nếu timeout
- Retry mechanism với delay

### 3. Render Platform Issues

- Sử dụng polling transport trước websocket
- Disable autoConnect để kiểm soát kết nối
- Fallback service cho các chức năng quan trọng

## Debug Tools

### 1. WebSocketDebugger

- Hiển thị ở góc dưới bên trái
- Test button để kiểm tra kết nối
- Hiển thị thông tin chi tiết

### 2. Console Logs

- Tất cả hoạt động WebSocket được log
- Error handling chi tiết
- Fallback service notifications

### 3. Connection Status

- Real-time status updates
- Error messages
- Socket ID tracking

## Troubleshooting

### 1. WebSocket không kết nối được

- Kiểm tra URL backend
- Kiểm tra CORS settings
- Sử dụng Fallback Service

### 2. Lỗi Render Platform

- Sử dụng polling transport
- Kiểm tra timeout settings
- Test connection trước khi sử dụng

### 3. AI Chat không hoạt động

- Kiểm tra WebSocket connection
- Sử dụng Fallback Service
- Kiểm tra authentication token

## Best Practices

1. **Luôn test kết nối trước khi sử dụng**
2. **Sử dụng Fallback Service khi cần thiết**
3. **Hiển thị trạng thái kết nối cho người dùng**
4. **Log tất cả hoạt động để debug**
5. **Xử lý lỗi gracefully**

## Monitoring

- Connection status tracking
- Error rate monitoring
- Fallback usage statistics
- Performance metrics

## Kết luận

Hệ thống WebSocket đã được cải thiện với:

- ✅ Robust error handling
- ✅ Fallback mechanism
- ✅ Debug tools
- ✅ User feedback
- ✅ Performance optimization

Người dùng sẽ có trải nghiệm mượt mà ngay cả khi WebSocket không khả dụng.
