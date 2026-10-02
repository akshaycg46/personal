# Akshay Gupta — Spirit Blossom Portfolio

A cinematic Ahri-inspired personal website for Akshay Gupta, Computer Science student at UCF.

## Features

- Next.js App Router with TypeScript
- Custom Ahri-inspired hero artwork
- Interactive Three.js spirit orb with nine orbital rings
- Spirit Blossom and Moonlight palettes, pause control and reduced-motion support
- Responsive layout, keyboard access, mobile navigation, and WebGL fallback
- Vercel deployment from the repository root

## Run locally

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

Open http://localhost:3000/ .

```bash
npm run build
npm run typecheck
```

## Deploy on Vercel

Import `akshaycg46/personal` in Vercel with these settings:

- Framework Preset: **Next.js**
- Root Directory: **./** (repository root)
- Build Command: **default** (`npm run build`)
- Output Directory: **default** (do not override with `out` or `public`)
- Install Command: **default** (`npm install`)

No environment variables are required. The project uses normal Next.js output, and all pages and public assets are served at the domain root. `vercel.json` explicitly selects the Next.js framework.

If the project is already imported, verify its Root Directory and remove any custom Output Directory override, then redeploy the latest `main` commit.

## Editing

- Text and sections: `app/page.tsx`
- Colors and responsive layout: `app/globals.css`
- Interactive 3D: `app/spirit.tsx`
- Metadata: `app/layout.tsx`
- Hero artwork: `public/ahri-hero.webp`

Ahri's hero is generated 3D-style raster artwork, not a rigged or rotatable character model. The spirit orb is real-time 3D geometry rendered with Three.js.

This is an independent fan-inspired portfolio. Ahri and League of Legends belong to Riot Games. No affiliation or endorsement is implied.
