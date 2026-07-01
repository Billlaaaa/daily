# Deploying to snake-master.com/daily

This app is a static Vite build deployed to **GitHub Pages** as a project site.
Because the custom domain `snake-master.com` is configured on your GitHub Pages
**user site**, any project repo you publish is served at `snake-master.com/<repo-name>/`.

The build is configured for the path **`/daily/`**, so the repo **must be named `daily`** (lowercase).

---

## One-time setup

### 1. Create the repo
On GitHub, create a new repository:
- Name: **`daily`** (exactly, lowercase)
- Visibility: **Public**
- Do **not** add a README, .gitignore, or license (keep it empty)

Create it under the same account/org that owns your `snake-master.com` Pages site.

### 2. Push this project
From the project folder (`C:\Users\yuvam\cfa-tracker`):

```bash
git remote add origin https://github.com/<your-username>/daily.git
git push -u origin main
```

If git asks you to sign in, use your GitHub account (or a Personal Access Token).

### 3. Add the Google client ID as a secret
The client ID is read at build time from a repository secret (your local `.env.local`
is never pushed).

Repo → **Settings → Secrets and variables → Actions → New repository secret**
- Name: `VITE_GOOGLE_CLIENT_ID`
- Value: copy the value after `VITE_GOOGLE_CLIENT_ID=` in your local `.env.local`

### 4. Enable Pages
Repo → **Settings → Pages → Build and deployment → Source: `GitHub Actions`**

Do **not** set a custom domain on this repo — it inherits `snake-master.com`
from your user site.

### 5. Authorize the domain for Google sign-in
[Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
→ your OAuth 2.0 Client ID → **Authorized JavaScript origins** → add:
- `https://snake-master.com`
- (keep `http://localhost:5173` for local dev)

HTTPS is required for both Google sign-in and the service worker — GitHub Pages
provides this automatically on the custom domain.

---

## Deploying (now and every update)

Just push to `main`:

```bash
git add -A
git commit -m "your message"
git push
```

The **Deploy to GitHub Pages** workflow (`.github/workflows/deploy.yml`) runs
automatically: it installs deps, builds with base `/daily/`, adds a `404.html`
SPA fallback and `.nojekyll`, and publishes. Watch progress in the repo's
**Actions** tab. First deploy takes ~1-2 minutes.

Live at: **https://snake-master.com/daily/**

---

## Notes / troubleshooting

- **Repo name = URL path, case-sensitive.** `daily` → `/daily/`. If you ever
  rename it, change `base` in `vite.config.js` to match.
- **Blank page / 404 on assets** usually means the `base` and repo name don't
  match, or Pages source isn't set to "GitHub Actions".
- **Sign-in button does nothing** on the live site → the domain isn't in the
  Google OAuth "Authorized JavaScript origins" (step 5), or the
  `VITE_GOOGLE_CLIENT_ID` secret is missing (step 3).
- **Local development** is unaffected: `npm run dev` still serves from `/`.
- Each user's data is stored per-Google-account in that browser's localStorage.
  Use the in-app **Settings → Backup** to export/import.
