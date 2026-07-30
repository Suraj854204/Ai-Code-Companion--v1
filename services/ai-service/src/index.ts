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
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@aicc/database";

const app = express();

const parseAIJson = (text: string) => {
  try {
    const clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(clean);
  } catch (err) {
    return {
      summary: "AI returned non JSON response",
      raw: text,
    };
  }
};

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "8mb" }));
app.use(morgan("dev"));

console.log("🔥 GEMINI CALL:", new Date().toLocaleTimeString());

const getUserFromHeaders = (req: any) => {
  const rawUserId = String(req.headers["x-user-id"] || "").trim();
  const userEmail = String(req.headers["x-user-email"] || "").trim();

  const match = rawUserId.match(
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
  );

  const userId = match?.[0];

  console.log("AI RAW USER ID:", JSON.stringify(rawUserId));
  console.log("AI CLEAN USER ID:", userId);

  if (!userId) {
    throw new Error("Unauthorized: valid UUID missing");
  }

  return { userId, userEmail };
};
const getEncryptKey = () => {
  return Buffer.from(
    (process.env.ENCRYPT_KEY || "dev-key").padEnd(32, "0").slice(0, 32),
  );
};

const decrypt = (data: string) => {
  const [ivHex, tagHex, encryptedHex] = data.split(":");

  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", getEncryptKey(), iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString(
    "utf8",
  );
};

async function getGeminiKey(userId: string) {
  const cleanUserId = String(userId).trim();

  const user = await prisma.user.findUnique({
    where: { id: cleanUserId },
  });

  if (!user?.claudeApiKey) {
    throw new Error("Gemini API key not connected");
  }

  return decrypt(user.claudeApiKey);
}

async function callAI(
  userId: string,
  systemPrompt: string,
  userMessage: string,
) {
  console.log("🔥 GEMINI CALL:", new Date().toLocaleTimeString());
  const apiKey = await getGeminiKey(userId);

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(userMessage);
  return result.response.text();
}

app.get("/health", (_req, res) => {
  res.json({
    service: "ai-service",
    provider: "gemini",
    status: "ok",
  });
});

app.post("/classify", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { file_tree, key_files, repo_id } = req.body;

    const systemPrompt =
      'Return ONLY valid JSON. No markdown. Shape: {"type":"","frontend":[],"backend":[],"database":[],"devops":[],"purpose":"","deploy_frontend":"","deploy_backend":"","deploy_database":""}';

    const userMessage = `Analyze this project.

Files:
${JSON.stringify(file_tree).slice(0, 12000)}

package.json:
${key_files?.["package.json"] || ""}`;

    const raw = await callAI(userId, systemPrompt, userMessage);

    let parsed: any;

    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      parsed = {
        type: "Unknown",
        purpose: raw,
        frontend: [],
        backend: [],
        database: [],
        devops: [],
      };
    }

    if (repo_id) {
      await prisma.repo.update({
        where: { id: repo_id },
        data: { techStack: parsed },
      });
    }

    res.json(parsed);
  } catch (error) {
    next(error);
  }
});

app.post("/chat", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { file_name, file_content, message, repo_id } = req.body;

    const systemPrompt = `
You are an expert code reviewer.

User may ask:
- explain code
- find bugs
- security review
- improve code

Rules:
1. If user asks for error/bug, do not explain the whole file.
2. If no issue exists, say "No critical issue found" and list possible risks.
3. Always include File, Line area, Severity, Suggested fix.

File:
${file_name}

Code:
${String(file_content || "").slice(0, 6000)}
`;

    const answer = await callAI(userId, systemPrompt, String(message || ""));

    const existing = await prisma.chat.findFirst({
      where: {
        repoId: repo_id,
        userId,
        fileName: file_name,
      },
    });

    const oldMessages = (existing?.messages as any[]) || [];

    const newMessages = [
      ...oldMessages,
      { role: "user", content: message, at: new Date().toISOString() },
      { role: "assistant", content: answer, at: new Date().toISOString() },
    ];

    if (existing) {
      await prisma.chat.update({
        where: { id: existing.id },
        data: { messages: newMessages },
      });
    } else {
      await prisma.chat.create({
        data: {
          repoId: repo_id,
          userId,
          fileName: file_name,
          messages: newMessages,
        },
      });
    }

    res.json({ response: answer });
  } catch (error) {
    next(error);
  }
});

