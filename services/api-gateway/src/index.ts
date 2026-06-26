import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { createProxyMiddleware } from "http-proxy-middleware";
import { serviceUrls } from "@aicc/shared";

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-code-companion-v1-web-app.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(helmet());
app.use(morgan("dev"));

console.log("Allowed CORS origins:", allowedOrigins);
console.log("Auth service:", serviceUrls.auth);

app.get("/health", (_req, res) => {
  res.json({
    service: "api-gateway",
    status: "ok",
  });
});

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
  }),
);

const addUserHeaders = (proxyReq: any, req: any, res: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing or invalid Authorization header" }));
    return proxyReq.destroy();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
    const userId = decoded.id || decoded.userId || decoded.sub;

    if (!userId) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Token valid but missing user id" }));
      return proxyReq.destroy();
    }

    proxyReq.setHeader("x-user-id", String(userId).trim());
    proxyReq.setHeader("x-user-email", String(decoded.email || "").trim());
  } catch {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid or expired token" }));
    return proxyReq.destroy();
  }
};

const proxyErrorHandler = (err: any, req: any, res: any) => {
  console.error("API GATEWAY PROXY ERROR:", {
    message: err?.message,
    code: err?.code,
    target: req?.url,
    stack: err?.stack,
  });

  if (!res.headersSent) {
    res.status(502).json({
      error: "Service unavailable",
      detail: err.message,
    });
  }
};

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: serviceUrls.auth,
    changeOrigin: true,
    pathRewrite: { "^/api/auth": "" },
    proxyTimeout: 30000,
    timeout: 30000,
    on: {
      error: proxyErrorHandler,
    },
  }),
);

app.use(
  "/api/repos",
  createProxyMiddleware({
    target: serviceUrls.github,
    changeOrigin: true,
    pathRewrite: { "^/api/repos": "" },
    proxyTimeout: 120000,
    timeout: 120000,
    on: {
      proxyReq: addUserHeaders,
      error: proxyErrorHandler,
    },
  }),
);

app.use(
  "/api/ai",
  createProxyMiddleware({
    target: serviceUrls.ai,
    changeOrigin: true,
    pathRewrite: { "^/api/ai": "" },
    proxyTimeout: 180000,
    timeout: 180000,
    on: {
      proxyReq: addUserHeaders,
      error: proxyErrorHandler,
    },
  }),
);

app.use(
  "/api/scan",
  createProxyMiddleware({
    target: serviceUrls.scanner,
    changeOrigin: true,
    pathRewrite: { "^/api/scan": "" },
    proxyTimeout: 180000,
    timeout: 180000,
    on: {
      proxyReq: addUserHeaders,
      error: proxyErrorHandler,
    },
  }),
);

app.use(
  "/api/report",
  createProxyMiddleware({
    target: serviceUrls.report,
    changeOrigin: true,
    pathRewrite: { "^/api/report": "" },
    proxyTimeout: 60000,
    timeout: 60000,
    on: {
      proxyReq: addUserHeaders,
      error: proxyErrorHandler,
    },
  }),
);

app.use(
  "/api/notify",
  createProxyMiddleware({
    target: serviceUrls.notification,
    changeOrigin: true,
    pathRewrite: { "^/api/notify": "" },
    proxyTimeout: 60000,
    timeout: 60000,
    on: {
      proxyReq: addUserHeaders,
      error: proxyErrorHandler,
    },
  }),
);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = Number(process.env.API_GATEWAY_PORT || process.env.PORT || 4000);

app.listen(PORT, () => {
  console.log(`api-gateway running on ${PORT}`);
});