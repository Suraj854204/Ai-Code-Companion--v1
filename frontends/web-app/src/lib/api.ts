import axios from "axios";
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
api.interceptors.request.use((c) => {
  if (typeof window !== "undefined") {
    const t = localStorage.getItem("acc_token");
    if (t) c.headers.Authorization = `Bearer ${t}`;
  }
  return c;
});
export const authApi = {
  signup: (data: any) => api.post("/api/auth/signup", data),
  login: (data: any) => api.post("/api/auth/login", data),
  me: () => api.get("/api/auth/me"),
  saveKeys: (data: any) => api.post("/api/auth/keys", data),
  logout: () => fetch("/api/auth/logout", { method: "POST" })
};

export const reposApi = {
  listGithub: () => api.get("/api/repos/github"),
  listScanned: () => api.get("/api/repos/scanned"),

  scan: (data: any) => api.post("/api/scan/repo", data),

  getFile: (params: any) =>
    api.get("/api/repos/file", {
      params,
    }),

  relatedFiles: (data: any) => api.post("/api/repos/related-files", data),

  getPRFiles: (params: any) =>
    api.get("/api/repos/pr-files", {
      params,
    }),

  createBranch: (data: any) => api.post("/api/repos/branch", data),

  commitFile: (data: any) => api.post("/api/repos/commit-file", data),

  createPullRequest: (data: any) => api.post("/api/repos/pull-request", data),
};

export const aiApi = {
  classify: (data: any) => api.post("/api/ai/classify", data),

  chat: (data: any) => api.post("/api/ai/chat", data),

  solveError: (data: any) => api.post("/api/ai/error", data),

  autoFix: (data: any) => api.post("/api/ai/auto-fix", data),

  qa: (data: any) => api.post("/api/ai/qa", data),

  reviewPR: (data: any) => api.post("/api/ai/review-pr", data),

  history: (id: string) => api.get(`/api/ai/history/${id}`),

  multiFileFix: (data: any) => api.post("/api/ai/multi-file-fix", data),

  fixReviewIssue: (data: any) => api.post("/api/ai/fix-review-issue", data),

  agentPlan: (data: any) => api.post("/api/ai/agent-plan", data),

  agentFix: (data: any) => api.post("/api/ai/agent-fix", data),

  securityScan: (data: any) => api.post("/api/ai/security-scan", data),

  generateTests: (data: any) => api.post("/api/ai/generate-tests", data),

  architecture: (data: any) => api.post("/api/ai/architecture", data),

  codeSearch: (data: any) => api.post("/api/ai/code-search", data),

  deployFix: (data: any) => api.post("/api/ai/deploy-fix", data),
};

export const reportApi = {
  check: (data: any) => api.post("/api/report/check", data),

  getByToken: (token: string) => api.get(`/api/report/share/${token}`),
};
