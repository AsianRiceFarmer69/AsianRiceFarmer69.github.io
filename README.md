# Andrew Le - Roblox Animation Portfolio

A compact React portfolio for Andrew Le's Roblox animation work, published as a static GitHub Pages site.

## Experience goals

- Keep the full portfolio quick to scan: short profile hero, three expertise summaries, and one project grid.
- Use a dark, purple-accented presentation inspired by the Yuji Sato React portfolio template.
- Group all four supplied videos under the single Combat Encounter project.
- Load lightweight thumbnails first and open the selected YouTube video only when requested.
- Avoid filler projects, fake statistics, fake contact forms, and long-scroll sections.

## Foundation

- **React + Vite** for the static application and GitHub Pages build.
- **Motion for React** for the restrained profile entrance.
- **Radix Dialog** for the accessible YouTube lightbox.
- **Lucide** for interface icons.

See `THIRD_PARTY_NOTICES.md` for the design reference.

## Run locally

1. Install Node.js.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open the local address shown in the terminal.

## Build for GitHub Pages

Run `npm run build:pages`. Vite builds the editable source in `app/`, then the generated
`index.html`, `favicon.svg`, and hashed `assets/` are copied to the repository root.

Run `npm run check:visual` for compact desktop/mobile layout, video selection, keyboard,
and overflow checks.
