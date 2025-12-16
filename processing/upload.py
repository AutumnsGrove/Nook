#!/usr/bin/env python3
"""
Upload processed videos to R2 and create D1 records.
"""

import json
import sys
import os
import argparse
from pathlib import Path
import boto3
from botocore.client import Config
import requests

# Load configuration
CONFIG_PATH = Path(__file__).parent / "config.json"
with open(CONFIG_PATH) as f:
    config = json.load(f)

def get_r2_client():
    """Create an S3-compatible client for Cloudflare R2."""
    # Credentials should be set via environment variables or config
    access_key_id = os.getenv("R2_ACCESS_KEY_ID") or config.get("r2_access_key_id")
    secret_access_key = os.getenv("R2_SECRET_ACCESS_KEY") or config.get("r2_secret_access_key")
    endpoint_url = config.get("r2_endpoint")
    if not access_key_id or not secret_access_key:
        raise ValueError("R2 credentials not configured")
    
    session = boto3.session.Session()
    client = session.client(
        service_name='s3',
        endpoint_url=endpoint_url,
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
        config=Config(signature_version='s3v4')
    )
    return client

def upload_to_r2(client, file_path: str, r2_key: str) -> bool:
    """Upload file to R2 bucket."""
    bucket = config.get("r2_bucket", "nook-videos")
    try:
        client.upload_file(file_path, bucket, r2_key)
        print(f"Uploaded {file_path} to R2 bucket {bucket} as {r2_key}")
        return True
    except Exception as e:
        print(f"Upload failed: {e}")
        return False

def create_d1_record(video_metadata: dict) -> bool:
    """Insert video metadata into D1 database via Cloudflare API."""
    # TODO: Implement using Cloudflare D1 REST API
    # For now, just log
    print(f"Would create D1 record: {json.dumps(video_metadata, indent=2)}")
    return True

def generate_thumbnail(video_path: str, thumbnail_path: str):
    """Generate thumbnail using FFmpeg."""
    # TODO: Implement thumbnail generation
    print(f"Would generate thumbnail for {video_path} -> {thumbnail_path}")

def main():
    parser = argparse.ArgumentParser(description="Upload video to Nook")
    parser.add_argument("video_path", help="Path to video file")
    parser.add_argument("--title", help="Video title")
    parser.add_argument("--description", help="Video description")
    parser.add_argument("--recorded-at", help="Recording date (ISO format)")
    args = parser.parse_args()

    video_path = Path(args.video_path)
    if not video_path.exists():
        print(f"Error: file {video_path} does not exist")
        sys.exit(1)

    # Generate R2 key (unique identifier)
    import uuid
    r2_key = f"videos/{uuid.uuid4()}{video_path.suffix}"
    
    # Upload to R2
    try:
        client = get_r2_client()
    except ValueError as e:
        print(f"Configuration error: {e}")
        print("Please set R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY environment variables or edit config.json")
        sys.exit(1)
    
    if not upload_to_r2(client, str(video_path), r2_key):
        sys.exit(1)

    # Generate thumbnail (placeholder)
    thumbnail_key = f"thumbnails/{uuid.uuid4()}.jpg"
    generate_thumbnail(str(video_path), thumbnail_key)

    # Prepare metadata
    import datetime
    video_metadata = {
        "id": str(uuid.uuid4()),
        "filename": video_path.name,
        "original_path": str(video_path),
        "r2_key": r2_key,
        "thumbnail_key": thumbnail_key,
        "title": args.title or video_path.stem,
        "description": args.description or "",
        "recorded_at": args.recorded_at or datetime.datetime.now().isoformat(),
        "uploaded_at": datetime.datetime.now().isoformat(),
        "duration_seconds": 0,  # TODO: extract with ffprobe
        "file_size_bytes": video_path.stat().st_size,
        "category": "review",
        "ai_confidence": 0.0,
        "ai_reasoning": "",
        "has_face_blur": False,
        "detected_faces_count": 0,
        "known_faces_count": 0,
        "processing_status": "uploaded",
        "published": False
    }

    # Create D1 record
    if create_d1_record(video_metadata):
        print("Upload successful!")
        print(f"Video ID: {video_metadata['id']}")
    else:
        print("D1 record creation failed (but video uploaded)")

if __name__ == "__main__":
    main()