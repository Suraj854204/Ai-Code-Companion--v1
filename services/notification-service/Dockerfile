FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY services/notification-service/package*.json ./services/notification-service/
RUN npm install
COPY services/notification-service ./services/notification-service
RUN npm run build -w @aicc/database && npm run build -w @aicc/shared && npm run build -w @aicc/notification-service
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/notification-service/dist ./dist
COPY --from=builder /app/services/notification-service/package.json ./package.json
EXPOSE 4006
CMD ["node", "dist/index.js"]
