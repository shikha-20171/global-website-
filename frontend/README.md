# DEZORYN TECHNOLOGY — Frontend (Next.js 14, App Router)

Frontend only: no backend, no database, no admin panel. Forms validate in the browser and log the lead object to the console.

## Run
```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Architecture Overview
- `lib/data.js` & `lib/caseStudiesData.js` — Single source of truth for products, pricing, industries, solutions, case study architectures, and navigation.
- `components/` — Shared, reusable UI components: Navbar, Footer, ProductCard, PricingCard, CookieBanner, SearchModal, 3D Globe, Bento orbit showcase, forms, and drawers.
- `app/` — Next.js 14 App Router routes: `/`, `/marketplace`, `/compare`, `/products/[slug]`, `/pricing`, `/industries`, `/industries/[slug]`, `/solutions`, `/projects`, `/case-studies/[slug]`, `/company`, `/contact`, `/demo`, `/resources`, `/legal/[slug]`.

## Animation System
- Three.js 3D Interactive Rotating Globe with NASA Earth night textures (`Globe.js`, `HeroStage.js`).
- 3D Interactive Bento Orbit animation for What We Build (`Bento.js`).
- 3D tilt pricing physics with mouse-follow specular spotlight (`PricingCard.js`).
- Flowing marquee industry cards (`HomeIndustries.js`).
- Ambient background effects and reduced-motion accessibility (`Effects.js`, `MotionRoot.js`).
