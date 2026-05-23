# PeopleOS Brand Guidelines
**Version 2.0 · Berlin 2026**

---

## 1. Color System

### Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `--black` | `#0a0a0a` | Page / app background |
| `--card` | `#1a1a1a` | Primary card / panel background |
| `--card2` | `#141414` | Secondary card background (slightly darker) |
| `--border` | `#2a2a2a` | Default border / divider |
| `--white` | `#f0ede8` | Primary text (warm white, not pure) |
| `--muted` | `#666666` | Secondary / helper text |

### Accent Palette

| Token | Hex | Role |
|---|---|---|
| `--gold` | `#f5a623` | Primary brand accent — headings, highlights, CTA labels |
| `--gold-dim` | `#a06b10` | Subdued gold — featured card borders |
| `--blue` | `#60a5fa` | Information, interactive elements, role badges, code |
| `--green` | `#4ade80` | Success states, confirmation indicators |
| `--red` | `#f87171` | Warnings, deadlines, error states |

### Contextual / Component Colors

| Value | Usage |
|---|---|
| `#0d1219` | Dark navy — role badge background, LinkedIn spec background, prompt box background |
| `#0d1a2e` | Deep navy — avatar background, agent tag background |
| `#1a2a3a` | Navy border — blue-tinted border for interactive / highlighted components |
| `#080d14` | Near-black navy — prompt / code block background |
| `#a0c4ff` | Light blue — prompt box body text |
| `#3a5a3a` | Muted green — code comment text in prompt boxes |
| `#0a77b5` | LinkedIn brand blue — LinkedIn-specific header |
| `#1a1000` | Dark amber — warning background |
| `#3a2a00` | Amber border — warning border |
| `#ffd080` | Amber text — warning text |
| `#1a0d0d` | Dark red — deadline / critical alert background |
| `#3a1a1a` | Red border — deadline border |
| `#050d1a` | Near-black blue — north-star / highlight box text |

---

## 2. Typography

### Font Stack

```css
font-family: 'DM Sans', sans-serif;      /* Body / UI default */
font-family: 'Syne', sans-serif;         /* Display headings */
font-family: 'DM Mono', monospace;       /* Code, labels, badges */
```

All three fonts are loaded from Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

### Type Scale

| Element | Font | Size | Weight | Notes |
|---|---|---|---|---|
| Page H1 | Syne | 48px | 800 | letter-spacing: -2px; line-height: 1 |
| Section H2 | Syne | 11px | 700 | letter-spacing: 0.2em; UPPERCASE; color: gold |
| Agent name H3 | Syne | 22px | 800 | — |
| Output title | Syne | 16px | 700 | — |
| Body default | DM Sans | 15px | 400 | line-height: 1.6 |
| Body large | DM Sans | 16px | 400 | Subtitle / north-star supporting text |
| Body small | DM Sans | 14px | 400–500 | Cards, spec body |
| Body XS | DM Sans | 13px | 400 | Descriptions, field values |
| Caption / micro | DM Sans | 12px–13px | 400 | Demo step descriptions |
| Role badge | DM Mono | 12px | 400 | letter-spacing: 0.15em; UPPERCASE |
| Spec header | DM Mono | 11px | 400 | letter-spacing: 0.1em; UPPERCASE; color: gold |
| Tag / pill | DM Mono | 10px | 400 | letter-spacing: 0.1em; UPPERCASE |
| Prompt box | DM Mono | 13px | 400 | line-height: 1.9 |
| Footer | DM Mono | 11px | 400 | color: muted |
| Output tag | DM Mono | 10px | 400 | letter-spacing: 0.1em; UPPERCASE |
| Code inline | DM Mono | 11–12px | 400 | background: #111; color: blue |

### Typography Rules

- H1 uses `em` spans to highlight a key word in **gold** (`color: --gold; font-style: normal`)
- H2 section labels always include a decorative trailing line: `h2::after { content: ''; flex: 1; height: 1px; background: var(--border); }`
- Bold text within body copy (`<strong>`) renders in gold (`--gold`)
- Italic text for direct speech / quotes (`<span class="say">`) renders in gold

---

## 3. Spacing & Layout

### Page Container

```css
max-width: 900px;
margin: 0 auto;
padding: 60px 40px;
```

### Spacing Rhythm

| Context | Value |
|---|---|
| Section bottom margin | 48px |
| Header bottom padding | 36px |
| Header bottom margin | 44px |
| Card / spec padding | 20–28px |
| Card gap (flex) | 20px |
| Grid gap (2-col output) | 8px |
| Stack gap (spec blocks) | 8px |

### Border Radius

| Component | Radius |
|---|---|
| General cards, specs, boxes | 4px |
| Role badge, tags, pills | 2px |
| Avatars | 50% (circle) |
| Inline code | 2px |

---

## 4. Component Library

### Role Badge

```css
display: inline-flex;
align-items: center;
gap: 10px;
background: #0d1219;
border: 1px solid #1a2a3a;
padding: 8px 16px;
border-radius: 2px;
font-family: 'DM Mono', monospace;
font-size: 12px;
letter-spacing: 0.15em;
color: #60a5fa;
text-transform: uppercase;
```

### Section Heading (H2)

```css
font-family: 'Syne', sans-serif;
font-size: 11px;
font-weight: 700;
letter-spacing: 0.2em;
text-transform: uppercase;
color: #f5a623;
margin-bottom: 18px;
display: flex;
align-items: center;
gap: 12px;
/* Trailing line via ::after */
```

### North Star / Highlight Box

