# SETUP RUNBOOK — get 3.0 on GitHub + CloudCannon

The local site is already a working clean fork (builds: 282 pages). These are the account-side steps (Jeff runs them; the sandbox can't git inside a mounted folder).

## 1. Push to a new GitHub repo
Create an **empty** repo on GitHub first (no README/license), e.g. `slashexperts-carly-website-3` (private). Then, in Terminal:

```bash
cd "/Users/jeff/Projects/SlashExperts/Website Claude/SlashExperts Carly Website 3.0"

# Start git clean on your Mac (the sandbox left a partial .git; re-init avoids lock issues)
rm -rf .git
git init
git branch -M main
git add -A
git commit -m "Initial commit: SlashExperts Carly Website 3.0 (clean fork of 2.0)"

# Use the URL GitHub shows for your new empty repo:
git remote add origin https://github.com/<you>/slashexperts-carly-website-3.git
git push -u origin main
```

> Note: `.gitignore` currently ignores `node_modules/` and `package-lock.json` (inherited from 2.0). That's fine — CloudCannon runs `npm i`. If you want fully reproducible builds, delete the `package-lock.json` line from `.gitignore` and commit the lockfile. Optional.

## 2. Create the CloudCannon staging site
- New site → connect the GitHub repo above.
- **Install command:** `npm i`
- **Build command:** `npx @11ty/eleventy`
- **Output directory:** `_site`
- Source/config: `cloudcannon.config.yml` is already in the repo root, so CloudCannon will pick up the existing setup (same as 2.0).
- Point it at a **staging subdomain** for now; we flip to production when the redesign is ready.

## 3. Confirm
- CloudCannon build succeeds and the staging URL renders the homepage.
- Tell me the staging URL and I'll add it to `STATUS.md`.

## Local dev (any session)
```bash
cd "/Users/jeff/Projects/SlashExperts/Website Claude/SlashExperts Carly Website 3.0"
npm run dev   # serves on http://localhost:8080
```
