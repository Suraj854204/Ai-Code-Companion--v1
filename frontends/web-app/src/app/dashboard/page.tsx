"use client";

import "./page.css";
import React, { useEffect, useRef, useState } from "react";
import { authApi, reposApi, reportApi, aiApi } from "@/lib/api";

type Tab =
  | "repos"
  | "analysis"
  | "assistant"
  | "pr-review"
  | "agent"
  | "security"
  | "keys"
  | "architecture"
  | "code-search";

type IconProps = { size?: number; className?: string };

function IconSparkle({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5l1.9 6.2 6.2 1.9-6.2 1.9L12 18.7l-1.9-6.2-6.2-1.9 6.2-1.9L12 2.5z" />
    </svg>
  );
}
function IconFolder({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8A2 2 0 0 1 21 9.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  );
}
function IconChart({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 20V10M11 20V4M18 20v-7" />
    </svg>
  );
}
function IconGitPR({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="9" r="2.2" />
      <path d="M6 8.2V15.8M18 11.2V16a2 2 0 0 1-2 2h-2.5" />
      <path d="M11.5 15.5l2-2-2-2" />
    </svg>
  );
}
function IconKey({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l8-8M16 7l2 2M13 10l2 2" />
    </svg>
  );
}
function IconFile({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4" />
    </svg>
  );
}
function IconSend({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 3L3 10.5l7 2.7L13 21l8-18z" />
      <path d="M10.2 13.2L21 3" />
    </svg>
  );
}
function IconAlert({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3.5L21.5 20H2.5L12 3.5z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconZap({ size = 14, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}
function IconBox({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8M12 13v8" />
    </svg>
  );
}
function IconRobot({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="16" x2="16" y2="16" strokeWidth="3" strokeLinecap="round" />
      <path d="M6 11V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function IconShield({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3l8 4v5c0 5-3.5 9.7-8 11C7.5 21.7 4 17 4 12V7l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconSitemap({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <rect x="3" y="17" width="6" height="4" rx="1" />
      <rect x="15" y="17" width="6" height="4" rx="1" />
      <path d="M12 7v4M12 11H6v6M12 11h6v6" />
    </svg>
  );
}
function IconSearch({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

/** The page's one recurring animated cue: shown inside a button while its
 *  request is in flight, so the person always knows the AI is working. */
function Writing({ label }: { label: string }) {
  return <span className="ed-writing">{label}</span>;
}

export default function CodeCompanion() {
  const [activeTab, setActiveTab] = useState<Tab>("repos");
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [keys, setKeys] = useState<any>({});
  const [result, setResult] = useState<any>(null);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [toast, setToast] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [question, setQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [errorSolution, setErrorSolution] = useState("");
  const [solveLoading, setSolveLoading] = useState(false);
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [fixResult, setFixResult] = useState<any>(null);
  const [fixing, setFixing] = useState(false);
  const [creatingPR, setCreatingPR] = useState(false);
  const [fixingIssue, setFixingIssue] = useState(false);
  const [prForm, setPrForm] = useState({ owner: "", repo: "", pull_number: "" });
  const [prReview, setPrReview] = useState<any>(null);
  const [reviewingPR, setReviewingPR] = useState(false);
  const [agentInstruction, setAgentInstruction] = useState("");
  const [agentPlan, setAgentPlan] = useState<any>(null);
  const [agentRunning, setAgentRunning] = useState(false);
  const [security, setSecurity] = useState<any>(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [generatingTest, setGeneratingTest] = useState(false);
  const [architecture, setArchitecture] = useState<any>(null);
  const [architectureLoading, setArchitectureLoading] = useState(false);
  const [codeSearchQuestion, setCodeSearchQuestion] = useState("");
  const [codeSearchResult, setCodeSearchResult] = useState<any>(null);
  const [codeSearchLoading, setCodeSearchLoading] = useState(false);
  const [deployFixing, setDeployFixing] = useState(false);
  const [mounted, setMounted] = useState(false);

  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // One-time settle — see .ed-app.is-ready in page.css. Nothing loops
    // after this; the page holds still until an AI call is actually running.
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    authApi.me().then((r) => setUser(r.data)).catch(() => (location.href = "/"));
    reposApi.listGithub().then((r) => setRepos(r.data)).catch(() => setRepos([]));
  }, []);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  async function saveKeys() {
    await authApi.saveKeys(keys);
    showToast();
    setTimeout(() => location.reload(), 800);
  }
  async function logout() {
    try {
      await authApi.logout();
    } catch (_) {}
    location.href = "/";
  }

  async function scan(repo: any) {
    setScanningId(repo.id);
    setSelectedRepo(repo);
    try {
      const res = await reposApi.scan({ owner: repo.owner, repo: repo.name });
      setResult(res.data);
      setActiveTab("analysis");
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } finally {
      setScanningId(null);
    }
  }

  async function deploy() {
    if (!result?.repo_id) return alert("Please scan repo first");
    setDeploying(true);
    try {
      const res = await reportApi.check({
        repo_id: result.repo_id,
        file_tree: result.file_tree,
        key_files: result.key_files,
      });
      setResult({ ...result, report: res.data });
    } finally {
      setDeploying(false);
    }
  }

  async function openFile(path: string) {
    if (!selectedRepo) return alert("Scan repo first");
    setSelectedFile(path);
    const res = await reposApi.getFile({ owner: selectedRepo.owner, repo: selectedRepo.name, path });
    setFileContent(res.data.content);
  }

  async function generateFix() {
    if (!selectedFile || !fileContent) return alert("Select file first");
    if (!errorText) return alert("Paste error first");
    setFixing(true);
    try {
      const res = await aiApi.autoFix({ file_name: selectedFile, file_content: fileContent, error_text: errorText });
      setFixResult({ file: selectedFile, summary: res.data.summary, code: res.data.fixed_code });
    } finally {
      setFixing(false);
    }
  }

  async function createPR() {
    if (!fixResult) return alert("Generate fix first");
    setCreatingPR(true);
    try {
      const branch = await reposApi.createBranch({ owner: selectedRepo.owner, repo: selectedRepo.name });
      await reposApi.commitFile({
        owner: selectedRepo.owner,
        repo: selectedRepo.name,
        branch: branch.data.branch,
        path: fixResult.file,
        content: fixResult.code,
      });
      const pr = await reposApi.createPullRequest({
        owner: selectedRepo.owner,
        repo: selectedRepo.name,
        branch: branch.data.branch,
        title: `AI Fix: ${fixResult.summary || fixResult.file}`,
        body: "Generated by AI Code Companion.",
      });
      alert(`Pull Request Created:\n${pr.data.pr_url}`);
    } finally {
      setCreatingPR(false);
    }
  }

  async function reviewPullRequest() {
    if (!prForm.owner || !prForm.repo || !prForm.pull_number) return alert("owner, repo and PR number required");
    setReviewingPR(true);
    try {
      const filesRes = await reposApi.getPRFiles({ owner: prForm.owner, repo: prForm.repo, pull_number: prForm.pull_number });
      const reviewRes = await aiApi.reviewPR({ files: filesRes.data.files });
      setPrReview(reviewRes.data);
    } finally {
      setReviewingPR(false);
    }
  }

  async function chatWithFile() {
    if (!selectedFile || !fileContent) return alert("Select file first");
    setChatLoading(true);
    try {
      const res = await aiApi.chat({ repo_id: result.repo_id, file_name: selectedFile, file_content: fileContent, message: question });
      setChatAnswer(res.data.response);
    } finally {
      setChatLoading(false);
    }
  }

  async function solveError() {
    if (!selectedFile || !fileContent) return alert("Select file first");
    setSolveLoading(true);
    try {
      const res = await aiApi.solveError({ file_name: selectedFile, file_content: fileContent, error_text: errorText });
      setErrorSolution(res.data.solution);
    } finally {
      setSolveLoading(false);
    }
  }

  async function loadRelatedFileContents() {
    if (!result || !selectedRepo || !selectedFile) return alert("Scan repo and select file first");
    const relatedRes = await reposApi.relatedFiles({
      file_tree: result.file_tree,
      selected_file: selectedFile,
      error_text: errorText,
    });
    const relatedPaths = relatedRes.data.related_files;
    const files = await Promise.all(
      relatedPaths.map(async (path: string) => {
        const res = await reposApi.getFile({ owner: selectedRepo.owner, repo: selectedRepo.name, path });
        return { path, content: res.data.content };
      }),
    );
    return files;
  }

  async function smartFix() {
    if (!result || !selectedRepo || !selectedFile) return alert("Scan repo and select file first");
    if (!errorText) return alert("Paste error first");
    setFixing(true);
    try {
      const files = await loadRelatedFileContents();
      if (!files) return;
      const res = await aiApi.multiFileFix({ selected_file: selectedFile, error_text: errorText, files });
      setFixResult({ file: res.data.target_file, summary: res.data.summary, code: res.data.fixed_code });
      alert(`Smart Fix generated for: ${res.data.target_file}`);
    } finally {
      setFixing(false);
    }
  }

  async function fixReviewIssue(issue: any) {
    if (!result || !selectedRepo) return alert("Scan repo first");
    setFixingIssue(true);
    try {
      const relatedRes = await reposApi.relatedFiles({
        file_tree: result.file_tree,
        selected_file: issue.file,
        error_text: `${issue.message}\n${issue.suggestion}`,
      });
      const relatedPaths = relatedRes.data.related_files;
      const files = await Promise.all(
        relatedPaths.map(async (path: string) => {
          const res = await reposApi.getFile({ owner: selectedRepo.owner || prForm.owner, repo: selectedRepo.name || prForm.repo, path });
          return { path, content: res.data.content };
        }),
      );
      const fix = await aiApi.fixReviewIssue({ issue, files });
      setFixResult({ file: fix.data.target_file, summary: fix.data.summary, code: fix.data.fixed_code });
      setActiveTab("assistant");
    } finally {
      setFixingIssue(false);
    }
  }

  async function runAgentPlan() {
    if (!result) return alert("Scan repo first");
    if (!agentInstruction) return alert("Enter instruction");
    setAgentRunning(true);
    try {
      const res = await aiApi.agentPlan({ instruction: agentInstruction, file_tree: result.file_tree, key_files: result.key_files });
      setAgentPlan(res.data);
    } finally {
      setAgentRunning(false);
    }
  }

  async function runAgentFix() {
    if (!agentPlan) return alert("Run agent plan first");
    if (!selectedRepo) return alert("Scan/select repo first");
    setAgentRunning(true);
    try {
      const files = await Promise.all(
        agentPlan.files_to_read.map(async (path: string) => {
          const res = await reposApi.getFile({ owner: selectedRepo.owner, repo: selectedRepo.name, path });
          return { path, content: res.data.content };
        }),
      );
      const fix = await aiApi.agentFix({ instruction: agentInstruction, plan: agentPlan, files });
      setFixResult({ file: fix.data.target_file, summary: fix.data.summary, code: fix.data.fixed_code });
      setActiveTab("assistant");
    } finally {
      setAgentRunning(false);
    }
  }

  async function runSecurityScan() {
    if (!result) return alert("Scan repo first");
    setSecurityLoading(true);
    try {
      const res = await aiApi.securityScan({ file_tree: result.file_tree, key_files: result.key_files });
      setSecurity(res.data);
    } finally {
      setSecurityLoading(false);
    }
  }

  async function fixSecurityIssue(issue: any) {
    if (!result || !selectedRepo) return alert("Scan repo first");
    setFixingIssue(true);
    try {
      const relatedRes = await reposApi.relatedFiles({
        file_tree: result.file_tree,
        selected_file: issue.file,
        error_text: `${issue.message}\n${issue.fix}`,
      });
      const relatedPaths = relatedRes.data.related_files;
      const files = await Promise.all(
        relatedPaths.map(async (path: string) => {
          const res = await reposApi.getFile({ owner: selectedRepo.owner, repo: selectedRepo.name, path });
          return { path, content: res.data.content };
        }),
      );
      const fix = await aiApi.fixReviewIssue({ issue, files });
      setFixResult({ file: fix.data.target_file || fix.data.file, summary: fix.data.summary, code: fix.data.fixed_code });
      setActiveTab("assistant");
    } finally {
      setFixingIssue(false);
    }
  }

  async function generateTests() {
    if (!selectedFile || !fileContent) return alert("Select file first");
    setGeneratingTest(true);
    try {
      const res = await aiApi.generateTests({ file_name: selectedFile, file_content: fileContent, framework: "jest" });
      setTestResult(res.data);
    } finally {
      setGeneratingTest(false);
    }
  }

  async function createTestPR() {
    if (!testResult) return alert("Generate tests first");
    if (!selectedRepo) return alert("Scan/select repo first");
    setCreatingPR(true);
    try {
      const branch = await reposApi.createBranch({ owner: selectedRepo.owner, repo: selectedRepo.name });
      await reposApi.commitFile({
        owner: selectedRepo.owner,
        repo: selectedRepo.name,
        branch: branch.data.branch,
        path: testResult.test_file,
        content: testResult.test_code,
        message: `AI Test: add tests for ${selectedFile}`,
      });
      const pr = await reposApi.createPullRequest({
        owner: selectedRepo.owner,
        repo: selectedRepo.name,
        branch: branch.data.branch,
        title: `AI Test: add tests for ${selectedFile}`,
        body: "Generated by AI Code Companion test generator.",
      });
      alert(`Test PR Created:\n${pr.data.pr_url}`);
    } finally {
      setCreatingPR(false);
    }
  }

  async function generateArchitecture() {
    if (!result) return alert("Scan repo first");
    setArchitectureLoading(true);
    try {
      const res = await aiApi.architecture({ file_tree: result.file_tree, key_files: result.key_files });
      setArchitecture(res.data);
    } finally {
      setArchitectureLoading(false);
    }
  }

  async function askProject() {
    if (!result) return alert("Scan repo first");
    setQaLoading(true);
    try {
      const res = await aiApi.qa({ question: qaQuestion, file_tree: result.file_tree, key_files: result.key_files });
      setQaAnswer(res.data.answer);
    } finally {
      setQaLoading(false);
    }
  }

  async function runCodeSearch() {
    if (!result) return alert("Scan repo first");
    if (!codeSearchQuestion) return alert("Enter question");
    setCodeSearchLoading(true);
    try {
      const res = await aiApi.codeSearch({ question: codeSearchQuestion, file_tree: result.file_tree, key_files: result.key_files });
      setCodeSearchResult(res.data);
    } finally {
      setCodeSearchLoading(false);
    }
  }

  async function generateDeployFix() {
    if (!result?.report) return alert("Run deploy check first");
    setDeployFixing(true);
    try {
      const res = await aiApi.deployFix({ report: result.report, file_tree: result.file_tree, key_files: result.key_files });
      setFixResult({ file: res.data.target_file, summary: res.data.summary, code: res.data.fixed_code });
      setActiveTab("assistant");
    } finally {
      setDeployFixing(false);
    }
  }

  const hasKeys = !!(user?.hasGithub && user?.hasClaudeKey);
  const step = result?.report ? 4 : result ? 3 : repos.length ? 1 : 0;
  const initials = user?.name?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || "U";

  const getHeaderMeta = () => {
    switch (activeTab) {
      case "repos":
        return { title: "Repositories", subtitle: `${repos.length} repositories available` };
      case "analysis":
        return { title: "Analysis", subtitle: selectedRepo?.full_name || "Scan a repository to begin analysis" };
      case "assistant":
        return { title: "AI Assistant", subtitle: selectedRepo?.full_name || "Chat with files, solve errors, and ask project questions" };
      case "pr-review":
        return { title: "PR Review", subtitle: "Review GitHub pull request changes with AI" };
      case "agent":
        return { title: "AI Agent", subtitle: selectedRepo?.full_name || "Give the agent a repo-level coding task and review its plan" };
      case "security":
        return { title: "Security Scanner", subtitle: selectedRepo?.full_name || "Scan your repository for vulnerabilities" };
      case "architecture":
        return { title: "Architecture Diagram", subtitle: selectedRepo?.full_name || "Visualize your repository's architecture and data flow" };
      case "code-search":
        return { title: "AI Code Search", subtitle: selectedRepo?.full_name || "Search your codebase with natural language" };
      case "keys":
        return { title: "API Keys", subtitle: "Manage GitHub and AI API credentials" };
      default:
        return { title: "CodeCompanion", subtitle: "" };
    }
  };

  const { title, subtitle } = getHeaderMeta();

  const navGroups: { label: string; items: { tab: Tab; icon: React.ReactNode; label: string; kind?: string; badge?: React.ReactNode }[] }[] = [
    {
      label: "Workspace",
      items: [
        { tab: "repos", icon: <IconFolder />, label: "Repositories", badge: <b className="ed-count">{repos.length}</b> },
        { tab: "analysis", icon: <IconChart />, label: "Analysis", badge: result ? <b className="ed-count lit">1</b> : null },
      ],
    },
    {
      label: "Assistant",
      items: [
        { tab: "assistant", icon: <IconSparkle size={15} />, label: "AI Assistant", kind: "ai", badge: result ? <b className="ed-count lit-ai">AI</b> : null },
        { tab: "agent", icon: <IconRobot />, label: "AI Agent", kind: "ai" },
        { tab: "pr-review", icon: <IconGitPR />, label: "PR Review", kind: "ai" },
        { tab: "security", icon: <IconShield />, label: "Security", kind: "ai" },
        { tab: "architecture", icon: <IconSitemap />, label: "Architecture", kind: "ai" },
        { tab: "code-search", icon: <IconSearch />, label: "Code Search", kind: "ai" },
      ],
    },
    {
      label: "Account",
      items: [{ tab: "keys", icon: <IconKey />, label: "API Keys" }],
    },
  ];

  return (
    <main className={`ed-app${mounted ? " is-ready" : ""}`}>
      <div className="ed-layout">
        <aside className="ed-rail">
          <div className="ed-mark-row">
            <span className="ed-mark">CC</span>
            <span className="ed-mark-name">CodeCompanion</span>
          </div>

          <nav className="ed-nav" aria-label="Primary">
            {navGroups.map((group) => (
              <div className="ed-nav-group" key={group.label}>
                <div className="ed-nav-label">{group.label}</div>
                {group.items.map(({ tab, icon, label, kind, badge }) => (
                  <button
                    key={tab}
                    className={`ed-nav-item ${activeTab === tab ? "active" : ""}`}
                    data-kind={kind}
                    aria-current={activeTab === tab ? "page" : undefined}
                    onClick={() => setActiveTab(tab)}
                  >
                    <span className="ed-glyph">{icon}</span>
                    <span className="ed-nav-text">{label}</span>
                    {badge}
                  </button>
                ))}
              </div>
            ))}
          </nav>

          <div className="ed-profile">
            <div className="ed-avatar">{initials}</div>
            <div className="ed-profile-meta">
              <p>{user?.name || "Developer"}</p>
              <small>{user?.email || "developer@example.com"}</small>
            </div>
            <span className="ed-plan-dot" role="img" aria-label="Free plan" title="Free plan">●</span>
            <button className="ed-logout" onClick={logout} title="Logout" aria-label="Logout">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </aside>

        <section className="ed-main">
          <header className="ed-topbar">
            <div className="ed-topbar-meta">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            <div className="ed-steps">
              {["Connect", "Scan", "Classify", "Report"].map((label, i) => {
                const n = i + 1;
                const isDone = step >= n;
                const isCurrent = step + 1 === n;
                return (
                  <div className={`ed-step ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`} key={label}>
                    <div className={`ed-step-node ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}>{isDone ? "✓" : n}</div>
                    <span>{label}</span>
                    {i < 3 && <div className={`ed-step-track ${step > n ? "done" : ""}`} />}
                  </div>
                );
              })}
            </div>
          </header>

          <div className="ed-view" key={activeTab}>
            {activeTab === "repos" && (
              <RepositoriesTab hasKeys={hasKeys} keys={keys} setKeys={setKeys} saveKeys={saveKeys} repos={repos} scanningId={scanningId} scan={scan} />
            )}
            {activeTab === "assistant" && (
              <AssistantTab
                result={result}
                selectedFile={selectedFile}
                openFile={openFile}
                fileContent={fileContent}
                question={question}
                setQuestion={setQuestion}
                chatWithFile={chatWithFile}
                chatAnswer={chatAnswer}
                chatLoading={chatLoading}
                errorText={errorText}
                setErrorText={setErrorText}
                solveError={solveError}
                solveLoading={solveLoading}
                errorSolution={errorSolution}
                generateFix={generateFix}
                fixing={fixing}
                loadRelatedFileContents={loadRelatedFileContents}
                smartFix={smartFix}
                fixResult={fixResult}
                createPR={createPR}
                creatingPR={creatingPR}
                qaQuestion={qaQuestion}
                setQaQuestion={setQaQuestion}
                askProject={askProject}
                qaAnswer={qaAnswer}
                qaLoading={qaLoading}
                generateTests={generateTests}
                generatingTest={generatingTest}
                testResult={testResult}
                createTestPR={createTestPR}
              />
            )}
            {activeTab === "analysis" && (
              <AnalysisTab
                resultRef={resultRef}
                result={result}
                selectedRepo={selectedRepo}
                deploy={deploy}
                deploying={deploying}
                generateDeployFix={generateDeployFix}
                deployFixing={deployFixing}
              />
            )}
            {activeTab === "pr-review" && (
              <PRReviewTab
                prForm={prForm}
                setPrForm={setPrForm}
                reviewPullRequest={reviewPullRequest}
                reviewingPR={reviewingPR}
                prReview={prReview}
                fixReviewIssue={fixReviewIssue}
                fixingIssue={fixingIssue}
              />
            )}
            {activeTab === "agent" && (
              <AgentTab
                result={result}
                agentInstruction={agentInstruction}
                setAgentInstruction={setAgentInstruction}
                runAgentPlan={runAgentPlan}
                agentRunning={agentRunning}
                agentPlan={agentPlan}
                runAgentFix={runAgentFix}
              />
            )}
            {activeTab === "security" && (
              <SecurityTab
                result={result}
                security={security}
                securityLoading={securityLoading}
                runSecurityScan={runSecurityScan}
                fixSecurityIssue={fixSecurityIssue}
                fixingIssue={fixingIssue}
              />
            )}
            {activeTab === "architecture" && (
              <ArchitectureTab result={result} architecture={architecture} architectureLoading={architectureLoading} generateArchitecture={generateArchitecture} />
            )}
            {activeTab === "code-search" && (
              <CodeSearchTab
                result={result}
                codeSearchQuestion={codeSearchQuestion}
                setCodeSearchQuestion={setCodeSearchQuestion}
                runCodeSearch={runCodeSearch}
                codeSearchLoading={codeSearchLoading}
                codeSearchResult={codeSearchResult}
              />
            )}
            {activeTab === "keys" && <KeysTab keys={keys} setKeys={setKeys} saveKeys={saveKeys} />}
          </div>
        </section>
      </div>

      {toast && (
        <div className="ed-toast" role="status" aria-live="polite">
          <span className="ed-toast-check">✓</span> Keys saved successfully
        </div>
      )}
    </main>
  );
}

function RepositoriesTab({ hasKeys, keys, setKeys, saveKeys, repos, scanningId, scan }: any) {
  return (
    <>
      {!hasKeys && (
        <div className="ed-setup">
          <div className="ed-setup-glyph">
            <IconKey size={16} />
          </div>
          <div className="ed-setup-copy">
            <h2>Connect your tools</h2>
            <p>Add your GitHub PAT and AI API key to start scanning repositories.</p>
          </div>
          <input type="password" placeholder="GitHub PAT" aria-label="GitHub personal access token" onChange={(e) => setKeys({ ...keys, github_token: e.target.value })} />
          <input type="password" placeholder="AI API key" aria-label="AI API key" onChange={(e) => setKeys({ ...keys, claude_key: e.target.value })} />
          <button className="ed-btn-ai" onClick={saveKeys}>Save keys</button>
        </div>
      )}
      <div className="ed-section-title">
        <h2>Your repositories</h2>
        <span className="ed-pill">{repos.length}</span>
      </div>
      {repos.length === 0 ? (
        <div className="ed-empty">
          <div className="ed-empty-glyph">
            <IconBox />
          </div>
          <h3>No repositories found</h3>
          <p>Connect GitHub or refresh after saving your keys.</p>
        </div>
      ) : (
        <div className="ed-repo-board">
          {repos.map((repo: any) => (
            <div key={repo.id} className={`ed-repo-card ${scanningId === repo.id ? "scanning" : ""}`}>
              <div className="ed-repo-head">
                <h3>{repo.full_name}</h3>
                {scanningId === repo.id && <span className="ed-repo-tag">Scanning…</span>}
              </div>
              <p className="ed-repo-desc">{repo.description || "No description provided."}</p>
              <div className="ed-repo-stats">
                <span className={`ed-lang-chip ${String(repo.language || "").toLowerCase()}`} />
                <span className="ed-lang-name">{repo.language || "Unknown"}</span>
                <span className="ed-star">★ {repo.stars || 0}</span>
              </div>
              <button className="ed-btn-line full" onClick={() => scan(repo)} disabled={!!scanningId} data-pending={scanningId === repo.id}>
                {scanningId === repo.id ? <Writing label="Scanning" /> : "Scan repository"}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function AssistantTab({
  result, selectedFile, openFile, fileContent, question, setQuestion, chatWithFile, chatAnswer, chatLoading,
  errorText, setErrorText, solveError, solveLoading, errorSolution, generateFix, fixing, loadRelatedFileContents,
  smartFix, fixResult, createPR, creatingPR, qaQuestion, setQaQuestion, askProject, qaAnswer, qaLoading,
  generateTests, generatingTest, testResult, createTestPR,
}: any) {
  if (!result) {
    return (
      <div className="ed-empty">
        <div className="ed-empty-glyph">
          <IconSparkle size={20} />
        </div>
        <h3>No repository selected</h3>
        <p>Scan a repository first, then use the AI Assistant.</p>
      </div>
    );
  }

  return (
    <div className="ed-assistant">
      <div className="ed-stat-grid">
        <div className="ed-stat-card">
          <span className="ed-icon-tile system"><IconFolder /></span>
          <div>
            <small>Files Scanned</small>
            <b>{result.file_tree?.length || 0}</b>
            <p>Last scan completed</p>
          </div>
        </div>

        <div className="ed-stat-card ai">
          <span className="ed-icon-tile ai"><IconSparkle /></span>
          <div>
            <small>AI Mode</small>
            <b>Active</b>
            <p>AI-powered assistant</p>
          </div>
        </div>

        <div className="ed-stat-card">
          <span className="ed-icon-tile system"><IconFile /></span>
          <div>
            <small>Selected File</small>
            <b>{selectedFile ? "Ready" : "None"}</b>
            <p>{selectedFile || "Choose file"}</p>
          </div>
        </div>
      </div>

      <div className="ed-workspace">
        <section className="ed-panel">
          <div className="ed-panel-head">
            <div>
              <h2>File Explorer</h2>
              <p>{result.file_tree?.length || 0} files indexed</p>
            </div>
            <span className="ed-badge">CODE</span>
          </div>

          <div className="ed-file-list">
            {result.file_tree?.map((file: any) => (
              <button key={file.path} className={`ed-file-item ${selectedFile === file.path ? "active" : ""}`} onClick={() => openFile(file.path)}>
                <IconFile size={13} />
                <span>{file.path}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="ed-panel">
          <div className="ed-panel-head">
            <div>
              <h2>Code Preview</h2>
              <p>{selectedFile || "No file selected"}</p>
            </div>
            <span className="ed-badge">VIEW</span>
          </div>
          <pre className="ed-code-preview">{fileContent || "Select a file from explorer to preview code."}</pre>
        </section>

        <section className="ed-panel ai-panel">
          <div className="ed-panel-head">
            <div>
              <h2>Test Generator</h2>
              <p>Generate unit tests for selected file</p>
            </div>
            <span className="ed-badge ai">AI</span>
          </div>

          <div className="ed-select-box">
            <span>{selectedFile || "Select file first"}</span>
          </div>

          <button className="ed-ai-cta" onClick={generateTests} disabled={generatingTest} data-pending={generatingTest}>
            {generatingTest ? <Writing label="Generating tests" /> : "Generate tests"}
          </button>

          {testResult && (
            <div className="ed-note">
              <h3>{testResult.summary}</h3>
              <p>{testResult.test_file}</p>
              <pre>{testResult.test_code}</pre>
              <button className="ed-btn" onClick={createTestPR} disabled={creatingPR} data-pending={creatingPR}>
                {creatingPR ? <Writing label="Creating test PR" /> : "Create test PR"}
              </button>
            </div>
          )}
        </section>

        <section className="ed-panel ai-panel">
          <div className="ed-panel-head">
            <div>
              <h2>Chat with File</h2>
              <p>Ask questions about selected code</p>
            </div>
            <span className="ed-badge ai">AI</span>
          </div>

          <div className="ed-chat-window">
            {question && (
              <div className="ed-chat-msg user">
                <span>YOU</span>
                <p>{question}</p>
              </div>
            )}
            {chatLoading && (
              <div className="ed-chat-msg ai">
                <span>AI</span>
                <p><Writing label="Reading the file" /></p>
              </div>
            )}
            {!chatLoading && chatAnswer && (
              <div className="ed-chat-msg ai">
                <span>AI</span>
                <p>{chatAnswer}</p>
              </div>
            )}
            {!chatLoading && !chatAnswer && <div className="ed-chat-empty">Ask something about this file.</div>}
          </div>

          <div className="ed-chat-input">
            <textarea placeholder="Ask anything about this file..." value={question} onChange={(e) => setQuestion(e.target.value)} />
            <button className="ed-send-btn" onClick={chatWithFile} aria-label="Send message" disabled={chatLoading} data-pending={chatLoading}>
              <IconSend />
            </button>
          </div>
        </section>

        <section className="ed-panel ai-panel wide">
          <div className="ed-panel-head">
            <div>
              <h2>Error & Fix</h2>
              <p>Explain errors, generate single-file or multi-file patches</p>
            </div>
            <span className="ed-badge ai">AI</span>
          </div>

          <textarea className="ed-error-area" placeholder="Paste stack trace or error here..." value={errorText} onChange={(e) => setErrorText(e.target.value)} />

          <div className="ed-btn-row">
            <button className="ed-btn-line" onClick={solveError} disabled={solveLoading} data-pending={solveLoading}>
              {solveLoading ? <Writing label="Explaining" /> : "Explain error"}
            </button>
            <button className="ed-btn-ai" onClick={generateFix} disabled={fixing} data-pending={fixing}>
              {fixing ? <Writing label="Generating" /> : "Generate fix"}
            </button>
            <button className="ed-btn-line" onClick={loadRelatedFileContents}>Load related files</button>
            <button className="ed-ai-cta" onClick={smartFix} disabled={fixing} data-pending={fixing}>
              {fixing ? <Writing label="Thinking" /> : "Smart fix"}
            </button>
          </div>

          {errorSolution && !solveLoading && (
            <div className="ed-note">
              <h3>Error explanation</h3>
              <pre>{errorSolution}</pre>
            </div>
          )}

          {fixResult && (
            <div className="ed-note success">
              <h3>{fixResult.file}</h3>
              <p>{fixResult.summary}</p>
              <pre>{fixResult.code}</pre>
              <button className="ed-btn" onClick={createPR} disabled={creatingPR} data-pending={creatingPR}>
                {creatingPR ? <Writing label="Creating PR" /> : "Create GitHub PR"}
              </button>
            </div>
          )}
        </section>

        <section className="ed-panel ai-panel wide">
          <div className="ed-panel-head">
            <div>
              <h2>Ask Whole Project</h2>
              <p>Ask about architecture, auth, risky files, or flow</p>
            </div>
            <span className="ed-badge ai">AI</span>
          </div>

          <div className="ed-suggest-row">
            <button onClick={() => setQaQuestion("What does this project do?")}>What does this do?</button>
            <button onClick={() => setQaQuestion("Where is authentication handled?")}>Where is auth handled?</button>
            <button onClick={() => setQaQuestion("Which file is riskiest to change?")}>Riskiest file?</button>
          </div>

          <textarea className="ed-error-area" placeholder="Ask about full codebase..." value={qaQuestion} onChange={(e) => setQaQuestion(e.target.value)} />

          <button className="ed-ai-cta" onClick={askProject} disabled={qaLoading} data-pending={qaLoading}>
            {qaLoading ? <Writing label="Reading the project" /> : "Ask project"}
          </button>

          {qaAnswer && !qaLoading && (
            <div className="ed-note">
              <pre>{qaAnswer}</pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function AnalysisTab({ resultRef, result, selectedRepo, deploy, deploying, generateDeployFix, deployFixing }: any) {
  if (!result) {
    return (
      <div ref={resultRef} className="ed-empty">
        <div className="ed-empty-glyph"><IconChart size={20} /></div>
        <h3>No analysis yet</h3>
        <p>Scan a repository to generate analysis and deploy report.</p>
      </div>
    );
  }
  return (
    <div ref={resultRef} className="ed-sheet">
      <div className="ed-sheet-head">
        <div>
          <small className="ed-kicker">{selectedRepo?.full_name}</small>
          <h2>{result.report ? "Deploy readiness report" : "Scan complete"}</h2>
        </div>
        {!result.report && (
          <button className="ed-btn" onClick={deploy} disabled={deploying} data-pending={deploying}>
            {deploying ? <Writing label="Running checks" /> : "Run deploy check →"}
          </button>
        )}
      </div>
      {result.report && (
        <>
          <div className="ed-score-wrap">
            <ScoreMeter score={result.report.score} grade={result.report.grade} />
            <div className="ed-ledger-stats">
              <div><span>Score</span><b>{result.report.score}/100</b></div>
              <div><span>Grade</span><b>{result.report.grade}</b></div>
            </div>
          </div>
          <div className="ed-markup-list">
            {result.report.checks.map((check: any, index: number) => (
              <div className="ed-markup-row" key={index}>
                <div className={`ed-markup-gutter ${check.passed ? "add" : "remove"}`}>{check.passed ? "+" : "−"}</div>
                <div className="ed-markup-body">
                  <h4>{check.name}</h4>
                  <p>{check.passed ? check.points : 0}/{check.points} pts</p>
                  {!check.passed && <small>{check.fix}</small>}
                </div>
              </div>
            ))}
          </div>
          {result.report.env_example && <pre className="ed-env">{result.report.env_example}</pre>}
          <button className="ed-btn-ai" onClick={generateDeployFix} disabled={deployFixing} data-pending={deployFixing} style={{ marginTop: 16 }}>
            {deployFixing ? <Writing label="Generating deploy fix" /> : "Generate deploy fix"}
          </button>
          <div className="ed-share-strip">
            <code>{result.report.share_url}</code>
            <button className="ed-btn-line" onClick={() => navigator.clipboard.writeText(result.report.share_url)}>Copy link</button>
          </div>
        </>
      )}
    </div>
  );
}

function PRReviewTab({ prForm, setPrForm, reviewPullRequest, reviewingPR, prReview, fixReviewIssue, fixingIssue }: any) {
  return (
    <div className="ed-keys-sheet">
      <h2><IconGitPR size={18} /> AI pull request review</h2>
      <label>Owner</label>
      <input placeholder="Suraj854204" value={prForm.owner} onChange={(e) => setPrForm({ ...prForm, owner: e.target.value })} />
      <label>Repository</label>
      <input placeholder="Booking-app" value={prForm.repo} onChange={(e) => setPrForm({ ...prForm, repo: e.target.value })} />
      <label>PR Number</label>
      <input placeholder="1" value={prForm.pull_number} onChange={(e) => setPrForm({ ...prForm, pull_number: e.target.value })} />
      <button className="ed-btn-ai full" onClick={reviewPullRequest} disabled={reviewingPR} data-pending={reviewingPR} style={{ marginTop: 20 }}>
        {reviewingPR ? <Writing label="Reviewing" /> : (<><IconSparkle size={13} /> Review PR</>)}
      </button>
      {prReview && (
        <div className="ed-sheet" style={{ marginTop: 24 }}>
          <h2>Review summary</h2>
          <p style={{ fontSize: 13, color: "var(--ink-dim)", lineHeight: 1.6 }}>{prReview.summary}</p>
          <div className="ed-ledger-stats" style={{ marginTop: 16 }}>
            <div><span>Risk</span><b>{prReview.risk_level}</b></div>
            <div><span>Issues</span><b>{prReview.issues?.length || 0}</b></div>
          </div>
          <div className="ed-markup-list" style={{ marginTop: 16 }}>
            {prReview.issues?.map((issue: any, index: number) => (
              <div className="ed-markup-row" key={index}>
                <div className="ed-markup-gutter remove">!</div>
                <div className="ed-markup-body">
                  <h4>{issue.file} — {issue.type} / {issue.severity}</h4>
                  <p>{issue.message}</p>
                  <small>{issue.suggestion}</small>
                  <button className="ed-btn" style={{ marginTop: 10 }} onClick={() => fixReviewIssue(issue)} disabled={fixingIssue} data-pending={fixingIssue}>
                    {fixingIssue ? <Writing label="Fixing" /> : "Fix this issue"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AgentTab({ result, agentInstruction, setAgentInstruction, runAgentPlan, agentRunning, agentPlan, runAgentFix }: any) {
  if (!result) {
    return (
      <div className="ed-empty">
        <div className="ed-empty-glyph"><IconZap size={20} /></div>
        <h3>No repository selected</h3>
        <p>Scan a repository first, then give the agent a task.</p>
      </div>
    );
  }
  return (
    <div className="ed-keys-sheet">
      <h2><IconRobot size={18} /> AI Agent mode</h2>
      <label>Instruction</label>
      <textarea className="ed-prompt-area" placeholder="Example: Improve auth security" value={agentInstruction} onChange={(e) => setAgentInstruction(e.target.value)} />
      <div className="ed-btn-row" style={{ marginTop: 4 }}>
        <button className="ed-btn" onClick={runAgentPlan} disabled={agentRunning} data-pending={agentRunning}>
          {agentRunning ? <Writing label="Planning" /> : "Run agent plan"}
        </button>
        <button className="ed-btn-ai" onClick={runAgentFix} disabled={agentRunning} data-pending={agentRunning}>
          {agentRunning ? <Writing label="Generating fix" /> : "Generate agent fix"}
        </button>
      </div>
      {agentPlan && (
        <div className="ed-sheet" style={{ marginTop: 24 }}>
          <h2>{agentPlan.goal}</h2>
          <div className="ed-ledger-stats">
            <div><span>Risk</span><b>{agentPlan.risk_level}</b></div>
            <div><span>Files</span><b>{agentPlan.files_to_read?.length || 0}</b></div>
          </div>
          <h3>Files to read</h3>
          <pre className="ed-output">{agentPlan.files_to_read?.join("\n")}</pre>
          <h3>Plan</h3>
          <pre className="ed-output">{agentPlan.plan?.map((x: string, i: number) => `${i + 1}. ${x}`).join("\n")}</pre>
        </div>
      )}
    </div>
  );
}

function SecurityTab({ result, security, securityLoading, runSecurityScan, fixSecurityIssue, fixingIssue }: any) {
  if (!result) {
    return (
      <div className="ed-empty">
        <div className="ed-empty-glyph"><IconShield size={20} /></div>
        <h3>No repository selected</h3>
        <p>Scan a repository first, then run the security scanner.</p>
      </div>
    );
  }
  return (
    <div className="ed-sheet">
      <h2><IconShield size={18} /> Security scanner</h2>
      <button className="ed-btn" onClick={runSecurityScan} disabled={securityLoading} data-pending={securityLoading}>
        {securityLoading ? <Writing label="Scanning" /> : "Run security scan"}
      </button>
      {security && (
        <>
          <div className="ed-score-wrap" style={{ marginTop: 20 }}>
            <ScoreMeter score={security.score} grade={security.risk} />
          </div>
          <div className="ed-markup-list">
            {security.issues.map((issue: any, i: number) => (
              <div className="ed-markup-row" key={i}>
                <div className="ed-markup-gutter remove">!</div>
                <div className="ed-markup-body">
                  <h4>{issue.file}</h4>
                  <p>{issue.message}</p>
                  <small>{issue.fix}</small>
                  <button className="ed-btn" style={{ marginTop: 10 }} onClick={() => fixSecurityIssue(issue)} disabled={fixingIssue} data-pending={fixingIssue}>
                    {fixingIssue ? <Writing label="Fixing" /> : "Fix security issue"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ArchitectureTab({ result, architecture, architectureLoading, generateArchitecture }: any) {
  if (!result) {
    return (
      <div className="ed-empty">
        <div className="ed-empty-glyph"><IconSitemap size={20} /></div>
        <h3>No repository selected</h3>
        <p>Scan a repository first, then generate its architecture diagram.</p>
      </div>
    );
  }
  return (
    <div className="ed-sheet">
      <h2><IconSitemap size={18} /> Architecture diagram</h2>
      <button className="ed-btn" onClick={generateArchitecture} disabled={architectureLoading} data-pending={architectureLoading}>
        {architectureLoading ? <Writing label="Generating" /> : "Generate architecture"}
      </button>
      {architecture && (
        <>
          <h3>Summary</h3>
          <p style={{ color: "var(--ink)", fontSize: 13, lineHeight: 1.6 }}>{architecture.summary}</p>
          <h3>Stack</h3>
          <pre className="ed-output">{architecture.stack?.join("\n")}</pre>
          <h3>Layers</h3>
          <div className="ed-markup-list">
            {architecture.layers?.map((layer: any, i: number) => (
              <div className="ed-markup-row" key={i}>
                <div className="ed-markup-gutter add">{i + 1}</div>
                <div className="ed-markup-body">
                  <h4>{layer.name}</h4>
                  <p>{layer.responsibility}</p>
                  <small>{layer.files?.join(", ")}</small>
                </div>
              </div>
            ))}
          </div>
          <h3>Data flow</h3>
          <pre className="ed-output">{architecture.data_flow?.map((x: string, i: number) => `${i + 1}. ${x}`).join("\n")}</pre>
          <h3>Mermaid diagram</h3>
          <pre className="ed-output">{architecture.diagram_mermaid}</pre>
        </>
      )}
    </div>
  );
}

function CodeSearchTab({ result, codeSearchQuestion, setCodeSearchQuestion, runCodeSearch, codeSearchLoading, codeSearchResult }: any) {
  if (!result) {
    return (
      <div className="ed-empty">
        <div className="ed-empty-glyph"><IconSearch size={20} /></div>
        <h3>No repository selected</h3>
        <p>Scan a repository first, then search your codebase.</p>
      </div>
    );
  }
  return (
    <div className="ed-sheet">
      <h2><IconSearch size={18} /> AI code search</h2>
      <textarea className="ed-prompt-area" placeholder="Where is authentication handled?" value={codeSearchQuestion} onChange={(e) => setCodeSearchQuestion(e.target.value)} />
      <button className="ed-btn" onClick={runCodeSearch} disabled={codeSearchLoading} data-pending={codeSearchLoading}>
        {codeSearchLoading ? <Writing label="Searching" /> : "Search codebase"}
      </button>
      {codeSearchResult && (
        <>
          <h3>Answer</h3>
          <p style={{ color: "var(--ink)", fontSize: 13, lineHeight: 1.6 }}>{codeSearchResult.answer}</p>
          <h3>Relevant files</h3>
          <div className="ed-markup-list">
            {codeSearchResult.relevant_files?.map((item: any, i: number) => (
              <div className="ed-markup-row" key={i}>
                <div className="ed-markup-gutter add">{i + 1}</div>
                <div className="ed-markup-body">
                  <h4>{item.file}</h4>
                  <p>{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
          <h3>Flow</h3>
          <pre className="ed-output">{codeSearchResult.flow?.map((x: string, i: number) => `${i + 1}. ${x}`).join("\n")}</pre>
          <h3>Next action</h3>
          <p style={{ color: "var(--ink-dim)", fontSize: 13 }}>{codeSearchResult.next_action}</p>
        </>
      )}
    </div>
  );
}

function KeysTab({ keys, setKeys, saveKeys }: any) {
  return (
    <div className="ed-keys-sheet">
      <h2><IconKey size={18} /> API keys</h2>
      <label>GitHub PAT</label>
      <input type="password" placeholder="github_pat_..." onChange={(e) => setKeys({ ...keys, github_token: e.target.value })} />
      <p>Required scopes: repository metadata and contents read-only.</p>
      <label>AI API key</label>
      <input type="password" placeholder="AI API key" onChange={(e) => setKeys({ ...keys, claude_key: e.target.value })} />
      <p>Used for code classification, analysis, and deploy suggestions.</p>
      <button className="ed-btn" onClick={saveKeys}>Save keys</button>
    </div>
  );
}

function ScoreMeter({ score, grade }: { score: number; grade: string }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="ed-stamp">
      <div className="ed-stamp-svg">
        <svg width="130" height="130" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={radius} className="ed-stamp-track" />
          <circle cx="65" cy="65" r={radius} className="ed-stamp-progress" strokeDasharray={circumference} strokeDashoffset={offset} />
        </svg>
      </div>
      <div className="ed-stamp-center">
        <b>{score}</b>
        <span>/100</span>
        <span className={`ed-stamp-grade grade-${String(grade).toLowerCase()}`}>{grade}</span>
      </div>
    </div>
  );
}
