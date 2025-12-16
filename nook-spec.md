# Nook

> *A cozy corner of the grove. Videos for close friends.*

## Overview

Nook is where you share moments with the people who matter. Not a YouTube channel, not a public archive — a tucked-away space where your closest friends can watch the videos you've been meaning to share for over a year.

Privacy-first by design. Every video passes through AI categorization and face detection before anyone sees it. Unknown faces get blurred. Personal moments stay private. What's left is the stuff worth sharing — hikes, hangouts, adventures — with the handful of people you actually want to share it with.

| | |
|---|---|
| **Public name** | Nook |
| **Internal codename** | GroveNook |
| **Domain** | nook.grove.place |
| **Repository** | AutumnsGrove/GroveNook |

## Philosophy

You've got 1,500+ videos sitting on an external SSD. High quality, 10-bit color, stabilized footage from nearly two years of your life. Your friends keep asking to see them. You keep not uploading them — because YouTube feels wrong, because privacy matters, because you don't want to leak your location or your friends' faces to strangers.

Nook solves this. Local AI processing categorizes what's shareable. Face detection protects privacy. Aggressive compression makes storage affordable. And at the end, your friends get a cozy little video site that's just for them.

This isn't about scale. It's about sharing moments with 5-10 people you trust.

## Tech Stack

- **Frontend:** SvelteKit (Lattice-based)
- **Backend:** Cloudflare Workers
- **Storage:** Cloudflare R2 (via Amber buckets)
- **Database:** Cloudflare D1
- **Auth:** Heartwood (Grove SSO) + allowlist
- **Streaming:** Progressive MP4 with `faststart`
- **Local Processing:** Python pipeline on Mac Mini M4 Pro
  - AI Categorization: Qwen3-VL-30B-A3B
  - Face Detection: MediaPipe
  - Face Recognition: face_recognition library
  - Compression: FFmpeg with parallel chunking

## Features

### Phase 0: Foundation
- Basic SvelteKit app with Heartwood auth
- Allowlist gate (only approved users can access)
- Manual video upload to R2
- Test progressive MP4 streaming through authenticated route
- Single video player page

### Phase 1: Manual Pipeline
- Adapt existing compression pipeline for web output
  - Add `movflags +faststart` for streaming
  - Generate thumbnails
  - Preserve 10-bit color where possible
- Video catalog UI (grid view)
- Basic metadata (title, date, duration)
- Upload script that pushes to Amber/R2 + creates D1 record
- **Milestone: Friends can watch manually-selected videos**

### Phase 2: AI Categorization
- Local Qwen3-VL inference pipeline
- Frame sampling (every 2-5 seconds)
- Categorization prompt: setting, people count, emotional tone, identifiable info
- Three buckets: `public` / `private` / `review`
- Review UI for edge cases
- Batch processing (overnight runs)
- **Milestone: Videos auto-categorize, you just approve**

### Phase 3: Face Privacy
- MediaPipe face detection integration
- face_recognition embedding extraction
- Known faces database (you + consenting friends)
- Consent levels: `owner` / `blanket_consent` / `per_video` / `always_blur`
- Auto-blur unknown faces during transcode
- Face management UI
- **Milestone: Unknown faces auto-blur, friends manage their own consent**

### Phase 4: Polish
- Better video player (keyboard shortcuts, playback speed)
- Search and filtering (by date, by detected people)
- Collections/albums
- Private tier (videos only you can see — personal backup)
- Rings integration (private view analytics)
- Mobile optimization

## Project Structure

