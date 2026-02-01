#!/usr/bin/env python3
"""Deploy site and photos to S3, invalidate CloudFront."""
import subprocess
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE_DIR = os.path.join(ROOT, "site", "dist")
PHOTOS_DIR = os.path.join(ROOT, "photos")

def get_stack_output(key):
    result = subprocess.run(
        ["aws", "cloudformation", "describe-stacks", "--stack-name", "InfraStack",
         "--query", f"Stacks[0].Outputs[?OutputKey=='{key}'].OutputValue", "--output", "text"],
        capture_output=True, text=True, check=True
    )
    return result.stdout.strip()

def main():
    # Build site
    print("Building site...")
    subprocess.run(["npm", "run", "build"], cwd=os.path.join(ROOT, "site"), check=True)
    
    bucket = get_stack_output("BucketName")
    dist_id = get_stack_output("DistributionId")
    
    print(f"\nSyncing site to s3://{bucket}...")
    subprocess.run(["aws", "s3", "sync", SITE_DIR, f"s3://{bucket}", "--delete", 
                    "--exclude", "photos/*"], check=True)
    
    print(f"\nSyncing photos to s3://{bucket}/photos/...")
    subprocess.run(["aws", "s3", "sync", PHOTOS_DIR, f"s3://{bucket}/photos/"], check=True)
    
    print(f"\nInvalidating CloudFront {dist_id}...")
    subprocess.run(["aws", "cloudfront", "create-invalidation", "--distribution-id", dist_id,
                    "--paths", "/*"], check=True, capture_output=True)
    
    url = get_stack_output("DistributionUrl")
    print(f"\n✓ Done! Site live at {url}")

if __name__ == "__main__":
    main()
