# Dùng image nhẹ Node 18 Alpine
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app/gateway

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Mở cổng 8082
EXPOSE 8083

# Chạy ứng dụng
CMD ["npm", "start"]