app.post("/error", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { error_text, file_name, file_content } = req.body;

    const systemPrompt = `You are a senior debugger.
Return markdown with:
- Root Cause
- Fix with line numbers
- Before/After code
- Explanation

File: ${file_name}

${String(file_content || "").slice(0, 6000)}`;

    const solution = await callAI(
      userId,
      systemPrompt,
      String(error_text || ""),
    );

    res.json({ solution });
  } catch (error) {
    next(error);
  }
});

app.post("/qa", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { question, file_tree, key_files } = req.body;

    const systemPrompt = `Answer about whole codebase.

Files:
${JSON.stringify(file_tree).slice(0, 10000)}

Key files:
${JSON.stringify(key_files).slice(0, 10000)}`;

    const answer = await callAI(userId, systemPrompt, String(question || ""));

    res.json({ answer });
  } catch (error) {
    next(error);
  }
});

app.get("/history/:repo_id", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);

    const chats = await prisma.chat.findMany({
      where: {
        repoId: req.params.repo_id,
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(chats);
  } catch (error) {
    next(error);
  }
});

app.post("/auto-fix", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { file_name, file_content, error_text } = req.body;

    if (!file_name || !file_content || !error_text) {
      return res.status(400).json({
        error: "file_name, file_content and error_text are required",
      });
    }

    const systemPrompt = `
You are a senior software engineer.
Fix the selected file based on the provided error.

Return ONLY valid JSON. No markdown.

Format:
{
  "summary": "short fix summary",
  "fixed_code": "full corrected file code"
}
`;

    const userMessage = `
FILE:
${file_name}

CODE:
${String(file_content).slice(0, 12000)}

ERROR:
${error_text}
`;

    const aiResponse = await callAI(userId, systemPrompt, userMessage);

    const clean = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json(parseAIJson(aiResponse));
  } catch (err) {
    next(err);
  }
});

app.post("/review-pr", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { files } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        error: "files array is required",
      });
    }

    const systemPrompt = `
   You are a senior code reviewer.

   Review the pull request changed files.

   Return ONLY valid JSON. No markdown.

   Format:
  {
    "summary": "overall PR review summary",
    "risk_level": "low | medium | high",
    "issues": [
    {
      "file": "filename",
      "type": "bug | security | performance | quality",
      "severity": "low | medium | high",
      "message": "issue explanation",
      "suggestion": "how to fix"
    }
  ]
}
`;

    const userMessage = `
Changed files:
${JSON.stringify(files).slice(0, 16000)}
`;

    const aiResponse = await callAI(userId, systemPrompt, userMessage);

    const clean = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json(JSON.parse(clean));
  } catch (err) {
    next(err);
  }
});

app.post("/multi-file-fix", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { selected_file, error_text, files } = req.body;

    if (!error_text) {
      return res.status(400).json({
        error: "error_text is required",
      });
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        error: "files array is required",
      });
    }

    const systemPrompt = `
You are a senior full-stack debugging agent.

You will receive multiple related files.
Your job is to find the REAL root cause and fix the correct file.

Important rules:
1. Do NOT add fallback/dummy data inside EJS/view files.
2. If an EJS variable is undefined, the fix is usually in controller or route.
3. Templates should not create missing backend data.
4. Choose a backend file when the issue is missing data passed to a template.
5. If the selected file is a view/template, inspect routes and controllers.
6. Return the full corrected code for only ONE target file.
7. The target_file must exactly match one path from the provided files array.

Return ONLY valid JSON. No markdown.

Format:
{
  "summary": "short explanation",
  "target_file": "path of file that should be changed",
  "fixed_code": "full corrected code of target_file"
}
`;

    const safeFiles = files.map((file: any) => ({
      path: file.path,
      content: String(file.content || "").slice(0, 7000),
    }));

    const userMessage = `
SELECTED FILE:
${selected_file || ""}

ERROR:
${error_text}

RELATED FILES:
${JSON.stringify(safeFiles, null, 2).slice(0, 26000)}
`;

    const aiResponse = await callAI(userId, systemPrompt, userMessage);

    const clean = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(clean);

    if (!parsed.target_file || !parsed.fixed_code) {
      return res.status(500).json({
        error: "AI response missing target_file or fixed_code",
        raw: parsed,
      });
    }

    res.json(parsed);
  } catch (err) {
    next(err);
  }
});

