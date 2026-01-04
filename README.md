# Nook

> *A cozy corner of the grove. Videos for close friends.*

**Privacy-first video sharing for the people who matter.**

| | |
|---|---|
| **Public name** | Nook |
| **Internal codename** | GroveNook |
| **Domain** | nook.grove.place |
| **Repository** | AutumnsGrove/GroveNook |

---

## What is Nook?

Nook is where you share moments with the people who matter. Not a YouTube channel, not a public archive — a tucked-away space where your closest friends can watch the videos you've been meaning to share.

Privacy-first by design:
- **AI categorization** determines what's shareable
- **Face detection** protects privacy by blurring unknown faces
- **Allowlist-only access** keeps it cozy (5-10 trusted friends)
- **Local processing** means your videos never leave your machine until you approve them

This isn't about scale. It's about sharing 1,500+ videos from nearly two years of life — hikes, hangouts, adventures — with the handful of people you actually want to share them with.

---

## Tech Stack

- **Frontend:** SvelteKit (Lattice-based)
- **Backend:** Cloudflare Workers
- **Storage:** Cloudflare R2 (via Amber buckets)
- **Database:** Cloudflare D1
- **Auth:** Heartwood (Grove SSO) + allowlist gate
- **Streaming:** Progressive MP4 with `faststart`
- **Local Processing:** Python pipeline on Mac Mini M4 Pro
  - AI Categorization: Qwen3-VL-30B-A3B
  - Face Detection: MediaPipe
  - Face Recognition: face_recognition library
  - Compression: FFmpeg with parallel chunking

---

## Features

### ✅ Phase 0: Foundation (Complete)
- Basic SvelteKit app with Heartwood auth
- Allowlist gate (only approved users can access)
- Manual video upload to R2
- Test progressive MP4 streaming through authenticated route
- Single video player page

### 🚧 Phase 1: Manual Pipeline (In Progress)
- Adapt existing compression pipeline for web output
- Video catalog UI (grid view)
- Basic metadata (title, date, duration)
- Upload script that pushes to R2 + creates D1 record
- **Milestone: Friends can watch manually-selected videos**

### 📋 Phase 2: AI Categorization (Planned)
- Local Qwen3-VL inference pipeline
- Frame sampling and categorization
- Three buckets: `public` / `private` / `review`
- Review UI for edge cases
- **Milestone: Videos auto-categorize, you just approve**

### 📋 Phase 3: Face Privacy (Planned)
- MediaPipe face detection integration
- Known faces database with consent levels
- Auto-blur unknown faces during transcode
- Face management UI
- **Milestone: Unknown faces auto-blur, friends manage their own consent**

### 📋 Phase 4: Polish (Planned)
- Better video player (keyboard shortcuts, playback speed)
- Search and filtering
- Collections/albums
- Private tier (videos only you can see)
- Rings integration (view analytics)
- Mobile optimization

---

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
│   ├── nook-spec.md            # Full specification
│   └── AGENT.md                # Agent instructions
└── README.md                   # This file
```

---

## Getting Started

### Prerequisites

- Node.js 20+ (for SvelteKit)
- Python 3.11+ (for local processing pipeline)
- Cloudflare account (Workers, R2, D1)
- Mac Mini M4 Pro (or compatible machine for AI processing)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AutumnsGrove/GroveNook.git
   cd GroveNook
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up Python environment**
   ```bash
   cd processing
   uv init
   uv add qwen-vl mediapipe face_recognition ffmpeg-python
   ```

4. **Configure secrets**
   ```bash
   cp secrets_template.json secrets.json
   # Edit secrets.json with your API keys
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

---

## Database Schema

```sql
-- Videos
CREATE TABLE videos (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  r2_key TEXT NOT NULL,
  thumbnail_key TEXT,
  title TEXT,
  description TEXT,
  recorded_at DATETIME,
  category TEXT CHECK(category IN ('public', 'private', 'review')),
  has_face_blur BOOLEAN DEFAULT FALSE,
  processing_status TEXT DEFAULT 'pending',
  published BOOLEAN DEFAULT FALSE
);

-- Known faces
CREATE TABLE known_faces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  embedding BLOB NOT NULL,
  consent_level TEXT CHECK(consent_level IN ('owner', 'blanket', 'per_video', 'always_blur'))
);

-- Allowlist
CREATE TABLE allowlist (
  user_id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

See `docs/nook-spec.md` for the complete schema.

---

## Security Model

1. **Heartwood authentication required** — No anonymous access
2. **Allowlist check** — Even authenticated users must be on the list
3. **R2 keys are not guessable** — UUIDs, not sequential
4. **No public URLs** — All video requests go through authenticated Workers
5. **Face privacy** — Unknown faces blurred by default
6. **Local AI processing** — No video data leaves your machine until you approve

---

## Cost Estimate

### Storage (R2)
- ~600-750 videos after categorization
- ~100-200MB average per video (after compression)
- **Estimated total: 60-150 GB**
- **R2 cost: $0.90 - $2.25/month**

### Compute
- All processing on Mac Mini
- **$0/month** (electricity negligible)

### Workers/D1
- Minimal requests (5-10 users)
- **Free tier covers this**

### Total: ~$1-3/month

---

## Related Grove Products

- **Amber** — Provides R2 storage buckets
- **Heartwood** — Authentication and user identity
- **Lattice** — UI components and SvelteKit patterns
- **Rings** — View analytics (future integration)

---

## Development Workflow

This project uses the BaseProject template structure:

- **See `AGENT.md`** for project-specific instructions and workflows
- **See `AgentUsage/`** for detailed guides (git, secrets, testing, etc.)
- **See `TODOS.md`** for current task list

### Quick Commands

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Deploy to Cloudflare
npm run deploy

# Process videos locally
cd processing
python scanner.py
```

---

## Contributing

This is a personal project, but if you're building something similar:

1. Check `docs/nook-spec.md` for the full specification
2. Read `AGENT.md` for architecture notes
3. See `AgentUsage/` for workflow guides

---

## License

Private project - All rights reserved.

---

**Last updated:** 2026-01-04
**Status:** Phase 0 complete, Phase 1 in progress
**Maintained by:** AutumnsGrove

---

*A cozy corner of the grove.*
