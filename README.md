# ARF Motion — Roblox Animation Portfolio

A React-powered portfolio for Andrew Le's Roblox animation and commission work.

The site uses a few focused libraries:

- **React** for the page and reusable UI components.
- **React Three Fiber + Three.js** for the interactive 3D impact scene.
- **Framer Motion** for smooth page transitions and scroll reveals.
- **Lucide React** for lightweight interface icons.

## Run it locally

1. Install Node.js.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local address shown in the terminal.

## Build it

Run `npm run build:pages`. This builds the React app and copies the generated `index.html` and `assets` files to the repository root, where GitHub Pages serves them from the main branch.

The editable website source lives in `app/`. The root `index.html`, `favicon.svg`, and `assets/` files are generated, so edit the React source instead of changing those by hand.

The portfolio is intentionally a single-page site so it stays fast, simple to update, and reliable on GitHub Pages.
