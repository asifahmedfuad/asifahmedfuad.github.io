# Website Project Log

A running log so we can stop and resume easily. Latest session first.

---

## Session 1 — 2026-07-05 / 06

### Goal
Set up this site for editing on a new PC, then customize the look.

### ✅ What we did

**1. Local toolchain (new PC setup)**
- Installed **Ruby 3.3 + DevKit** via winget → `C:\Ruby33-x64`; MSYS2 toolchain via `ridk install 3`.
- Fixed the template so it builds on modern Ruby: commented out the `wdm` gem in `Gemfile`, deleted the old `Gemfile.lock` and regenerated it.
- Local preview works: `bundle exec jekyll serve` → **http://127.0.0.1:4000/**.
- Wrote **`HOW_TO_RUN_LOCALLY.md`** (how to start the server, edit, publish).

**2. Animated background** — particles.js (dots + connecting lines)
- Files: `_includes/particles.html`, `assets/js/particles-config.json`; included via one line in `_layouts/default.html`.
- Final settings: **navy-teal `#1f4e5f`**, **130 dots**, **speed 0.6**. (Copied the technique from tauhidnabi's site — NONE of his personal content.)

**3. Font** → **Inter** (Google Font)
- `_sass/_variables.scss` (`$inter`, `$global-font-family`, `$header-font-family`); font loaded in `_includes/head/custom.html`.

**4. Footer name** — `_config.yml` `name`: "Your Name" → **"Kazi Ahmed Asif Fuad"**.

**5. Body text size** — `_sass/_reset.scss`: 16px/18px → **15px/16px** (slightly smaller everywhere).

**6. Deleted unused template files** — `CHANGELOG.md`, `CONTRIBUTING.md`, `README.md`, `talkmap/`, `talkmap.ipynb`, `talkmap.py`. Kept placeholder content + `markdown_generator/` (by choice).

**7. Homepage sections** (in `_pages/about.md`) — styled in `assets/css/enhancements.css` (`enh-` prefixed):
- Recent News · Research-interest badges · Experience/Education **timeline** · Awards · Selected Publications.
- Original homepage backed up to **`legacy/about.md`** (folder excluded from build in `_config.yml`).

**8. Polish**
- **Fade-in on scroll** (`assets/js/enhancements.js`, `.enh-reveal`).
- **Social share image** (og:image = `profile.png`, tags in `head/custom.html`).
- **Dark mode toggle** (round button, bottom-right) — theme-aware particle colors + dark CSS in `enhancements.css`; choice saved in browser.

**9. Guide** — wrote **`EDITING_GUIDE.md`** covering every section + dark mode/animations.

### 📍 Current state
- All changes are **LOCAL ONLY — nothing pushed to GitHub yet.**
- Git remote: `asifahmedfuad/asifahmedfuad.github.io`, branch `master`.
- To start the server next time: open PowerShell in this folder → `bundle exec jekyll serve` (if `bundle` isn't found, run `$env:Path = "C:\Ruby33-x64\bin;" + $env:Path` first). See `HOW_TO_RUN_LOCALLY.md`.

### ⏭️ TODO — next session ("we need to update a lot")
- [ ] **Recent News** — replace the 4 `[example]` entries with real updates (`_pages/about.md`).
- [ ] **Selected Publications** — replace placeholder titles/links; add real figure images (`_pages/about.md` + `images/`).
- [ ] **Publications / Talks / Portfolio / Posts** — still the template placeholders (`_publications/`, `_talks/`, `_portfolio/`, `_posts/`). Replace with real content.
- [ ] Review other pages for leftover template text: `cv.md`, `research.md`, `teaching.md`, `experience.md`, `educations.md`, `volunteering.md`, etc.
- [ ] Optional not-yet-added ideas: hero tagline + CTA buttons (#1), institution **logo strip** with real logos (#5).
- [ ] Confirm dark-mode contrast looks right in the browser.
- [ ] **Publish**: `git add -A && git commit -m "..." && git push` when ready.

### ↩️ How to fully revert the homepage
`cp legacy/about.md _pages/about.md` (then optionally remove the enhancement CSS/JS links from `_includes/head/custom.html`).
