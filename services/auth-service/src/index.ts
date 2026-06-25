import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "@aicc/database";

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
const key = () =>
  Buffer.from(
    (process.env.ENCRYPT_KEY || "dev-key").padEnd(32, "0").slice(0, 32),
  );
const encrypt = (text?: string) => {
  if (!text) return undefined;
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([c.update(text, "utf8"), c.final()]);
  return `${iv.toString("hex")}:${c.getAuthTag().toString("hex")}:${enc.toString("hex")}`;
};
const token = (u: any) =>
  jwt.sign(
    { id: u.id, email: u.email },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as any,
  );
const auth = (req: any, res: any, next: any) => {
  try {
    const raw = (req.headers.authorization || "").replace("Bearer ", "");
    const d: any = jwt.verify(raw, process.env.JWT_SECRET || "dev-secret");
    req.userId = d.id;
    req.userEmail = d.email;
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};

app.get("/health", (_, res) =>
  res.json({ service: "auth-service", status: "ok" }),
);
app.post("/signup", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email and password required" });
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return res.status(409).json({ error: "Email already registered" });
    const user = await prisma.user.create({
      data: { email, password: await bcrypt.hash(password, 12), name },
    });
    res.json({
      token: token(user),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (e) {
    next(e);
  }
});
app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: "Invalid credentials" });
    res.json({
      token: token(user),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (e) {
    next(e);
  }
});
app.get("/me", auth, async (req: any, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      hasGithub: !!user.githubToken,
      hasClaudeKey: !!user.claudeApiKey,
    });
  } catch (e) {
    next(e);
  }
});
app.post("/keys", auth, async (req: any, res, next) => {
  try {
    const data: any = {};
    if (req.body.github_token)
      data.githubToken = encrypt(req.body.github_token);
    if (req.body.claude_key) data.claudeApiKey = encrypt(req.body.claude_key);
    await prisma.user.update({ where: { id: req.userId }, data });
    res.json({ message: "Keys saved securely" });
  } catch (e) {
    next(e);
  }
});
app.use((err: any, _req: any, res: any, _next: any) =>
  res.status(500).json({ error: err.message || "Server error" }),
);
app.listen(Number(process.env.AUTH_SERVICE_PORT || 4001), () =>
  console.log("auth-service running"),
);
