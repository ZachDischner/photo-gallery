# Architecture

## Overview

Static photo gallery served via AWS CloudFront CDN, with photos and site assets stored in S3.

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│ CloudFront  │────▶│     S3      │
│             │     │    (CDN)    │     │   Bucket    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  Route53    │
                    │ (DNS/Cert)  │
                    └─────────────┘
```

## AWS Resources

| Resource | Purpose |
|----------|---------|
| S3 Bucket | Stores site HTML + photos (private, CloudFront-only access) |
| CloudFront | CDN with HTTPS, caching, URL rewriting |
| Route53 | Hosted zone for `gallery.zachdischner.com` |
| ACM Certificate | SSL cert for custom domain |
| CloudFront Function | Rewrites `/gallery/foo` → `/gallery/foo/index.html` |

## S3 Structure

```
bucket/
├── index.html
├── favicon.ico
├── gallery/
│   ├── 2023-capetown-surfing/index.html
│   └── project-volcan-ecuador/index.html
└── photos/
    ├── 2023-capetown-surfing/
    │   ├── photo1.jpg
    │   └── photo1_thumb.jpg
    └── project-volcan-ecuador/
        └── ...
```

## Image Strategy

- **Originals**: Full resolution JPGs (10-100MB for panos)
- **Thumbnails**: 400px max dimension, `_thumb` suffix
- Gallery grid uses thumbnails, lightbox loads originals
- Convention-based: `{name}.jpg` → `{name}_thumb.jpg`

## Cost Estimate

For ~1k photos, ~50 visitors/month:
- S3 storage: ~$0.10/month
- CloudFront transfer: ~$1-2/month  
- Route53 hosted zone: $0.50/month
- **Total: ~$2-3/month**
