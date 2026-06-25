FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY services/api-gateway/package*.json ./services/api-gateway/
RUN npm install
COPY services/api-gateway ./services/api-gateway
RUN npm run build -w @aicc/database && npm run build -w @aicc/shared && npm run build -w @aicc/api-gateway
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/api-gateway/dist ./dist
COPY --from=builder /app/services/api-gateway/package.json ./package.json
EXPOSE 4000
CMD ["node", "dist/index.js"]
