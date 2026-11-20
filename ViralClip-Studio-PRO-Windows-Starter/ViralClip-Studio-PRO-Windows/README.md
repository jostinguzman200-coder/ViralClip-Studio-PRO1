# ViralClip Studio PRO — Windows desktop starter

This repository builds a Windows x64 NSIS installer using GitHub Actions.

## Build the installer
1. Upload all repository files to GitHub.
2. Open the **Actions** tab.
3. Select **Build Windows installer**.
4. Click **Run workflow**.
5. When it finishes, open the run and download the artifact named `ViralClip-Studio-PRO-Windows-Installer`.

## Current implemented features
- Native Electron desktop window.
- Local video file picker and preview.
- Manual start/end clip trimming.
- MP4 H.264 export using bundled FFmpeg.
- Optional center crop to vertical 9:16.
- No upload of selected local video to a remote server.

## Not implemented yet
AI transcription, automatic viral-moment detection/scoring, face tracking, animated captions, social publishing, and live-stream capture are not included in this starter. These require additional engine integrations and platform-specific testing. Do not describe this initial build as feature-equivalent to SupoClip.
