# TODOs for Nook (Phase 0)

## Phase 0: Foundation
- [x] Review project spec and scaffold directory structure
- [x] Initialize SvelteKit app with placeholder components
- [x] Set up Cloudflare Worker skeleton
- [x] Create Python processing pipeline placeholder
- [x] Create database migrations placeholder
- [x] Update AGENT.md with project details
- [ ] Set up Heartwood authentication integration
- [ ] Implement allowlist gate (backend + frontend)
- [ ] Create manual video upload to R2 (script/UI)
- [ ] Test progressive MP4 streaming via authenticated route
- [ ] Implement single video player page
- [ ] Set up D1 database and run migrations
- [ ] Configure environment variables and secrets

## Phase 1: Manual Pipeline
- [ ] Adapt compression pipeline for web output (faststart, thumbnails)
- [ ] Video catalog UI (grid view)
- [ ] Basic metadata (title, date, duration)
- [ ] Upload script that pushes to Amber/R2 + creates D1 record

## Phase 2: AI Categorization
- [ ] Local Qwen3-VL inference pipeline
- [ ] Frame sampling and categorization
- [ ] Review UI for edge cases
- [ ] Batch processing (overnight runs)

## Phase 3: Face Privacy
- [ ] MediaPipe face detection integration
- [ ] face_recognition embedding extraction
- [ ] Known faces database
- [ ] Auto-blur unknown faces during transcode
- [ ] Face management UI

## Phase 4: Polish
- [ ] Better video player (keyboard shortcuts, playback speed)
- [ ] Search and filtering
- [ ] Collections/albums
- [ ] Private tier (personal backup)
- [ ] Rings integration
- [ ] Mobile optimization

## Maintenance
- [ ] Write tests
- [ ] Documentation
- [ ] Performance optimization
- [ ] Security audit