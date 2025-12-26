# deploy guide

## to vercel (recommended)

vercel auto-deploys from github. just push to main and it'll go live at https://miljte.github.io

```bash
vercel --prod
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
