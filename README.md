# Digital Marketing Specialist Guide — PWA Execution OS

**Live GitHub Pages Target URL:** `https://esp046-cyber.github.io/Digital-Marketing-Specialist-guide/`

A zero-build-step, offline-first Progressive Web App (PWA) designed for Digital Marketing Specialists. Built to be uploaded directly to GitHub from an **iPhone browser (Safari/Chrome)** without requiring GitHub Codespaces, Node.js, or a desktop terminal.

---

## How to Upload Directly to GitHub from an iPhone (No Codespaces Needed)

1. Download **`Digital-Marketing-Specialist-guide.zip`** onto your iPhone.
2. Open the iOS **Files** app and tap **`Digital-Marketing-Specialist-guide.zip`** once — iOS automatically extracts it into a folder containing `index.html`, `style.css`, `script.js`, `manifest.json`, `service-worker.js`, and all subfolders.
3. Open Safari on your iPhone and navigate to your repository:
   `https://github.com/esp046-cyber/Digital-Marketing-Specialist-guide`
4. Tap **Add file** -> **Upload files** (if on mobile view, tap the `...` menu or request Desktop Website in Safari's `aA` address bar menu so the drag-and-drop / file picker uploader appears clearly).
5. Select the extracted files (`index.html`, `style.css`, `script.js`, `manifest.json`, `service-worker.js`, `offline.html`, `favicon.ico`, `icon-192.png`, `icon-512.png`, `robots.txt`, `sitemap.xml`, `assets/`, etc.) and tap **Commit changes** directly to the `main` branch.
6. In your GitHub repo, go to **Settings -> Pages**, set **Source** to **Deploy from a branch**, select `main` and `/ (root)`, and tap **Save**.
7. Within 60 seconds, your PWA will be live at:
   `https://esp046-cyber.github.io/Digital-Marketing-Specialist-guide/`

---

## Implemented Architecture & Features

- **4 Navigation Tabs with Deep Linking:**
  1. **Specialist Tasks (`#tasks`)** — 25+ concrete Digital Marketing Specialist SOPs across 7 pillars (SEO, Paid Media/PPC, Social & Content, Email/CRM, CRO, Analytics Attribution, Local/Field Marketing).
  2. **Campaign Itinerary (`#itinerary`)** — Time-blocked campaign sprint & field activation schedule with JSON backup export/import and Print/PDF generator.
  3. **Compass & KPI HUD (`#hud`)** — `DeviceOrientationEvent` compass bearing calculator smoothed by a circular **Low-Pass Filter (`α = 0.18`)** to eliminate sensor jitter.
  4. **Sync & PWA Audit (`#system`)** — Live `IndexedDB` offline mutation queue inspector, `Background Sync` flush trigger, local `ErrorBoundary` exception viewer, and the complete **11-Point PWA Design & Layout Checklist**.
- **Custom EventBus (Pub/Sub):** Decouples UI rendering from state mutations and sensor streams.
- **Fuzzy Search Algorithm:** Combines token substring matching with bounded Levenshtein edit distance to handle typos in local names or marketing terms.
- **Battery Status Listener (`navigator.getBattery`):** Automatically activates Eco Power-Saver mode when battery charge drops to `<= 20%`.
- **Vibration API Haptics (`navigator.vibrate`):** Tactile feedback on task completion, bookmarking, and sync flush.
- **Dynamic Theme Color Updater:** Updates `<meta name="theme-color">` on tab navigation and theme switching (Dark / Light / High-Contrast).
- **Clipboard Utility:** One-tap copying for GPS coordinates, UTM deep links, and SOP checklists.
