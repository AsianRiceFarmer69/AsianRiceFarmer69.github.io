# Andrew Le - Roblox Animation Portfolio

A React portfolio for Andrew Le's Roblox animation work, published as a static GitHub Pages site.

## Experience goals

- Open with a direct personal introduction, then show the work immediately.
- Use a simple editorial flow inspired by Kazu Develops, without copying its content or assets.
- Keep the restrained typography, spacing, red accent, and product polish of the Roborock-inspired design.
- Keep the featured Roblox video visibly moving, with an accessible full-video dialog.
- Stay honest: one real showcase, no filler projects, fake statistics, or fake contact form.

## Foundation

- **React + Vite** for the static application and GitHub Pages build.
- **Motion for React** for restrained entrances and the moving project playhead.
- **Radix Dialog** for the accessible YouTube lightbox.
- **Lucide** for interface icons.

See `THIRD_PARTY_NOTICES.md` for design references.

## Run locally

1. Install Node.js.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local address shown in the terminal.

## Build for GitHub Pages

Run `npm run build:pages`. Vite builds the editable source in `app/`, then the
generated `index.html`, `favicon.svg`, and hashed `assets/` are copied to the
repository root for GitHub Pages.

Run `npm run check:visual` for desktop, mobile, video, keyboard, motion, and
reduced-motion browser checks.
