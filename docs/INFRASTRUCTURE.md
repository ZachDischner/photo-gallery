# Infrastructure (CDK)

## Stack Overview

Single CDK stack in `infra/lib/infra-stack.ts` creates all AWS resources.

## Resources Created

```typescript
// S3 bucket - private, CloudFront-only access
const bucket = new s3.Bucket(this, 'PhotosBucket', {
  removalPolicy: cdk.RemovalPolicy.RETAIN,
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
});

// Route53 hosted zone for custom domain
const zone = new route53.PublicHostedZone(this, 'Zone', { 
  zoneName: 'gallery.zachdischner.com' 
});

// ACM certificate (auto-validated via DNS)
const certificate = new acm.Certificate(this, 'Cert', {
  domainName: DOMAIN,
  validation: acm.CertificateValidation.fromDns(zone),
});

// CloudFront distribution with URL rewriting
const distribution = new cloudfront.Distribution(this, 'CDN', { ... });
```

## CloudFront Function

Handles directory URLs by appending `index.html`:

```javascript
function handler(event) {
  var request = event.request;
  var uri = request.uri;
  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (!uri.includes('.')) {
    request.uri += '/index.html';
  }
  return request;
}
```

## Stack Outputs

| Output | Description |
|--------|-------------|
| BucketName | S3 bucket for uploads |
| DistributionId | CloudFront ID for invalidations |
| DistributionUrl | CloudFront URL (fallback) |
| CustomDomain | `https://gallery.zachdischner.com` |
| NameServers | NS records for GoDaddy |

## Commands

```bash
cd infra

# First time setup
npx cdk bootstrap

# Deploy/update
npx cdk deploy

# Preview changes
npx cdk diff

# Destroy (careful!)
npx cdk destroy
```

## Custom Domain Setup

1. Deploy stack → get NameServers output
2. In GoDaddy, add NS record for `gallery` subdomain pointing to AWS nameservers
3. Wait for DNS propagation (~10 min)
4. Certificate auto-validates, CloudFront updates
