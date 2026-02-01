# Tools

Python utilities for deployment and image processing. Uses `uv` for dependency management.

## Setup

```bash
cd tools
uv sync  # Install dependencies
```

## deploy.py

Builds site and syncs everything to S3.

```bash
uv run deploy.py
```

**What it does:**
1. Runs `npm run build` in site/
2. Gets bucket name from CloudFormation outputs
3. Syncs `site/dist/` to S3 (excluding photos/)
4. Syncs `photos/` to S3
5. Creates CloudFront invalidation

**Example output:**
```
Building site...
Syncing site to s3://infrastack-photosbucket...
Syncing photos to s3://infrastack-photosbucket/photos/...
Invalidating CloudFront E96N2MNX1XQS...
✓ Done! Site live at https://drfb1hfqrr915.cloudfront.net
```

## gen_thumbs.sh

Generates 400px thumbnails for all photos.

```bash
./gen_thumbs.sh [photos_dir]
```

**What it does:**
- Finds all `.jpg`, `.jpeg`, `.png` files
- Creates `{name}_thumb.{ext}` if it doesn't exist
- Uses macOS `sips` (no ImageMagick needed)

**Example:**
```bash
./gen_thumbs.sh ../photos
# Creating thumbnail: ../photos/album/photo1_thumb.jpg
# Creating thumbnail: ../photos/album/photo2_thumb.jpg
# Done!
```

## Adding New Photos

1. Create folder in `photos/` with slugified name:
   ```bash
   mkdir photos/2024-summer-trip
   ```

2. Copy photos into folder

3. Generate thumbnails:
   ```bash
   cd tools && ./gen_thumbs.sh
   ```

4. Deploy:
   ```bash
   uv run deploy.py
   ```

## Manual S3 Sync

If deploy.py times out on large uploads:

```bash
# Get bucket name
BUCKET=$(aws cloudformation describe-stacks --stack-name InfraStack \
  --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)

# Sync photos only
aws s3 sync ../photos s3://$BUCKET/photos/

# Invalidate cache
DIST_ID=$(aws cloudformation describe-stacks --stack-name InfraStack \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" --output text)
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```
