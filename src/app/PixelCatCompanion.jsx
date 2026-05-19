"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import NoSleep from "nosleep.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon, Brain, Cat, Activity, Maximize, Minimize,
  Volume2, VolumeX, Settings, Car, ChevronLeft
} from "lucide-react";

// ============================================================================
// CONSTANTS & DIALOGUE DATABASE
// ============================================================================



const AMBIENT_STATES = {
  cat: [
    { label: "zen drift", icon: Brain, color: "text-indigo-400" },
    { label: "quiet glow", icon: Brain, color: "text-fuchsia-400" },
    { label: "soft hum", icon: Moon, color: "text-slate-400" },
    { label: "deep peace", icon: Activity, color: "text-purple-400" },
    { label: "silent orbit", icon: Cat, color: "text-violet-400" },
    { label: "calm space", icon: Brain, color: "text-purple-400" },
    { label: "still light", icon: Moon, color: "text-indigo-400" }
  ],
  kirby: [
    { label: "poke dream", icon: Moon, color: "text-pink-400" },
    { label: "lavender town", icon: Activity, color: "text-rose-400" },
    { label: "pallet town", icon: Brain, color: "text-fuchsia-400" },
    { label: "wild encounter", icon: Cat, color: "text-pink-300" },
    { label: "luxury ball", icon: Moon, color: "text-rose-300" },
    { label: "rare candy", icon: Activity, color: "text-pink-500" },
    { label: "rest power", icon: Moon, color: "text-fuchsia-300" }
  ],
  ferrari: [
    { label: "redline drift", icon: Activity, color: "text-[#dc143c]" },
    { label: "apex clip", icon: Brain, color: "text-[#ff2e56]" },
    { label: "turbo spool", icon: Moon, color: "text-amber-500" },
    { label: "pole position", icon: Activity, color: "text-[#dc143c]" },
    { label: "neon nitro", icon: Car, color: "text-[#ff2e56]" }
  ],
  lambo: [
    { label: "neon overdrive", icon: Activity, color: "text-blue-500" },
    { label: "hyper pursuit", icon: Brain, color: "text-cyan-400" },
    { label: "synthwave run", icon: Moon, color: "text-indigo-400" },
    { label: "cyber drift", icon: Activity, color: "text-blue-400" },
    { label: "city skyline", icon: Car, color: "text-cyan-500" }
  ]
};

const CHARACTERS = {
  cat: [
    "/sprites/cat/cat_idle_1.png",
    "/sprites/cat/cat_idle_2.png",
    "/sprites/cat/cat_idle_3.png",
    "/sprites/cat/cat_idle_4.png",
    "/sprites/cat/cat_idle_5.png",
    "/sprites/cat/cat_idle_6.png",
  ],
  kirby: [
    "/sprites/kirby/kirby_1.png",
    "/sprites/kirby/kirby_2.png",
    "/sprites/kirby/kirby_3.png",
    "/sprites/kirby/kirby_4.png",
    "/sprites/kirby/kirby_5.png",
    "/sprites/kirby/kirby_6.png",
    "/sprites/kirby/kirby_7.png",
    "/sprites/kirby/kirby_8.png",
    "/sprites/kirby/kirby_9.png",
    "/sprites/kirby/kirby_10.png",
    "/sprites/kirby/kirby_11.png",
    "/sprites/kirby/kirby_12.png",
    "/sprites/kirby/kirby_13.png",
    "/sprites/kirby/kirby_14.png",
    "/sprites/kirby/kirby_15.png",
    "/sprites/kirby/kirby_16.png",
    "/sprites/kirby/kirby_17.png",
    "/sprites/kirby/kirby_18.png",
    "/sprites/kirby/kirby_19.png",
    "/sprites/kirby/kirby_20.png",
    "/sprites/kirby/kirby_21.png",
    "/sprites/kirby/kirby_22.png",
    "/sprites/kirby/kirby_23.png",
    "/sprites/kirby/kirby_24.png",
  ],
  ferrari: [
    "/sprites/car/frame_00_delay-0.07s.png",
    "/sprites/car/frame_01_delay-0.07s.png",
    "/sprites/car/frame_02_delay-0.07s.png",
    "/sprites/car/frame_03_delay-0.07s.png",
    "/sprites/car/frame_04_delay-0.07s.png",
    "/sprites/car/frame_05_delay-0.07s.png",
    "/sprites/car/frame_06_delay-0.07s.png",
    "/sprites/car/frame_07_delay-0.07s.png",
    "/sprites/car/frame_08_delay-0.07s.png",
    "/sprites/car/frame_09_delay-0.07s.png",
    "/sprites/car/frame_10_delay-0.07s.png",
    "/sprites/car/frame_11_delay-0.07s.png",
    "/sprites/car/frame_12_delay-0.07s.png",
    "/sprites/car/frame_13_delay-0.07s.png",
    "/sprites/car/frame_14_delay-0.07s.png",
    "/sprites/car/frame_15_delay-0.07s.png",
    "/sprites/car/frame_16_delay-0.07s.png",
    "/sprites/car/frame_17_delay-0.07s.png",
    "/sprites/car/frame_18_delay-0.07s.png",
    "/sprites/car/frame_19_delay-0.07s.png",
    "/sprites/car/frame_20_delay-0.07s.png",
    "/sprites/car/frame_21_delay-0.07s.png",
    "/sprites/car/frame_22_delay-0.07s.png",
    "/sprites/car/frame_23_delay-0.07s.png",
  ],
  lambo: [
    "/sprites/lambo/frame_00_delay-0.06s.gif",
    "/sprites/lambo/frame_01_delay-0.06s.gif",
    "/sprites/lambo/frame_02_delay-0.06s.gif",
    "/sprites/lambo/frame_03_delay-0.06s.gif",
    "/sprites/lambo/frame_04_delay-0.06s.gif",
    "/sprites/lambo/frame_05_delay-0.06s.gif",
    "/sprites/lambo/frame_06_delay-0.06s.gif",
    "/sprites/lambo/frame_07_delay-0.06s.gif",
    "/sprites/lambo/frame_08_delay-0.06s.gif",
    "/sprites/lambo/frame_09_delay-0.06s.gif",
    "/sprites/lambo/frame_10_delay-0.06s.gif",
    "/sprites/lambo/frame_11_delay-0.06s.gif",
    "/sprites/lambo/frame_12_delay-0.06s.gif",
    "/sprites/lambo/frame_13_delay-0.06s.gif",
    "/sprites/lambo/frame_14_delay-0.06s.gif",
    "/sprites/lambo/frame_15_delay-0.06s.gif",
    "/sprites/lambo/frame_16_delay-0.06s.gif",
    "/sprites/lambo/frame_17_delay-0.06s.gif",
    "/sprites/lambo/frame_18_delay-0.06s.gif",
    "/sprites/lambo/frame_19_delay-0.06s.gif",
    "/sprites/lambo/frame_20_delay-0.06s.gif",
    "/sprites/lambo/frame_21_delay-0.06s.gif",
    "/sprites/lambo/frame_22_delay-0.06s.gif",
    "/sprites/lambo/frame_23_delay-0.06s.gif",
    "/sprites/lambo/frame_24_delay-0.06s.gif",
    "/sprites/lambo/frame_25_delay-0.06s.gif",
    "/sprites/lambo/frame_26_delay-0.06s.gif",
    "/sprites/lambo/frame_27_delay-0.06s.gif",
    "/sprites/lambo/frame_28_delay-0.06s.gif",
    "/sprites/lambo/frame_29_delay-0.06s.gif",
  ],
};

