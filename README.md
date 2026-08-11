# Andrew Le - Roblox Animation Portfolio

A React portfolio for Andrew Le's Roblox animation commission work, published as a static GitHub Pages site.

## Experience goals

- Lead with the moving Roblox showcase on the first screen.
- Use a bright, product-led layout inspired by Roborock's restraint and spacing.
- Pair that with Aceternity UI interaction patterns: Gooey Input, Card Spotlight,
  scroll entrances, and the Productized Agency template's grid-and-horizon rhythm.
- Keep the video dialog, keyboard navigation, mobile layout, and reduced-motion support accessible.
- Avoid fake statistics, fake contact submission, and unnecessary effects.

## Foundation

- **React + Vite** for the static application and GitHub Pages build.
- **Motion for React** for component, pointer, and scroll interactions.
- **Aceternity UI** for adapted Gooey Input and Card Spotlight components.
- **Radix Dialog** for the accessible YouTube lightbox.
- **Lucide** for interface icons.

See `THIRD_PARTY_NOTICES.md` for source and usage references.

## Run locally

1. Install Node.js.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local address shown in the terminal.

## Build for GitHub Pages

Run `npm run build:pages`. Vite builds the editable source in `app/`, then the
generated `index.html`, `favicon.svg`, and hashed `assets/` are copied to the
repository root for GitHub Pages.

Run `npm run check:visual` for automated desktop, mobile, interaction, motion,
video, keyboard, and reduced-motion browser checks.
