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
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2.5l1.9 6.2 6.2 1.9-6.2 1.9L12 18.7l-1.9-6.2-6.2-1.9 6.2-1.9L12 2.5z" />
    </svg>
  );
}
function IconFolder({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8A2 2 0 0 1 21 9.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    </svg>
  );
}
function IconChart({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 20V10M11 20V4M18 20v-7" />
    </svg>
  );
}
function IconGitPR({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
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
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l8-8M16 7l2 2M13 10l2 2" />
    </svg>
  );
}
function IconFile({ size = 14, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M14 3v4h4" />
    </svg>
  );
}
function IconSend({ size = 14, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 3L3 10.5l7 2.7L13 21l8-18z" />
      <path d="M10.2 13.2L21 3" />
    </svg>
  );
}
function IconWrench({ size = 14, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.7 6.3a4 4 0 1 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.6-.6-.6-2.6 2.5-2.1z" />
    </svg>
  );
}
function IconAlert({ size = 14, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3.5L21.5 20H2.5L12 3.5z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconLink({ size = 14, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9.5 14.5l5-5" />
      <path d="M11 6.5l1-1a3.5 3.5 0 1 1 5 5l-1 1M13 17.5l-1 1a3.5 3.5 0 1 1-5-5l1-1" />
    </svg>
  );
}
function IconZap({ size = 14, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}
function IconGitBranch({ size = 14, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="6" cy="5" r="2.2" />
      <circle cx="6" cy="19" r="2.2" />
      <circle cx="17" cy="12" r="2.2" />
      <path d="M6 7.2V16.8" />
      <path d="M6 9a6 6 0 0 0 6 6h2.8" />
    </svg>
  );
}
function IconBox({ size = 18, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8M12 13v8" />
    </svg>
  );
}
function IconRobot({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line
        x1="8"
        y1="16"
        x2="8"
        y2="16"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="16"
        x2="16"
        y2="16"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M6 11V9a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function IconShield({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3l8 4v5c0 5-3.5 9.7-8 11C7.5 21.7 4 17 4 12V7l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconSitemap({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <rect x="3" y="17" width="6" height="4" rx="1" />
      <rect x="15" y="17" width="6" height="4" rx="1" />
      <path d="M12 7v4M12 11H6v6M12 11h6v6" />
    </svg>
  );
}
function IconSearch({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
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
  const [errorText, setErrorText] = useState("");
  const [errorSolution, setErrorSolution] = useState("");
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState("");
  const [fixResult, setFixResult] = useState<any>(null);
  const [fixing, setFixing] = useState(false);
  const [creatingPR, setCreatingPR] = useState(false);
  const [fixingIssue, setFixingIssue] = useState(false);
  const [prForm, setPrForm] = useState({
    owner: "",
    repo: "",
    pull_number: "",
  });
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

  const resultRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    authApi
      .me()
      .then((r) => setUser(r.data))
      .catch(() => (location.href = "/"));
    reposApi
      .listGithub()
      .then((r) => setRepos(r.data))
      .catch(() => setRepos([]));
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
      } catch (_) { }
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
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
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
    const res = await reposApi.getFile({
      owner: selectedRepo.owner,
      repo: selectedRepo.name,
      path,
    });
    setFileContent(res.data.content);
  }

  async function generateFix() {
    if (!selectedFile || !fileContent) return alert("Select file first");
    if (!errorText) return alert("Paste error first");
    setFixing(true);
    try {
      const res = await aiApi.autoFix({
        file_name: selectedFile,
        file_content: fileContent,
        error_text: errorText,
      });
      setFixResult({
        file: selectedFile,
        summary: res.data.summary,
        code: res.data.fixed_code,
      });
    } finally {
      setFixing(false);
    }
  }

  async function createPR() {
    if (!fixResult) return alert("Generate fix first");
    setCreatingPR(true);
    try {
      const branch = await reposApi.createBranch({
        owner: selectedRepo.owner,
        repo: selectedRepo.name,
      });
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
    if (!prForm.owner || !prForm.repo || !prForm.pull_number)
      return alert("owner, repo and PR number required");
    setReviewingPR(true);
    try {
      const filesRes = await reposApi.getPRFiles({
        owner: prForm.owner,
        repo: prForm.repo,
        pull_number: prForm.pull_number,
      });
      const reviewRes = await aiApi.reviewPR({ files: filesRes.data.files });
      setPrReview(reviewRes.data);
    } finally {
      setReviewingPR(false);
    }
  }

  async function chatWithFile() {
    if (!selectedFile || !fileContent) return alert("Select file first");
    const res = await aiApi.chat({
      repo_id: result.repo_id,
      file_name: selectedFile,
      file_content: fileContent,
      message: question,
    });
    setChatAnswer(res.data.response);
  }

  async function solveError() {
    if (!selectedFile || !fileContent) return alert("Select file first");
    const res = await aiApi.solveError({
      file_name: selectedFile,
      file_content: fileContent,
      error_text: errorText,
    });
    setErrorSolution(res.data.solution);
  }

  async function loadRelatedFileContents() {
    if (!result || !selectedRepo || !selectedFile)
      return alert("Scan repo and select file first");
    const relatedRes = await reposApi.relatedFiles({
      file_tree: result.file_tree,
      selected_file: selectedFile,
      error_text: errorText,
    });
    const relatedPaths = relatedRes.data.related_files;
    const files = await Promise.all(
      relatedPaths.map(async (path: string) => {
        const res = await reposApi.getFile({
          owner: selectedRepo.owner,
          repo: selectedRepo.name,
          path,
        });
        return { path, content: res.data.content };
      }),
    );
    return files;
  }

  async function smartFix() {
    if (!result || !selectedRepo || !selectedFile)
      return alert("Scan repo and select file first");
    if (!errorText) return alert("Paste error first");
    setFixing(true);
    try {
      const files = await loadRelatedFileContents();
      if (!files) return;
      const res = await aiApi.multiFileFix({
        selected_file: selectedFile,
        error_text: errorText,
        files,
      });
      setFixResult({
        file: res.data.target_file,
        summary: res.data.summary,
        code: res.data.fixed_code,
      });
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
          const res = await reposApi.getFile({
            owner: selectedRepo.owner || prForm.owner,
            repo: selectedRepo.name || prForm.repo,
            path,
          });
          return { path, content: res.data.content };
        }),
      );
      const fix = await aiApi.fixReviewIssue({ issue, files });
      setFixResult({
        file: fix.data.target_file,
        summary: fix.data.summary,
        code: fix.data.fixed_code,
      });
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
      const res = await aiApi.agentPlan({
        instruction: agentInstruction,
        file_tree: result.file_tree,
        key_files: result.key_files,
      });
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
          const res = await reposApi.getFile({
            owner: selectedRepo.owner,
            repo: selectedRepo.name,
            path,
          });
          return { path, content: res.data.content };
        }),
      );
      const fix = await aiApi.agentFix({
        instruction: agentInstruction,
        plan: agentPlan,
        files,
      });
      setFixResult({
        file: fix.data.target_file,
        summary: fix.data.summary,
        code: fix.data.fixed_code,
      });
      setActiveTab("assistant");
    } finally {
      setAgentRunning(false);
    }
  }

  async function runSecurityScan() {
    if (!result) return alert("Scan repo first");
    setSecurityLoading(true);
    try {
      const res = await aiApi.securityScan({
        file_tree: result.file_tree,
        key_files: result.key_files,
      });
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
          const res = await reposApi.getFile({
            owner: selectedRepo.owner,
            repo: selectedRepo.name,
            path,
          });
          return { path, content: res.data.content };
        }),
      );
      const fix = await aiApi.fixReviewIssue({ issue, files });
      setFixResult({
        file: fix.data.target_file || fix.data.file,
        summary: fix.data.summary,
        code: fix.data.fixed_code,
      });
      setActiveTab("assistant");
    } finally {
      setFixingIssue(false);
    }
  }

  async function generateTests() {
    if (!selectedFile || !fileContent) return alert("Select file first");
    setGeneratingTest(true);
    try {
      const res = await aiApi.generateTests({
        file_name: selectedFile,
        file_content: fileContent,
        framework: "jest",
      });
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
      const branch = await reposApi.createBranch({
        owner: selectedRepo.owner,
        repo: selectedRepo.name,
      });
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
      const res = await aiApi.architecture({
        file_tree: result.file_tree,
        key_files: result.key_files,
      });
      setArchitecture(res.data);
    } finally {
      setArchitectureLoading(false);
    }
  }

  async function askProject() {
    if (!result) return alert("Scan repo first");
    const res = await aiApi.qa({
      question: qaQuestion,
      file_tree: result.file_tree,
      key_files: result.key_files,
    });
    setQaAnswer(res.data.answer);
  }

  async function runCodeSearch() {
    if (!result) return alert("Scan repo first");
    if (!codeSearchQuestion) return alert("Enter question");
    setCodeSearchLoading(true);
    try {
      const res = await aiApi.codeSearch({
        question: codeSearchQuestion,
        file_tree: result.file_tree,
        key_files: result.key_files,
      });
      setCodeSearchResult(res.data);
    } finally {
      setCodeSearchLoading(false);
    }
  }

  async function generateDeployFix() {
    if (!result?.report) return alert("Run deploy check first");
    setDeployFixing(true);
    try {
      const res = await aiApi.deployFix({
        report: result.report,
        file_tree: result.file_tree,
        key_files: result.key_files,
      });
      setFixResult({
        file: res.data.target_file,
        summary: res.data.summary,
        code: res.data.fixed_code,
      });
      setActiveTab("assistant");
    } finally {
      setDeployFixing(false);
    }
  }

  const hasKeys = !!(user?.hasGithub && user?.hasClaudeKey);
  const step = result?.report ? 4 : result ? 3 : repos.length ? 1 : 0;
  const initials =
    user?.name?.slice(0, 2).toUpperCase() ||
    user?.email?.slice(0, 2).toUpperCase() ||
    "U";

  const getHeaderMeta = () => {
    switch (activeTab) {
      case "repos":
        return {
          title: "Repositories",
          subtitle: `${repos.length} repositories available`,
        };
      case "analysis":
        return {
          title: "Analysis",
          subtitle:
            selectedRepo?.full_name || "Scan a repository to begin analysis",
        };
      case "assistant":
        return {
          title: "AI Assistant",
          subtitle:
            selectedRepo?.full_name ||
            "Chat with files, solve errors, and ask project questions",
        };
      case "pr-review":
        return {
          title: "PR Review",
          subtitle: "Review GitHub pull request changes with AI",
        };
      case "agent":
        return {
          title: "AI Agent",
          subtitle:
            selectedRepo?.full_name ||
            "Give the agent a repo-level coding task and review its plan",
        };
      case "security":
        return {
          title: "Security Scanner",
          subtitle:
            selectedRepo?.full_name ||
            "Scan your repository for vulnerabilities",
        };
      case "architecture":
        return {
          title: "Architecture Diagram",
          subtitle:
            selectedRepo?.full_name ||
            "Visualize your repository's architecture and data flow",
        };
      case "code-search":
        return {
          title: "AI Code Search",
          subtitle:
            selectedRepo?.full_name ||
            "Search your codebase with natural language",
        };
      case "keys":
        return {
          title: "API Keys",
          subtitle: "Manage GitHub and AI API credentials",
        };
      default:
        return { title: "CodeCompanion", subtitle: "" };
    }
  };

  const { title, subtitle } = getHeaderMeta();

  const navItems = [
    {
      tab: "assistant" as Tab,
      icon: <IconSparkle size={15} />,
      label: "AI Assistant",
      kind: "ai",
      badge: result ? <b className="nav-count lit-ai">AI</b> : null,
    },
    {
      tab: "repos" as Tab,
      icon: <IconFolder />,
      label: "Repositories",
      badge: <b className="nav-count">{repos.length}</b>,
    },
    {
      tab: "analysis" as Tab,
      icon: <IconChart />,
      label: "Analysis",
      badge: result ? <b className="nav-count lit">1</b> : null,
    },
    { tab: "pr-review" as Tab, icon: <IconGitPR />, label: "PR Review" },
    { tab: "keys" as Tab, icon: <IconKey />, label: "API Keys" },
    { tab: "agent" as Tab, icon: <IconRobot />, label: "AI Agent" },
    { tab: "security" as Tab, icon: <IconShield />, label: "Security" },
    {
      tab: "architecture" as Tab,
      icon: <IconSitemap />,
      label: "Architecture",
    },
    { tab: "code-search" as Tab, icon: <IconSearch />, label: "Code Search" },
  ];

  return (
    <main className="cc-app">
      <div className="glow glow-one" />
      <div className="glow glow-two" />
      <div className="glow glow-three" />

      <div className="layout">
        <aside className="cc-sidebar">
          <div className="brand-row">
            <div className="brand-mark">{">"}_ </div>
            <div className="brand-name">
              Code<b>Companion</b>
            </div>
          </div>

          <div className="nav-label">Navigation</div>

          <nav className="nav-rail" aria-label="Primary">
            {navItems.map(({ tab, icon, label, kind, badge }) => (
              <button
                key={tab}
                className={`nav-rail-item ${activeTab === tab ? "active" : ""}`}
                data-kind={kind}
                aria-current={activeTab === tab ? "page" : undefined}
                onClick={() => setActiveTab(tab)}
              >
                <span className="nav-glyph-svg">{icon}</span>
                <span className="nav-text">{label}</span>
                {badge}
              </button>
            ))}
          </nav>

          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-meta">
              <p>{user?.name || "Developer"}</p>
              <small>{user?.email || "developer@example.com"}</small>
            </div>
            <span
              className="plan-chip"
              role="img"
              aria-label="Free plan"
              title="Free plan"
            >
              ●
            </span>

            <button
              className="logout-btn"
              onClick={logout}
              title="Logout"
              aria-label="Logout"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </aside>

        <section className="cc-main">
          <header className="top-strip">
            <div className="top-meta">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            <div className="ci-steps">
              {["Connect", "Scan", "Classify", "Report"].map((label, i) => {
                const n = i + 1;
                const isDone = step >= n;
                const isCurrent = step + 1 === n;
                return (
                  <div
                    className={`ci-step ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
                    key={label}
                  >
                    <div
                      className={`ci-node ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
                    >
                      {isDone ? "✓" : n}
                    </div>
                    <span>{label}</span>
                    {i < 3 && (
                      <div className={`ci-track ${step > n ? "done" : ""}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </header>

          <div className="view">
            {activeTab === "repos" && (
              <RepositoriesTab
                hasKeys={hasKeys}
                keys={keys}
                setKeys={setKeys}
                saveKeys={saveKeys}
                repos={repos}
                scanningId={scanningId}
                scan={scan}
              />
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
                errorText={errorText}
                setErrorText={setErrorText}
                solveError={solveError}
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
              <ArchitectureTab
                result={result}
                architecture={architecture}
                architectureLoading={architectureLoading}
                generateArchitecture={generateArchitecture}
              />
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
            {activeTab === "keys" && (
              <KeysTab keys={keys} setKeys={setKeys} saveKeys={saveKeys} />
            )}
          </div>
        </section>
      </div>

      {toast && (
        <div className="toast-strip" role="status" aria-live="polite">
          <span className="toast-check">✓</span> Keys saved successfully
        </div>
      )}
    </main>
  );
}

function RepositoriesTab({
  hasKeys,
  keys,
  setKeys,
  saveKeys,
  repos,
  scanningId,
  scan,
}: any) {
  return (
    <>
      {!hasKeys && (
        <div className="setup-strip">
          <div className="setup-glyph">
            <IconKey size={16} />
          </div>
          <div className="setup-copy">
            <h2>Connect your tools</h2>
            <p>
              Add your GitHub PAT and AI API key to start scanning repositories.
            </p>
          </div>
          <input
            type="password"
            placeholder="GitHub PAT"
            aria-label="GitHub personal access token"
            onChange={(e) => setKeys({ ...keys, github_token: e.target.value })}
          />
          <input
            type="password"
            placeholder="AI API key"
            aria-label="AI API key"
            onChange={(e) => setKeys({ ...keys, claude_key: e.target.value })}
          />
          <button className="btn-solid" onClick={saveKeys}>
            Save keys
          </button>
        </div>
      )}
      <div className="section-title">
        <h2>Your repositories</h2>
        <span className="count-pill">{repos.length}</span>
      </div>
      {repos.length === 0 ? (
        <div className="empty-block">
          <div className="empty-glyph">
            <IconBox />
          </div>
          <h3>No repositories found</h3>
          <p>Connect GitHub or refresh after saving your keys.</p>
        </div>
      ) : (
        <div className="repo-board">
          {repos.map((repo: any) => (
            <div
              key={repo.id}
              className={`repo-row ${scanningId === repo.id ? "scanning" : ""}`}
            >
              <div className="repo-row-head">
                <h3>{repo.full_name}</h3>
                {scanningId === repo.id && (
                  <span className="repo-tag">Scanning…</span>
                )}
              </div>
              <p className="repo-desc">
                {repo.description || "No description provided."}
              </p>
              <div className="repo-stats">
                <span
                  className={`lang-chip ${String(repo.language || "").toLowerCase()}`}
                />
                <span className="lang-name">{repo.language || "Unknown"}</span>
                <span className="star-count">★ {repo.stars || 0}</span>
              </div>
              <button
                className="btn-line full"
                onClick={() => scan(repo)}
                disabled={!!scanningId}
              >
                {scanningId === repo.id && <span className="spinner" />}
                {scanningId === repo.id ? "Scanning…" : "$ scan repository"}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function AssistantTab({
  result,
  selectedFile,
  openFile,
  fileContent,
  question,
  setQuestion,
  chatWithFile,
  chatAnswer,
  errorText,
  setErrorText,
  solveError,
  errorSolution,
  generateFix,
  fixing,
  loadRelatedFileContents,
  smartFix,
  fixResult,
  createPR,
  creatingPR,
  qaQuestion,
  setQaQuestion,
  askProject,
  qaAnswer,
  generateTests,
  generatingTest,
  testResult,
  createTestPR,
}: any) {
  if (!result) {
    return (
      <div className="empty-block">
        <div className="empty-glyph">
          <IconSparkle size={20} />
        </div>
        <h3>No repository selected</h3>
        <p>Scan a repository first, then use the AI Assistant.</p>
      </div>
    );
  }

  return (
    <div className="pro-assistant">
      <div className="pro-top-grid">
        <div className="pro-stat-card">
          <span className="icon-tile cyan">
            <IconFolder />
          </span>
          <div>
            <small>Files Scanned</small>
            <b>{result.file_tree?.length || 0}</b>
            <p>Last scan completed</p>
          </div>
        </div>

        <div className="pro-stat-card ai">
          <span className="icon-tile ai">
            <IconSparkle />
          </span>
          <div>
            <small>AI Mode</small>
            <b>Active</b>
            <p>Gemini powered assistant</p>
          </div>
        </div>

        <div className="pro-stat-card">
          <span className="icon-tile cyan">
            <IconFile />
          </span>
          <div>
            <small>Selected File</small>
            <b>{selectedFile ? "Ready" : "None"}</b>
            <p>{selectedFile || "Choose file"}</p>
          </div>
        </div>
      </div>

      <div className="pro-workspace">
        <section className="pro-card file-card">
          <div className="pro-card-head">
            <div>
              <h2>File Explorer</h2>
              <p>{result.file_tree?.length || 0} files indexed</p>
            </div>
            <span className="ai-badge">CODE</span>
          </div>

          <div className="pro-file-list">
            {result.file_tree?.map((file: any) => (
              <button
                key={file.path}
                className={`pro-file-item ${selectedFile === file.path ? "active" : ""}`}
                onClick={() => openFile(file.path)}
              >
                <IconFile size={13} />
                <span>{file.path}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="pro-card preview-card">
          <div className="pro-card-head">
            <div>
              <h2>Code Preview</h2>
              <p>{selectedFile || "No file selected"}</p>
            </div>
            <span className="ai-badge">VIEW</span>
          </div>

          <pre className="pro-code-preview">
            {fileContent || "Select a file from explorer to preview code."}
          </pre>
        </section>

        <section className="pro-card ai-card">
          <div className="pro-card-head">
            <div>
              <h2>Test Generator</h2>
              <p>Generate unit tests for selected file</p>
            </div>
            <span className="ai-badge gold">AI</span>
          </div>

          <div className="pro-select-box">
            <span>{selectedFile || "Select file first"}</span>
          </div>

          <button
            className="pro-gold-btn"
            onClick={generateTests}
            disabled={generatingTest}
          >
            {generatingTest ? "Generating Tests..." : "✦ Generate Tests"}
          </button>

          {testResult && (
            <div className="pro-result">
              <h3>{testResult.summary}</h3>
              <p>{testResult.test_file}</p>
              <pre>{testResult.test_code}</pre>

              <button
                className="btn-solid"
                onClick={createTestPR}
                disabled={creatingPR}
              >
                {creatingPR ? "Creating Test PR..." : "Create Test PR"}
              </button>
            </div>
          )}
        </section>

        <section className="pro-card ai-card chat-card">
          <div className="pro-card-head">
            <div>
              <h2>Chat with File</h2>
              <p>Ask questions about selected code</p>
            </div>
            <span className="ai-badge gold">AI</span>
          </div>

          <div className="pro-chat-window">
            {question && (
              <div className="chat-msg user">
                <span>YOU</span>
                <p>{question}</p>
              </div>
            )}

            {chatAnswer && (
              <div className="chat-msg ai">
                <span>AI</span>
                <p>{chatAnswer}</p>
              </div>
            )}

            {!chatAnswer && (
              <div className="chat-empty">Ask something about this file.</div>
            )}
          </div>

          <div className="pro-chat-input">
            <textarea
              placeholder="Ask anything about this file..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              className="pro-send-btn"
              onClick={chatWithFile}
              aria-label="Send message"
            >
              <IconSend />
            </button>
          </div>
        </section>

        <section className="pro-card ai-card wide">
          <div className="pro-card-head">
            <div>
              <h2>Error & Fix</h2>
              <p>Explain errors, generate single-file or multi-file patches</p>
            </div>
            <span className="ai-badge gold">AI</span>
          </div>

          <textarea
            className="pro-error-area"
            placeholder="Paste stack trace or error here..."
            value={errorText}
            onChange={(e) => setErrorText(e.target.value)}
          />

          <div className="btn-row">
            <button className="btn-line" onClick={solveError}>
              Explain error
            </button>

            <button className="btn-ai" onClick={generateFix} disabled={fixing}>
              {fixing ? "Generating..." : "Generate fix"}
            </button>

            <button className="btn-line" onClick={loadRelatedFileContents}>
              Load related files
            </button>

            <button
              className="pro-gold-btn"
              onClick={smartFix}
              disabled={fixing}
            >
              {fixing ? "Thinking..." : "Smart Fix"}
            </button>
          </div>

          {errorSolution && (
            <div className="pro-result">
              <h3>Error Explanation</h3>
              <pre>{errorSolution}</pre>
            </div>
          )}

          {fixResult && (
            <div className="pro-result success">
              <h3>{fixResult.file}</h3>
              <p>{fixResult.summary}</p>
              <pre>{fixResult.code}</pre>

              <button
                className="btn-solid"
                onClick={createPR}
                disabled={creatingPR}
              >
                {creatingPR ? "Creating PR..." : "Create GitHub PR"}
              </button>
            </div>
          )}
        </section>

        <section className="pro-card ai-card wide">
          <div className="pro-card-head">
            <div>
              <h2>Ask Whole Project</h2>
              <p>Ask about architecture, auth, risky files, or flow</p>
            </div>
            <span className="ai-badge gold">AI</span>
          </div>

          <div className="suggest-row">
            <button onClick={() => setQaQuestion("What does this project do?")}>
              What does this do?
            </button>
            <button
              onClick={() => setQaQuestion("Where is authentication handled?")}
            >
              Where is auth handled?
            </button>
            <button
              onClick={() => setQaQuestion("Which file is riskiest to change?")}
            >
              Riskiest file?
            </button>
          </div>

          <textarea
            className="pro-error-area"
            placeholder="Ask about full codebase..."
            value={qaQuestion}
            onChange={(e) => setQaQuestion(e.target.value)}
          />

          <button className="pro-gold-btn" onClick={askProject}>
            Ask Project
          </button>

          {qaAnswer && (
            <div className="pro-result">
              <pre>{qaAnswer}</pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function AnalysisTab({
  resultRef,
  result,
  selectedRepo,
  deploy,
  deploying,
  generateDeployFix,
  deployFixing,
}: any) {
  if (!result) {
    return (
      <div ref={resultRef} className="empty-block">
        <div className="empty-glyph">
          <IconChart size={20} />
        </div>
        <h3>No analysis yet</h3>
        <p>Scan a repository to generate analysis and deploy report.</p>
      </div>
    );
  }
  return (
    <div ref={resultRef} className="report-card">
      <div className="report-head">
        <div>
          <small className="kicker">{selectedRepo?.full_name}</small>
          <h2>{result.report ? "Deploy readiness report" : "Scan complete"}</h2>
        </div>
        {!result.report && (
          <button className="btn-solid" onClick={deploy} disabled={deploying}>
            {deploying && <span className="spinner" />}
            {deploying ? "Running checks…" : "Run deploy check →"}
          </button>
        )}
      </div>
      {result.report && (
        <>
          <div className="score-wrap">
            <ScoreMeter
              score={result.report.score}
              grade={result.report.grade}
            />
            <div className="ledger-stats">
              <div>
                <span>Score</span>
                <b>{result.report.score}/100</b>
              </div>
              <div>
                <span>Grade</span>
                <b>{result.report.grade}</b>
              </div>
            </div>
          </div>
          <div className="diff-list">
            {result.report.checks.map((check: any, index: number) => (
              <div className="diff-row" key={index}>
                <div
                  className={`diff-gutter ${check.passed ? "add" : "remove"}`}
                >
                  {check.passed ? "+" : "−"}
                </div>
                <div className="diff-body">
                  <h4>{check.name}</h4>
                  <p>
                    {check.passed ? check.points : 0}/{check.points} pts
                  </p>
                  {!check.passed && <small>{check.fix}</small>}
                </div>
              </div>
            ))}
          </div>
          {result.report.env_example && (
            <pre className="env-panel">{result.report.env_example}</pre>
          )}
          <button
            className="btn-solid"
            onClick={generateDeployFix}
            disabled={deployFixing}
            style={{ marginTop: 16 }}
          >
            {deployFixing ? "Generating Deploy Fix..." : "Generate Deploy Fix"}
          </button>
          <div className="share-strip">
            <code>{result.report.share_url}</code>
            <button
              className="btn-line"
              onClick={() =>
                navigator.clipboard.writeText(result.report.share_url)
              }
            >
              Copy link
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function PRReviewTab({
  prForm,
  setPrForm,
  reviewPullRequest,
  reviewingPR,
  prReview,
  fixReviewIssue,
  fixingIssue,
}: any) {
  return (
    <div className="keys-card">
      <h2>
        <IconGitPR size={18} /> AI pull request review
      </h2>
      <label>Owner</label>
      <input
        placeholder="Suraj854204"
        value={prForm.owner}
        onChange={(e) => setPrForm({ ...prForm, owner: e.target.value })}
      />
      <label>Repository</label>
      <input
        placeholder="Booking-app"
        value={prForm.repo}
        onChange={(e) => setPrForm({ ...prForm, repo: e.target.value })}
      />
      <label>PR Number</label>
      <input
        placeholder="1"
        value={prForm.pull_number}
        onChange={(e) => setPrForm({ ...prForm, pull_number: e.target.value })}
      />
      <button
        className="btn-ai full"
        onClick={reviewPullRequest}
        disabled={reviewingPR}
        style={{ marginTop: 20 }}
      >
        {reviewingPR ? (
          <span className="spinner spinner-ai" />
        ) : (
          <IconSparkle size={13} />
        )}
        {reviewingPR ? "Reviewing…" : "Review PR"}
      </button>
      {prReview && (
        <div className="report-card" style={{ marginTop: 24 }}>
          <h2>Review summary</h2>
          <p style={{ fontSize: 13, color: "var(--ink-dim)", lineHeight: 1.6 }}>
            {prReview.summary}
          </p>
          <div className="ledger-stats" style={{ marginTop: 16 }}>
            <div>
              <span>Risk</span>
              <b>{prReview.risk_level}</b>
            </div>
            <div>
              <span>Issues</span>
              <b>{prReview.issues?.length || 0}</b>
            </div>
          </div>
          <div className="diff-list" style={{ marginTop: 16 }}>
            {prReview.issues?.map((issue: any, index: number) => (
              <div className="diff-row" key={index}>
                <div className="diff-gutter remove">!</div>
                <div className="diff-body">
                  <h4>
                    {issue.file} — {issue.type} / {issue.severity}
                  </h4>
                  <p>{issue.message}</p>
                  <small>{issue.suggestion}</small>
                  <button
                    className="btn-solid"
                    style={{ marginTop: 10 }}
                    onClick={() => fixReviewIssue(issue)}
                    disabled={fixingIssue}
                  >
                    {fixingIssue && <span className="spinner" />}
                    {fixingIssue ? "Fixing..." : "🤖 Fix This Issue"}
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

function AgentTab({
  result,
  agentInstruction,
  setAgentInstruction,
  runAgentPlan,
  agentRunning,
  agentPlan,
  runAgentFix,
}: any) {
  if (!result) {
    return (
      <div className="empty-block">
        <div className="empty-glyph">
          <IconZap size={20} />
        </div>
        <h3>No repository selected</h3>
        <p>Scan a repository first, then give the agent a task.</p>
      </div>
    );
  }
  return (
    <div className="keys-card">
      <h2>
        <IconRobot size={18} /> AI Agent Mode
      </h2>
      <label>Instruction</label>
      <textarea
        className="prompt-area"
        placeholder="Example: Improve auth security"
        value={agentInstruction}
        onChange={(e) => setAgentInstruction(e.target.value)}
      />
      <div className="btn-row" style={{ marginTop: 4 }}>
        <button
          className="btn-solid"
          onClick={runAgentPlan}
          disabled={agentRunning}
        >
          {agentRunning && <span className="spinner" />}
          {agentRunning ? "Planning..." : "Run Agent Plan"}
        </button>
        <button
          className="btn-ai"
          onClick={runAgentFix}
          disabled={agentRunning}
        >
          {agentRunning ? "Generating Fix..." : "Generate Agent Fix"}
        </button>
      </div>
      {agentPlan && (
        <div className="report-card" style={{ marginTop: 24 }}>
          <h2>{agentPlan.goal}</h2>
          <div className="ledger-stats">
            <div>
              <span>Risk</span>
              <b>{agentPlan.risk_level}</b>
            </div>
            <div>
              <span>Files</span>
              <b>{agentPlan.files_to_read?.length || 0}</b>
            </div>
          </div>
          <h3>Files to read</h3>
          <pre className="output-pane">
            {agentPlan.files_to_read?.join("\n")}
          </pre>
          <h3>Plan</h3>
          <pre className="output-pane">
            {agentPlan.plan
              ?.map((x: string, i: number) => `${i + 1}. ${x}`)
              .join("\n")}
          </pre>
        </div>
      )}
    </div>
  );
}

function SecurityTab({
  result,
  security,
  securityLoading,
  runSecurityScan,
  fixSecurityIssue,
  fixingIssue,
}: any) {
  if (!result) {
    return (
      <div className="empty-block">
        <div className="empty-glyph">
          <IconShield size={20} />
        </div>
        <h3>No repository selected</h3>
        <p>Scan a repository first, then run the security scanner.</p>
      </div>
    );
  }
  return (
    <div className="report-card">
      <h2>
        <IconShield size={18} /> Security Scanner
      </h2>
      <button
        className="btn-solid"
        onClick={runSecurityScan}
        disabled={securityLoading}
      >
        {securityLoading && <span className="spinner" />}
        {securityLoading ? "Scanning..." : "Run Security Scan"}
      </button>
      {security && (
        <>
          <div className="score-wrap" style={{ marginTop: 20 }}>
            <ScoreMeter score={security.score} grade={security.risk} />
          </div>
          <div className="diff-list">
            {security.issues.map((issue: any, i: number) => (
              <div className="diff-row" key={i}>
                <div className="diff-gutter remove">!</div>
                <div className="diff-body">
                  <h4>{issue.file}</h4>
                  <p>{issue.message}</p>
                  <small>{issue.fix}</small>
                  <button
                    className="btn-solid"
                    style={{ marginTop: 10 }}
                    onClick={() => fixSecurityIssue(issue)}
                    disabled={fixingIssue}
                  >
                    {fixingIssue ? "Fixing..." : "🤖 Fix Security Issue"}
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

function ArchitectureTab({
  result,
  architecture,
  architectureLoading,
  generateArchitecture,
}: any) {
  if (!result) {
    return (
      <div className="empty-block">
        <div className="empty-glyph">
          <IconSitemap size={20} />
        </div>
        <h3>No repository selected</h3>
        <p>Scan a repository first, then generate its architecture diagram.</p>
      </div>
    );
  }
  return (
    <div className="report-card">
      <h2>
        <IconSitemap size={18} /> Architecture Diagram
      </h2>
      <button
        className="btn-solid"
        onClick={generateArchitecture}
        disabled={architectureLoading}
      >
        {architectureLoading && <span className="spinner" />}
        {architectureLoading ? "Generating..." : "Generate Architecture"}
      </button>
      {architecture && (
        <>
          <h3>Summary</h3>
          <p style={{ color: "var(--ink)", fontSize: 13, lineHeight: 1.6 }}>
            {architecture.summary}
          </p>
          <h3>Stack</h3>
          <pre className="output-pane">{architecture.stack?.join("\n")}</pre>
          <h3>Layers</h3>
          <div className="diff-list">
            {architecture.layers?.map((layer: any, i: number) => (
              <div className="diff-row" key={i}>
                <div className="diff-gutter add">{i + 1}</div>
                <div className="diff-body">
                  <h4>{layer.name}</h4>
                  <p>{layer.responsibility}</p>
                  <small>{layer.files?.join(", ")}</small>
                </div>
              </div>
            ))}
          </div>
          <h3>Data Flow</h3>
          <pre className="output-pane">
            {architecture.data_flow
              ?.map((x: string, i: number) => `${i + 1}. ${x}`)
              .join("\n")}
          </pre>
          <h3>Mermaid Diagram</h3>
          <pre className="output-pane">{architecture.diagram_mermaid}</pre>
        </>
      )}
    </div>
  );
}

function CodeSearchTab({
  result,
  codeSearchQuestion,
  setCodeSearchQuestion,
  runCodeSearch,
  codeSearchLoading,
  codeSearchResult,
}: any) {
  if (!result) {
    return (
      <div className="empty-block">
        <div className="empty-glyph">
          <IconSearch size={20} />
        </div>
        <h3>No repository selected</h3>
        <p>Scan a repository first, then search your codebase.</p>
      </div>
    );
  }
  return (
    <div className="report-card">
      <h2>
        <IconSearch size={18} /> AI Code Search
      </h2>
      <textarea
        className="prompt-area"
        placeholder="Where is authentication handled?"
        value={codeSearchQuestion}
        onChange={(e) => setCodeSearchQuestion(e.target.value)}
      />
      <button
        className="btn-solid"
        onClick={runCodeSearch}
        disabled={codeSearchLoading}
      >
        {codeSearchLoading && <span className="spinner" />}
        {codeSearchLoading ? "Searching..." : "Search Codebase"}
      </button>
      {codeSearchResult && (
        <>
          <h3>Answer</h3>
          <p style={{ color: "var(--ink)", fontSize: 13, lineHeight: 1.6 }}>
            {codeSearchResult.answer}
          </p>
          <h3>Relevant Files</h3>
          <div className="diff-list">
            {codeSearchResult.relevant_files?.map((item: any, i: number) => (
              <div className="diff-row" key={i}>
                <div className="diff-gutter add">{i + 1}</div>
                <div className="diff-body">
                  <h4>{item.file}</h4>
                  <p>{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
          <h3>Flow</h3>
          <pre className="output-pane">
            {codeSearchResult.flow
              ?.map((x: string, i: number) => `${i + 1}. ${x}`)
              .join("\n")}
          </pre>
          <h3>Next Action</h3>
          <p style={{ color: "var(--ink-dim)", fontSize: 13 }}>
            {codeSearchResult.next_action}
          </p>
        </>
      )}
    </div>
  );
}

function KeysTab({ keys, setKeys, saveKeys }: any) {
  return (
    <div className="keys-card">
      <h2>
        <IconKey size={18} /> API Keys
      </h2>
      <label>GitHub PAT</label>
      <input
        type="password"
        placeholder="github_pat_..."
        onChange={(e) => setKeys({ ...keys, github_token: e.target.value })}
      />
      <p>Required scopes: repository metadata and contents read-only.</p>
      <label>AI API Key</label>
      <input
        type="password"
        placeholder="AI API key (Gemini / Claude)"
        onChange={(e) => setKeys({ ...keys, claude_key: e.target.value })}
      />
      <p>Used for code classification, analysis, and deploy suggestions.</p>
      <button className="btn-solid" onClick={saveKeys}>
        Save keys
      </button>
    </div>
  );
}

function ScoreMeter({ score, grade }: { score: number; grade: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="score-dial">
      <div className="dial-ticks">
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={`dial-tick ${i % 3 === 0 ? "major" : ""}`}
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-62px)`,
            }}
          />
        ))}
      </div>
      <div className="dial-svg">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} className="dial-track" />
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="dial-progress"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
      </div>
      <div className="dial-center">
        <b>{score}</b>
        <span>/100</span>
        <span className={`dial-grade grade-${String(grade).toLowerCase()}`}>
          {grade}
        </span>
      </div>
    </div>
  );
}
