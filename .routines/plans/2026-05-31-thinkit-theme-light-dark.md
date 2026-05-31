# Thinkit Theme Light/Dark — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable the existing `jekyll-theme-console` light/dark auto-switching so `kiranramanna.github.io/thinkit/` respects each visitor's OS color-scheme preference.

**Architecture:** Single-line config change in `_config.yml` activates the `prefers-color-scheme` CSS media-query path that the theme already includes in `_includes/head.html`. The three sass files (`_light.scss`, `_dark.scss`, `_hacker.scss`) are already in place. No new code; no new files.

**Tech Stack:** Jekyll 4.x, jekyll-theme-console (forked from `b2a3e8`), Sass, Liquid templating, GitHub Pages.

**Spec reference:** `.routines/specs/2026-05-31-thinkit-publishing-routines-design.md` § 3.

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `_config.yml` | Modify line ~11 | Enable `listen_for_clients_preferred_style` flag |
| (no other files) | — | All theme assets already exist |

---

## Prerequisites

- [ ] Local Jekyll dev environment works: `bundle install && bundle exec jekyll serve` from `~/Documents/github/thinkit/` succeeds and serves `http://127.0.0.1:4000/thinkit/`.
- [ ] You can switch macOS appearance manually (System Settings → Appearance) OR use Chrome DevTools' "Emulate CSS prefers-color-scheme" rendering panel.

---

### Task 1: Create a feature branch

**Files:**
- (no file changes — git operation only)

- [ ] **Step 1: Switch to thinkit repo and check current state**

```bash
cd ~/Documents/github/thinkit
git status
git branch --show-current
```

Expected output: working tree clean OR untracked `.routines/` directory only; current branch shows whatever you're on (likely `feat/routines-spec` if the spec was already committed).

- [ ] **Step 2: Create branch from master**

```bash
git checkout master
git pull origin master
git checkout -b feat/theme-light-dark
```

Expected: `Switched to a new branch 'feat/theme-light-dark'`.

- [ ] **Step 3: Verify branch is clean**

```bash
git status
```

