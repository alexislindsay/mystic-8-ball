# 🎱 Mystic 8-Ball — Digital Oracle

Interactive 3D Liquid Fate & Entropy Simulator built with modular ES Modules, Tailwind CSS, Web Audio API synthesis, and **Capacitor** for Android / Google Play Store deployment.

## Architecture

Every module follows single-responsibility separation and stays strictly under 250 lines:

- [`index.html`](./index.html) — Clean HTML5 shell, responsive layout, and PWA metadata
- [`src/styles/sphere.css`](./src/styles/sphere.css) — 3D billiard sphere, specular highlights, liquid caustics, and keyframe animations
- [`src/data/oracle-answers.js`](./src/data/oracle-answers.js) — Classic 8-Ball (20) & Philosophical/Entropic (16) answer pools
- [`src/services/audio-service.js`](./src/services/audio-service.js) — Zero-dependency Web Audio synthesizer for liquid slosh and reveal chords
- [`src/services/storage-service.js`](./src/services/storage-service.js) — `localStorage` persistence for the Oracle Chronicle
- [`src/services/mobile-bridge.js`](./src/services/mobile-bridge.js) — Native accelerometer shake detection & Capacitor/Web Vibration haptics
- [`src/state/oracle-store.js`](./src/state/oracle-store.js) — Centralized state management & statistics calculation
- [`src/ui/sphere-view.js`](./src/ui/sphere-view.js) — 3D sphere DOM controller & bubble particle emitter
- [`src/ui/chronicle-view.js`](./src/ui/chronicle-view.js) — Readout banner, filterable history list, and Clipboard API integration
- [`src/main.js`](./src/main.js) — Application bootstrap and event wiring

## Quick Start (Web & Android)

```bash
# Run local web server
npm start

# Build web assets & sync Capacitor Android project
npm install
npm run android:init
npm run android:sync
```

See [`PLAY_STORE_GUIDE.md`](./PLAY_STORE_GUIDE.md) for step-by-step instructions to generate a signed `.aab` bundle for the Google Play Store.
