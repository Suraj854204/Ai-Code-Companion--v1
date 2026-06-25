import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.error("NEXT_PUBLIC_API_URL is missing");
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("acc_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error?.config?.url,
      baseURL: error?.config?.baseURL,
      status: error?.response?.status,
      message: error?.message,
      data: error?.response?.data,
    });

    return Promise.reject(error);
  }
);

export const authApi = {
  signup: (data: any) => api.post("/api/auth/signup", data),
  login: (data: any) => api.post("/api/auth/login", data),
  me: () => api.get("/api/auth/me"),
  saveKeys: (data: any) => api.post("/api/auth/keys", data),
  logout: () => Promise.resolve(),
};

export const reposApi = {
  listGithub: () => api.get("/api/repos/github"),
  listScanned: () => api.get("/api/repos/scanned"),
  scan: (data: any) => api.post("/api/scan/repo", data),
  getFile: (params: any) => api.get("/api/repos/file", { params }),
  relatedFiles: (data: any) => api.post("/api/repos/related-files", data),
  getPRFiles: (params: any) => api.get("/api/repos/pr-files", { params }),
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