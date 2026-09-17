# Rudy Command Deck V4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a universal commander-level click-to-explain layer to Mobile V3 without changing Starship business logic.

**Architecture:** Keep GitHub Pages as the frontend and the existing authenticated `starship-v3-mobile-data` read-only backend. Add a focused explanation module consumed by `app.js`; update the drawer so every metric opens explanation first, and load live lane contents where supported. Add a clickable ship-status surface.

**Tech Stack:** HTML, CSS, ES modules, vanilla JavaScript, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-17-rudy-command-deck-v4-design.md`

## Global Constraints
- No changes to Starship business rules or queue routing.
- No changes to fire controls or worker behavior.
- No fake execution claims: contextual actions may prepare a draft only.
- Mobile-first UI.
- Plain Italian commander-level explanations before technical detail.

---

### Task 1: Explanation model

**Files:**
- Create: `explanations.js`
- Test: local Node test against `metricExplanation()`

**Interfaces:**
- Consumes: metric objects `{key,title,count,subtitle,tone}`.
- Produces: `metricExplanation(metric)` returning `{what,now,why,actions}`.

- [x] Step 1: Write a failing test importing `metricExplanation` from missing `explanations.js` and assert `what`, `now`, `why`, and `actions` exist.
- [x] Step 2: Run with Node and verify `ERR_MODULE_NOT_FOUND`.
- [x] Step 3: Implement mapping for all current Mobile V3 metrics plus fallback.
- [x] Step 4: Run Node test and verify PASS.
- [ ] Step 5: Commit module.

### Task 2: Commander detail drawer

**Files:**
- Modify: `app.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `metricExplanation()` and existing `/lane?key=` API.
- Produces: click-to-explain drawer with sections `COS'È`, `STATO ADESSO`, `PERCHÉ`, `COSA C'È DENTRO`, `COSA PUOI FARE`.

- [ ] Step 1: Add drawer markup/style requirements to local test fixture and verify current UI lacks explanation sections.
- [ ] Step 2: Update `app.js` to render explanation first, then fetch lane items when supported.
- [ ] Step 3: Add contextual draft action buttons that never claim execution.
- [ ] Step 4: Verify syntax with Node and inspect generated HTML strings.
- [ ] Step 5: Commit frontend changes.

### Task 3: Clickable ship status

**Files:**
- Modify: `index.html`
- Modify: `app.js`

**Interfaces:**
- Consumes: existing `dashboard.fire`.
- Produces: clickable ship-status panel with plain-language explanation of EMAIL, FORM and RUNTIME.

- [ ] Step 1: Verify existing status surface has no click handler.
- [ ] Step 2: Make it a semantic button and add `openShipStatus()`.
- [ ] Step 3: Verify button tap opens drawer and shows current state.
- [ ] Step 4: Commit.

### Task 4: Deployment verification

**Files:** none

- [ ] Step 1: Verify GitHub Pages deployment workflow completes successfully.
- [ ] Step 2: Fetch deployed source/commit metadata and ensure current commit is published.
- [ ] Step 3: Ask Rudy to open a cache-busted URL and test one metric plus ship status.
