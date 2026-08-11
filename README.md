# Andrew Le — Roblox Animation Portfolio

A compact, interactive portfolio for Andrew Le's Roblox animation commission work.

## Design goals

- Show the animation work immediately.
- Keep the full page close to one desktop viewport.
- Use interaction to organize information instead of adding long sections.
- Respect keyboard navigation and reduced-motion preferences.
- Avoid decorative 3D or WebGL.

## Open-source foundation

- **React** for the interface.
- **Motion** for smooth, accessible animation.
- **Radix Primitives** for keyboard-friendly tabs and the video dialog.
- **VengeanceUI** source patterns for Stagger Text, Animated Button, and Highlight Grid.
- **Lucide** for small interface icons.

VengeanceUI components are adapted to the project's plain CSS setup. See
`THIRD_PARTY_NOTICES.md` for the license notice.

## Run locally

1. Install Node.js.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local address shown in the terminal.

## Build for GitHub Pages

Run `npm run build:pages`. Vite builds the editable source in `app/`, then the
generated `index.html`, `favicon.svg`, and hashed `assets/` are copied to the
repository root for GitHub Pages.

Run `npm run check:visual` for the automated desktop, mobile, interaction, and
reduced-motion browser checks.
