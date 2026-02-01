# Deployment Guide

## First-Time Setup

### 1. Deploy Infrastructure

```bash
cd infra
npx cdk bootstrap  # One-time AWS setup
npx cdk deploy     # Create all resources
```

**Outputs to note:**
- `BucketName` - S3 bucket for uploads
- `DistributionUrl` - CloudFront URL (works immediately)
- `NameServers` - For custom domain setup

### 2. Configure Custom Domain (Optional)

In GoDaddy DNS settings, add NS records:

| Type | Name | Value |
|------|------|-------|
| NS | gallery | ns-XXXX.awsdns-XX.co.uk |
| NS | gallery | ns-XXX.awsdns-XX.com |
| NS | gallery | ns-XXX.awsdns-XX.net |
| NS | gallery | ns-XXXX.awsdns-XX.org |

Wait ~10 minutes for DNS propagation. Certificate validates automatically.

### 3. Deploy Content

```bash
cd tools
./gen_thumbs.sh    # Generate thumbnails
uv run deploy.py   # Build and upload
```

## Updating Content

### Add New Gallery

```bash
# 1. Create folder with slugified name
mkdir photos/2024-new-trip

# 2. Copy photos
cp ~/Downloads/*.jpg photos/2024-new-trip/

# 3. Generate thumbnails
cd tools && ./gen_thumbs.sh

# 4. Deploy
uv run deploy.py
```

### Update Site Styling

```bash
# 1. Edit .astro files
# 2. Test locally
cd site && npm run dev

# 3. Deploy
cd tools && uv run deploy.py
```

## Manual Deployment

If `deploy.py` has issues:

```bash
# Build site
cd site && npm run build

# Get resource IDs
BUCKET=$(aws cloudformation describe-stacks --stack-name InfraStack \
  --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)
DIST=$(aws cloudformation describe-stacks --stack-name InfraStack \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" --output text)

# Sync
aws s3 sync site/dist s3://$BUCKET --delete --exclude "photos/*"
aws s3 sync photos s3://$BUCKET/photos/

# Invalidate cache
aws cloudfront create-invalidation --distribution-id $DIST --paths "/*"
```

## Troubleshooting

**403 on gallery pages:**
- CloudFront function may not be deployed
- Run `npx cdk deploy` to ensure function is attached

**Certificate not validating:**
- Check NS records in GoDaddy match stack output exactly
- DNS propagation can take up to 48 hours (usually ~10 min)

**Images not updating:**
- CloudFront caches aggressively
- Create invalidation: `aws cloudfront create-invalidation --distribution-id $DIST --paths "/*"`
