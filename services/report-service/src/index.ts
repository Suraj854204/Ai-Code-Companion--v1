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
import crypto from "crypto";
import { prisma } from "@aicc/database";

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-code-companion-v1-web-app.vercel.app",
];

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

const getUserFromHeaders = (req: any) => {
  const userId = req.headers["x-user-id"] as string | undefined;
  const userEmail = req.headers["x-user-email"] as string | undefined;

  if (!userId) {
    throw new Error("Unauthorized: x-user-id missing");
  }

  return { userId, userEmail };
};

const getPaths = (tree: any[]) => {
  return tree.map((file: any) => String(file.path || file));
};

app.get("/health", (_req, res) => {
  res.json({
    service: "report-service",
    status: "ok",
  });
});

app.post("/check", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { repo_id, file_tree = [], key_files = {} } = req.body;

    if (!repo_id) {
      return res.status(400).json({
        error: "repo_id is required",
      });
    }

    const filePaths = getPaths(file_tree);
    const allKeyFilesContent = Object.values(key_files).join("\n");

    const checks = [
      {
        name: "package.json has start script",
        passed: String(key_files["package.json"] || "").includes('"start"'),
        points: 15,
        fix: "Add a start script in package.json",
      },
      {
        name: ".env.example exists",
        passed: filePaths.some((path) => path.endsWith(".env.example")),
        points: 10,
        fix: "Create .env.example",
      },
      {
        name: ".env is in .gitignore",
        passed: String(key_files[".gitignore"] || "").includes(".env"),
        points: 15,
        fix: "Add .env to .gitignore",
      },
      {
        name: "PORT uses process.env.PORT",
        passed: allKeyFilesContent.includes("process.env.PORT"),
        points: 15,
        fix: "Use process.env.PORT in server entry",
      },
      {
        name: "CORS is configured",
        passed: allKeyFilesContent.toLowerCase().includes("cors"),
        points: 20,
        fix: "Configure CORS in backend",
      },
      {
        name: "README.md exists",
        passed: filePaths.some((path) =>
          path.toLowerCase().endsWith("readme.md"),
        ),
        points: 10,
        fix: "Add README.md",
      },
      {
        name: "Dockerfile exists",
        passed: filePaths.some(
          (path) => path === "Dockerfile" || path.endsWith("/Dockerfile"),
        ),
        points: 15,
        fix: "Add Dockerfile",
      },
    ];

    const score = checks
      .filter((check) => check.passed)
      .reduce((total, check) => total + check.points, 0);

    const grade = score >= 85 ? "ready" : score >= 55 ? "almost" : "not-ready";

    const envNames = [
      ...new Set(
        [...allKeyFilesContent.matchAll(/process\.env\.(\w+)/g)].map(
          (match) => match[1],
        ),
      ),
    ];

    const envExample = envNames.map((envName) => `${envName}=`).join("\n");
    const shareToken = crypto.randomBytes(8).toString("hex");

    await prisma.report.create({
      data: {
        repoId: repo_id,
        userId,
        deployScore: score,
        checks,
        grade,
        shareToken,
        envExample,
      },
    });

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    res.json({
      score,
      grade,
      checks,
      share_token: shareToken,
      env_example: envExample,
      share_url: `${frontendUrl}/report/${shareToken}`,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/share/:token", async (req, res, next) => {
  try {
    const report = await prisma.report.findUnique({
      where: {
        shareToken: req.params.token,
      },
      include: {
        repo: {
          select: {
            repoName: true,
            repoUrl: true,
            repoFullName: true,
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({
        error: "Report not found",
      });
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("REPORT SERVICE ERROR:", err);

  res.status(500).json({
    error: err.message || "Report service error",
  });
});

app.listen(Number(process.env.REPORT_SERVICE_PORT || 4005), () => {
  console.log("report-service running");
});