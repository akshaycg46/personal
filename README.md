# Akshay Gupta — Portfolio

Professional personal portfolio for a Computer Science student at the University of Central Florida, with an Ahri-inspired visual identity.

## Content

- Selected work: Total Recall, GradFinance, and Mars / Jigyasa
- Project descriptions, implementation notes, technology lists, and public source links
- Education, project-backed skills, LinkedIn, GitHub, and email contact
- Printable résumé at `/resume`
- Responsive mobile navigation, keyboard access, reduced-motion support, and email copying

Project descriptions are grounded in the linked repositories and Akshay’s project history. Project graphics are explanatory illustrations, not application screenshots. No employment history, performance metrics, or skill ratings are invented. Ahri's hero is generated artwork. An interactive Three.js Charm effect is integrated into the hero: cast with E, the cast button, or an artwork tap. It uses a procedural heart shader, bloom, gold filigree, a kiss-pose transition, mouth-anchored launch coordinates, a perspective trajectory toward the viewer, curved ribbon trails, trailing hearts, and a foreground burst of rings, light and petals. It is a fan-made visual interpretation, not an extracted Riot game asset. Reduced-motion preferences and a non-WebGL fallback are supported.

## Development

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

## Vercel

Import `akshaycg46/personal` using **Next.js**, Root Directory **./**, and the default build, install, and output settings. No environment variables are required. `vercel.json` selects the Next.js framework. Deployments run from `main`.

## Editing

- Portfolio content and project notes: `app/page.tsx`
- Design and responsive styles: `app/globals.css`
- Navigation and contact controls: `app/ui.tsx`
- Ahri Charm interaction: `app/charm.tsx`
- Résumé: `app/resume/page.tsx`
- Metadata: `app/layout.tsx`
- Hero artwork: `public/ahri-hero.webp` and `public/ahri-kiss.webp`

The character animation uses a crossfade between two generated poses and subtle image movement; it is not a rigged 3D Ahri model. The heart and effects are rendered in real time using Three.js. Mouth coordinates are mapped through the current object-fit crop for responsive alignment.

The résumé uses browser printing, with a dedicated A4 stylesheet. Select **Print / save PDF** on the résumé page to save a PDF.

Independent fan-inspired portfolio. Ahri and League of Legends belong to Riot Games.
