# Skill: Add Photos

## Trigger Phrases
- "Add new photos"
- "Upload gallery"
- "Add album"

## Workflow

### 1. Get Gallery Info
Ask user for:
- Gallery name (will be slugified)
- Photo location (local path)

### 2. Create Gallery Folder
```bash
# Slugify name: lowercase, replace spaces/special chars with dashes
GALLERY_NAME="2024-trip-name"
mkdir -p photos/$GALLERY_NAME
```

### 3. Copy Photos
```bash
cp /path/to/photos/*.jpg photos/$GALLERY_NAME/
```

### 4. Generate Thumbnails
```bash
cd tools && ./gen_thumbs.sh
```

### 5. Test Locally
```bash
cd site && npm run dev
# Verify gallery appears at http://localhost:4321
```

### 6. Deploy
```bash
cd tools && uv run deploy.py
```

## Example

**User**: "Add new photos from my Iceland trip"

**Agent**:
```bash
# Create gallery
mkdir -p photos/2024-iceland-trip

# User copies photos...

# Generate thumbnails
cd tools && ./gen_thumbs.sh

# Deploy
uv run deploy.py
```

## Notes
- Folder names must be URL-safe (no spaces, use dashes)
- Thumbnails are required for good performance
- Large uploads may timeout; use manual `aws s3 sync` if needed
