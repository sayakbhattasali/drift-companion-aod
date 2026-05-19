"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import NoSleep from "nosleep.js";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
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

  start(callback) {
    this.frameCallback = callback;
    const measure = () => {
      this.frames++;
      const now = performance.now();
      if (now - this.lastTime >= 1000) {
        this.fps = this.frames;
        callback(this.fps);
        this.frames = 0;
        this.lastTime = now;
      }
      requestAnimationFrame(measure);
    };
    requestAnimationFrame(measure);
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

    requestAnimationFrame(() => this.analyze());
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

const PremiumParticle = ({ color, size, initialX, initialY, duration, delay, behavior, tiltRef }) => {
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);

  useEffect(() => {
    let timeoutId;
    let intervalId;

    if (behavior === "drift") {
      const animate = () => {
        const baseNewX = Math.random() * window.innerWidth;
        const baseNewY = Math.random() * window.innerHeight;
        const sensitivity = 200;
        const tiltOffsetX = tiltRef?.current ? tiltRef.current.x * sensitivity : 0;
        const tiltOffsetY = tiltRef?.current ? tiltRef.current.y * sensitivity : 0;
        x.set(baseNewX + tiltOffsetX);
        y.set(baseNewY + tiltOffsetY);
        timeoutId = setTimeout(animate, duration * 1000);
      };
      timeoutId = setTimeout(animate, delay * 1000);
    } else if (behavior === "orbit") {
      let angle = Math.random() * Math.PI * 2;
      const radius = 200;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      intervalId = setInterval(() => {
        angle += 0.02;
        x.set(centerX + Math.cos(angle) * radius);
        y.set(centerY + Math.sin(angle) * radius);
      }, 50);
    } else if (behavior === "rain") {
      const startRain = () => {
        let currentX = Math.random() * window.innerWidth;
        x.set(currentX);
        y.set(-100);

        let currentY = -100;
        const speed = (window.innerHeight + 200) / (duration * 20);
        intervalId = setInterval(() => {
          currentY += speed;
          const tiltOffsetX = tiltRef?.current ? tiltRef.current.x * 5 : 0;
          currentX += tiltOffsetX;
          y.set(currentY);
          x.set(currentX);
          if (currentY > window.innerHeight + 50) {
            currentY = -100;
            currentX = Math.random() * window.innerWidth;
            x.set(currentX);
          }
        }, 50);
      };

      timeoutId = setTimeout(startRain, delay * 1000);
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [behavior, duration, delay, x, y, tiltRef]);

  const isRain = behavior === "rain";

  return (
    <motion.div
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={isRain
        ? { opacity: [0, 0.9, 0.9, 0] }
        : { opacity: [0, 0.8, 0], scale: [0, 1.5, 0] }
      }
      transition={{ duration: duration, repeat: Infinity, delay, ease: "linear" }}
      className="absolute pointer-events-none"
    >
      <div
        className={`rounded-full ${color} ${isRain ? 'blur-[0.5px]' : 'blur-sm'}`}
        style={isRain
          ? { width: Math.max(2, size * 0.6), height: size * 8 }
          : { width: size * 1.5, height: size * 1.5 }
        }
      />
    </motion.div>
  );
};

const ParticleSystem = ({ config, isActive, tiltRef }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isActive || !mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 'inherit' }}>
      {Array.from({ length: config.count }).map((_, i) => {
        const color = config.colors[i % config.colors.length];
        return (
          <PremiumParticle
            key={i}
            color={color}
            size={Math.random() * 4 + 1}
            initialX={Math.random() * window.innerWidth}
            initialY={Math.random() * window.innerHeight}
            duration={(Math.random() * 15 + 8) * (config.speedMultiplier || 1)}
            delay={Math.random() * 5}
            behavior={config.behavior}
            tiltRef={tiltRef}
          />
        );
      })}
    </div>
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
  const [state, setState] = useState("idle");
  const [ambientIndex, setAmbientIndex] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState("lambo");
  const [frameIndex, setFrameIndex] = useState(0);
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
  const [metrics, setMetrics] = useState({
    fps: 60,
    latency: 0,
    memoryUsage: 0,
    uptime: 0,
    keystrokesPerMinute: 0,
    mouseDistance: 0,
    ambientLight: 0.5,
  });

  const currentFrames = useMemo(() => {
    return CHARACTERS[selectedCharacter] || CHARACTERS.cat;
  }, [selectedCharacter]);

  // Refs for performance tracking
  const containerRef = useRef(null);
  const startTime = useRef(Date.now());
  const performanceMonitor = useRef(new PerformanceMonitor());
  const audioEngine = useRef(new AudioReactivityEngine());
  const ambientVolume = useRef(0);
  const ambientAudio = useRef(null);
  const noSleepRef = useRef(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);

  // Gyroscope Parallax Tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleOrientation = (event) => {
      const beta = event.beta || 0;
      const gamma = event.gamma || 0;
      const maxTilt = 45;
      tiltRef.current.x = Math.max(-1, Math.min(1, gamma / maxTilt));
      tiltRef.current.y = Math.max(-1, Math.min(1, (beta - 45) / maxTilt));
    };
    window.addEventListener("deviceorientation", handleOrientation);
    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, []);

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    getMetrics: () => metrics,
    setState: (newState) => {
      setState(newState);
    },
    toggleAudioReactivity: () => {
      if (isMuted) {
        audioEngine.current.initialize((vol) => { ambientVolume.current = vol; });
        setIsMuted(false);
      } else {
        audioEngine.current.stop();
        setIsMuted(true);
      }
    },
  }));

  // Onboarding System Initialization
  useEffect(() => {
    setShowOnboarding(true);
    if (!noSleepRef.current) {
      noSleepRef.current = new NoSleep();
    }
  }, []);

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
  useEffect(() => {
    setFrameIndex(0);
    let timeoutId;
    let currentIdx = 0;
    const maxFrames = currentFrames.length;

    const advanceFrame = () => {
      const isKirby = selectedCharacter === "kirby";
      const isFerrari = selectedCharacter === "ferrari";
      const isLambo = selectedCharacter === "lambo";

      let nextFrame = currentIdx + 1;
      let delay = isFerrari ? 70 : isLambo ? 60 : isKirby ? 170 : 240; // Base timing

      if (!isKirby && !isFerrari && !isLambo) {
        // 1. Variable frame timing (controlled imperfection)
        delay += Math.floor(Math.random() * 40) - 20; // +/- 20ms micro-shifts

        // 2. Rare alternate cadence and micro-pauses
        const rand = Math.random();

        // Cat: introspective, asymmetrical (contemplative pauses)
        if (rand > 0.96) {
          delay += 400; // Deep contemplative pause
        } else if (rand > 0.92) {
          nextFrame = currentIdx; // Rare alternate cadence (stutter-step hold)
          delay = 180;
        }
      }

      nextFrame = nextFrame % maxFrames;
      currentIdx = nextFrame;
      setFrameIndex(nextFrame);

      timeoutId = setTimeout(advanceFrame, delay);
    };

    timeoutId = setTimeout(advanceFrame, 150);

    return () => clearTimeout(timeoutId);
  }, [selectedCharacter, currentFrames.length]);

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
    if (!enablePerformanceMonitoring) return;

    performanceMonitor.current.start((fps) => {
      setMetrics(prev => ({
        ...prev,
        fps,
        latency: Math.random() * 20 + 5,
        memoryUsage: Math.random() * 200 + 50,
        uptime: (Date.now() - startTime.current) / 1000,
        ambientLight: Math.random() * 0.6 + 0.2,
      }));
    });

    // Simulate ambient light sensor
    const lightInterval = setInterval(() => {
      const hour = new Date().getHours();
      const ambient = hour > 20 || hour < 6 ? 0.2 : hour > 8 && hour < 18 ? 0.8 : 0.5;
      setMetrics(prev => ({ ...prev, ambientLight: ambient }));
    }, 5000);

    return () => clearInterval(lightInterval);
  }, [enablePerformanceMonitoring]);

  // Ambient Status System (Phase 3B & 4A) - Rotates dynamically
  useEffect(() => {
    const rotationPacing = selectedCharacter === "ferrari" || selectedCharacter === "lambo" ? 8000 : selectedCharacter === "kirby" ? 12000 : 20000;
    const interval = setInterval(() => {
      setAmbientIndex(prev => {
        const states = AMBIENT_STATES[selectedCharacter] || AMBIENT_STATES.cat;
        return (prev + 1) % states.length;
      });
    }, rotationPacing);
    return () => clearInterval(interval);
  }, [selectedCharacter]);

  // Reset ambient index when character changes
  useEffect(() => {
    setAmbientIndex(0);
  }, [selectedCharacter]);

  // Audio reactivity initialization
  useEffect(() => {
    if (enableAudioReactivity && !isMuted) {
      audioEngine.current.initialize((vol) => { ambientVolume.current = vol; });
    }
    return () => {
      audioEngine.current.stop();
    };
  }, [enableAudioReactivity, isMuted]);

  // Cinematic Ambient Music System
  useEffect(() => {
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
  }, [isMuted]);

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
  const isKirby = selectedCharacter === "kirby";
  const isFerrari = selectedCharacter === "ferrari";
  const isLambo = selectedCharacter === "lambo";
  const isNight = hour >= 22 || hour < 6;
  const isMorning = hour >= 6 && hour < 11;

  const themeColors = {
    badgeLine: isFerrari ? "from-[#dc143c]/40" : isLambo ? "from-blue-500/40" : isKirby ? "from-pink-500/40" : "from-purple-500/40",
    pulseLine: isFerrari ? "via-[#dc143c]/20" : isLambo ? "via-blue-500/20" : isKirby ? "via-pink-500/20" : "via-purple-500/20",
    pulseDot: isFerrari ? "bg-[#dc143c]/30" : isLambo ? "bg-blue-500/30" : isKirby ? "bg-pink-500/30" : "bg-purple-500/30",
    controlHover: isFerrari ? "hover:text-[#dc143c]" : isLambo ? "hover:text-blue-400" : isKirby ? "hover:text-pink-400" : "hover:text-purple-400",
    textMuted: isFerrari ? "text-[#dc143c]/60" : isLambo ? "text-blue-400/60" : isKirby ? "text-pink-400/60" : "text-purple-400/60",
    buttonGlow: isFerrari ? "drop-shadow-[0_0_10px_rgba(220,20,60,0.7)] text-[#dc143c]" : isLambo ? "drop-shadow-[0_0_10px_rgba(59,130,246,0.7)] text-blue-400" : isKirby ? "drop-shadow-[0_0_10px_rgba(244,63,94,0.7)] text-pink-400" : "drop-shadow-[0_0_10px_rgba(168,85,247,0.7)] text-purple-400",
    particleColors: isFerrari
      ? ["bg-[#dc143c]/30", "bg-[#ff2e56]/30", "bg-orange-500/20", "bg-[#dc143c]/30"]
      : isLambo
        ? ["bg-blue-500/30", "bg-cyan-500/30", "bg-indigo-500/20", "bg-blue-400/30"]
        : isKirby
          ? ["bg-pink-500/30", "bg-rose-500/30", "bg-fuchsia-500/30", "bg-pink-400/30"]
          : ["bg-purple-500/30", "bg-indigo-500/30", "bg-violet-500/30", "bg-fuchsia-500/20"],
    scanlineOpacity: isFerrari || isLambo ? [0.012, 0.025, 0.012] : isKirby ? [0.01, 0.02, 0.01] : [0.015, 0.035, 0.015],
    pulseSpeed: isFerrari || isLambo ? 1.5 : isKirby ? 2 : 3.5,
    clockGlowSpeed: isFerrari || isLambo ? 3 : isKirby ? 4 : 6,
  };

  // Clock glow — character sets the default
  const clockGlowColorStyle = {
    backgroundColor: isFerrari
      ? "rgba(220,20,60,0.08)"
      : isLambo
        ? "rgba(59,130,246,0.08)"
        : isKirby
          ? "rgba(244,63,94,0.08)"
          : "rgba(168,85,247,0.08)"
  };

  // Glow intensity
  const glowOpacity = isFerrari || isLambo
    ? [0.12, 0.5, 0.12]
    : isKirby
      ? [0.1, 0.4, 0.1]
      : [0.06, 0.3, 0.06];

  // Particle config — character-based
  const particleConfig = {
    count: particleDensity === "high" ? 48 : particleDensity === "medium" ? 24 : 12,
    colors: themeColors.particleColors,
    behavior: "drift",
    speedMultiplier: isFerrari || isLambo ? 2.5 : isKirby ? 0.8 : 1.5,
  }; return (
    <div ref={containerRef} className={`h-[100dvh] w-screen overflow-hidden font-sans selection:bg-purple-500/30 ${theme === "dark" ? "bg-black text-slate-300" : "bg-white text-slate-700"} ${isRetroMode ? "grayscale contrast-[1.15]" : ""}`}>

      {/* Particle System */}
      <ParticleSystem config={particleConfig} isActive={!isFocusMode} tiltRef={tiltRef} />

      {isFocusMode ? (
        <div className="fixed inset-0 z-[200] w-screen h-[100dvh] flex flex-col items-center justify-center bg-black">
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
        /* Main Layout - Seamless AMOLED Cinematic Composition */
        <div
          style={{
            paddingLeft: "env(safe-area-inset-left, 0px)",
            paddingRight: "env(safe-area-inset-right, 0px)",
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}
          className="relative z-10 flex flex-row h-[100dvh] w-full min-h-0 overflow-hidden bg-black"
        >
          {/* LEFT: Cinematic Centerpiece */}
          <section className={`relative w-[60%] sm:w-[62%] md:w-[64%] h-full min-h-0 flex flex-col justify-between bg-black overflow-hidden transition-all duration-1000 ${isLightFocusMode ? 'blur-[3px] opacity-60 saturate-50' : ''}`}>
            {/* Character Switcher */}
            <div className="z-20 flex flex-row gap-2 pt-4 pl-4 sm:pt-6 sm:pl-6 portrait:md:pt-12 portrait:md:pl-12 lg:pt-12 lg:pl-12 w-full">
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

            {/* Main Character */}
            <div className="flex-grow flex items-center justify-center min-h-0 relative w-full">
              <motion.div
                className={`relative z-10 cursor-default select-none drop-shadow-2xl flex min-h-0 transition-all duration-300
                ${selectedCharacter === "ferrari" || selectedCharacter === "lambo"
                    ? "absolute bottom-1 sm:bottom-2 w-full left-0 right-0 items-end justify-center"
                    : "items-center justify-center"
                  }`}
              >
                <img
                  src={currentFrames[frameIndex] || currentFrames[0]}
                  alt={`Pixel ${selectedCharacter} companion`}
                  className={`image-render-pixel transition-all duration-300
                  ${selectedCharacter === "ferrari" || selectedCharacter === "lambo" ? "object-bottom" : "object-contain"}
                  ${selectedCharacter === "kirby"
                      ? "w-auto h-[80vh] max-h-[195px] sm:max-h-[275px] md:max-h-[390px] lg:max-h-[520px]"
                      : selectedCharacter === "ferrari" || selectedCharacter === "lambo"
                        ? "w-full h-auto max-h-[70vh]"
                        : "w-auto h-[58vh] max-h-[130px] sm:max-h-[185px] md:max-h-[260px] lg:max-h-[350px]"
                    }`}
                />
              </motion.div>
            </div>

            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-1.5 w-full z-20 pb-4 pl-4 sm:pb-6 sm:pl-6 portrait:md:pb-12 portrait:md:pl-12 lg:pb-12 lg:pl-12"
            >
              <div className={`h-px w-16 sm:w-32 bg-gradient-to-r ${themeColors.badgeLine} to-transparent`} />
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentInfo.label}
                  initial={{ opacity: 0, filter: "blur(2px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(2px)" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className={`text-[7px] sm:text-[9px] md:text-[11px] tracking-[0.3em] font-mono uppercase ${themeColors.textMuted}`}
                >
                  {currentInfo.label}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </section>

          {/* Soft gradient divider (replaces hard border) */}
          <div className="w-px h-full shrink-0 bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />

          {/* RIGHT: Floating OLED Telemetry OR Light Focus */}
          <section className="w-[40%] sm:w-[38%] md:w-[36%] h-full max-h-full relative z-[50] flex flex-col justify-between bg-black overflow-hidden min-h-0">

            {isLightFocusMode ? (
              <div className="flex-1 flex flex-col items-center justify-center relative w-full h-full">
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50">
                  <motion.button
                    whileHover={{ scale: 1.1, filter: "drop-shadow(0 0 8px rgba(255,255,255,0.2))" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setIsLightFocusMode(false);
                      if (window.history.state?.lightFocusMode) window.history.back();
                    }}
                    className="p-2 text-white/20 hover:text-white/70 transition-colors cursor-pointer rounded-full bg-white/5 border border-white/5"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-1" />
                  </motion.button>
                </div>

                <div className="relative font-mono flex items-center justify-center w-full px-2">
                  <motion.div
                    animate={{ opacity: glowOpacity }}
                    transition={{ duration: themeColors.clockGlowSpeed, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -inset-10 blur-[80px] rounded-full pointer-events-none"
                    style={clockGlowColorStyle}
                  />
                  <span className={`relative z-10 flex flex-col items-center justify-center text-[16vmin] sm:text-[18vmin] md:text-[20vmin] leading-none font-digital tabular-nums transition-colors duration-1000 drop-shadow-2xl ${isNight ? 'text-white/60' : 'text-white/90'}`}>
                    <span>{formattedTime.main}</span>
                    <motion.span
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className={`text-[5vmin] sm:text-[6vmin] md:text-[7vmin] mt-2 ${themeColors.textMuted}`}
                    >
                      {formattedTime.sub}
                    </motion.span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-between p-3 sm:p-4 portrait:md:p-10 lg:p-10 h-full max-h-full min-h-0">
                {/* TOP ROW: Header (Merged) */}
                <div className="flex flex-row justify-end items-center border-b border-white/5 pb-1.5 portrait:md:pb-6 portrait:md:flex-col portrait:md:items-end portrait:md:space-y-4 portrait:md:border-none lg:pb-6 lg:flex-col lg:items-end lg:space-y-4 lg:border-none shrink-0">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-[5px] md:text-[8px] tracking-[0.3em] text-white/20 font-mono uppercase leading-none mb-1">SYSTEM PROTOCOL</span>
                      <div className="flex flex-col items-end">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={currentInfo.label}
                            initial={{ opacity: 0, x: 5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`text-[10px] sm:text-xs md:text-sm tracking-widest font-mono uppercase ${currentInfo.color} leading-none mb-1 md:mb-1.5`}
                          >
                            {currentInfo.label}
                          </motion.span>
                        </AnimatePresence>
                        <span className={`text-[6px] sm:text-[8px] md:text-[10px] tracking-[0.2em] font-mono uppercase ${themeColors.textMuted} leading-none`}>
                          SYSTEM RUNTIME ACTIVE
                        </span>
                        {isWakeLockActive && (
                          <motion.span
                            initial={{ opacity: 0, y: -2 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-[5px] sm:text-[7px] md:text-[8px] tracking-[0.2em] font-mono uppercase mt-1.5 flex items-center gap-1.5 ${selectedCharacter === "lambo" ? "text-[#87a96b]/90" :
                                selectedCharacter === "ferrari" ? "text-[#f3e5ab]/90" :
                                  selectedCharacter === "kirby" ? "text-[#e6e6fa]/90" :
                                    "text-cyan-400/90"
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${selectedCharacter === "lambo" ? "bg-[#87a96b]" :
                                selectedCharacter === "ferrari" ? "bg-[#f3e5ab]" :
                                  selectedCharacter === "kirby" ? "bg-[#e6e6fa]" :
                                    "bg-cyan-400"
                              }`} />
                            SCREEN AWAKE
                          </motion.span>
                        )}
                      </div>
                    </div>
                    <div className={`p-1 md:p-3 rounded bg-white/5 border border-white/10 ${currentInfo.color}`}>
                      <CurrentIcon className="w-2.5 h-2.5 md:w-6 md:h-6" />
                    </div>
                  </div>
                </div>

                {/* CENTER: Atmospheric Ambient Zone (Massive Clock) */}
                <div className="flex-1 flex flex-col justify-center items-center relative min-h-0 overflow-hidden">
                  <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    {/* Massive Atmospheric Clock */}
                    <div className="relative font-mono flex flex-row items-center justify-center">
                      <motion.div
                        key={`${selectedCharacter}-glow`}
                        animate={{ opacity: glowOpacity }}
                        transition={{ duration: themeColors.clockGlowSpeed, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -inset-10 blur-3xl rounded-full pointer-events-none"
                        style={clockGlowColorStyle}
                      />
                      <span className={`relative z-10 block text-[48px] sm:text-[64px] md:text-[84px] lg:text-[110px] leading-none font-digital tabular-nums transition-colors duration-1000 drop-shadow-2xl ${isNight ? 'text-white/60' : 'text-white/90'}`}>
                        {formattedTime.main}
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className={`text-[20px] sm:text-[28px] md:text-[36px] lg:text-[48px] ml-1 sm:ml-2 ${themeColors.textMuted}`}
                        >
                          {formattedTime.sub}
                        </motion.span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM HUD BAR: Metrics & Controls */}
                <div className="flex flex-row justify-between items-center pt-1.5 border-t border-white/[0.04] portrait:md:flex-col portrait:md:items-stretch portrait:md:space-y-4 portrait:md:pt-6 lg:flex-col lg:items-stretch lg:space-y-6 lg:pt-8 shrink-0">
                  {/* Unified HUD Metrics */}
                  <div className="flex flex-row items-center gap-2.5 md:grid md:grid-cols-2 md:gap-8">
                    <div className="flex items-center gap-1 md:flex-col md:items-start md:gap-2">
                      <Activity className="w-1.5 h-1.5 md:w-4 md:h-4 text-white/10" />
                      <div className="flex items-baseline gap-0.5 md:gap-2">
                        <motion.span
                          key={`${selectedCharacter}-fps`}
                          animate={{ opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                          className="text-[8px] md:text-2xl font-light text-white/60 tabular-nums"
                        >
                          {metrics.fps}
                        </motion.span>
                        <span className="text-[4px] md:text-[10px] text-white/10 font-mono">FPS</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 md:flex-col md:items-end md:gap-2">
                      <div className="flex flex-col items-start md:items-end">
                        <motion.span
                          key={`${selectedCharacter}-mem`}
                          animate={{ opacity: [0.5, 0.9, 0.5] }}
                          transition={{ duration: 7.2, repeat: Infinity, ease: "linear", delay: 1 }}
                          className="text-[6px] md:text-xs font-mono text-emerald-500/40 uppercase leading-none"
                        >
                          M:{metrics.memoryUsage.toFixed(0)}
                        </motion.span>
                        <span className="text-[4px] md:text-[10px] font-mono text-white/10 italic leading-none mt-0.5 sm:block hidden">U:{Math.floor(metrics.uptime / 60)}m</span>
                      </div>
                    </div>
                  </div>

                  {/* Micro Controls */}
                  <div className="flex flex-row items-center gap-2 sm:gap-4 relative z-[60] pointer-events-auto">
                    <motion.button
                      whileHover={{ scale: 1.15, filter: "drop-shadow(0px 0px 8px currentColor)" }}
                      whileTap={{ scale: 0.85 }}
                      onPointerUp={toggleFullscreen}
                      className={`p-3 sm:p-4 text-white/20 transition-colors duration-300 touch-manipulation pointer-events-auto ${themeColors.controlHover}`}
                    >
                      {isFullscreen ? (
                        <Minimize className="w-3 h-3 md:w-5 md:h-5" />
                      ) : (
                        <Maximize className="w-3 h-3 md:w-5 md:h-5" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15, filter: "drop-shadow(0px 0px 8px currentColor)" }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 sm:p-4 transition-all duration-500 touch-manipulation pointer-events-auto ${themeColors.controlHover} ${!isMuted ? themeColors.buttonGlow : "text-white/20"
                        }`}
                    >
                      {isMuted ? <VolumeX className="w-3 h-3 md:w-5 md:h-5" /> : <Volume2 className="w-3 h-3 md:w-5 md:h-5" />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.15, filter: "drop-shadow(0px 0px 8px currentColor)" }}
                      whileTap={{ scale: 0.85 }}
                      onClick={() => setShowSettings(!showSettings)}
                      className={`p-3 sm:p-4 text-white/20 transition-colors duration-300 touch-manipulation pointer-events-auto ${themeColors.controlHover}`}
                    >
                      <Settings className="w-3 h-3 md:w-5 md:h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </section>
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

export default PixelCatCompanion;