app.post("/fix-review-issue", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { issue, files } = req.body;

    if (!issue) {
      return res.status(400).json({ error: "issue is required" });
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "files array is required" });
    }

    const safeFiles = files.map((file: any) => ({
      path: file.path,
      content: String(file.content || "").slice(0, 7000),
    }));

    const systemPrompt = `
You are an autonomous senior software engineer.

A PR review found an issue.
Your task:
- understand the issue
- inspect related files
- find the real root cause
- modify only the correct file
- return JSON only

Rules:
1. Do not add dummy fallback data in EJS/view files.
2. If the issue is about missing template data, prefer fixing controller/route.
3. target_file must exactly match one file path from files array.

Return ONLY valid JSON:
{
  "summary": "short explanation",
  "target_file": "path of file to change",
  "fixed_code": "full corrected code"
}
`;

    const userMessage = `
ISSUE:
${JSON.stringify(issue, null, 2)}

FILES:
${JSON.stringify(safeFiles, null, 2).slice(0, 26000)}
`;

    const answer = await callAI(userId, systemPrompt, userMessage);

    const clean = answer
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);
  } catch (err) {
    next(err);
  }
});

app.post("/agent-plan", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { instruction, file_tree, key_files } = req.body;

    if (!instruction) {
      return res.status(400).json({ error: "instruction is required" });
    }

    const systemPrompt = `
You are an autonomous AI software engineering agent.

Given a user instruction and repository file tree:
- understand the task
- choose files that should be inspected
- create a short execution plan

Return ONLY valid JSON:
{
  "goal": "what user wants",
  "files_to_read": ["path1", "path2"],
  "plan": ["step 1", "step 2"],
  "risk_level": "low | medium | high"
}
`;

    const userMessage = `
USER INSTRUCTION:
${instruction}

FILE TREE:
${JSON.stringify(file_tree).slice(0, 14000)}

KEY FILES:
${JSON.stringify(key_files).slice(0, 10000)}
`;

    const answer = await callAI(userId, systemPrompt, userMessage);

    const clean = answer
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json(JSON.parse(clean));
  } catch (err) {
    next(err);
  }
});

app.post("/agent-fix", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { instruction, plan, files } = req.body;

    if (!instruction) {
      return res.status(400).json({ error: "instruction is required" });
    }

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "files array is required" });
    }

    const safeFiles = files.map((file: any) => ({
      path: file.path,
      content: String(file.content || "").slice(0, 8000),
    }));

    const systemPrompt = `
You are an autonomous senior software engineering agent.

Use the user instruction, plan, and file contents to make one safe code change.

Return ONLY valid JSON:
{
  "summary": "what changed and why",
  "target_file": "exact file path to update",
  "fixed_code": "full corrected code of target_file"
}

Rules:
1. Change only one file.
2. target_file must exactly match one provided file path.
3. Do not return markdown.
4. Preserve existing code style.
`;

    const userMessage = `
USER INSTRUCTION:
${instruction}

PLAN:
${JSON.stringify(plan, null, 2)}

FILES:
${JSON.stringify(safeFiles, null, 2).slice(0, 30000)}
`;

    const answer = await callAI(userId, systemPrompt, userMessage);

    const clean = answer
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(clean);

    if (!parsed.target_file || !parsed.fixed_code) {
      return res.status(500).json({
        error: "AI response missing target_file or fixed_code",
        raw: parsed,
      });
    }

    res.json(parsed);
  } catch (err) {
    next(err);
  }
});

app.post("/security-scan", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);

    const { file_tree, key_files } = req.body;

    const systemPrompt = `
You are a senior application security engineer.

Analyze repository security.

Find:
- exposed secrets
- weak JWT usage
- auth bugs
- missing validation
- injection risks
- unsafe dependencies
- CORS problems
- env mistakes

Return ONLY JSON.

Format:
{
 "score":80,
 "risk":"low | medium | high",
 "issues":[
 {
  "file":"",
  "severity":"",
  "type":"",
  "message":"",
  "fix":""
 }
 ]
}
`;

    const userMessage = `

FILES:
${JSON.stringify(file_tree).slice(0, 12000)}

KEY FILES:
${JSON.stringify(key_files).slice(0, 20000)}

`;

    const answer = await callAI(userId, systemPrompt, userMessage);

    const clean = answer
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json(JSON.parse(clean));
  } catch (err) {
    next(err);
  }
});

