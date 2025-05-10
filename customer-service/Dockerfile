# Dùng image nhẹ Node 18 Alpine
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app/customer-service

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Mở cổng 8082
EXPOSE 8081

# Chạy ứng dụng
CMD ["npm", "start"]
