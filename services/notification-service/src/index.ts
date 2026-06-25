import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { Resend } from "resend";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const resend = new Resend(process.env.RESEND_API_KEY);

app.get("/health", (_req, res) => {
  res.json({
    service: "notification-service",
    status: "ok",
  });
});

app.post("/email/send", async (req, res, next) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject) {
      return res.status(400).json({
        error: "to and subject required",
      });
    }

    const result = await resend.emails.send({
      from:
        process.env.FROM_EMAIL || "AI Code Companion <onboarding@resend.dev>",

      to,

      subject,

      html: html || "<p>Hello from AI Code Companion</p>",
    });

    res.json({
      queued: true,
      id: result.data?.id,
    });
  } catch (err) {
    next(err);
  }
});

app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(500).json({
    error: err.message || "Email failed",
  });
});

app.listen(Number(process.env.NOTIFICATION_SERVICE_PORT || 4006), () =>
  console.log("notification-service running"),
);