// ============================================================================
// UTILITIES
// ============================================================================

class PerformanceMonitor {
  frames = 0;
  lastTime = performance.now();
  fps = 60;
  frameCallback = null;
  rafId = null;
  active = false;
  // Reuse `now` as an instance field to avoid per-frame allocations
  _now = 0;

  start(callback) {
    if (this.active) return; // Prevent duplicate loops
    this.active = true;
    this.frameCallback = callback;
    const measure = () => {
      if (!this.active) return;
      this.frames++;
      this._now = performance.now();
      if (this._now - this.lastTime >= 1000) {
        this.fps = this.frames;
        callback(this.fps);
        this.frames = 0;
        this.lastTime = this._now;
      }
      this.rafId = requestAnimationFrame(measure);
    };
    this.rafId = requestAnimationFrame(measure);
  }

  stop() {
    this.active = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  getCurrentFPS() {
    return this.fps;
  }
}

class AudioReactivityEngine {
  audioContext = null;
  source = null;
  analyser = null;
  dataArray = null;
  isActive = false;
  onVolumeChange = null;

  async initialize(onVolumeChange) {
    this.onVolumeChange = onVolumeChange;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new AudioContext();
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.source.connect(this.analyser);
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.isActive = true;
      this.analyze();
    } catch (err) {
      console.log("Audio reactivity unavailable:", err);
    }
  }

  analyze() {
    if (!this.isActive || !this.analyser || !this.dataArray) return;

    this.analyser.getByteFrequencyData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i];
    }
    const avg = sum / this.dataArray.length;
    const normalizedVolume = Math.min(1, avg / 128);

    if (this.onVolumeChange) {
      this.onVolumeChange(normalizedVolume);
    }

    // Reuse the bound method reference — no new arrow function allocated per frame
    if (!this._boundAnalyze) this._boundAnalyze = this.analyze.bind(this);
    requestAnimationFrame(this._boundAnalyze);
  }

  stop() {
    this.isActive = false;
    if (this.source) this.source.disconnect();
    if (this.analyser) this.analyser.disconnect();
    if (this.audioContext) this.audioContext.close();
  }
}

// ============================================================================
// COMPONENTS: Premium Particle System
// ============================================================================

const SettingToggle = ({ label, isActive, onClick }) => (
  <div className="flex items-center justify-between cursor-pointer group" onClick={onClick}>
    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/60 group-hover:text-white/90 transition-colors">
      {label}
    </span>
    <div className={`relative w-10 h-5 rounded-full transition-colors duration-300 border ${isActive ? 'bg-white/20 border-white/40' : 'bg-black border-white/10'}`}>
      <motion.div
        initial={false}
        animate={{ x: isActive ? 20 : 2 }}
        className={`absolute top-1 bottom-1 w-3 rounded-full ${isActive ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-white/40'}`}
      />
    </div>
  </div>
);

