FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY services/scanner-service/package*.json ./services/scanner-service/
RUN npm install
COPY services/scanner-service ./services/scanner-service
RUN npm run build -w @aicc/database && npm run build -w @aicc/shared && npm run build -w @aicc/scanner-service
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/scanner-service/dist ./dist
COPY --from=builder /app/services/scanner-service/package.json ./package.json
EXPOSE 4004
CMD ["node", "dist/index.js"]
