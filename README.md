# tuleenhr.github.io

Personal portfolio for Tuleen Rowaihy: a one-page site plus case studies at `/kbt` and `/fiddlie`.
Next.js (App Router) + TypeScript + Tailwind CSS, exported as static HTML and deployed to GitHub Pages.

## Editing words

All copy, links, projects, timeline rows and case-study text live in **`src/content.ts`**.
Change text there; components only handle layout.

- Hide a link (e.g. a private repo): set the project's `href` to `null`.
- Add a portrait: drop `public/me.jpg` in and rebuild. The About section only shows a photo if the file exists.
- Add the Fiddlie annotation screenshot: drop `public/fiddlie/fiddlie-annotation-pins.jpg` in. It appears under "Calm, and only what's theirs." only if the file exists.
- New screenshots: put the originals in `public/kbt/` or `public/fiddlie/`, run `npm run optimize-images` (resizes them in place), and update the width/height in `src/content.ts`.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `out/`.

## Deploy

`.github/workflows/deploy.yml` builds and publishes `out/` to GitHub Pages on every push to `main`.