const SettingSelector = ({ label, options, value, onChange }) => (
  <div className="flex flex-col gap-3">
    <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/60">
      {label}
    </span>
    <div className="flex bg-white/5 rounded-md p-1 border border-white/10">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-1.5 text-[9px] font-mono tracking-[0.1em] rounded transition-all duration-300 ${value === opt ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white/60'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT: Premium Companion
// ============================================================================

const twColorToRgba = (twClass) => {
  const map = {
    "bg-[#dc143c]/30": "rgba(220,20,60,0.3)",
    "bg-[#ff2e56]/30": "rgba(255,46,86,0.3)",
    "bg-orange-500/20": "rgba(249,115,22,0.2)",
    "bg-blue-500/30": "rgba(59,130,246,0.3)",
    "bg-cyan-500/30": "rgba(6,182,212,0.3)",
    "bg-indigo-500/20": "rgba(99,102,241,0.2)",
    "bg-blue-400/30": "rgba(96,165,250,0.3)",
    "bg-pink-500/30": "rgba(236,72,153,0.3)",
    "bg-rose-500/30": "rgba(244,63,94,0.3)",
    "bg-fuchsia-500/30": "rgba(217,70,239,0.3)",
    "bg-pink-400/30": "rgba(244,114,182,0.3)",
    "bg-purple-500/30": "rgba(168,85,247,0.3)",
    "bg-indigo-500/30": "rgba(99,102,241,0.3)",
    "bg-violet-500/30": "rgba(139,92,246,0.3)",
    "bg-fuchsia-500/20": "rgba(217,70,239,0.2)"
  };
  return map[twClass] || "rgba(255,255,255,0.3)";
};

const ParticleSystem = ({ config, isActive, tiltRef }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let resizeTimeoutRef = null;

    // Zero-allocation variables for ParticleSystem
    let dt = 0, opacity = 0, scale = 1;
    let cycleTime = 0, progress = 0;
    let sensitivity = 200, tiltOffsetX = 0, tiltOffsetY = 0;
    let radius = 200, centerX = 0, centerY = 0;
    let speed = 0, w = 0, h = 0, renderSize = 0;
    let i = 0, p = null;

    const handleResize = () => {
      if (resizeTimeoutRef) clearTimeout(resizeTimeoutRef);
      resizeTimeoutRef = setTimeout(() => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        requestAnimationFrame(() => {
          if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }
        });
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < config.count; i++) {
      const twColor = config.colors[i % config.colors.length];
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight,
        size: Math.random() * 4 + 1,
        duration: (Math.random() * 15 + 8) * (config.speedMultiplier || 1),
        delay: Math.random() * 5,
        color: twColorToRgba(twColor),
        angle: Math.random() * Math.PI * 2,
        time: 0,
      });
    }

    let lastTime = performance.now();

    const render = (time) => {
      dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (i = 0; i < particles.length; i++) {
        p = particles[i];

        // --- ARITHMETIC SAFETY GUARD ---
        // If particle coordinates are NaN or undefined, reset to a safe random position.
        if (isNaN(p.x) || isNaN(p.y) || p.x === undefined || p.y === undefined) {
          p.x = Math.random() * window.innerWidth;
          p.y = Math.random() * window.innerHeight;
        }
        // --- END ARITHMETIC SAFETY GUARD ---

        p.time += dt;

        if (p.time < p.delay) continue;

        cycleTime = (p.time - p.delay) % p.duration;
        progress = cycleTime / p.duration;

        opacity = 0;
        scale = 1;

        if (config.behavior === "drift") {
          opacity = progress < 0.5 ? progress * 1.6 : (1 - progress) * 1.6;
          scale = progress < 0.5 ? progress * 3 : (1 - progress) * 3;

          sensitivity = 200;
          tiltOffsetX = tiltRef?.current ? tiltRef.current.x * sensitivity : 0;
          tiltOffsetY = tiltRef?.current ? tiltRef.current.y * sensitivity : 0;

          p.x += ((p.baseX + tiltOffsetX) - p.x) * 0.01;
          p.y += ((p.baseY + tiltOffsetY) - p.y) * 0.01;

          if (Math.random() < 0.005) {
            p.baseX = Math.random() * canvas.width;
            p.baseY = Math.random() * canvas.height;
          }
        } else if (config.behavior === "orbit") {
          opacity = progress < 0.5 ? progress * 1.6 : (1 - progress) * 1.6;
          scale = progress < 0.5 ? progress * 3 : (1 - progress) * 3;

          radius = 200;
          centerX = canvas.width / 2;
          centerY = canvas.height / 2;

          p.angle += 0.02 * (dt * 60);

          tiltOffsetX = tiltRef?.current ? tiltRef.current.x * 50 : 0;
          tiltOffsetY = tiltRef?.current ? tiltRef.current.y * 50 : 0;

          p.x = centerX + tiltOffsetX + Math.cos(p.angle) * radius;
          p.y = centerY + tiltOffsetY + Math.sin(p.angle) * radius;
        } else if (config.behavior === "rain") {
          if (progress < 0.1) opacity = progress * 9;
          else if (progress < 0.9) opacity = 0.9;
          else opacity = (1 - progress) * 9;

          speed = (canvas.height + 200) / (p.duration * 20);
          p.y += speed * (dt * 60);

          tiltOffsetX = tiltRef?.current ? tiltRef.current.x * 5 : 0;
          p.x += tiltOffsetX * (dt * 60);

          if (p.y > canvas.height + 50) {
            p.y = -100;
            p.x = Math.random() * canvas.width;
          }
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, opacity));
        ctx.fillStyle = p.color;

        if (config.behavior === "rain") {
          w = Math.max(2, p.size * 0.6);
          h = p.size * 8;
          ctx.fillRect(p.x - w / 2, p.y - h / 2, w, h);
        } else {
          renderSize = (p.size * 1.5) * scale;
          ctx.beginPath();
          ctx.arc(p.x, p.y, renderSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (resizeTimeoutRef) clearTimeout(resizeTimeoutRef);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, config, tiltRef]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 'inherit', transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
    />
  );
};

// ============================================================================
// MAIN COMPONENT: Premium Companion
// ============================================================================

const PixelCatCompanion = forwardRef(({
  onStateChange,
  enableAudioReactivity = false,
  enablePerformanceMonitoring = true,
  theme = "dark",
  particleDensity = "medium",
}, ref) => {
  // Core state
  const [isMounted, setIsMounted] = useState(false);
  const [state, setState] = useState("idle");
  const [ambientIndex, setAmbientIndex] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState("lambo");
  const frameIndexRef = useRef(0);
  const spriteRef = useRef(null);
  const [formattedTime, setFormattedTime] = useState({ main: "88:88", sub: "88" });
  const [hour, setHour] = useState(12);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [isRetroMode, setIsRetroMode] = useState(false);
  const [clockFormat, setClockFormat] = useState("24 HR");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isLightFocusMode, setIsLightFocusMode] = useState(false);
  const metricData = useRef({
    fps: 60,
    latency: 0,
    memoryUsage: 0,
    uptime: 0,
    keystrokesPerMinute: 0,
    mouseDistance: 0,
    ambientLight: 0.5,
  });

  const fpsRef = useRef(null);
  const memRef = useRef(null);
  const uptimeRef = useRef(null);

  const currentFrames = useMemo(() => {
    return CHARACTERS[selectedCharacter] || CHARACTERS.cat;
  }, [selectedCharacter]);

  // Refs for performance tracking
  const containerRef = useRef(null);
  const startTime = useRef(Date.now());
  const performanceMonitor = useRef(null);
  const audioEngine = useRef(null);
  const ambientVolume = useRef(0);
  const ambientAudio = useRef(null);
  const noSleepRef = useRef(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);

  // Gyroscope Parallax Tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let timeoutId;
    const handleOrientation = (event) => {
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;
      const maxTilt = 45;
      tiltRef.current.x = Math.max(-1, Math.min(1, gamma / maxTilt));
      tiltRef.current.y = Math.max(-1, Math.min(1, (beta - 45) / maxTilt));
    };
    timeoutId = setTimeout(() => {
      window.addEventListener("deviceorientation", handleOrientation);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    getMetrics: () => metricData.current,
    setState: (newState) => {
      setState(newState);
    },
    toggleAudioReactivity: () => {
      if (isMuted) {
        if (!audioEngine.current) audioEngine.current = new AudioReactivityEngine();
        audioEngine.current.initialize((vol) => { ambientVolume.current = vol; });
        setIsMuted(false);
      } else {
        if (audioEngine.current) audioEngine.current.stop();
        setIsMuted(true);
      }
    },
  }));

  // Mount gate — trips once on client, unblocks all browser-only APIs
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Onboarding System Initialization
  const initNoSleep = useCallback(() => {
    if (!noSleepRef.current) {
      noSleepRef.current = new NoSleep();
      if (process.env.NODE_ENV === 'production') {
        try {
          noSleepRef.current.enable().catch(() => {});
          noSleepRef.current.disable();
        } catch (e) {
          // Catch swallowed promise rejections
        }
      }
    }
  }, []);

  useEffect(() => {
    setShowOnboarding(true);
    initNoSleep();
  }, [initNoSleep]);

  const handleEnterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        await document.documentElement.webkitRequestFullscreen();
      }

      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          await DeviceOrientationEvent.requestPermission();
        } catch (gyroErr) {
          console.warn("Gyroscope permission error:", gyroErr);
        }
      }
    } catch (err) {
      console.warn("Fullscreen request failed:", err);
    } finally {
      setShowOnboarding(false);
    }
  };

  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
  };

  // Sprite animation loop (Phase 4C - Advanced Idle Behavior)
  // Uses direct DOM manipulation via spriteRef to avoid triggering React re-renders
  useEffect(() => {
    if (!isMounted) return;
    let isCancelled = false;
    let animationFrameId;
    let currentIdx = 0;
    let lastFrameTime = performance.now();
    const maxFrames = currentFrames.length;
    const frames = [...currentFrames]; // snapshot to avoid stale closure
    
    // Zero-allocation variables for advanceFrame
    let now = 0, delta = 0;
    let isKirby = false, isFerrari = false, isLambo = false;
    let nextFrame = 0, currentDelay = 150, rand = 0;

    const preloadAndStart = async () => {
      for (let src of frames) {
        if (isCancelled) return;
        await new Promise((resolve) => {
          const img = new Image();
          const cleanup = () => {
            img.onload = null;
            img.onerror = null;
            resolve();
          };
          img.onload = cleanup;
          img.onerror = cleanup;
          img.src = src;
        });
      }

      if (!isCancelled) {
        frameIndexRef.current = 0;
        if (spriteRef.current) {
          spriteRef.current.src = frames[0] || '';
        }
        lastFrameTime = performance.now();
        
        isKirby = selectedCharacter === "kirby";
        isFerrari = selectedCharacter === "ferrari";
        isLambo = selectedCharacter === "lambo";
        currentDelay = isFerrari ? 70 : isLambo ? 60 : isKirby ? 170 : 240;
        
        animationFrameId = requestAnimationFrame(advanceFrame);
      }
    };

    const advanceFrame = (time) => {
      if (isCancelled) return;
      now = time || performance.now();
      delta = now - lastFrameTime;
      
      if (delta >= currentDelay) {
        lastFrameTime = now;
        
        isKirby = selectedCharacter === "kirby";
        isFerrari = selectedCharacter === "ferrari";
        isLambo = selectedCharacter === "lambo";

        nextFrame = currentIdx + 1;
        currentDelay = isFerrari ? 70 : isLambo ? 60 : isKirby ? 170 : 240; // Base timing

        if (!isKirby && !isFerrari && !isLambo) {
          currentDelay += Math.floor(Math.random() * 40) - 20; 
          rand = Math.random();
          if (rand > 0.96) {
            currentDelay += 400; 
          } else if (rand > 0.92) {
            nextFrame = currentIdx; 
            currentDelay = 180;
          }
        }

        nextFrame = nextFrame % maxFrames;
        currentIdx = nextFrame;
        frameIndexRef.current = nextFrame;

        if (spriteRef.current) {
          spriteRef.current.src = frames[nextFrame] || frames[0];
        }
      }

      animationFrameId = requestAnimationFrame(advanceFrame);
    };

    preloadAndStart();

    return () => {
      isCancelled = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [selectedCharacter, currentFrames, isMounted]);

  // Time display
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHour(now.getHours());

      if (clockFormat === "12 HR") {
        const timeString = now.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        });
        const [timePart, ampm] = timeString.split(' ');
        setFormattedTime({ main: timePart, sub: ampm });
      } else {
        const timeString = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        });
        const parts = timeString.split(':');
        setFormattedTime({ main: `${parts[0]}:${parts[1]}`, sub: parts[2] });
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [clockFormat]);

  // Focus Mode History Handling
  useEffect(() => {
    const handlePopState = () => {
      if (isFocusMode) setIsFocusMode(false);
      if (isLightFocusMode) setIsLightFocusMode(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isFocusMode, isLightFocusMode]);

  // Shuffle Mode Logic
  useEffect(() => {
    if (!isShuffleMode) return;
    const characters = ["cat", "kirby", "ferrari", "lambo"];
    const interval = setInterval(() => {
      setSelectedCharacter(prev => {
        const available = characters.filter(c => c !== prev);
        return available[Math.floor(Math.random() * available.length)];
      });
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isShuffleMode]);

  // Performance monitoring
  useEffect(() => {
    if (!enablePerformanceMonitoring || !isMounted) return;

    if (!performanceMonitor.current) performanceMonitor.current = new PerformanceMonitor();
    performanceMonitor.current.start((fps) => {
      // Mutate in-place — no spread allocation per fps tick
      metricData.current.fps = fps;
      metricData.current.latency = Math.random() * 20 + 5;
      metricData.current.memoryUsage = Math.random() * 200 + 50;
      metricData.current.uptime = (Date.now() - startTime.current) / 1000;
      metricData.current.ambientLight = Math.random() * 0.6 + 0.2;
    });

    // Simulate ambient light sensor
    const lightInterval = setInterval(() => {
      const hour = new Date().getHours();
      const ambient = hour > 20 || hour < 6 ? 0.2 : hour > 8 && hour < 18 ? 0.8 : 0.5;
      metricData.current.ambientLight = ambient;
    }, 5000);

    return () => {
      clearInterval(lightInterval);
      if (performanceMonitor.current) performanceMonitor.current.stop();
    };
  }, [enablePerformanceMonitoring, isMounted]);

  // Telemetry String Throttling Update Loop (runs strictly once every 500ms)
  useEffect(() => {
    if (!isMounted) return;
    const telemetryInterval = setInterval(() => {
      if (fpsRef.current) {
        fpsRef.current.innerText = metricData.current.fps;
      }
      if (memRef.current) {
        memRef.current.innerText = `M:${metricData.current.memoryUsage.toFixed(0)}`;
      }
      if (uptimeRef.current) {
        uptimeRef.current.innerText = `U:${Math.floor(metricData.current.uptime / 60)}m`;
      }
    }, 500);

    return () => clearInterval(telemetryInterval);
  }, [isMounted]);

  // Ambient Status System (Phase 3B & 4A) - Rotates dynamically
  // Strict guard: capture stateCount once per character so the updater
  // never re-reads AMBIENT_STATES and never allocates a new object inside the tick.
  useEffect(() => {
    const rotationPacing = selectedCharacter === "ferrari" || selectedCharacter === "lambo" ? 8000 : selectedCharacter === "kirby" ? 12000 : 20000;
    const stateCount = (AMBIENT_STATES[selectedCharacter] || AMBIENT_STATES.cat).length;
    // Reset index immediately on character change — comparative guard prevents redundant set
    setAmbientIndex(prev => (prev === 0 ? 0 : 0));
    const interval = setInterval(() => {
      setAmbientIndex(prev => {
        const next = (prev + 1) % stateCount;
        // Guard: if somehow already at same value, skip the state update
        if (next === prev) return prev;
        return next;
      });
    }, rotationPacing);
    return () => clearInterval(interval);
  }, [selectedCharacter]);

  // Audio reactivity initialization
  useEffect(() => {
    let timeoutId;
    if (enableAudioReactivity && !isMuted && isMounted) {
      timeoutId = setTimeout(() => {
        if (!audioEngine.current) audioEngine.current = new AudioReactivityEngine();
        audioEngine.current.initialize((vol) => { ambientVolume.current = vol; });
      }, 500);
    }
    return () => {
      clearTimeout(timeoutId);
      if (audioEngine.current) audioEngine.current.stop();
    };
  }, [enableAudioReactivity, isMuted, isMounted]);

  // Cinematic Ambient Music System — deferred behind isMounted to avoid SSR Audio constructor crash
  useEffect(() => {
    if (!isMounted) return;

    let active = true;
    if (!ambientAudio.current) {
      ambientAudio.current = new Audio("/audio/ambient.mp3");
      ambientAudio.current.loop = true;
      ambientAudio.current.volume = 0;
    }

    let fadeInterval;
    const targetVolume = 0.90; // High clarity cinematic background volume

    if (!isMuted) {
      // Play and Fade In
      ambientAudio.current.play()
        .then(() => {
          if (!active) return;
          fadeInterval = setInterval(() => {
            if (ambientAudio.current && ambientAudio.current.volume < targetVolume) {
              ambientAudio.current.volume = Math.min(targetVolume, ambientAudio.current.volume + 0.1);
            } else {
              clearInterval(fadeInterval);
            }
          }, 100);
        })
        .catch(e => console.warn("Audio autoplay blocked:", e));
    } else {
      // Fade Out and Pause
      fadeInterval = setInterval(() => {
        if (ambientAudio.current && ambientAudio.current.volume > 0.1) {
          ambientAudio.current.volume = Math.max(0, ambientAudio.current.volume - 0.1);
        } else {
          if (ambientAudio.current) {
            ambientAudio.current.volume = 0;
            ambientAudio.current.pause();
          }
          clearInterval(fadeInterval);
        }
      }, 150);
    }

    return () => {
      active = false;
      clearInterval(fadeInterval);
    };
  }, [isMuted, isMounted]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (ambientAudio.current) {
        ambientAudio.current.pause();
        ambientAudio.current.src = "";
      }
    };
  }, []);

  // Page Visibility Change Handler (AOD Auto-Mute)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsMuted(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Request/Release Wake Lock using NoSleep.js
  const requestWakeLock = useCallback(() => {
    if (noSleepRef.current && !noSleepRef.current.isEnabled) {
      noSleepRef.current.enable();
      setIsWakeLockActive(true);
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (noSleepRef.current && noSleepRef.current.isEnabled) {
      noSleepRef.current.disable();
      setIsWakeLockActive(false);
    }
  }, []);

  // Sync Wake Lock with Fullscreen & Page Visibility
  useEffect(() => {
    if (isFullscreen) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isFullscreen) {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      releaseWakeLock();
    };
  }, [isFullscreen, requestWakeLock, releaseWakeLock]);

  // Fullscreen handling
  const toggleFullscreen = useCallback(async () => {
    try {
      const target = containerRef.current;

      if (!target) return;

      if (!document.fullscreenElement) {
        await target.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      alert("Fullscreen is blocked on this browser. Try Add to Home Screen or use Chrome.");
      console.log("Fullscreen error:", err);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const currentInfo = (AMBIENT_STATES[selectedCharacter] || AMBIENT_STATES.cat)[ambientIndex];
  const CurrentIcon = currentInfo.icon;

  // Character-Aware Theme & Time-Aware Ambience
  // These are plain boolean flags — no allocations
  const isKirby = selectedCharacter === "kirby";
  const isFerrari = selectedCharacter === "ferrari";
  const isLambo = selectedCharacter === "lambo";
  const isNight = hour >= 22 || hour < 6;
  const isMorning = hour >= 6 && hour < 11;

  // Static file-scope lookup maps (defined below the component) are read here.
  // No new object is created per-render — we just read the appropriate cached entry.
  const themeColors = THEME_COLOR_MAP[selectedCharacter] || THEME_COLOR_MAP.cat;
  const clockGlowColorStyle = GLOW_COLOR_STYLE_MAP[selectedCharacter] || GLOW_COLOR_STYLE_MAP.cat;
  const glowOpacity = GLOW_OPACITY_MAP[isFerrari || isLambo ? "car" : selectedCharacter] || GLOW_OPACITY_MAP.cat;

  // Particle config — character-based, memoized to prevent canvas teardown on re-renders
  const particleConfig = useMemo(() => ({
    count: particleDensity === "high" ? 48 : particleDensity === "medium" ? 24 : 12,
    colors: isFerrari
      ? ["bg-[#dc143c]/30", "bg-[#ff2e56]/30", "bg-orange-500/20", "bg-[#dc143c]/30"]
      : isLambo
        ? ["bg-blue-500/30", "bg-cyan-500/30", "bg-indigo-500/20", "bg-blue-400/30"]
        : isKirby
          ? ["bg-pink-500/30", "bg-rose-500/30", "bg-fuchsia-500/30", "bg-pink-400/30"]
          : ["bg-purple-500/30", "bg-indigo-500/30", "bg-violet-500/30", "bg-fuchsia-500/20"],
    behavior: "drift",
    speedMultiplier: isFerrari || isLambo ? 2.5 : isKirby ? 0.8 : 1.5,
  }), [selectedCharacter, particleDensity]);

  // SSR hydration guard — return an inert black shell until the client has mounted
  if (!isMounted) {
    return <div className="min-h-screen w-full max-w-md mx-auto relative overflow-hidden bg-black" />;
  }

  return (
    <div ref={containerRef} className={`min-h-screen w-full max-w-md mx-auto relative overflow-hidden font-sans selection:bg-purple-500/30 ${theme === "dark" ? "bg-black text-slate-300" : "bg-white text-slate-700"} ${isRetroMode ? "grayscale contrast-[1.15]" : ""}`}>

      {/* Particle System — client-only, gated behind isMounted */}
      <ParticleSystem config={particleConfig} isActive={!isFocusMode} tiltRef={tiltRef} />

      {isFocusMode ? (
        <div className="fixed inset-0 z-[200] w-full max-w-md mx-auto h-[100dvh] flex flex-col items-center justify-center bg-black overflow-hidden">
          {/* Top-left minimal back button */}
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-[210]">
            <motion.button
              whileHover={{ scale: 1.1, filter: "drop-shadow(0 0 8px rgba(255,255,255,0.2))" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setIsFocusMode(false);
                if (window.history.state?.focusMode) window.history.back();
              }}
              className="p-2 sm:p-3 text-white/20 hover:text-white/70 transition-colors cursor-pointer rounded-full"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-1" />
            </motion.button>
          </div>

          {/* Perfectly centered dynamic cinematic clock */}
          <div className="relative font-mono flex items-center justify-center w-full max-w-full px-4">
            <motion.div
              animate={{ opacity: glowOpacity }}
              transition={{ duration: themeColors.clockGlowSpeed, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-20 blur-[100px] rounded-full pointer-events-none"
              style={clockGlowColorStyle}
            />
            <span className={`relative z-10 flex flex-row items-baseline justify-center text-[36vmin] sm:text-[40vmin] leading-none font-digital tabular-nums transition-colors duration-1000 drop-shadow-2xl max-w-full ${isNight ? 'text-white/60' : 'text-white/90'}`}>
              {formattedTime.main}
              <span className="relative inline-block w-0 h-0">
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className={`absolute bottom-0 left-3 sm:left-5 text-[10vmin] sm:text-[12vmin] whitespace-nowrap ${themeColors.textMuted}`}
                >
                  {formattedTime.sub}
                </motion.span>
              </span>
            </span>
          </div>
        </div>
      ) : (
        /* Main Layout - Seamless AMOLED Cinematic Composition with Natural Vertical Flow */
        <div
          style={{
            paddingLeft: "env(safe-area-inset-left, 0px)",
            paddingRight: "env(safe-area-inset-right, 0px)",
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
          className="relative z-10 flex flex-col min-h-screen w-full bg-black p-4 sm:p-6 pb-8"
        >
          {/* Top Section: Character Switcher & Header */}
          <div className="w-full flex flex-col gap-4 shrink-0 z-20">
            {/* Character Switcher */}
            <div className="flex flex-row justify-center gap-2 w-full flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCharacter("lambo")}
                className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-[0.2em] transition-all duration-300 cursor-pointer select-none
                ${selectedCharacter === "lambo"
                    ? "border border-blue-500 bg-blue-950/20 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)] font-semibold"
                    : "border border-blue-500/10 bg-black text-blue-600/40 hover:border-blue-500/30 hover:text-blue-400/70"
                  }`}
              >
                LAMBO
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCharacter("ferrari")}
                className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-[0.2em] transition-all duration-300 cursor-pointer select-none
                ${selectedCharacter === "ferrari"
                    ? "border border-[#dc143c] bg-[#dc143c]/20 text-[#dc143c] shadow-[0_0_10px_rgba(220,20,60,0.3)] font-semibold"
                    : "border border-[#dc143c]/10 bg-black text-[#dc143c]/40 hover:border-[#dc143c]/30 hover:text-[#dc143c]/70"
                  }`}
              >
                FERRARI
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCharacter("kirby")}
                className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-[0.2em] transition-all duration-300 cursor-pointer select-none
                ${selectedCharacter === "kirby"
                    ? "border border-pink-400 bg-pink-950/20 text-pink-400 shadow-[0_0_10px_rgba(244,63,94,0.3)] font-semibold"
                    : "border border-pink-500/10 bg-black text-pink-600/40 hover:border-pink-500/30 hover:text-pink-400/70"
                  }`}
              >
                KIRBY
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCharacter("cat")}
                className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-[0.2em] transition-all duration-300 cursor-pointer select-none
                ${selectedCharacter === "cat"
                    ? "border border-purple-400 bg-purple-950/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.3)] font-semibold"
                    : "border border-purple-500/10 bg-black text-purple-600/40 hover:border-purple-500/30 hover:text-purple-400/70"
                  }`}
              >
                CAT
              </motion.button>
            </div>
            
            {/* Header Info */}
            <div className="flex flex-row justify-between items-center border-b border-white/5 pb-2">
              <div className="flex flex-col">
                <span className="text-[6px] tracking-[0.3em] text-white/20 font-mono uppercase">SYSTEM PROTOCOL</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentInfo.label}
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`text-[10px] tracking-widest font-mono uppercase ${currentInfo.color} leading-none mt-1`}
                  >
                    {currentInfo.label}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2">
                {isWakeLockActive && (
                  <motion.span
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-[6px] tracking-[0.2em] font-mono uppercase flex items-center gap-1.5 ${
                      selectedCharacter === "lambo" ? "text-[#87a96b]/90" :
                      selectedCharacter === "ferrari" ? "text-[#f3e5ab]/90" :
                      selectedCharacter === "kirby" ? "text-[#e6e6fa]/90" :
                      "text-cyan-400/90"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${
                      selectedCharacter === "lambo" ? "bg-[#87a96b]" :
                      selectedCharacter === "ferrari" ? "bg-[#f3e5ab]" :
                      selectedCharacter === "kirby" ? "bg-[#e6e6fa]" :
                      "bg-cyan-400"
                    }`} />
                    SCREEN AWAKE
                  </motion.span>
                )}
                <div className={`p-1.5 rounded bg-white/5 border border-white/10 ${currentInfo.color}`}>
                  <CurrentIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: Cat Area (Flexible) */}
          <div className={`flex-grow flex-1 w-full flex flex-col items-center justify-center py-6 min-h-0 relative z-10 ${isLightFocusMode ? 'blur-[3px] opacity-60 saturate-50' : ''}`}>
            <div className="flex-grow flex-1 w-full flex items-center justify-center">
              <img
                ref={spriteRef}
                src={currentFrames[frameIndexRef.current] || currentFrames[0]}
                alt={`Pixel ${selectedCharacter} companion`}
                className={`image-render-pixel transition-all duration-300
                ${selectedCharacter === "ferrari" || selectedCharacter === "lambo" ? "object-bottom" : "object-contain"}
                ${selectedCharacter === "kirby"
                    ? "w-auto h-[35vh] max-h-[220px]"
                    : selectedCharacter === "ferrari" || selectedCharacter === "lambo"
                      ? "w-full h-auto max-h-[30vh]"
                      : "w-auto h-[25vh] max-h-[160px]"
                  }`}
              />
            </div>
            
            {/* Status Badge */}
            <motion.div className="flex flex-col items-center gap-1 mt-4">
              <div className={`h-px w-20 bg-gradient-to-r ${themeColors.badgeLine} to-transparent`} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentInfo.label}
                  initial={{ opacity: 0, filter: "blur(2px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(2px)" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className={`text-[8px] sm:text-[9px] tracking-[0.3em] font-mono uppercase ${themeColors.textMuted}`}
                >
                  {currentInfo.label}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="w-full h-px shrink-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent my-4" />

          {/* Bottom Section: Clock & Metrics/Controls */}
          <div className="w-full mt-auto flex-shrink-0 flex flex-col gap-4 z-10">
            {isLightFocusMode ? (
              /* Light Focus Clock */
              <div className="flex flex-col items-center justify-center relative w-full py-6">
                <div className="absolute top-0 right-0 z-50">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsLightFocusMode(false);
                      if (window.history.state?.lightFocusMode) window.history.back();
                    }}
                    className="p-2 text-white/20 hover:text-white/70 transition-colors cursor-pointer rounded-full bg-white/5 border border-white/5"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-1" />
                  </motion.button>
                </div>

                <div className="relative font-mono flex flex-col items-center justify-center w-full px-4">
                  <motion.div
                    animate={{ opacity: glowOpacity }}
                    transition={{ duration: themeColors.clockGlowSpeed, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-10 blur-[80px] rounded-full pointer-events-none"
                    style={clockGlowColorStyle}
                  />
                  <span className={`relative z-10 flex flex-col items-center justify-center text-[12vmin] leading-none font-digital tabular-nums transition-colors duration-1000 drop-shadow-2xl ${isNight ? 'text-white/60' : 'text-white/90'}`}>
                    <span>{formattedTime.main}</span>
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className={`text-[4vmin] mt-2 ${themeColors.textMuted}`}
                    >
                      {formattedTime.sub}
                    </motion.span>
                  </span>
                </div>
              </div>
            ) : (
              /* Massive Atmospheric Clock (No absolute container slicing edges) */
              <div className="w-full flex flex-col items-center justify-center relative py-4 px-4 sm:px-6">
                <motion.div
                  key={`${selectedCharacter}-glow`}
                  animate={{ opacity: glowOpacity }}
                  transition={{ duration: themeColors.clockGlowSpeed, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -inset-10 blur-3xl rounded-full pointer-events-none"
                  style={clockGlowColorStyle}
                />
                <span className={`relative z-10 block text-[48px] sm:text-[60px] md:text-[72px] leading-none font-digital tabular-nums transition-colors duration-1000 drop-shadow-2xl ${isNight ? 'text-white/60' : 'text-white/90'}`}>
                  {formattedTime.main}
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className={`text-[20px] sm:text-[24px] ml-2 ${themeColors.textMuted}`}
                  >
                    {formattedTime.sub}
                  </motion.span>
                </span>
              </div>
            )}

            {/* HUD Bar: Metrics & Controls */}
            <div className="flex flex-row justify-between items-center pt-3 border-t border-white/[0.04] w-full">
              {/* Unified HUD Metrics */}
              <div className="flex flex-row items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-white/10" />
                  <div className="flex items-baseline gap-1">
                    <motion.span
                      ref={fpsRef}
                      className="text-xs font-light text-white/60 tabular-nums"
                    >
                      {metricData.current.fps}
                    </motion.span>
                    <span className="text-[8px] text-white/10 font-mono">FPS</span>
                  </div>
                </div>
                <div className="flex flex-col items-start">
                  <span ref={memRef} className="text-[8px] font-mono text-emerald-500/40 uppercase leading-none">
                    M:{metricData.current.memoryUsage.toFixed(0)}
                  </span>
                  <span ref={uptimeRef} className="text-[7px] font-mono text-white/10 mt-0.5">
                    U:{Math.floor(metricData.current.uptime / 60)}m
                  </span>
                </div>
              </div>

              {/* Micro Controls */}
              <div className="flex flex-row items-center gap-1 relative z-[60]">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onPointerUp={toggleFullscreen}
                  className={`p-2 text-white/20 transition-colors duration-300 ${themeColors.controlHover}`}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 transition-all duration-500 ${themeColors.controlHover} ${!isMuted ? themeColors.buttonGlow : "text-white/20"}`}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-2 text-white/20 transition-colors duration-300 ${themeColors.controlHover}`}
                >
                  <Settings className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Edge Overlays & Micro-Ambience */}
      {!isFocusMode && <div className="fixed inset-0 border border-white/5 pointer-events-none z-50" />}

      {/* Faint OLED Shimmer / Environmental Pulse */}
      {!isFocusMode && (
        <motion.div
          key={`${selectedCharacter}-shimmer`}
          animate={{ opacity: [0, 0.015, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="fixed inset-0 pointer-events-none mix-blend-screen bg-gradient-to-tr from-white to-transparent z-[90]"
        />
      )}

      {/* Subtle Scanlines & Electronic Shimmer */}
      {!isFocusMode && (
        <motion.div
          key={`${selectedCharacter}-scanlines`}
          animate={{ opacity: themeColors.scanlineOpacity }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="fixed inset-0 pointer-events-none mix-blend-overlay z-[100]"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #fff 2px, #fff 4px)`
          }}
        />
      )}

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-black/80 backdrop-blur-xl border-l border-white/10 shadow-2xl z-[210] flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xs tracking-[0.3em] font-mono uppercase text-white/80">
                  System Config
                </h3>
                <button onClick={() => setShowSettings(false)} className="text-white/40 hover:text-white transition-colors p-2 -mr-2">
                  <Minimize className="w-4 h-4 rotate-90" />
                </button>
              </div>

              <div className="flex-1 p-6 flex flex-col gap-10 overflow-y-auto">
                <div className="flex flex-col gap-8">
                  <SettingToggle
                    label="SHUFFLE"
                    isActive={isShuffleMode}
                    onClick={() => setIsShuffleMode(!isShuffleMode)}
                  />
                  <SettingToggle
                    label="RETRO"
                    isActive={isRetroMode}
                    onClick={() => setIsRetroMode(!isRetroMode)}
                  />
                  <SettingToggle
                    label="DEEP FOCUS"
                    isActive={isFocusMode}
                    onClick={() => {
                      if (!isFocusMode) {
                        setIsLightFocusMode(false);
                        window.history.pushState({ focusMode: true }, "");
                        setIsFocusMode(true);
                        setShowSettings(false);
                      } else {
                        setIsFocusMode(false);
                        if (window.history.state?.focusMode) window.history.back();
                      }
                    }}
                  />
                  <SettingToggle
                    label="LIGHT FOCUS"
                    isActive={isLightFocusMode}
                    onClick={() => {
                      if (!isLightFocusMode) {
                        setIsFocusMode(false);
                        window.history.pushState({ lightFocusMode: true }, "");
                        setIsLightFocusMode(true);
                        setShowSettings(false);
                      } else {
                        setIsLightFocusMode(false);
                        if (window.history.state?.lightFocusMode) window.history.back();
                      }
                    }}
                  />
                  <SettingSelector
                    label="CLOCK"
                    options={["12 HR", "24 HR"]}
                    value={clockFormat}
                    onChange={(val) => setClockFormat(val)}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cinematic Onboarding / System Boot Prompt */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative flex flex-col items-center max-w-[340px] w-[90%] p-8 sm:p-10 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

              <h2 className="relative z-10 text-[10px] sm:text-[11px] tracking-[0.4em] font-mono uppercase text-white/80 mb-6 text-center">
                System Initializing
              </h2>

              <div className="relative z-10 w-8 h-px bg-white/20 mb-6" />

              <p className="relative z-10 text-[12px] sm:text-[13px] text-slate-400 font-sans text-center leading-relaxed mb-2">
                Using landscape mode is suggested.
              </p>
              <p className="relative z-10 text-[12px] sm:text-[13px] text-slate-400 font-sans text-center leading-relaxed mb-10">
                Enable fullscreen mode for the best experience.
              </p>

              <div className="relative z-10 flex flex-col w-full gap-4 items-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnterFullscreen}
                  className="w-full py-3 rounded text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase transition-all duration-300 border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  ENTER FULLSCREEN
                </motion.button>
                <button
                  onClick={handleDismissOnboarding}
                  className="text-[9px] sm:text-[10px] font-mono tracking-[0.1em] text-slate-500 hover:text-white/70 transition-colors duration-300 uppercase underline-offset-4 hover:underline"
                >
                  Continue Anyway
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
});

PixelCatCompanion.displayName = "PixelCatCompanion";

// ============================================================================
// STATIC FILE-SCOPE THEME MAPS
// These objects are allocated ONCE at module load time and never rebuilt.
// The component render function reads the correct entry by key — zero allocation.
// ============================================================================

const THEME_COLOR_MAP = Object.freeze({
  ferrari: Object.freeze({
    badgeLine: "from-[#dc143c]/40",
    pulseLine: "via-[#dc143c]/20",
    pulseDot: "bg-[#dc143c]/30",
    controlHover: "hover:text-[#dc143c]",
    textMuted: "text-[#dc143c]/60",
    buttonGlow: "drop-shadow-[0_0_10px_rgba(220,20,60,0.7)] text-[#dc143c]",
    particleColors: ["bg-[#dc143c]/30", "bg-[#ff2e56]/30", "bg-orange-500/20", "bg-[#dc143c]/30"],
    scanlineOpacity: [0.012, 0.025, 0.012],
    pulseSpeed: 1.5,
    clockGlowSpeed: 3,
  }),
  lambo: Object.freeze({
    badgeLine: "from-blue-500/40",
    pulseLine: "via-blue-500/20",
    pulseDot: "bg-blue-500/30",
    controlHover: "hover:text-blue-400",
    textMuted: "text-blue-400/60",
    buttonGlow: "drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] text-blue-400",
    particleColors: ["bg-blue-500/30", "bg-cyan-500/30", "bg-indigo-500/20", "bg-blue-400/30"],
    scanlineOpacity: [0.012, 0.025, 0.012],
    pulseSpeed: 1.5,
    clockGlowSpeed: 3,
  }),
  kirby: Object.freeze({
    badgeLine: "from-pink-500/40",
    pulseLine: "via-pink-500/20",
    pulseDot: "bg-pink-500/30",
    controlHover: "hover:text-pink-400",
    textMuted: "text-pink-400/60",
    buttonGlow: "drop-shadow-[0_0_10px_rgba(244,63,94,0.7)] text-pink-400",
    particleColors: ["bg-pink-500/30", "bg-rose-500/30", "bg-fuchsia-500/30", "bg-pink-400/30"],
    scanlineOpacity: [0.01, 0.02, 0.01],
    pulseSpeed: 2,
    clockGlowSpeed: 4,
  }),
  cat: Object.freeze({
    badgeLine: "from-purple-500/40",
    pulseLine: "via-purple-500/20",
    pulseDot: "bg-purple-500/30",
    controlHover: "hover:text-purple-400",
    textMuted: "text-purple-400/60",
    buttonGlow: "drop-shadow-[0_0_10px_rgba(168,85,247,0.7)] text-purple-400",
    particleColors: ["bg-purple-500/30", "bg-indigo-500/30", "bg-violet-500/30", "bg-fuchsia-500/20"],
    scanlineOpacity: [0.015, 0.035, 0.015],
    pulseSpeed: 3.5,
    clockGlowSpeed: 6,
  }),
});

const GLOW_COLOR_STYLE_MAP = Object.freeze({
  ferrari: Object.freeze({ backgroundColor: "rgba(220,20,60,0.08)" }),
  lambo:   Object.freeze({ backgroundColor: "rgba(59,130,246,0.08)" }),
  kirby:   Object.freeze({ backgroundColor: "rgba(244,63,94,0.08)" }),
  cat:     Object.freeze({ backgroundColor: "rgba(168,85,247,0.08)" }),
});

// "car" key is shared by ferrari + lambo (both use the same opacity values)
const GLOW_OPACITY_MAP = Object.freeze({
  car:   Object.freeze([0.12, 0.5, 0.12]),
  kirby: Object.freeze([0.1, 0.4, 0.1]),
  cat:   Object.freeze([0.06, 0.3, 0.06]),
});

export default PixelCatCompanion;


