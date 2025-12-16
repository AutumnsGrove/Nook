#!/usr/bin/env python3
"""
Face detection and recognition using MediaPipe and face_recognition.
"""

import json

def detect_faces(video_path: str) -> list[dict]:
    """Detect faces in video and match against known faces."""
    # TODO: Implement
    return []

def register_face(image_path: str, name: str) -> dict:
    """Register a new known face."""
    # TODO: Implement
    return {"id": "placeholder", "name": name}

if __name__ == "__main__":
    # Placeholder CLI
    import sys
    if len(sys.argv) < 2:
        print("Usage: faces.py <command>")
        sys.exit(1)
    print(json.dumps({"message": "Face module placeholder"}))