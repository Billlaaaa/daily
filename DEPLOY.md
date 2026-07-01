# Deploying to daily.snake-master.com

This app is a static Vite build hosted on **GitHub Pages** from the `daily` repo,
served at the subdomain **https://daily.snake-master.com/** (root of the subdomain,
so Vite `base` is `/`). A `public/CNAME` file pins the custom domain.

---

## One-time setup

### 1. Push the code
```bash
git remote add origin https://github.com/Billlaaaa/daily.git   # if not already set
git push -u origin main
```

### 2. Add the Google client ID secret
Repo → **Settings → Secrets and variables → Actions → New repository secret**
- Name: `VITE_GOOGLE_CLIENT_ID`
- Value: the value after `VITE_GOOGLE_CLIENT_ID=` in local `.env.local`

### 3. Enable Pages
Repo → **Settings → Pages → Build and deployment → Source: `GitHub Actions`**

### 4. Point the subdomain at GitHub (DNS)
At the registrar/DNS host for `snake-master.com`, add one record:
- Type: **CNAME**
- Name/Host: **daily**
- Value/Target: **billlaaaa.github.io**

### 5. Set the custom domain on the repo
Repo → **Settings → Pages → Custom domain** → `daily.snake-master.com` → **Save**.
Wait for the green "DNS check successful", then tick **Enforce HTTPS**.

### 6. Authorize the domain for Google sign-in
[Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
→ your OAuth client → **Authorized JavaScript origins** → add
`https://daily.snake-master.com` (keep `http://localhost:5173` for local dev).

Live at: **https://daily.snake-master.com/**

---

## Updating later
```bash
git add -A
git commit -m "what changed"
git push
```
The **Deploy to GitHub Pages** workflow rebuilds and republishes automatically.

## Notes
- Subdomain serves at root, so `base` is `/`. Don't reintroduce a `/daily/` base.
- Local dev is unaffected: `npm run dev` runs at `/`.
- DNS/cert can take a few minutes to an hour to go green the first time.
