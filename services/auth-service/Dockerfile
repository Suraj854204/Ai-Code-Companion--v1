FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY services/auth-service/package*.json ./services/auth-service/
RUN npm install
COPY services/auth-service ./services/auth-service
RUN npm run build -w @aicc/database && npm run build -w @aicc/shared && npm run build -w @aicc/auth-service
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/auth-service/dist ./dist
COPY --from=builder /app/services/auth-service/package.json ./package.json
EXPOSE 4001
CMD ["node", "dist/index.js"]
