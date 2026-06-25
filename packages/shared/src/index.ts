export const ok = (data: unknown = null) => ({ success: true, data });
export const fail = (message: string, status = 500) => ({ success: false, error: { message, status } });
export const serviceUrls = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
  github: process.env.GITHUB_SERVICE_URL || "http://localhost:4002",
  ai: process.env.AI_SERVICE_URL || "http://localhost:4003",
  scanner: process.env.SCANNER_SERVICE_URL || "http://localhost:4004",
  report: process.env.REPORT_SERVICE_URL || "http://localhost:4005",
  notification:
    process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4006",
};
