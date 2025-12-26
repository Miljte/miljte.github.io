# deploy guide

## to vercel (recommended)

Monorepo setup (root + `apps/web`). Two options:

1) Set root directory in Vercel (preferred)

- Vercel Dashboard → Project → Settings → General
- Root Directory: `apps/web`
- Framework: Next.js
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm run build`
- Output Directory: `.next` (auto)

2) Use vercel.json at repo root (already added)

- Vercel will run `pnpm install` at repo root and then `pnpm run build` which proxies to `apps/web`
- No extra config needed in the dashboard

Deploy from CLI (optional):

```bash
pnpm dlx vercel --prod
```

## to github pages (manual)

```bash
# build
pnpm build

# the .next folder has everything you need
# push to gh-pages branch and enable GitHub Pages in settings
```

## local development

```bash
pnpm dev
# visit http://localhost:3000
```

## testing the build

```bash
pnpm build
pnpm start
```
