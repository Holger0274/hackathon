# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**PeopleOS** — AImation Hackathon-Projekt. Berlin 2026.

PeopleOS ist eine KI-gestützte HR-Plattform mit 8 AI-Agenten (named HR team members). Der erste Demo-Agent ist **Alex Chen**, Talent Acquisition Manager.

### Demo-Konzept (Alex)

Der Pitcher gibt Alex einen einzeiligen Hiring-Brief → Alex produziert in Sekunden:
1. LinkedIn Job Advert (Hero-Output, wird live auf Stage gepostet)
2. Full Job Specification (internes Dokument)
3. Interview Scorecard (5 Competencies, 2 Fragen je, Rating 1–5)

**LinkedIn-Post-Mechanismus:** `window.open('https://www.linkedin.com/feed/?shareActive=true&text=' + encodeURIComponent(text), '_blank')` — kein API-Key nötig.

### Alex-System-Prompt (Kern)

Alex Chen, Talent Acquisition Manager at PeopleOS. Antwortet immer mit drei Sections: `## LINKEDIN JOB ADVERT`, `## JOB SPECIFICATION`, `## INTERVIEW SCORECARD`. UK English, £ für Salär.

## Brand (PeopleOS Brand Guidelines v2)

### CSS Custom Properties

```css
:root {
  --black:    #0a0a0a;   /* Page background */
  --card:     #1a1a1a;   /* Primary card */
  --card2:    #141414;   /* Secondary card */
  --border:   #2a2a2a;
  --white:    #f0ede8;   /* Primary text */
  --muted:    #666666;
  --gold:     #f5a623;   /* Brand accent, headings, CTA */
  --gold-dim: #a06b10;   /* Featured card borders */
  --blue:     #60a5fa;   /* Info, interactive, role badges */
  --green:    #4ade80;   /* Success */
  --red:      #f87171;   /* Error, warnings, deadlines */
}
```

### Fonts (Google Fonts)

- `DM Sans` — Body/UI
- `Syne` — Display headings (H1: 48px 800, letter-spacing: -2px)
- `DM Mono` — Labels, badges, code, tags

### Design Principles

- Dark-first. Kein box-shadow — Tiefe über Border-Farben.
- Gold = Wichtigkeit (Headings, Featured, Strong in Body).
- Blue = Interaktivität / Information (Badges, Links, Code).
- Border-radius: immer 2px oder 4px. Avatare: 50%.
- H2 Section Labels: 11px Syne, 0.2em letter-spacing, UPPERCASE, gold, mit trailing line `::after`.

### Key Component Styles

| Komponente | Hintergrund | Border | Besonderheit |
|---|---|---|---|
| Agent Card | `#1a1a1a` | `#1a2a3a` | flex, gap 20px |
| Avatar | `#0d1a2e` | — | 60×60px, circle, blue text |
| Spec Block | `#1a1a1a` | `#2a2a2a` | header strip (gold, DM Mono) + body |
| Prompt/Code Box | `#080d14` | `#1a2a3a` | DM Mono 13px, color `#a0c4ff` |
| Demo Step | `#1a1a1a` | `#2a2a2a` + 3px left blue | grid 28px 1fr |
| Warning Box | `#1a1000` | `#3a2a00` | text `#ffd080` |
| Deadline Alert | `#1a0d0d` | `#3a1a1a` | DM Mono, red |
| Tag/Pill | `#0d1a2e` | `#1a2a3a` | DM Mono 10px, UPPERCASE, blue |
| North Star Box | `#60a5fa` (bg) | — | text `#050d1a`, 17px |

## Repository

- GitHub: https://github.com/Holger0274/hackathon
- Branch: `main`

## Tech Stack

- Plain HTML/CSS/JS (kein Framework, keine Build-Pipeline)
- Claude API (für Alex-Outputs)
- LinkedIn Share URL (kein API-Key)

---

## RIFF

This project uses the RIFF planning framework. Symlinked into `.riff/` (gitignored — local only).

### Commands

| Command | Purpose |
|---|---|
| `/riff:start` | Begin a new feature from a seed |
| `/riff:next` | Execute the next planned step |
| `/riff:map` | Map existing code into RIFF planning state |
| `/riff:quick` | Quick task without full planning overhead |
| `/riff:dashboard` | Show project status |
| `/riff:debug` | Debug a failing test or error |

### Execution rules

- Never skip phases. Always follow `.riff/protocols/EXECUTION.md`.
- Planning artifacts live in `.planning/` — do not edit manually.
- Hooks in `.claude/hooks/riff/` run automatically (lint, typecheck, test gates).
- Profile: `cautious` — security gates (route-auth-guard, idor-detector, input-validation-guard, todo-orphan-guard) are active.

### Protocols

See `.riff/protocols/` for: EXECUTION, HANDOFF, AUTO-TRIGGERS, DASHBOARD-EXPLAIN, DEEP-AUDIT.
