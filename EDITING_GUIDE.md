# Editing Guide — Homepage Sections

This guide explains how to edit the custom sections on your homepage
(**Recent News, Research Interests, Experience & Education, Awards, Selected
Publications, Expertise**).

## The two files involved

| File | What it controls |
|------|------------------|
| `_pages/about.md` | **The content** — the words, dates, and entries you edit. |
| `assets/css/enhancements.css` | **The look** — colors, spacing, sizes. You rarely need to touch this. |

> Your original homepage is safely backed up at **`legacy/about.md`** (that folder
> is excluded from the site, so it never publishes). To fully revert, copy it back:
> `cp legacy/about.md _pages/about.md`

After any edit: **save the file**, wait a few seconds for the local server to
rebuild, then **hard-refresh** the browser (`Ctrl + F5`). Changes to `about.md`
auto-reload; only edits to `_config.yml` need a server restart.

---

## 1. Recent News

Find the `<ul class="enh-news">` block. Each news item is one `<li>` line.
**Newest goes at the top.** To add one, copy an existing line and edit the date + text:

```html
<li><span class="enh-date">Aug 2026</span><span class="enh-what">Your update text here.</span></li>
```

Delete the `[example]` entries once you add real ones.

---

## 2. Research Interests (badges)

Find `<div class="enh-badges">` under **Research Interests**. Each interest is one span:

```html
<span class="enh-badge">Your Topic</span>
```

Add or remove lines to taste.

---

## 3. Experience & Education (timeline)

Find `<div class="enh-timeline">`. Each entry is one block. Copy a block and edit it:

```html
<div class="enh-tl">
  <h4>Your Job Title</h4>
  <div class="enh-org">Organization — Department</div>
  <p class="enh-meta">City, Country · Dates</p>
</div>
```

- Use `class="enh-tl"` for **jobs** (navy dot).
- Use `class="enh-tl edu"` for **education** (teal dot).
- Order top-to-bottom = most recent first.

---

## 4. Awards & Honors

Find `<div class="enh-awards">`. Each award is one block:

```html
<div class="enh-award">
  <div class="enh-medal">🏅</div>
  <h4>Award Name</h4>
  <p>Short description / who gave it</p>
</div>
```

Change the emoji (🏅 🥇 🎓 ⚛️ 🌟 🏆) and text. They lay out two per row automatically.

---

## 5. Selected Publications

Find the `<div class="enh-pub">` blocks. Each paper is one block:

```html
<div class="enh-pub">
  <div class="enh-thumb">figure</div>
  <div>
    <h4>Paper Title</h4>
    <div class="enh-venue">Venue · Year</div>
    <div class="enh-plinks"><a href="LINK">PDF</a> <a href="LINK">Code</a></div>
  </div>
</div>
```

**To show a real figure instead of the grey “figure” box:** put an image in the
`images/` folder, then replace `<div class="enh-thumb">figure</div>` with:

```html
<div class="enh-thumb"><img src="/images/your-figure.png" alt=""></div>
```

**Link buttons:** edit the `href="..."` values. Remove an `<a>` you don't need.

---

## 6. Expertise (skill badges + tables)

- **Badges:** the `<div class="enh-badges">` under **Expertise** — same as interests,
  but use `class="enh-badge alt"` (teal style) for skills/tools.
- **Tables:** plain Markdown tables below the badges. Edit the cells between the `|` bars.

---

## Changing the colors

All the new sections use two brand colors, defined once at the top of
`assets/css/enhancements.css`:

```css
--enh-navy: #1f4e5f;   /* dots, headings, primary accents */
--enh-teal: #52adc8;   /* secondary accent, education dots */
```

Change those two hex values to recolor every section at once.
(These match your particle background and site link color.)

---

## Dark mode & animations (site-wide polish)

These work automatically — no per-page editing needed:

- **Dark / light toggle** — the round button at the **bottom-right** of every page.
  The choice is remembered in the browser. In dark mode the particle background and
  dots automatically switch to a brighter teal so they stay visible.
- **Fade-in on scroll** — sections with the `enh-reveal` class fade in as you scroll.
  To make a new block fade in, add `enh-reveal` to its class list. (Respects the OS
  "reduce motion" accessibility setting.)
- **Social share image** — when your site link is shared on LinkedIn/Twitter/Slack,
  it shows your profile photo. To change it, edit the `og:image` lines in
  `_includes/head/custom.html` (point them at a different file in `/images/`).

**Where these live:** dark-mode styles + fade-in are in `assets/css/enhancements.css`;
the toggle + particle logic is in `_includes/particles.html`; the fade-in script is
`assets/js/enhancements.js`. To change the dark particle-dot color, edit the two
`#7fc4d8` values in `_includes/particles.html`.

## Full revert

If you ever want the original plain homepage back:

```powershell
cp legacy/about.md _pages/about.md
```

Then (optional) remove the stylesheet link from `_includes/head/custom.html`
and delete `assets/css/enhancements.css`.
