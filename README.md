# Akshay Gupta — Spirit Blossom Portfolio

A cinematic Ahri-inspired personal website for Akshay Gupta, Computer Science student at UCF.

## Features

- Next.js App Router with TypeScript and static export
- Custom Ahri-inspired hero artwork
- Interactive Three.js spirit orb with nine orbital rings
- Spirit Blossom and Moonlight palettes, pause control and reduced-motion support
- Responsive layout, keyboard access, mobile navigation, and WebGL fallback
- GitHub Pages deployment workflow

## Run locally

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open http://localhost:3000/personal/ .

```bash
npm run build
npm run typecheck
```

The static website is generated into `out/`.

## GitHub Pages

In this repository, open **Settings → Pages** and select **GitHub Actions** as the source. Pushing to `main` runs `.github/workflows/deploy.yml` and deploys the static export to https://akshaycg46.github.io/personal/ .

The `basePath` in `next.config.ts` and asset URLs use `/personal`. Change these together if the repository name changes or a custom domain is added.

## Editing

- Text and sections: `app/page.tsx`
- Colors and responsive layout: `app/globals.css`
- Interactive 3D: `app/spirit.tsx`
- Metadata: `app/layout.tsx`
- Hero artwork: `public/ahri-hero.webp`

Ahri's hero is generated 3D-style raster artwork, not a rigged or rotatable character model. The spirit orb is real-time 3D geometry rendered with Three.js.

This is an independent fan-inspired portfolio. Ahri and League of Legends belong to Riot Games. No affiliation or endorsement is implied.