app.post("/generate-tests", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { file_name, file_content, framework } = req.body;

    if (!file_name || !file_content) {
      return res.status(400).json({
        error: "file_name and file_content are required",
      });
    }

    const systemPrompt = `
You are a senior QA automation engineer.

Generate useful tests for the provided file.

Return ONLY valid JSON:
{
  "summary": "what tests are generated",
  "test_file": "path for test file",
  "test_code": "full test code"
}

Rules:
1. Use Jest + Supertest for Express routes/controllers.
2. Use meaningful test cases.
3. Do not return markdown.
`;

    const userMessage = `
FRAMEWORK:
${framework || "jest"}

SOURCE FILE:
${file_name}

CODE:
${String(file_content).slice(0, 14000)}
`;

    const answer = await callAI(userId, systemPrompt, userMessage);

    const clean = answer
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    res.json(JSON.parse(clean));
  } catch (err) {
    next(err);
  }
});

app.post("/architecture", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { file_tree, key_files } = req.body;

    if (!file_tree) {
      return res.status(400).json({ error: "file_tree is required" });
    }

    const systemPrompt = `
You are a senior software architect.

Analyze the repository and produce architecture documentation.

Return ONLY valid JSON:
{
  "summary": "short architecture summary",
  "stack": ["tech1", "tech2"],
  "layers": [
    {
      "name": "layer name",
      "files": ["file1"],
      "responsibility": "what this layer does"
    }
  ],
  "data_flow": ["step 1", "step 2"],
  "external_services": ["service1"],
  "diagram_mermaid": "valid mermaid flowchart"
}
`;

    const userMessage = `
FILE TREE:
${JSON.stringify(file_tree).slice(0, 16000)}

KEY FILES:
${JSON.stringify(key_files).slice(0, 20000)}
`;

    const answer = await callAI(userId, systemPrompt, userMessage);

    const clean = answer
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json(JSON.parse(clean));
  } catch (err) {
    next(err);
  }
});
app.post("/code-search", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { question, file_tree, key_files } = req.body;

    if (!question) {
      return res.status(400).json({ error: "question is required" });
    }

    const systemPrompt = `
You are an expert codebase navigator.

Answer where something lives in the repo.

Return ONLY valid JSON:
{
  "answer": "short direct answer",
  "relevant_files": [
    {
      "file": "path",
      "reason": "why relevant"
    }
  ],
  "flow": ["step 1", "step 2"],
  "next_action": "what user should inspect next"
}
`;

    const userMessage = `
QUESTION:
${question}

FILE TREE:
${JSON.stringify(file_tree).slice(0, 16000)}

KEY FILES:
${JSON.stringify(key_files).slice(0, 18000)}
`;

    const answer = await callAI(userId, systemPrompt, userMessage);
    const clean = answer
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json(JSON.parse(clean));
  } catch (err) {
    next(err);
  }
});

app.post("/deploy-fix", async (req: any, res, next) => {
  try {
    const { userId } = getUserFromHeaders(req);
    const { report, file_tree, key_files } = req.body;

    const systemPrompt = `
You are a senior DevOps engineer.

Fix deployment readiness issues for this repository.

Return ONLY valid JSON:
{
  "summary": "what deployment issue is fixed",
  "target_file": "file path to create or update",
  "fixed_code": "full file content"
}

Rules:
1. Change only one file at a time.
2. Prefer package.json for missing start script.
3. Prefer .env.example for missing env documentation.
4. Prefer Dockerfile if Dockerfile is missing.
5. No markdown.
`;

    const userMessage = `
DEPLOY REPORT:
${JSON.stringify(report, null, 2)}

FILE TREE:
${JSON.stringify(file_tree).slice(0, 12000)}

KEY FILES:
${JSON.stringify(key_files).slice(0, 20000)}
`;

    const answer = await callAI(userId, systemPrompt, userMessage);
    const clean = answer
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.json(JSON.parse(clean));
  } catch (err) {
    next(err);
  }
});

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("AI SERVICE ERROR:", err);

  res.status(500).json({
    error: err.message,
  });
});

app.listen(Number(process.env.AI_SERVICE_PORT || 4003), () => {
  console.log("ai-service running with Gemini");
});
