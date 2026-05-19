# 🌌 drift-companion-aod

<p align="center">
  <img src="https://img.shields.io/badge/OLED--Optimized-%23000000?style=for-the-badge&logoColor=white&color=000000" alt="OLED Optimized" />
  <img src="https://img.shields.io/badge/UI--Diagnostics-60%20FPS-purple?style=for-the-badge" alt="60 FPS Verified" />
  <img src="https://img.shields.io/badge/Framework-Next.js%20%7C%20React-blue?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Motion-Framer%20Motion-fuchsia?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

---

## 📱 About The Project

**drift-companion-aod** is an immersive, hardware-accelerated Always-On Display (AOD) and cinematic desk companion designed explicitly for mobile and desktop AMOLED screens. 

When your device rests on a desk or a wireless charging pad, this application transforms the screen into a functional visual anchor—blending raw retro pixel-art loops with real-time UI performance diagnostic monitoring.

<p align="center">
  <b>[ Space Drift ] ─── [ Fluid Parallax ] ─── [ True Black AMOLED ]</b>
</p>

---

## ⚡ Core Architecture & Features

### 🔋 AMOLED-True Battery Optimization
The entire structural canvas is locked to `#000000` pitch black. On modern mobile OLED/AMOLED displays, true black pixels completely deactivate at the hardware level. This drastically preserves battery lifespan and eliminates screen burn-in potential during long desk sessions.

### 🌌 High-Performance Physics Particle Loop
Powered by Framer Motion's low-overhead `useMotionValue` hooks, dozens of micro-particles drift, orbit, or rain across the container. Coordinates map directly onto the device's GPU paint layers, avoiding expensive React re-renders and maintaining a locked frame rate.

### 📱 Mobile-First Gyro Parallax Motion
Integrates direct hardware accelerometer hooks. Tilting your mobile device captures fluid pitch and roll vectors, causing the background particle fog to gently sway toward the physical tilt angle—transforming your glass screen into a physical container.

### 🎮 Lifelike Micro-Stutter Cadence
Sprite loops feature variable frame timing offsets and rare contemplative pauses. This asymmetrical design breaks mechanical repetition, giving the character sprites (Lambo, Ferrari, Kirby, Cat) an organic, retro presence.

---

## 📊 Integrated UI Diagnostic HUD

The system houses an active diagnostic bar monitoring continuous environment states:

| Diagnostic Metric | Data Origin | Operational Utility |
| :--- | :--- | :--- |
| **`FPS` (Frames Per Second)** | `requestAnimationFrame` | Monitors visual fluidity and thread locking in real-time. |
| **`U` (System Uptime)** | Delta Engine Timestamps | Tracks continuous active runtime since application mount. |
| **`M` (Thread Allocation)** | Simulated Matrix | Emulates reactive micro-allocation metrics for dashboard styling. |

---

## 🛠️ Tech Stack & Protocols

* **Core Framework:** Next.js (Client-Side Interface) & React 19
* **Animation System:** Framer Motion (GPU Interpolated Coordinate Loops)
* **Icons:** Lucide React
* **Wake Lock Protocol:** Native integration via `nosleep.js` to bypass mobile timeout dimming.

---

## 🚀 Quick Start / Local Deployment

To run the dashboard locally on your development machine or deploy it to a local mobile server:

### 1. Clone & Install Dependencies
```bash
git clone [https://github.com/sayakbhattasali/drift-companion-aod.git](https://github.com/sayakbhattasali/drift-companion-aod.git)
cd drift-companion-aod
npm install
```

### 2. Launch Local Environment
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your desktop browser, or scan the local IP address on your smartphone to view it in standard mobile landscape mode.

---

## ⚙️ System Config Guidelines

* **Mobile Use:** Add the application to your mobile home screen as a Progressive Web App (PWA) to strip away browser navigation trays for a full native overlay experience.
* **Audio Layering:** Ensure your mobile browser has allowed media autoplay permissions, or use the interactive onboarding overlay toggle to release the cinematic soundtrack stream.

---

<p align="center">
  <sub>Developed with 💜 by Sayak as a premium desk companion module.</sub>
</p>
