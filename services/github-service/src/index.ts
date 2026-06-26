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
import { Octokit } from "@octokit/rest";
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
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-user-email"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

const getUserFromHeaders = (req: any) => {
  const userId = req.headers["x-user-id"] as string | undefined;
  const userEmail = req.headers["x-user-email"] as string | undefined;

  if (!userId) {
    throw new Error("Unauthorized: x-user-id missing from api-gateway");
  }

  return { userId, userEmail };
};

const key = () => {
  const raw = process.env.ENCRYPT_KEY || "dev-key";
  return Buffer.from(raw.padEnd(32, "0").slice(0, 32));
};

const decrypt = (data: string) => {
  const [ivHex, tagHex, encHex] = data.split(":");

  if (!ivHex || !tagHex || !encHex) {
    throw new Error("Invalid encrypted token format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const enc = Buffer.from(encHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(enc), decipher.final()]).toString(
    "utf8",
  );
};

async function getOctokit(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.githubToken) {
    throw new Error("GitHub token not connected. Save GitHub PAT again.");
  }

  const githubToken = decrypt(user.githubToken);

  return new Octokit({
    auth: githubToken,
  });
}

app.get("/health", (_req, res) => {
  res.json({
    service: "github-service",
    status: "ok",
  });
});

app.get("/github", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const octokit = await getOctokit(userId);

    const { data } = await octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 100,
    });

    res.json(
      data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        private: repo.private,
        updated_at: repo.updated_at,
        url: repo.html_url,
        owner: repo.owner.login,
      })),
    );
  } catch (error) {
    next(error);
  }
});

