# Architecture & Pub/Sub Data Flow

1. **EventBus (`script.js`)**: Decouples UI events (`task:toggled`, `filter:changed`, `battery:changed`, `sync:queued`) from DOM updates and telemetry logging.
2. **Offline Queue (`IndexedDB`)**: Every task completion, bookmark, or custom item writes immediately to `localStorage` for instant hydration and appends an action record to `dms_offline_db.sync_queue` for `ServiceWorker` Background Sync.
3. **Compass HUD (`DeviceOrientationEvent`)**: Applies circular low-pass smoothing `smoothed = (prev + alpha * delta + 360) % 360` to prevent 0°/360° wrap-around spikes.
