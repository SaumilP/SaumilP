# Contributing & Automation Guide for Saumil's GitHub Profile

Welcome!

This repository contains the source for my public GitHub Profile README.

Along with Markdown content, it includes several **automated workflows** that keep the profile dynamic, modern and always up to date.

---

## 🚀 Automated Systems Included

### 1. Light/Dark Banner Generator

**Purpose:**  
Auto-generates both `profile-banner-light.png` and `profile-banner-dark.png`.

**How it works:**  
- `scripts/generate-banners.js` uses `node-canvas` to draw two versions.  
- A GitHub Action (`generate-banners.yml`) runs weekly.  
- The README uses a `<picture>` block to serve the correct banner based on theme.

**Files:**  
- scripts/generate-banners.js
- assets/profile-banner-light.png
- assets/profile-banner-dark.png
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
  profile-banner-light.png
  profile-banner-dark.png

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
