# Kill Criteria — Pre-Launch Security Review

**Date:** May 23, 2026  
**Risk level for public launch:** **LOW**

## Executive summary

Kill Criteria is a static client-only SPA with no backend, authentication, user-submitted content, or network API calls. Attack surface is minimal. React renders all dynamic text via JSX, route params are whitelisted, dependencies pass npm audit with zero findings, and no secrets or env vars are embedded. The primary pre-launch gap is missing HTTP security headers in vercel.json — defense-in-depth, not an active exploit in current code.

## Findings

| Severity | Title | Location | Issue | Recommendation |
|----------|-------|----------|-------|----------------|
| Medium | Missing security headers | vercel.json L1-3 | Only SPA rewrite; no CSP, framing policy, nosniff, Referrer-Policy | Add headers array in vercel.json |
| Low | Unvalidated localStorage restore | useFlowState.ts L14-24, L47-52 | Invalid currentNodeId causes infinite Loading; tampered choiceLabel in UI/clipboard | Validate session against flow graph on restore |
| Low | Third-party font loading | index.html L47-52 | Google Fonts CDN; IP/referrer to third party | Self-host fonts; add font-src in CSP |
| Info | Shared-device localStorage | useFlowState.ts, Hub.tsx | Career path in kill-criteria-session until cleared | Optional clear-session control on hub |
| Info | Vercel host logging | disclosure.ts privacy section | Platform may log IPs | Align Vercel settings with disclosure |

## Positive controls

- Static SPA, no server injection surface
- React JSX auto-escaping; no raw HTML injection APIs used
- Minimal deps; npm audit 0 vulnerabilities
- flowId allowlist + redirect (Flow.tsx L17-31)
- rel=noopener noreferrer on external links (SiteFooter.tsx L41-44)
- No production source maps
- Privacy disclosure covers localStorage

## Pre-launch checklist

**Must-fix:** Add security headers in vercel.json — **done**

**Nice-to-have:** Validate FlowSession on restore; self-host fonts; clear-session UI; npm audit in CI — **done**

**Test coverage:** Vitest + Testing Library — session validation, security headers, vercel parity, hub clear/resume, flow route allowlist — **done**

## Remediation (May 23, 2026)

| Finding | Fix |
|---------|-----|
| Missing security headers | Added CSP, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy in `vercel.json` |
| Unvalidated localStorage restore | Shared `src/lib/flowSession.ts` validates nodes/choices on load; corrupt sessions cleared |
| Third-party font loading | Google Sans self-hosted under `public/fonts/google-sans/`; CDN links removed |
| Shared-device localStorage | Hub "Clear saved progress" button |
| Vercel host logging | Privacy disclosure names Vercel explicitly |
| npm audit in CI | `.github/workflows/ci.yml` runs audit + build on push/PR |
