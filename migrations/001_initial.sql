-- Nook database schema (Cloudflare D1)
-- Videos table
CREATE TABLE IF NOT EXISTS videos (
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
CREATE TABLE IF NOT EXISTS known_faces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  embedding BLOB NOT NULL,
  consent_level TEXT CHECK(consent_level IN ('owner', 'blanket', 'per_video', 'always_blur')),
  reference_image_key TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Face appearances
CREATE TABLE IF NOT EXISTS video_faces (
  id TEXT PRIMARY KEY,
  video_id TEXT REFERENCES videos(id),
  face_id TEXT REFERENCES known_faces(id),
  is_blurred BOOLEAN DEFAULT FALSE,
  timestamp_seconds REAL,
  confidence REAL
);

-- Allowlist
CREATE TABLE IF NOT EXISTS allowlist (
  user_id TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

-- View logs (optional, for Rings)
CREATE TABLE IF NOT EXISTS view_logs (
  id TEXT PRIMARY KEY,
  video_id TEXT REFERENCES videos(id),
  user_id TEXT REFERENCES allowlist(user_id),
  watched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  watch_duration_seconds INTEGER
);

-- Indexes
CREATE INDEX idx_videos_category ON videos(category);
CREATE INDEX idx_videos_published ON videos(published);
CREATE INDEX idx_video_faces_video_id ON video_faces(video_id);
CREATE INDEX idx_view_logs_video_id ON view_logs(video_id);