app.post("/scan", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { owner, repo } = req.body;

    if (!owner || !repo) {
      return res.status(400).json({
        error: "owner and repo are required",
      });
    }

    const octokit = await getOctokit(userId);

    const tree = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: "HEAD",
      recursive: "1",
    });

    const skip = [
      "node_modules/",
      ".git/",
      "dist/",
      "build/",
      ".next/",
      "coverage/",
      ".vite/",
    ];

    const files = (tree.data.tree || [])
      .filter(
        (file: any) =>
          file.type === "blob" &&
          file.path &&
          !skip.some((item) => file.path.includes(item)),
      )
      .slice(0, 300)
      .map((file: any) => ({
        path: file.path,
        size: file.size,
        sha: file.sha,
      }));

    const wanted = [
      "package.json",
      "requirements.txt",
      ".env.example",
      "README.md",
      "docker-compose.yml",
      "Dockerfile",
      ".gitignore",
    ];

    const keyFiles: Record<string, string> = {};

    for (const name of wanted) {
      const found = files.find(
        (file: any) => file.path === name || file.path.endsWith("/" + name),
      );

      if (!found) continue;

      try {
        const content: any = await octokit.repos.getContent({
          owner,
          repo,
          path: found.path,
        });

        if (!Array.isArray(content.data) && content.data.content) {
          keyFiles[name] = Buffer.from(content.data.content, "base64")
            .toString("utf8")
            .slice(0, 3000);
        }
      } catch {
        // ignore unreadable key file
      }
    }

    const savedRepo = await prisma.repo.upsert({
      where: {
        userId_repoFullName: {
          userId,
          repoFullName: `${owner}/${repo}`,
        },
      },
      update: {
        repoName: repo,
        repoUrl: `https://github.com/${owner}/${repo}`,
        owner,
        fileTree: files,
        keyFiles,
        lastScanned: new Date(),
      },
      create: {
        userId,
        repoName: repo,
        repoFullName: `${owner}/${repo}`,
        repoUrl: `https://github.com/${owner}/${repo}`,
        owner,
        fileTree: files,
        keyFiles,
        lastScanned: new Date(),
      },
    });

    res.json({
      repo_id: savedRepo.id,
      file_tree: files,
      key_files: keyFiles,
      total_files: files.length,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/branch", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { owner, repo } = req.body;

    if (!owner || !repo) {
      return res.status(400).json({
        error: "owner and repo are required",
      });
    }

    const octokit = await getOctokit(userId);

    const repoData = await octokit.repos.get({ owner, repo });
    const defaultBranch = repoData.data.default_branch;

    const baseRef = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${defaultBranch}`,
    });

    const branch = `ai-fix-${Date.now()}`;

    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: baseRef.data.object.sha,
    });

    res.json({
      branch,
      base_branch: defaultBranch,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/commit-file", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { owner, repo, branch, path, content, message } = req.body;

    if (!owner || !repo || !branch || !path || content === undefined) {
      return res.status(400).json({
        error: "owner, repo, branch, path, content required",
      });
    }

    const octokit = await getOctokit(userId);

    let sha: string | undefined;

    try {
      const file: any = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });

      if (!Array.isArray(file.data)) {
        sha = file.data.sha;
      }
    } catch (err: any) {
      if (err.status !== 404) {
        throw err;
      }
    }

    const result = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      branch,
      ...(sha ? { sha } : {}),
      message: message || `AI Fix: update ${path}`,
      content: Buffer.from(content, "utf8").toString("base64"),
    });

    res.json({
      branch,
      path,
      commit_url: result.data.commit.html_url,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/pull-request", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { owner, repo, branch, title, body } = req.body;

    if (!owner || !repo || !branch) {
      return res.status(400).json({
        error: "owner, repo and branch are required",
      });
    }

    const octokit = await getOctokit(userId);

    const repoData = await octokit.repos.get({ owner, repo });
    const base = repoData.data.default_branch;

    const pr = await octokit.pulls.create({
      owner,
      repo,
      head: branch,
      base,
      title: title || "AI Fix: apply generated fix",
      body: body || "Generated by AI Code Companion.",
    });

    res.json({
      pr_url: pr.data.html_url,
      pr_number: pr.data.number,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/pr-files", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { owner, repo, pull_number } = req.query;

    if (!owner || !repo || !pull_number) {
      return res.status(400).json({
        error: "owner, repo and pull_number required",
      });
    }

    const octokit = await getOctokit(userId);

    const { data } = await octokit.pulls.listFiles({
      owner: String(owner),
      repo: String(repo),
      pull_number: Number(pull_number),
    });

    const files = data.map((file) => ({
      filename: file.filename,
      status: file.status,
      additions: file.additions,
      deletions: file.deletions,
      changes: file.changes,
      patch: file.patch,
    }));

    res.json({
      total: files.length,
      files,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/scanned", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);

    const repos = await prisma.repo.findMany({
      where: { userId },
      orderBy: { lastScanned: "desc" },
    });

    res.json(repos);
  } catch (error) {
    next(error);
  }
});

app.get("/file", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { owner, repo, path } = req.query as any;

    if (!owner || !repo || !path) {
      return res.status(400).json({
        error: "owner, repo and path are required",
      });
    }

    const octokit = await getOctokit(userId);

    const content: any = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });

    const fileContent =
      !Array.isArray(content.data) && content.data.content
        ? Buffer.from(content.data.content, "base64")
          .toString("utf8")
          .slice(0, 8000)
        : "";

    res.json({
      path,
      content: fileContent,
      sha: !Array.isArray(content.data) ? content.data.sha : "",
    });
  } catch (error) {
    next(error);
  }
});

app.post("/related-files", async (req: any, res, next) => {
  try {
    getUserFromHeaders(req);

    const { file_tree, selected_file, error_text } = req.body;

    if (!file_tree || !selected_file) {
      return res.status(400).json({
        error: "file_tree and selected_file are required",
      });
    }

    const repoPaths = file_tree.map((file: any) => file.path || file).filter(Boolean);

    const selected = String(selected_file).toLowerCase();
    const error = String(error_text || "").toLowerCase();

    const keywords = new Set<string>();

    selected
      .replace(/\.[^/.]+$/, "")
      .split(/[\/\\._-]/)
      .filter(Boolean)
      .forEach((item) => keywords.add(item));

    error
      .split(/[^a-zA-Z0-9_]+/)
      .filter((item) => item.length >= 4)
      .slice(0, 20)
      .forEach((item) => keywords.add(item));

    const related = repoPaths
      .filter((path: string) => {
        const lowerPath = path.toLowerCase();

        if (lowerPath === selected) return true;

        if (
          lowerPath.includes("node_modules") ||
          lowerPath.includes(".git/") ||
          lowerPath.includes("dist/") ||
          lowerPath.includes("build/") ||
          lowerPath.includes(".next/") ||
          lowerPath.includes(".vite/") ||
          lowerPath.endsWith(".map")
        ) {
          return false;
        }

        const isCode =
          lowerPath.endsWith(".js") ||
          lowerPath.endsWith(".ts") ||
          lowerPath.endsWith(".jsx") ||
          lowerPath.endsWith(".tsx") ||
          lowerPath.endsWith(".ejs") ||
          lowerPath.endsWith(".json") ||
          lowerPath.endsWith(".env.example");

        if (!isCode) return false;

        if (selected.includes("/views/") || selected.includes("views/")) {
          if (
            lowerPath.includes("routes") ||
            lowerPath.includes("controllers") ||
            lowerPath.includes("models") ||
            lowerPath.includes("views")
          ) {
            return true;
          }
        }

        for (const key of keywords) {
          if (key.length >= 4 && lowerPath.includes(key)) {
            return true;
          }
        }

        return false;
      })
      .slice(0, 8);

    if (!related.includes(selected_file)) {
      related.unshift(selected_file);
    }

    res.json({
      selected_file,
      related_files: related,
      total: related.length,
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
  console.log("=========== GITHUB SERVICE ERROR ===========");
  console.log("MESSAGE:", err.message);
  console.log("STATUS:", err.status);
  console.log("===========================================");

  res.status(err.status || 500).json({
    error: err.message || "GitHub service error",
    status: err.status || 500,
  });
});

app.listen(Number(process.env.GITHUB_SERVICE_PORT || 4002), () => {
  console.log("github-service running");
});