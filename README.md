# TikTok Multi-Account Publisher

A Next.js app to publish videos to multiple TikTok accounts simultaneously.

## Features

- 🔑 Add multiple TikTok API bearer tokens (persisted in localStorage)
- ✅ Verify tokens by querying TikTok's Creator Info API
- 📁 File Upload — browser sends video chunks directly to TikTok's upload URL (bypasses Vercel size limits)
- 🔗 Pull from URL — provide a hosted video URL for TikTok to fetch
- 📊 Per-job publish queue with real-time progress tracking
- 🌙 Dark industrial UI

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

No environment variables needed — API tokens are entered in the UI and stored in the user's browser localStorage.

## TikTok API Requirements

You need a **TikTok for Developers** account and an app with the `video.publish` scope approved. Each account's bearer token is obtained via TikTok's OAuth2 flow.

Refer to: https://developers.tiktok.com/doc/content-posting-api-get-started

## Architecture

| Route | Purpose |
|-------|---------|
| `POST /api/creator-info` | Proxies TikTok creator info query (keeps token server-side) |
| `POST /api/publish-init` | Proxies TikTok publish init endpoint |
| `POST /api/publish-status` | Proxies TikTok publish status polling |

**File uploads bypass the Next.js server entirely** — the browser sends video chunks directly to TikTok's signed upload URL, avoiding Vercel's 4.5MB body limit.

## CORS Note

TikTok's upload endpoint (`open-upload.tiktokapis.com`) must allow browser-side PUT requests. If you encounter CORS issues with direct uploads, you'll need to proxy chunks through your own server or use a signed URL approach within Vercel's limits.
