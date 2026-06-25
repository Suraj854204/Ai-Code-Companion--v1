FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY services/github-service/package*.json ./services/github-service/
RUN npm install
COPY services/github-service ./services/github-service
RUN npm run build -w @aicc/database && npm run build -w @aicc/shared && npm run build -w @aicc/github-service
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/github-service/dist ./dist
COPY --from=builder /app/services/github-service/package.json ./package.json
EXPOSE 4002
CMD ["node", "dist/index.js"]
