declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import axios from "axios";

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "8mb" }));
app.use(morgan("dev"));

const getUserFromHeaders = (req: any) => {
  const userId = req.headers["x-user-id"] as string | undefined;
  const userEmail = req.headers["x-user-email"] as string | undefined;

  if (!userId) {
    throw new Error("Unauthorized: x-user-id missing");
  }

  return { userId, userEmail };
};

app.get("/health", (_req, res) => {
  res.json({
    service: "scanner-service",
    status: "ok",
  });
});

app.post("/repo", async (req: any, res, next) => {
  try {
    const { userId, userEmail } = getUserFromHeaders(req);

    const headers = {
      "x-user-id": userId,
      "x-user-email": userEmail || "",
    };

    const githubUrl = process.env.GITHUB_SERVICE_URL || "http://localhost:4002";

    const aiUrl = process.env.AI_SERVICE_URL || "http://localhost:4003";

    const scan = await axios.post(`${githubUrl}/scan`, req.body, { headers });

    const classified = await axios.post(
      `${aiUrl}/classify`,
      {
        file_tree: scan.data.file_tree,
        key_files: scan.data.key_files,
        repo_id: scan.data.repo_id,
      },
      { headers },
    );

    res.json({
      ...scan.data,
      tech_stack: classified.data,
    });
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("SCANNER SERVICE ERROR:", err.response?.data || err.message);

  res.status(err.response?.status || 500).json({
    error: err.response?.data?.error || err.message || "Scanner service error",
  });
});

app.listen(Number(process.env.SCANNER_SERVICE_PORT || 4004), () => {
  console.log("scanner-service running");
});
