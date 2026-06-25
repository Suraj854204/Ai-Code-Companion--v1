FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages ./packages
COPY services/report-service/package*.json ./services/report-service/
RUN npm install
COPY services/report-service ./services/report-service
RUN npm run build -w @aicc/database && npm run build -w @aicc/shared && npm run build -w @aicc/report-service
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/report-service/dist ./dist
COPY --from=builder /app/services/report-service/package.json ./package.json
EXPOSE 4005
CMD ["node", "dist/index.js"]
