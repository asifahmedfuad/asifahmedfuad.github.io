# How to Run & Preview My Website Locally

This is my personal Jekyll website (`asifahmedfuad.github.io`). These steps let me
edit it on this PC and preview the changes in a browser **before** they go live.

---

## One-time setup (already done — only needed on a brand-new PC)

Already installed on this machine:
- **Ruby 3.3 + DevKit** — installed at `C:\Ruby33-x64` (via `winget install RubyInstallerTeam.RubyWithDevKit.3.3`)
- **Jekyll + site dependencies** — installed with `bundle install`

If I ever move to a *new* PC, I redo this once:
```powershell
winget install RubyInstallerTeam.RubyWithDevKit.3.3
ridk install 3
cd "\MyWeb\asifahmedfuad.github.io"
bundle install
```

---

## Every time I want to work on the site

### Step 1 — Open PowerShell in the project folder
Open the **Start menu → type "PowerShell" → Enter**, then paste:
```powershell
cd "\MyWeb\asifahmedfuad.github.io"
```

> Shortcut: in File Explorer, open the project folder, type `powershell` in the
> address bar, and press Enter — it opens already pointing at the folder.

### Step 2 — Start the server
```powershell
bundle exec jekyll serve
```
Wait ~10–15 seconds until you see:
```
Server address: http://127.0.0.1:4000/
Server running... press ctrl-c to stop.
```

> **If `bundle` is "not recognized":** the terminal can't find Ruby. Run this line
> first, then repeat Step 2:
> ```powershell
> $env:Path = "C:\Ruby33-x64\bin;" + $env:Path
> ```

### Step 3 — View the site
Open a browser and go to:

### 👉 http://127.0.0.1:4000/

### Step 4 — Edit and see changes
1. Edit any content file and **save** it (see "Where things live" below).
2. The server **auto-rebuilds** in a few seconds (watch the PowerShell window).
3. **Refresh the browser** to see the update.

### Step 5 — Stop the server
Click the PowerShell window and press **`Ctrl + C`**.

---

## Where things live (what to edit)

| To change...                         | Edit...                          |
|--------------------------------------|----------------------------------|
| Name, bio, email, social links       | `_config.yml`                    |
| Homepage / About text                | `_pages/about.md`                |
| Publications                         | `_publications/`                 |
| Talks                                | `_talks/`                        |
| Portfolio projects                   | `_portfolio/`                    |
| Blog posts                           | `_posts/`                        |
| Top navigation menu                  | `_data/navigation.yml`           |
| Profile photo & images               | `images/`                        |
| CV / PDFs                            | `files/`                         |

---

## Publish changes to the live website

Local preview (`127.0.0.1:4000`) is only on my PC. To put changes on the real
site at **https://asifahmedfuad.github.io**, commit and push to GitHub:
```powershell
git add -A
git commit -m "describe what I changed"
git push
```
GitHub Pages rebuilds the public site automatically in about 1 minute.

---

## Troubleshooting

- **`bundle` / `ruby` not recognized** → run `$env:Path = "C:\Ruby33-x64\bin;" + $env:Path` then retry.
- **Port already in use** → an old server is still running. Close other PowerShell
  windows, or use a different port: `bundle exec jekyll serve --port 4001`
  (then open http://127.0.0.1:4001/).
- **Changes don't appear** → hard-refresh the browser (`Ctrl + F5`), and make sure
  the PowerShell window shows the rebuild finished with no red error.
- **A red error on start after editing `_config.yml`** → `_config.yml` is
  whitespace-sensitive (YAML). Undo the last edit, save, and it should recover.
  Config changes also require **stopping and restarting** the server (Steps 5 → 2).