Expected: `nothing to commit, working tree clean` (or only the `.routines/` directory if it hasn't been merged from `feat/routines-spec` yet — that's fine, it's independent).

---

### Task 2: Capture baseline rendering (before change)

**Files:**
- (no file changes — observation only)

This task confirms the site renders in `hacker` style only today, so we can compare after the change.

- [ ] **Step 1: Start Jekyll dev server**

```bash
cd ~/Documents/github/thinkit
bundle exec jekyll serve --baseurl ''
```

Expected: server starts on `http://127.0.0.1:4000/` — note the `--baseurl ''` override; the production config sets `baseurl: /thinkit` which would otherwise serve at `http://127.0.0.1:4000/thinkit/`.

Leave server running in this terminal; open a new terminal for next steps.

- [ ] **Step 2: Visual confirmation — current state**

Open in a browser: `http://127.0.0.1:4000/`

Confirm:
- Background is dark green/black (hacker theme).
- Monospace terminal aesthetic visible.
- Text contrast is high but not respecting OS theme.

In Chrome DevTools:
- Open DevTools (Cmd+Opt+I).
- Cmd+Shift+P → type "Show Rendering" → enable.
- In Rendering tab, set "Emulate CSS prefers-color-scheme" to `light`.
- Reload the page.

Expected: page still renders hacker theme (because flag isn't enabled yet).

- [ ] **Step 3: Stop the server**

In the terminal running `jekyll serve`, press Ctrl+C.

---

### Task 3: Enable the light/dark toggle in `_config.yml`

**Files:**
- Modify: `_config.yml` (uncomment one line)

- [ ] **Step 1: Inspect current `_config.yml`**

```bash
cat ~/Documents/github/thinkit/_config.yml
```

Find the line that looks like:

```yaml
#listen_for_clients_preferred_style: true # true or false (default)
```

- [ ] **Step 2: Edit `_config.yml`**

Open `~/Documents/github/thinkit/_config.yml` in your editor.

Replace:
```yaml
#listen_for_clients_preferred_style: true # true or false (default)
```

With:
```yaml
listen_for_clients_preferred_style: true # respect visitor's OS prefers-color-scheme
```

(Remove the leading `#` and trim the trailing comment to something clearer.)

- [ ] **Step 3: Diff the change**

```bash
cd ~/Documents/github/thinkit
git diff _config.yml
```

Expected: a single-line diff showing the comment marker removed and the trailing comment edited.

---

### Task 4: Verify the change works locally — all three theme paths

**Files:**
- (no file changes — verification only)

- [ ] **Step 1: Start Jekyll dev server**

```bash
cd ~/Documents/github/thinkit
bundle exec jekyll serve --baseurl ''
```

Wait until you see `Server address: http://127.0.0.1:4000/` and `Server running... press ctrl-c to stop.`

- [ ] **Step 2: Test LIGHT theme path**

Open `http://127.0.0.1:4000/` in Chrome.

In DevTools → Rendering tab → "Emulate CSS prefers-color-scheme" → set to `light` → reload page.

Expected:
- Background becomes light/white.
- Text becomes dark.
- Visually distinct from previous hacker theme.
- Open one post (e.g., the EB1A one) and confirm body text is readable on light background.

- [ ] **Step 3: Test DARK theme path**

In DevTools → Rendering tab → "Emulate CSS prefers-color-scheme" → set to `dark` → reload page.

Expected:
- Background becomes dark (but a softer dark than hacker theme — closer to standard dark mode).
- Text becomes light.
- Open one post and confirm body text is readable.

- [ ] **Step 4: Test NO-PREFERENCE fallback (hacker theme)**

In DevTools → Rendering tab → "Emulate CSS prefers-color-scheme" → set to `No emulation` → reload page.

Expected:
- Background reverts to dark green/black hacker theme.
- Site looks the way it did in Task 2.

- [ ] **Step 5: Spot-check 3 posts in each theme**

For each theme (light, dark, no-preference), visit:
- `http://127.0.0.1:4000/2025/01/22/deepseek-r1-paper-review.html`
- `http://127.0.0.1:4000/2025/11/06/unlocking-ai-success-key-insights-for-founders-and-innovators.html`
- `http://127.0.0.1:4000/2025/11/27/unlocking-eb1a-success-the-power-of-conference-paper-reviews.html`

Confirm in each:
- Body text legible.
- Code blocks (if any) have readable contrast.
- Links visible (not invisible due to color collision).
- Emoji bullets render (✅ ⚠️ 🎯 etc.).

- [ ] **Step 6: Stop the server**

Ctrl+C in the terminal running `jekyll serve`.

---

### Task 5: Commit the change

**Files:**
- Stage: `_config.yml`

- [ ] **Step 1: Stage and review diff one more time**

```bash
cd ~/Documents/github/thinkit
git add _config.yml
git diff --cached _config.yml
```

Expected: clean single-line diff showing the comment removed and trailing comment updated.

- [ ] **Step 2: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat(theme): enable light/dark auto-switching via prefers-color-scheme

Uncomment listen_for_clients_preferred_style in _config.yml so the
jekyll-theme-console renders _light.scss for light-mode visitors and
_dark.scss for dark-mode visitors. The hacker theme remains the
fallback when no OS preference is exposed.

No new files; the toggle logic in _includes/head.html and the
three sass files (_light.scss, _dark.scss, _hacker.scss) were
already in place from the original theme fork.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

Expected: `[feat/theme-light-dark <sha>] feat(theme): enable light/dark auto-switching...` with 1 file changed.

- [ ] **Step 3: Verify commit log**

```bash
git log --oneline -3
```

Expected: your new commit appears at top.

---

### Task 6: Push and verify on GitHub Pages

**Files:**
- (no file changes — deployment only)

> **Auth caveat:** Push to `kiranramanna/thinkit` requires the `kiranramanna` GitHub account auth. If `gh auth status` shows you're logged in as `krama-mcp`, the push will fail (`Permission denied`). Resolve via one of:
> 1. `gh auth login` and pick `kiranramanna` account, then `gh auth setup-git`
> 2. Configure SSH key for `kiranramanna` and use a host alias in `~/.ssh/config`
> 3. Use HTTPS push with a PAT scoped to `kiranramanna/thinkit`

- [ ] **Step 1: Push the branch**

```bash
cd ~/Documents/github/thinkit
git push origin feat/theme-light-dark
```

Expected: branch pushed and tracking set up.

- [ ] **Step 2: Open a PR (optional but recommended)**

```bash
gh pr create --base master --head feat/theme-light-dark \
  --title "Enable theme light/dark auto-switching" \
  --body "Single-line config change. See spec § 3 in .routines/specs/."
```

Or merge directly:

```bash
git checkout master
git merge --no-ff feat/theme-light-dark
git push origin master
```

- [ ] **Step 3: Wait for GitHub Pages rebuild**

```bash
sleep 90
gh api repos/kiranramanna/thinkit/pages/builds --jq '.[0] | {status, created_at, error}'
```

Expected: `{"status": "built", "created_at": "...", "error": {"message": null}}`.

If the build is still pending, wait another 30s and re-run.

- [ ] **Step 4: Verify live site behavior**

Open `https://kiranramanna.github.io/thinkit/` on a Mac with the OS in **Light mode** (System Settings → Appearance → Light).

Expected: site renders in `_light.scss` styles — light background, dark text.

Switch OS to **Dark mode**.

Expected: site re-renders (after reload) in `_dark.scss` styles.

- [ ] **Step 5: Mark Effort 1 complete**

```bash
git log --oneline -1
echo "Effort 1 (theme light/dark) complete."
```

---

## Self-Review Checklist

Run through after all tasks complete:

- [ ] `_config.yml` shows `listen_for_clients_preferred_style: true` uncommented.
- [ ] Local `jekyll serve` confirmed all 3 theme paths (light, dark, no-preference).
- [ ] Live site at `kiranramanna.github.io/thinkit/` reflects OS preference on at least one device.
- [ ] No existing post renders broken in any theme.
- [ ] Commit history shows one clean commit for this change.
- [ ] Branch `feat/theme-light-dark` is merged to master (or PR is open).

---

## Rollback

If anything breaks:

```bash
cd ~/Documents/github/thinkit
git revert <commit-sha>
git push origin master
```

Reverts to single-theme `hacker` rendering. Site is back to current behavior within ~1 min after GitHub Pages rebuilds.
