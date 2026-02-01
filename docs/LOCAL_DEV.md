# Local Development

## Setup

1. **Install site dependencies:**
   ```bash
   cd site && npm install
   ```

2. **Verify photos symlink:**
   ```bash
   ls -la site/public/photos
   # Should show: photos -> ../../photos
   ```
   
   If missing:
   ```bash
   cd site/public && ln -s ../../photos photos
   ```

3. **Start dev server:**
   ```bash
   cd site && npm run dev
   # Open http://localhost:4321
   ```

## How It Works

- Astro dev server serves `public/` directory statically
- `public/photos` symlink points to `../../photos`
- `IMAGE_BASE` defaults to `/photos` in dev
- Changes to `.astro` files hot-reload automatically

## Testing Changes

### Site changes
Edit files in `site/src/`, browser auto-refreshes.

### New photos
1. Add folder to `photos/`
2. Restart dev server (reads directories at startup)

### Thumbnails
Generate before testing grid performance:
```bash
cd tools && ./gen_thumbs.sh
```

## Preview Production Build

```bash
cd site
npm run build    # Build static files
npm run preview  # Serve from dist/
```

This catches issues that only appear in static builds (e.g., path problems).

## Troubleshooting

**Images not loading:**
- Check symlink: `ls site/public/photos/`
- Check browser console for 404s
- Verify folder names are URL-safe (no spaces/special chars)

**Gallery page 404:**
- Dev server has issues with special characters in paths
- Use slugified folder names: `2024-trip-name` not `2024 - Trip Name!`

**Slow loading:**
- Generate thumbnails: `cd tools && ./gen_thumbs.sh`
- Site uses `_thumb` versions in grid view
