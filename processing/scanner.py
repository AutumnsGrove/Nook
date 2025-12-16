#!/usr/bin/env python3
"""
Scan folder structure for video files.
"""

import argparse
import json
import os
from pathlib import Path

def scan_videos(root_path: str) -> list[dict]:
    """Scan for video files and return metadata."""
    # TODO: Implement
    return []

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scan videos for processing")
    parser.add_argument("path", help="Root path to scan")
    args = parser.parse_args()
    results = scan_videos(args.path)
    print(json.dumps(results, indent=2))