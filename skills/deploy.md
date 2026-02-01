# Skill: Deploy Site

## Trigger Phrases
- "Deploy"
- "Push changes"
- "Update site"
- "Sync to S3"

## Workflow

### Quick Deploy
```bash
cd tools && uv run deploy.py
```

### Manual Deploy (if script fails)

#### 1. Build Site
```bash
cd site && npm run build
```

#### 2. Get AWS Resource IDs
```bash
BUCKET=$(aws cloudformation describe-stacks --stack-name InfraStack \
  --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)
DIST=$(aws cloudformation describe-stacks --stack-name InfraStack \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" --output text)
```

#### 3. Sync Files
```bash
# Site files
aws s3 sync site/dist s3://$BUCKET --delete --exclude "photos/*"

# Photos (if changed)
aws s3 sync photos s3://$BUCKET/photos/
```

#### 4. Invalidate Cache
```bash
aws cloudfront create-invalidation --distribution-id $DIST --paths "/*"
```

## Verification

Check deployment:
```bash
# Test CloudFront URL
curl -sI https://drfb1hfqrr915.cloudfront.net/ | head -3

# Or custom domain (if configured)
curl -sI https://gallery.zachdischner.com/ | head -3
```

## Troubleshooting

**Timeout on large photos:**
- Run `aws s3 sync` directly in background
- Photos sync is incremental; only new files upload

**Changes not visible:**
- CloudFront caches for 24h by default
- Always run invalidation after deploy

**Build fails:**
- Check `cd site && npm run build` output
- Common issue: missing photos symlink
