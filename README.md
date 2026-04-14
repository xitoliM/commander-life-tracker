# Commander Life Tracker

Mobile-first Magic: The Gathering Commander life tracker built with Next.js, React, TypeScript and Tailwind CSS. The app is fully client-side and configured for static export so it can be deployed on GitHub Pages.

## Features

- 2 to 6 players with editable names and color accents
- Large touch targets for life changes: `+1`, `-1`, `+5`, `-5`
- Commander damage tracking per attacker and target
- Poison, commander tax, energy, experience and custom counters
- Monarch, Initiative and random starting-player tracking
- Undo for life, counters, commander damage and status changes
- `localStorage` persistence so reload keeps the active game
- Dark, mobile-first UI

## Local development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Static build

```bash
pnpm build
```

The static export is written to `out/`.

## GitHub Pages deployment

This project uses Next.js static export:

- no backend
- no API routes
- no SSR
- no runtime Node.js server required in production

If the site is published from a repository sub-path such as `https://username.github.io/repository-name/`, set a base path during build:

```bash
NEXT_PUBLIC_BASE_PATH=/repository-name pnpm build
```

Then publish the generated `out/` directory with GitHub Pages.

If the repository itself is the user site, for example `username.github.io`, leave `NEXT_PUBLIC_BASE_PATH` empty.

## GitHub Actions

An example workflow is included in `.github/workflows/deploy.yml`.

It:

1. installs dependencies with `pnpm`
2. builds the static export
3. uploads `out/`
4. deploys to GitHub Pages

The workflow automatically sets `NEXT_PUBLIC_BASE_PATH` to the repository name for project sites and leaves it empty for user sites such as `username.github.io`.
