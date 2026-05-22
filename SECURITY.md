# Security Policy

We take security seriously — especially for a library people copy into production apps.

---

## Reporting a vulnerability

**Do not** open a public GitHub issue for security bugs.

Email: **security@gwenui.dev**

Include:

- Description of the issue and impact
- Steps to reproduce (PoC welcome)
- Affected versions / blocks / packages
- Your suggested fix (optional)

You should receive an acknowledgment within **48 hours**. We aim for an initial assessment within **7 business days** and a fix or mitigation timeline shortly after, depending on severity.

We appreciate responsible disclosure and will credit reporters in the release notes when they want recognition.

---

## Scope

### In scope

- `@gwenui/cli` — registry fetch, file writes, dependency installation
- Official registry at `gwenui.vercel.app` (or documented production URL)
- Block source under `blocks/` shipped via CLI
- Docs site (`apps/web`) — XSS, auth, or unsafe MDX rendering
- Supply-chain issues in documented install paths (`npx gwenui`, lockfiles)

### Out of scope

- Vulnerabilities in **your** app after you modify copied block code
- Third-party deps (Next.js, React, Three.js, etc.) — report upstream unless GwenUI introduces the exposure
- Social engineering, DDoS, or physical attacks
- Issues in unmaintained forks or unofficial registries
- Missing security headers on demo deployments without demonstrated exploit

---

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.4.x   | Yes       |
| < 0.4   | No        |

Patch releases are preferred for security fixes on the current minor line.

---

## Safe harbor

We won't pursue legal action against researchers who follow this policy, avoid privacy violations, and don't disrupt production services during testing.

---

*Last updated: 2026-05-22*
