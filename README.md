# Andrew Le - Roblox Animation Portfolio

An interactive portfolio for Andrew Le's Roblox animation commission work.

## Experience goals

- Put the moving Roblox showcase on the first screen.
- Use a compact profile-sidebar and content-card layout.
- Make interaction visible through a moving rig, timeline playhead, cursor light,
  project tilt, animated navigation, expanding mobile profile, and theme switch.
- Support keyboard navigation and reduced-motion preferences.
- Keep the site responsive and free of horizontal overflow.

## Open-source foundation

- **React** for the interface.
- **Motion** for animation and pointer interaction.
- **Radix Primitives** for accessible tabs and the video dialog.
- **Lucide** for interface icons.
- **vCard Personal Portfolio** for the MIT-licensed responsive layout structure.
- **VengeanceUI Radial Glow Button** for the animated showcase control.

See `THIRD_PARTY_NOTICES.md` for the complete open-source license notices.

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
video, keyboard, theme, and reduced-motion browser checks.
