import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

const DOMAIN = 'gallery.zachdischner.com';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'PhotosBucket', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Hosted zone for subdomain
    const zone = new route53.PublicHostedZone(this, 'Zone', { zoneName: DOMAIN });

    // ACM certificate - validated via DNS
    const certificate = new acm.Certificate(this, 'Cert', {
      domainName: DOMAIN,
      validation: acm.CertificateValidation.fromDns(zone),
    });

    // CloudFront function for index.html rewriting
    const urlRewrite = new cloudfront.Function(this, 'UrlRewrite', {
      code: cloudfront.FunctionCode.fromInline(`
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
      `),
    });

    const distribution = new cloudfront.Distribution(this, 'CDN', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        functionAssociations: [{
          function: urlRewrite,
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
      domainNames: [DOMAIN],
      certificate,
      defaultRootObject: 'index.html',
      errorResponses: [{ httpStatus: 403, responsePagePath: '/index.html', responseHttpStatus: 200 }],
    });

    // A record pointing to CloudFront
    new route53.ARecord(this, 'AliasRecord', {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    new cdk.CfnOutput(this, 'BucketName', { value: bucket.bucketName });
    new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });
    new cdk.CfnOutput(this, 'DistributionUrl', { value: `https://${distribution.distributionDomainName}` });
    new cdk.CfnOutput(this, 'CustomDomain', { value: `https://${DOMAIN}` });
    new cdk.CfnOutput(this, 'NameServers', { 
      value: cdk.Fn.join(', ', zone.hostedZoneNameServers!),
      description: 'Add these as NS records in GoDaddy for "gallery" subdomain'
    });
  }
}
