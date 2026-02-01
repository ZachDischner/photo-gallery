# Astro Site

## Structure

```
site/
├── src/
│   ├── config.ts          # IMAGE_BASE for local vs prod
│   └── pages/
│       ├── index.astro    # Gallery grid homepage
│       └── gallery/
│           └── [gallery].astro  # Individual gallery view
├── public/
│   └── photos -> ../../photos   # Symlink for local dev
└── dist/                  # Built static files
```

## Key Configuration

### `src/config.ts`
```typescript
export const IMAGE_BASE = import.meta.env.PUBLIC_IMAGE_BASE || '/photos';
```

- **Local dev**: Uses `/photos` (served from symlink)
- **Production**: Set `PUBLIC_IMAGE_BASE` env var if using separate domain

## Pages

### Index (`/`)
- Grid of gallery cards with cover thumbnails
- Header with name and contact links
- Reads `public/photos/` directories at build time

### Gallery (`/gallery/[name]`)
- Grid of photo thumbnails
- Click opens lightbox with full image
- Back link to index

## Styling

- Dark theme (`#111` background)
- 12px rounded corners on cards
- Hover zoom effect on gallery cards
- Responsive grid layout

## Customization

**Change contact info**: Edit `site/src/pages/index.astro` header section

**Change colors**: Edit `<style>` blocks in `.astro` files

**Add gallery metadata**: Could add `manifest.json` per gallery for titles/descriptions

## Build

```bash
cd site
npm run dev      # Local dev server at :4321
npm run build    # Build to dist/
npm run preview  # Preview built site
```
