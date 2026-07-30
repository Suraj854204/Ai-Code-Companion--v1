"use client";
import { useState } from "react";
import { authApi } from "@/lib/api";

const PIPELINE = ["GitHub", "Scan", "Classify", "Chat", "Fix", "Deploy"];

export default function Page() {
  const [mode, setMode]               = useState<"login" | "signup">("login");
  const [form, setForm]               = useState<any>({});
  const [msg, setMsg]                 = useState("");
  const [loading, setLoading]         = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused]         = useState<string | null>(null);

  async function submit() {
    setMsg(""); setLoading(true);
    try {
      const r = mode === "login" ? await authApi.login(form) : await authApi.signup(form);
      localStorage.setItem("acc_token", r.data.token);
      localStorage.setItem("acc_user", JSON.stringify(r.data.user));
      location.href = "/dashboard";
    } catch (e: any) {
      setMsg(e.response?.data?.error || e.message);
    } finally { setLoading(false); }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") submit();
  }

  return (
    <main className="ap">
      {/* ── Background layers ── */}
      <div className="ap-grid" aria-hidden="true"/>
      <div className="ap-glow ap-glow-a" aria-hidden="true"/>
      <div className="ap-glow ap-glow-b" aria-hidden="true"/>
      <div className="ap-glow ap-glow-c" aria-hidden="true"/>
      <div className="ap-scanlines" aria-hidden="true"/>

      <div className="ap-shell">
        {/* ── Left panel: terminal showcase ── */}
        <aside className="ap-left" aria-hidden="true">
          <div className="ap-left-inner">
            {/* Terminal window */}
            <div className="term-window">
              <div className="term-bar">
                <span className="term-dot dot-red"/>
                <span className="term-dot dot-yellow"/>
                <span className="term-dot dot-green"/>
                <span className="term-title">codecompanion — zsh</span>
              </div>
              <div className="term-body">
                <div className="term-line" style={{ ["--li" as any]: 0 }}><span className="term-prompt">❯</span><span className="term-cmd"> cc scan <span className="term-arg">--repo</span> my-api</span></div>
                <div className="term-line term-out" style={{ ["--li" as any]: 1 }}>  Fetching file tree… <span className="term-dot-anim">…</span></div>
                <div className="term-line term-out" style={{ ["--li" as any]: 2 }}>  <span className="term-ok">✓</span> 142 files indexed in 1.2s</div>
                <div className="term-line term-out" style={{ ["--li" as any]: 3 }}>  <span className="term-ok">✓</span> 7 key files extracted</div>
                <div className="term-spacer"/>
                <div className="term-line" style={{ ["--li" as any]: 4 }}><span className="term-prompt">❯</span><span className="term-cmd"> cc fix <span className="term-arg">--smart</span></span></div>
                <div className="term-line term-out" style={{ ["--li" as any]: 5 }}>  Analyzing related files…</div>
                <div className="term-line term-out" style={{ ["--li" as any]: 6 }}>  <span className="term-ok">✓</span> Patch generated: auth/middleware.ts</div>
                <div className="term-line term-out" style={{ ["--li" as any]: 7 }}>  <span className="term-ok">✓</span> PR #47 created successfully</div>
                <div className="term-spacer"/>
                <div className="term-line" style={{ ["--li" as any]: 8 }}><span className="term-prompt">❯</span><span className="term-cmd"> cc security <span className="term-arg">--scan</span></span></div>
                <div className="term-line term-out" style={{ ["--li" as any]: 9 }}>  Score: <span className="term-score">92</span>/100 · Grade: <span className="term-grade">A</span></div>
                <div className="term-line term-out" style={{ ["--li" as any]: 10 }}>  <span className="term-warn">⚠</span> 1 critical · 2 medium issues</div>
                <div className="term-cursor"/>
              </div>
            </div>

            {/* Stat chips */}
            <div className="ap-chips">
              <div className="ap-chip" style={{ ["--ci" as any]: 0 }}>
                <span className="ap-chip-n">142</span>
                <span className="ap-chip-l">Files scanned</span>
              </div>
              <div className="ap-chip ap-chip-gold" style={{ ["--ci" as any]: 1 }}>
                <span className="ap-chip-n">47</span>
                <span className="ap-chip-l">PRs created</span>
              </div>
              <div className="ap-chip" style={{ ["--ci" as any]: 2 }}>
                <span className="ap-chip-n">98%</span>
                <span className="ap-chip-l">Fix accuracy</span>
              </div>
            </div>

            {/* Headline */}
            <div className="ap-headline">
              <h2>Ship fixes,<br/>not just issues.</h2>
              <p>Connect a repo, scan it in seconds, get AI-generated patches and PRs — without leaving the terminal.</p>
            </div>
          </div>
        </aside>

        {/* ── Right panel: auth form ── */}
        <div className="ap-right">
          {/* Brand */}
          <div className="ap-brand">
            <div className="ap-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L4 12L9 6M15 6L20 12L15 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="ap-brand-name">AI Code Companion</span>
          </div>

          {/* Card */}
          <div className="ap-card">
            {/* Pipeline ticker */}
            <div className="ap-pipeline" aria-label="Pipeline: GitHub to Deploy">
              {PIPELINE.map((stage, i) => (
                <div className="ap-pip-stage" key={stage}>
                  <span className="ap-pip-pill">{stage}</span>
                  {i < PIPELINE.length - 1 && (
                    <span className="ap-pip-arrow">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                        <path d="M1 4H11M11 4L8 1M11 4L8 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </div>
              ))}
              <span className="ap-pip-runner" aria-hidden="true"/>
            </div>

            {/* Title */}
            <div className="ap-card-head">
              <h1>{mode === "login" ? "Welcome back" : "Create your workspace"}</h1>
              <p>{mode === "login" ? "Sign in to keep shipping." : "Up and running in under a minute."}</p>
            </div>

            {/* Tab switcher */}
            <div className="ap-seg" role="tablist">
              <button role="tab" aria-selected={mode === "login"}   className={`ap-seg-btn ${mode === "login"   ? "active" : ""}`} onClick={() => { setMode("login");  setMsg(""); }}>Sign in</button>
              <button role="tab" aria-selected={mode === "signup"}  className={`ap-seg-btn ${mode === "signup"  ? "active" : ""}`} onClick={() => { setMode("signup"); setMsg(""); }}>Create account</button>
              <div className="ap-seg-slider" style={{ transform: `translateX(${mode === "login" ? "0" : "100%"})` }}/>
            </div>

            {/* Form */}
            <div className="ap-form" onKeyDown={handleKeyDown} key={mode}>
              {mode === "signup" && (
                <div className={`ap-field ${focused === "name" ? "focused" : ""}`} style={{ ["--fi" as any]: 0 }}>
                  <label className="ap-field-label" htmlFor="ap-name">Name</label>
                  <input id="ap-name" className="ap-input" placeholder="Ada Lovelace" autoComplete="name"
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}/>
                </div>
              )}

              <div className={`ap-field ${focused === "email" ? "focused" : ""}`} style={{ ["--fi" as any]: mode === "signup" ? 1 : 0 }}>
                <label className="ap-field-label" htmlFor="ap-email">Email</label>
                <input id="ap-email" className="ap-input" placeholder="you@company.com" type="email" autoComplete="email"
                  onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}/>
              </div>

              <div className={`ap-field ${focused === "password" ? "focused" : ""}`} style={{ ["--fi" as any]: mode === "signup" ? 2 : 1 }}>
                <label className="ap-field-label" htmlFor="ap-password">Password</label>
                <div className="ap-input-wrap">
                  <input id="ap-password" className="ap-input ap-input-pw"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}/>
                  <button type="button" className="ap-eye" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} tabIndex={-1}>
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c5 0 9 4 10.5 7-0.6 1.2-1.5 2.5-2.7 3.6M6.6 6.6C4.5 8 2.9 9.9 1.5 12c1.5 3 5.5 7 10.5 7 1.1 0 2.1-.2 3.1-.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9.9 10a2.8 2.8 0 0 0 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M1.5 12c1.5-3 5.5-7 10.5-7s9 4 10.5 7c-1.5 3-5.5 7-10.5 7s-9-4-10.5-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button className="ap-submit" onClick={submit} disabled={loading}>
                {loading ? <span className="ap-spinner"/> : <span>{mode === "login" ? "Sign in →" : "Create account →"}</span>}
              </button>

              {msg && (
                <div className="ap-error" role="alert">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="16.5" r="1" fill="currentColor"/>
                  </svg>
                  {msg}
                </div>
              )}
            </div>

            {/* Switch mode */}
            <p className="ap-switch">
              {mode === "login" ? (
                <>New here? <button className="ap-switch-link" onClick={() => { setMode("signup"); setMsg(""); }}>Create an account</button></>
              ) : (
                <>Already have one? <button className="ap-switch-link" onClick={() => { setMode("login"); setMsg(""); }}>Sign in</button></>
              )}
            </p>
          </div>

          {/* Footer */}
          <p className="ap-footer">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6, verticalAlign: "-1px" }}>
              <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
            Industry-standard encryption · Zero data retention
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap");

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          /* Same Night Build palette as the dashboard: graphite-aubergine
             base, teal = system/structured, gold = AI-generated. */
          --ap-bg:       #0b0a12;
          --ap-panel:    #151322;
          --ap-raised:   #1a1729;
          --ap-border:   #332b4c;
          --ap-soft:     #211d33;
          --ap-ink:      #f2eefc;
          --ap-dim:      #a89bc4;
          --ap-faint:    #423a5c;
          --ap-cyan:     #2fe3c4;
          --ap-cyan-dim: rgba(47,227,196,0.1);
          --ap-cyan-g:   rgba(47,227,196,0.18);
          --ap-cyan-l:   rgba(47,227,196,0.26);
          --ap-gold:     #ffb454;
          --ap-gold-dim: rgba(255,180,84,0.11);
          --ap-gold-g:   rgba(255,180,84,0.18);
          --ap-gold-l:   rgba(255,180,84,0.26);
          --ap-green:    #4ee39a;
          --ap-red:      #ff5d7a;
          --ap-red-dim:  rgba(255,93,122,0.11);
          --mono: "JetBrains Mono", ui-monospace, monospace;
          --sans: "Inter", -apple-system, sans-serif;
          --display: "Space Grotesk", "Inter", -apple-system, sans-serif;
          --ease: cubic-bezier(0.16, 1, 0.3, 1);
          --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .ap {
          min-height: 100vh;
          width: 100%;
          background: var(--ap-bg);
          display: flex;
          align-items: stretch;
          position: relative;
          overflow: hidden;
          font-family: var(--sans);
          color: var(--ap-ink);
        }

        /* Grid background */
        .ap-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(to right,  rgba(47,227,196,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(47,227,196,0.03) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
        }

        /* Scanlines */
        .ap-scanlines {
          position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.05) 2px,
            rgba(0,0,0,0.05) 4px
          );
          z-index: 1;
        }

        .ap-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(130px);
          pointer-events: none;
          z-index: 0;
          will-change: transform;
        }
        .ap-glow-a { top: -200px; right: -100px; width: 560px; height: 560px; background: var(--ap-cyan); opacity: 0.06; animation: apDriftA 26s ease-in-out infinite; }
        .ap-glow-b { bottom: -180px; left: -80px; width: 480px; height: 480px; background: var(--ap-gold); opacity: 0.05; animation: apDriftB 32s ease-in-out infinite; }
        .ap-glow-c { top: 38%; left: 46%; width: 360px; height: 360px; background: #2a1f4d; opacity: 0.5; animation: apDriftC 40s ease-in-out infinite; }
        @keyframes apDriftA { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-28px, 22px); } }
        @keyframes apDriftB { 0%,100% { transform: translate(0,0); } 50% { transform: translate(24px, -20px); } }
        @keyframes apDriftC { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(16px, 14px) scale(1.05); } }

        /* Shell */
        .ap-shell {
          position: relative; z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          min-height: 100vh;
        }

        /* ── Left panel ── */
        .ap-left {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px 40px;
          background: linear-gradient(135deg, rgba(47,227,196,0.045), rgba(47,227,196,0.01));
          border-right: 1px solid var(--ap-soft);
          position: relative;
          overflow: hidden;
        }

        .ap-left::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 60% at 30% 40%, rgba(47,227,196,0.07), transparent);
        }

        .ap-left-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 460px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          animation: apPanelIn 640ms var(--ease);
        }

        /* Terminal */
        .term-window {
          background: #06040d;
          border: 1px solid var(--ap-soft);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(47,227,196,0.09);
        }

        .term-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 11px 16px;
          background: #0a0716;
          border-bottom: 1px solid var(--ap-soft);
        }
        .term-dot { width: 11px; height: 11px; border-radius: 50%; }
        .dot-red    { background: #ff5f57; }
        .dot-yellow { background: #febc2e; }
        .dot-green  { background: #28c840; }
        .term-title {
          margin-left: 8px;
          font-family: var(--mono);
          font-size: 11px;
          color: var(--ap-faint);
          flex: 1;
          text-align: center;
        }

        .term-body {
          padding: 18px 20px 20px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-height: 240px;
        }
        .term-line  {
          display: flex; align-items: baseline; gap: 6px;
          font-family: var(--mono); font-size: 12.5px; line-height: 1.6;
          opacity: 0;
          animation: termLineIn 320ms var(--ease) forwards;
          animation-delay: calc(var(--li, 0) * 140ms + 260ms);
        }
        .term-prompt { color: var(--ap-cyan); font-weight: 700; }
        .term-cmd   { color: var(--ap-ink); }
        .term-arg   { color: var(--ap-gold); }
        .term-out   { color: var(--ap-dim); padding-left: 14px; font-size: 12px; }
        .term-ok    { color: var(--ap-green); font-weight: 700; }
        .term-warn  { color: var(--ap-gold); font-weight: 700; }
        .term-score { color: var(--ap-green); font-weight: 700; }
        .term-grade { color: var(--ap-cyan); font-weight: 700; }
        .term-spacer { height: 6px; }
        .term-dot-anim { animation: dotBlink 1.2s step-end infinite; }
        @keyframes dotBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes termLineIn {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .term-cursor {
          width: 8px; height: 14px;
          background: var(--ap-cyan);
          border-radius: 2px;
          margin-top: 4px;
          margin-left: 2px;
          animation: cursorBlink 1s ease-in-out infinite, fadeIn 200ms var(--ease) 1.9s both;
          box-shadow: 0 0 8px var(--ap-cyan);
        }
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* Chips */
        .ap-chips {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .ap-chip {
          background: rgba(47,227,196,0.07);
          border: 1px solid var(--ap-cyan-l);
          border-radius: 12px;
          padding: 14px;
          text-align: center;
          opacity: 0;
          animation: apChipIn 420ms var(--ease-spring) forwards;
          animation-delay: calc(var(--ci, 0) * 90ms + 2.05s);
          transition: transform 220ms var(--ease), border-color 220ms var(--ease);
        }
        .ap-chip:hover {
          transform: translateY(-2px);
          border-color: var(--ap-cyan);
        }
        .ap-chip.ap-chip-gold {
          background: var(--ap-gold-dim);
          border-color: var(--ap-gold-l);
        }
        .ap-chip.ap-chip-gold:hover { border-color: var(--ap-gold); }
        .ap-chip-n {
          display: block;
          font-family: var(--mono);
          font-size: 22px;
          font-weight: 800;
          color: var(--ap-ink);
          margin-bottom: 3px;
          font-variant-numeric: tabular-nums;
        }
        .ap-chip-l {
          display: block;
          font-family: var(--mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--ap-dim);
        }
        @keyframes apChipIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Headline */
        .ap-headline {
          opacity: 0;
          animation: apPanelIn 560ms var(--ease) 2.3s forwards;
        }
        .ap-headline h2 {
          font-family: var(--display);
          font-size: 30px;
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.2;
          color: var(--ap-ink);
          margin-bottom: 12px;
        }
        .ap-headline p {
          font-size: 14px;
          line-height: 1.65;
          color: var(--ap-dim);
        }

        /* ── Right panel ── */
        .ap-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          gap: 0;
        }

        /* Brand */
        .ap-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          align-self: center;
          opacity: 0;
          animation: apDropIn 480ms var(--ease) 80ms forwards;
        }
        .ap-mark {
          width: 30px; height: 30px;
          border-radius: 7px;
          background: var(--ap-cyan-dim);
          border: 1px solid var(--ap-cyan-l);
          color: var(--ap-cyan);
          display: grid; place-items: center;
          box-shadow: 0 0 14px var(--ap-cyan-g);
          animation: markPulse 3.5s ease-in-out infinite;
        }
        @keyframes markPulse { 0%,100%{box-shadow:0 0 8px var(--ap-cyan-g)} 50%{box-shadow:0 0 20px var(--ap-cyan-g)} }
        .ap-brand-name {
          font-family: var(--mono);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--ap-ink);
          letter-spacing: -0.02em;
        }

        /* Card */
        .ap-card {
          width: 100%;
          max-width: 380px;
          background: var(--ap-panel);
          border: 1px solid var(--ap-border);
          border-top: 2px solid var(--ap-cyan);
          border-radius: 16px;
          padding: 28px;
          box-shadow:
            0 1px 0 rgba(47,227,196,0.05) inset,
            0 32px 64px -24px rgba(0,0,0,0.75),
            0 0 0 1px rgba(47,227,196,0.06);
          opacity: 0;
          animation: apCardIn 620ms var(--ease) 160ms forwards;
        }

        /* Pipeline */
        .ap-pipeline {
          position: relative;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 5px;
          padding: 10px 13px;
          background: var(--ap-bg);
          border: 1px solid var(--ap-soft);
          border-radius: 8px;
          margin-bottom: 22px;
          overflow: hidden;
        }
        .ap-pip-stage { display: flex; align-items: center; gap: 5px; }
        .ap-pip-pill {
          font-family: var(--mono);
          font-size: 10.5px;
          font-weight: 500;
          color: var(--ap-dim);
          padding: 2px 7px;
          border-radius: 4px;
          background: var(--ap-raised);
          border: 1px solid var(--ap-border);
          letter-spacing: -0.01em;
        }
        .ap-pip-pill::before { content: "["; color: var(--ap-faint); margin-right: 2px; }
        .ap-pip-pill::after  { content: "]"; color: var(--ap-faint); margin-left: 2px; }
        .ap-pip-arrow { color: var(--ap-faint); display: flex; }
        .ap-pip-runner {
          position: absolute; top: 0; left: -30%; width: 30%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(47,227,196,0.14), transparent);
          animation: pipRun 4s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes pipRun { 0%{left:-30%} 100%{left:110%} }

        /* Card head */
        .ap-card-head { margin-bottom: 20px; }
        .ap-card-head h1 { font-family: var(--display); font-size: 21px; font-weight: 700; letter-spacing: -0.025em; color: var(--ap-ink); margin-bottom: 5px; }
        .ap-card-head p  { font-size: 13px; color: var(--ap-dim); }

        /* Seg control */
        .ap-seg {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--ap-bg);
          border: 1px solid var(--ap-soft);
          border-radius: 9px;
          padding: 3px;
          margin-bottom: 22px;
          gap: 3px;
          position: relative;
        }
        .ap-seg-slider {
          position: absolute;
          top: 3px; bottom: 3px;
          left: 3px;
          width: calc(50% - 3px);
          border-radius: 7px;
          background: var(--ap-cyan-dim);
          border: 1px solid var(--ap-cyan-l);
          transition: transform .3s var(--ease-spring);
          pointer-events: none;
          z-index: 0;
        }
        .ap-seg-btn {
          appearance: none; border: none; background: transparent;
          color: var(--ap-dim);
          font-family: var(--mono); font-size: 12px; font-weight: 500;
          padding: 8px 0;
          border-radius: 6px;
          cursor: pointer;
          position: relative; z-index: 1;
          transition: color .18s;
        }
        .ap-seg-btn:hover { color: var(--ap-ink); }
        .ap-seg-btn.active { color: var(--ap-cyan); }

        /* Form */
        .ap-form { display: flex; flex-direction: column; gap: 14px; }

        .ap-field {
          display: flex; flex-direction: column; gap: 5px;
          opacity: 0;
          animation: apFieldIn 340ms var(--ease) forwards;
          animation-delay: calc(var(--fi, 0) * 55ms);
        }
        .ap-field-label {
          font-family: var(--mono); font-size: 10px;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: var(--ap-faint);
          transition: color .14s;
        }
        .ap-field.focused .ap-field-label { color: var(--ap-cyan); }
        @keyframes apFieldIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ap-input {
          appearance: none; width: 100%;
          background: var(--ap-bg);
          border: 1px solid var(--ap-border);
          border-radius: 7px;
          padding: 10px 12px;
          font-size: 13.5px;
          font-family: var(--mono);
          color: var(--ap-ink);
          transition: border-color .14s, box-shadow .14s;
        }
        .ap-input::placeholder { color: var(--ap-faint); font-family: var(--sans); }
        .ap-input:hover   { border-color: #4a3f6e; }
        .ap-input:focus   { outline: none; border-color: var(--ap-cyan); box-shadow: 0 0 0 3px var(--ap-cyan-dim); }

        .ap-input-wrap { position: relative; display: flex; }
        .ap-input-pw   { padding-right: 40px; }

        .ap-eye {
          position: absolute; right: 5px; top: 50%; transform: translateY(-50%);
          appearance: none; border: none; background: transparent;
          color: var(--ap-faint);
          padding: 6px; display: grid; place-items: center;
          border-radius: 5px; cursor: pointer;
          transition: color .13s;
        }
        .ap-eye:hover { color: var(--ap-dim); }

        /* Submit */
        .ap-submit {
          appearance: none; border: none;
          width: 100%; margin-top: 4px;
          padding: 11px 0;
          border-radius: 8px;
          background: linear-gradient(135deg, #0f9e83 0%, var(--ap-cyan) 55%, #7cf3dc 100%);
          color: #00201a;
          font-family: var(--mono); font-size: 13.5px; font-weight: 800;
          cursor: pointer;
          display: grid; place-items: center;
          min-height: 44px;
          position: relative;
          overflow: hidden;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.25) inset,
            0 8px 22px -6px rgba(47,227,196,0.42);
          transition: filter .14s, transform .08s, box-shadow .14s;
          letter-spacing: -0.01em;
        }
        .ap-submit::before {
          content: "";
          position: absolute; inset: 0;
          background: linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.32) 50%, transparent 60%);
          transform: translateX(-120%);
          transition: transform 520ms var(--ease);
        }
        .ap-submit:hover:not(:disabled)::before { transform: translateX(120%); }
        .ap-submit:hover:not(:disabled) {
          filter: brightness(1.08);
          box-shadow: 0 1px 0 rgba(255,255,255,0.3) inset, 0 12px 32px -6px rgba(47,227,196,0.58);
          transform: translateY(-1px);
        }
        .ap-submit:active:not(:disabled) { transform: scale(0.99); }
        .ap-submit:focus-visible { outline: 2px solid var(--ap-cyan); outline-offset: 2px; }
        .ap-submit:disabled { opacity: 0.6; cursor: default; }

        .ap-spinner {
          width: 15px; height: 15px;
          border-radius: 50%;
          border: 2px solid rgba(0,32,26,0.25);
          border-top-color: #00201a;
          animation: apSpin .65s linear infinite;
        }
        @keyframes apSpin { to { transform: rotate(360deg); } }

        /* Error */
        .ap-error {
          display: flex; align-items: flex-start; gap: 7px;
          padding: 9px 11px;
          background: var(--ap-red-dim);
          border: 1px solid rgba(255,93,122,0.3);
          border-radius: 7px;
          color: var(--ap-red);
          font-size: 12.5px;
          line-height: 1.45;
          animation: apShake 420ms var(--ease);
        }
        @keyframes apShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(3px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(1px); }
        }

        /* Switch */
        .ap-switch {
          text-align: center;
          font-size: 12.5px;
          color: var(--ap-dim);
          margin-top: 20px;
        }
        .ap-switch-link {
          appearance: none; border: none; background: none;
          color: var(--ap-cyan);
          font-family: var(--mono); font-size: 12.5px; font-weight: 600;
          cursor: pointer; padding: 0;
        }
        .ap-switch-link:hover { text-decoration: underline; }

        /* Footer */
        .ap-footer {
          margin-top: 22px;
          font-size: 11.5px;
          font-family: var(--mono);
          color: var(--ap-faint);
          text-align: center;
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          animation: fadeIn 400ms var(--ease) 480ms forwards;
        }

        @keyframes apPanelIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes apDropIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes apCardIn {
          from { opacity: 0; transform: translateY(16px) scale(0.985); filter: blur(2px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .ap-shell { grid-template-columns: 1fr; }
          .ap-left  { display: none; }
          .ap-right { padding: 32px 20px; min-height: 100vh; }
          .ap-card  { max-width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
          .term-line, .ap-chip, .ap-headline, .ap-brand, .ap-card, .ap-field, .ap-footer {
            opacity: 1 !important;
          }
        }
      `}</style>
    </main>
  );
}
