FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY services/ai-service/package*.json ./services/ai-service/
RUN npm install
COPY services/ai-service ./services/ai-service
RUN npm run build -w @aicc/database && npm run build -w @aicc/shared && npm run build -w @aicc/ai-service
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/ai-service/dist ./dist
COPY --from=builder /app/services/ai-service/package.json ./package.json
EXPOSE 4003
CMD ["node", "dist/index.js"]