```
GroveNook/
├── src/
│   ├── lib/
│   │   ├── components/         # Svelte components
│   │   │   ├── VideoGrid.svelte
│   │   │   ├── VideoPlayer.svelte
│   │   │   ├── AllowlistManager.svelte
│   │   │   └── FaceManager.svelte
│   │   ├── server/             # Server-side utilities
│   │   └── types/              # TypeScript types
│   └── routes/
│       ├── api/                # API endpoints
│       │   ├── videos/
│       │   ├── faces/
│       │   └── allowlist/
│       ├── (app)/              # Authenticated app pages
│       │   ├── +page.svelte    # Video grid
│       │   ├── watch/[id]/     # Video player
│       │   └── manage/         # Admin pages
│       └── +layout.server.ts   # Auth gate
├── worker/                     # Cloudflare Worker (if needed)
├── processing/                 # Local Python pipeline
│   ├── scanner.py              # Folder structure scanner
│   ├── categorize.py           # AI categorization
│   ├── faces.py                # Face detection/recognition
│   ├── compress.py             # Adapted from existing pipeline
│   ├── upload.py               # Push to R2 + D1
│   └── config.json
├── migrations/                 # D1 database migrations
├── docs/
│   ├── SPEC.md                 # This document
│   └── AGENT.md                # Agent instructions
└── README.md
```

## Database Schema

```sql
-- Videos
CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_path TEXT,
  r2_key TEXT NOT NULL,
  thumbnail_key TEXT,
  
  title TEXT,
  description TEXT,
  recorded_at DATETIME,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  duration_seconds INTEGER,
  file_size_bytes INTEGER,
  
  category TEXT CHECK(category IN ('public', 'private', 'review')),
  ai_confidence REAL,
  ai_reasoning TEXT,
  
  has_face_blur BOOLEAN DEFAULT FALSE,
  detected_faces_count INTEGER,
  known_faces_count INTEGER,
  
  processing_status TEXT DEFAULT 'pending',
  published BOOLEAN DEFAULT FALSE
);

-- Known faces
CREATE TABLE known_faces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  embedding BLOB NOT NULL,
  consent_level TEXT CHECK(consent_level IN ('owner', 'blanket', 'per_video', 'always_blur')),
  reference_image_key TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Face appearances
CREATE TABLE video_faces (
  id TEXT PRIMARY KEY,
  video_id TEXT REFERENCES videos(id),
  face_id TEXT REFERENCES known_faces(id),
  is_blurred BOOLEAN DEFAULT FALSE,
  timestamp_seconds REAL,
  confidence REAL
);

-- Allowlist
CREATE TABLE allowlist (
  user_id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

-- View logs (optional, for Rings)
CREATE TABLE view_logs (
  id TEXT PRIMARY KEY,
  video_id TEXT REFERENCES videos(id),
  user_id TEXT REFERENCES allowlist(user_id),
  watched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  watch_duration_seconds INTEGER
);
```

## Cost Estimate

### Storage (R2)
- 1,500 videos → ~40-50% pass categorization → ~600-750 videos
- Aggressive compression (your existing pipeline): ~100-200MB average per video
- **Estimated total: 60-150 GB**
- R2 cost: **$0.90 - $2.25/month**

### Compute (Local)
- All processing on your Mac Mini
- **$0/month** (electricity negligible)

### Workers/D1
- Minimal requests (5-10 users)
- **Free tier covers this easily**

### Total: **~$1-3/month**

## Security Model

1. **Heartwood authentication required** — No anonymous access
2. **Allowlist check** — Even authenticated users must be on the list
3. **R2 keys are not guessable** — UUIDs, not sequential
4. **No public URLs** — All video requests go through authenticated Workers
5. **Face privacy** — Unknown faces blurred by default
6. **Local AI processing** — No video data leaves your machine until you approve

## Success Metrics

- Friends actually watch videos
- No privacy incidents (no unblurred strangers, no location leaks)
- Processing pipeline runs unattended overnight
- Total cost stays under $5/month

## Related Grove Products

- **Amber** — Provides R2 storage buckets
- **Heartwood** — Authentication and user identity
- **Lattice** — UI components and SvelteKit patterns
- **Rings** — View analytics (future integration)

---

*A cozy corner of the grove.*
