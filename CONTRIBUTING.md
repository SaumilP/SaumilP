# Contributing & Automation Guide

Welcome!

This repository contains the source for my public GitHub Profile README.

Along with Markdown content, it includes several **automated workflows** that keep the profile dynamic, modern and always up to date.

---

## 🚀 Automated Systems Included

### 1. Light/Dark Banner Generator

**Purpose:**  
Auto-generates both `profile-banner-light.svg` and `profile-banner-dark.svg`.

**How it works:**  
- `scripts/generate-banners.js` is plain Node with no dependencies and writes two SVG versions.  
- A GitHub Action (`generate-banners.yml`) runs weekly.  
- The README uses a `<picture>` block to serve the correct banner based on theme.

**Files:**  
- scripts/generate-banners.js
- assets/profile-banner-light.svg
- assets/profile-banner-dark.svg
- .github/workflows/generate-banners.yml

---

### 2. Auto-Updating Developer Dashboard

**Purpose:**  
Shows live metrics such as:
- Public repositories count  
- Recent GitHub activity  
- Last updated timestamp  

**How it works:**  
- `scripts/update-dashboard.js` calls the GitHub API.  
- The script updates a special Markdown block between:  
  `<!-- DASHBOARD:START -->` and `<!-- DASHBOARD:END -->`
- A GitHub Action (`update-dashboard.yml`) runs every 12 hours.

**Files:**  
scripts/update-dashboard.js
README.md
.github/workflows/update-dashboard.yml

**Environment:**  
Uses the built-in `${{ secrets.GITHUB_TOKEN }}`.

---

### 3. Animated Stat Cards

**Purpose:**  
Re-publishes the gh-stats cards (pins, overview, languages, impact timeline) as self-hosted SVGs with CSS animation.
GitHub strips CSS and JS from READMEs but plays animations that live inside an `<img>` SVG, so the generator inlines each card into an animated wrapper.

**How it works:**  
- `scripts/generate-cards.js` fetches each card for dark and light themes and writes `assets/cards/<name>-<dark|light>.svg`.
- Motion: staggered entrance, light sweep, travelling border glow, pop-in contribution cells. All of it is off under `prefers-reduced-motion`.
- If any card cannot be fetched the run fails and the existing files stay in place.
- `scripts/check-cards.js` checks that every local asset referenced in the README exists.

**Files:**  
- scripts/generate-cards.js
- scripts/check-cards.js
- .github/workflows/generate-cards.yml
- .github/workflows/check-cards.yml

---

### 3. GitHub Activity Graph & Trophies

These are external visuals embedded in the README:

- **GitHub Trophy** (achievements visual)  
- **GitHub Activity Graph** (commit heat map)

These load dynamically and require no maintenance.

**Files:**  
None (external embeds).

---

### 4. Badge Theme and Styling

The README uses *dark/light neutral* badge styles (`flat-square`) for maximum readability across themes.  
No workflow needed.

---

## 🧪 Running Scripts Locally

### Install dependencies

```bash
npm install
```

### Generate banners locally

```bash
npm run generate:banners
```

### Update dashboard locally
```bash
npm run update:dashboard
```

### 📦 Directory Overview
```bash
/assets
  profile-banner-light.svg
  profile-banner-dark.svg

/scripts
  generate-banners.js
  update-dashboard.js

/.github/workflows
  generate-banners.yml
  update-dashboard.yml

README.md
CONTRIBUTING.md
package.json
```

### 🙌 Contributions

This is a personal profile repo.
Direct contributions aren’t expected, but ideas, improvements, or issue reports are always welcome.

Feel free to fork this layout for your own GitHub profile!


### 📬 Contact
- 🔗 **Website**: https://saumilp.github.io
- **GitHub**: https://github.com/SaumilP

---

# 🎉 All deliverables complete!

If you’d like, I can also generate:

✅ A **Makefile** to simplify local dev  
✅ A **“dark/light code snippet style”** upgrade  
✅ A **script to auto-update pinned repos**  
✅ An “activity digest” summarizing your last 7 days of GitHub work  

Just say the word.