```css
background: #60a5fa;
color: #050d1a;
padding: 24px 28px;
border-radius: 4px;
font-size: 17px;
font-weight: 500;
line-height: 1.5;
```

### Agent / Person Card

```css
background: #1a1a1a;
border: 1px solid #1a2a3a;
border-radius: 4px;
padding: 24px;
display: flex;
gap: 20px;
align-items: flex-start;
```

**Avatar inside agent card:**
```css
width: 60px;
height: 60px;
border-radius: 50%;
background: #0d1a2e;
color: #60a5fa;
font-family: 'Syne', sans-serif;
font-size: 20px;
font-weight: 800;
```

### Spec Block

Structure: header strip + body.

```css
/* Container */
background: #1a1a1a;
border: 1px solid #2a2a2a;
border-radius: 4px;
overflow: hidden;

/* Header strip */
background: #1a1a1a;
padding: 12px 20px;
font-family: 'DM Mono', monospace;
font-size: 11px;
letter-spacing: 0.1em;
text-transform: uppercase;
color: #f5a623;
border-bottom: 1px solid #2a2a2a;

/* Body */
padding: 20px 22px;
font-size: 14px;
line-height: 1.8;
```

### Output Card (2-column grid)

```css
/* Standard */
background: #1a1a1a;
border: 1px solid #2a2a2a;
border-radius: 4px;
padding: 18px 20px;

/* Featured (full-width) */
border-color: #a06b10;
grid-column: 1 / -1;
```

### Prompt / Code Box

```css
background: #080d14;
border: 1px solid #1a2a3a;
border-radius: 4px;
padding: 22px 26px;
font-family: 'DM Mono', monospace;
font-size: 13px;
line-height: 1.9;
color: #a0c4ff;
```

### Demo Step

```css
background: #1a1a1a;
border: 1px solid #2a2a2a;
border-left: 3px solid #60a5fa;     /* accent left border */
border-radius: 4px;
padding: 16px 20px;
margin-bottom: 4px;
display: grid;
grid-template-columns: 28px 1fr;
gap: 14px;
```

Step number: DM Mono, 13px, color: blue, weight 500.

### Warning Box

```css
background: #1a1000;
border: 1px solid #3a2a00;
border-radius: 4px;
padding: 14px 18px;
font-size: 13px;
color: #ffd080;
```

### Deadline / Critical Alert

```css
background: #1a0d0d;
border: 1px solid #3a1a1a;
padding: 12px 18px;
border-radius: 4px;
font-family: 'DM Mono', monospace;
font-size: 12px;
color: #f87171;
margin-bottom: 4px;
```

### Tag / Pill

```css
display: inline-block;
font-family: 'DM Mono', monospace;
font-size: 10px;
letter-spacing: 0.1em;
text-transform: uppercase;
background: #0d1a2e;
color: #60a5fa;
border: 1px solid #1a2a3a;
padding: 3px 10px;
border-radius: 2px;
```

### Inline Code

```css
font-family: 'DM Mono', monospace;
background: #111;
padding: 2px 6px;
border-radius: 2px;
font-size: 11–12px;
color: #60a5fa;
```

### Footer

```css
border-top: 1px solid #2a2a2a;
padding-top: 24px;
margin-top: 60px;
display: flex;
justify-content: space-between;
font-family: 'DM Mono', monospace;
font-size: 11px;
color: #666;
```

---

## 5. CSS Custom Properties — Full Reference

Paste this `:root` block as the foundation of any PeopleOS project:

```css
:root {
  /* Backgrounds */
  --black:    #0a0a0a;
  --card:     #1a1a1a;
  --card2:    #141414;

  /* Borders */
  --border:   #2a2a2a;

  /* Text */
  --white:    #f0ede8;
  --muted:    #666666;

  /* Accents */
  --gold:     #f5a623;
  --gold-dim: #a06b10;
  --blue:     #60a5fa;
  --green:    #4ade80;
  --red:      #f87171;
}
```

---

## 6. Design Principles

1. **Dark-first.** Every surface is near-black. Contrast is created through subtle elevation (`--card` over `--black`), gold accents, and colored borders — not lightness.

2. **Monospace for metadata.** Labels, tags, badges, and code always use DM Mono. Never use DM Sans for system-level labels.

3. **Gold signals importance.** Gold (`--gold`) is reserved for: section headings, featured content highlights, strong emphasis in body copy, and direct speech / quotes. Do not use it decoratively.

4. **Blue signals interactivity and information.** Blue (`--blue`) marks role types, inline code, step numbers, interactive borders, and links.

5. **Borders create depth, not shadows.** No box-shadows. Depth is expressed through border color differences (`--border` vs `#1a2a3a` for navy-tinted accents).

6. **Accent left borders for sequential content.** Demo steps and lists use a 3px left border in blue to signal ordered, actionable content.

7. **Small radius everywhere.** Border radius is always 2px or 4px. Never large or pill-shaped (except avatar circles).

8. **Tight letter-spacing on display type, wide on labels.** H1 uses `-2px` tracking; DM Mono labels use `+0.1–0.2em` tracking.

---

## 7. Color Semantics Quick Reference

| Color | Meaning |
|---|---|
| Gold `#f5a623` | Brand accent, importance, featured |
| Blue `#60a5fa` | Information, interactive, identity |
| Green `#4ade80` | Success, confirmed, ready |
| Red `#f87171` | Error, warning, deadline, critical |
| Amber `#ffd080` | Caution, soft warning |
| Muted `#666` | Helper text, metadata, secondary |
| Warm white `#f0ede8` | All primary readable text |

---

*PeopleOS · Brand Guidelines v2 · 2026*
