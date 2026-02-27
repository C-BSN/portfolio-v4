"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Enemy = {
  id: number;
  lane: 0 | 1 | 2;
  y: number;
  w: number;
  h: number;
  passed?: boolean;
  variant: 0 | 1 | 2;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  t: number;
  size: number;
  kind: "spark" | "dust";
};

type Star = {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  phase: number;
};

export default function Car404NeonRunner() {
  const CFG = useMemo(
    () => ({
      W: 940,
      H: 520,

      lanes: 3,
      roadPadX: 170,

      playerW: 62,
      playerH: 102,
      playerY: 372,

      baseSpeed: 290,
      maxSpeed: 680,
      speedUpPerScore: 9,

      spawnBase: 0.95,
      spawnUpPerScore: 0.045,
      spawnMax: 3.2,

      enemyW: 58,
      enemyH: 98,

      particleTrailRate: 42,
      particleBurstCount: 34,
      dtClamp: 0.033,

      laneChangeSpeed: 14,
      accelLerp: 3.5,
      starCount: 45,
      lampSpacing: 160,
    }),
    []
  );

  const rafRef = useRef<number | null>(null);
  const lastTRef = useRef<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const laneRef = useRef<0 | 1 | 2>(1);
  const laneVisualRef = useRef(1);
  const enemiesRef = useRef<Enemy[]>([]);
  const nextEnemyIdRef = useRef(1);

  const particlesRef = useRef<Particle[]>([]);
  const nextParticleIdRef = useRef(1);

  const currentSpeedRef = useRef(0);
  const distanceRef = useRef(0);
  const timeRef = useRef(0);
  const starsRef = useRef<Star[]>([]);

  const swipeXRef = useRef<number | null>(null);

  const [ui, setUi] = useState(() => ({
    running: false,
    dead: false,
    score: 0,
    best: 0,
    sound: true,
    hint: true,
  }));

  const [, setTick] = useState(0);

  useEffect(() => {
    document.body.classList.add("no-global-effects", "page-404");
    return () => document.body.classList.remove("no-global-effects", "page-404");
  }, []);

  useEffect(() => {
    try {
      const best = Number(localStorage.getItem("neoncar404_best") || "0");
      const sound = localStorage.getItem("neoncar404_sound") ?? "1";
      setUi((u) => ({
        ...u,
        best: Number.isFinite(best) ? best : 0,
        sound: sound === "1",
      }));
    } catch {}
  }, []);

  useEffect(() => {
    starsRef.current = Array.from({ length: CFG.starCount }, () => ({
      x: Math.random() * CFG.W,
      y: Math.random() * CFG.H,
      size: 1 + Math.random() * 2,
      baseAlpha: 0.12 + Math.random() * 0.48,
      phase: Math.random() * Math.PI * 2,
    }));
    resetGame(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveBest(best: number) {
    try { localStorage.setItem("neoncar404_best", String(best)); } catch {}
  }
  function saveSound(v: boolean) {
    try { localStorage.setItem("neoncar404_sound", v ? "1" : "0"); } catch {}
  }

  function ensureAudio() {
    if (audioCtxRef.current) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const g = ctx.createGain();
    g.gain.value = 0.25;
    g.connect(ctx.destination);
    audioCtxRef.current = ctx;
    masterGainRef.current = g;
  }

  function tone(freq: number, dur = 0.07, type: OscillatorType = "triangle", vol = 0.12) {
    if (!ui.sound) return;
    ensureAudio();
    const ctx = audioCtxRef.current!;
    const master = masterGainRef.current!;
    if (ctx.state === "suspended") ctx.resume?.();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(g);
    g.connect(master);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  }

  function blip() { tone(760, 0.05, "sine", 0.10); }

  function crashSound() {
    if (!ui.sound) return;
    ensureAudio();
    const ctx = audioCtxRef.current!;
    const master = masterGainRef.current!;
    if (ctx.state === "suspended") ctx.resume?.();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(260, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.22);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    osc.connect(g);
    g.connect(master);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  }

  function laneX(lane: number) {
    const roadW = CFG.W - CFG.roadPadX * 2;
    const laneW = roadW / CFG.lanes;
    return CFG.roadPadX + laneW * lane + laneW / 2;
  }

  function getSpeed(score: number) {
    return clamp(CFG.baseSpeed + score * CFG.speedUpPerScore, CFG.baseSpeed, CFG.maxSpeed);
  }

  function getSpawnRate(score: number) {
    return clamp(CFG.spawnBase + score * CFG.spawnUpPerScore, CFG.spawnBase, CFG.spawnMax);
  }

  function resetGame(start = false) {
    laneRef.current = 1;
    laneVisualRef.current = 1;
    currentSpeedRef.current = 0;
    distanceRef.current = 0;
    enemiesRef.current = [];
    particlesRef.current = [];
    nextEnemyIdRef.current = 1;
    nextParticleIdRef.current = 1;
    lastTRef.current = null;
    setUi((u) => ({ ...u, running: start, dead: false, score: 0, hint: !start }));
  }

  function start() {
    setUi((u) => ({ ...u, running: true, dead: false, hint: false }));
    tone(420, 0.05, "sine", 0.08);
  }

  function toggleSound() {
    setUi((u) => {
      const v = !u.sound;
      saveSound(v);
      return { ...u, sound: v };
    });
  }

  function die() {
    setUi((u) => {
      const best = Math.max(u.best, u.score);
      if (best !== u.best) saveBest(best);
      return { ...u, running: false, dead: true, best };
    });
    crashSound();
    burstParticles();
  }

  function spawnEnemy() {
    const p = laneRef.current;
    let lane = Math.floor(Math.random() * 3) as 0 | 1 | 2;
    if (lane === p && Math.random() < 0.62) {
      lane = ((lane + 1 + Math.floor(Math.random() * 2)) % 3) as 0 | 1 | 2;
    }
    const minGap = 160;
    const near = enemiesRef.current.some((e) => e.lane === lane && e.y < minGap);
    if (near && Math.random() < 0.7) return;
    enemiesRef.current = enemiesRef.current.concat({
      id: nextEnemyIdRef.current++,
      lane,
      y: -140,
      w: CFG.enemyW,
      h: CFG.enemyH,
      passed: false,
      variant: Math.floor(Math.random() * 3) as 0 | 1 | 2,
    }).slice(-24);
  }

  function emitTrail(dt: number, speed: number) {
    const count = Math.floor(CFG.particleTrailRate * dt * (0.7 + (speed / CFG.maxSpeed) * 0.6));
    if (count <= 0) return;
    const x = laneX(laneVisualRef.current);
    const y = CFG.playerY + CFG.playerH * 0.78;
    const list: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const kind: Particle["kind"] = Math.random() < 0.7 ? "spark" : "dust";
      list.push({
        id: nextParticleIdRef.current++,
        x: x + rand(-10, 10),
        y: y + rand(-6, 6),
        vx: rand(-40, 40),
        vy: rand(120, 260),
        life: rand(0.18, 0.35),
        t: 0,
        size: kind === "spark" ? rand(2, 4) : rand(2, 3),
        kind,
      });
    }
    particlesRef.current = particlesRef.current.concat(list).slice(-220);
  }

  function burstParticles() {
    const x = laneX(laneRef.current);
    const y = CFG.playerY + CFG.playerH * 0.45;
    const list: Particle[] = [];
    for (let i = 0; i < CFG.particleBurstCount; i++) {
      const a = rand(0, Math.PI * 2);
      const sp = rand(80, 340);
      list.push({
        id: nextParticleIdRef.current++,
        x: x + rand(-10, 10),
        y: y + rand(-10, 10),
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: rand(0.25, 0.55),
        t: 0,
        size: rand(2, 5),
        kind: Math.random() < 0.75 ? "spark" : "dust",
      });
    }
    particlesRef.current = particlesRef.current.concat(list).slice(-260);
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        laneRef.current = Math.max(0, laneRef.current - 1) as 0 | 1 | 2;
        if (!ui.running && !ui.dead) start();
        if (ui.dead) resetGame(true);
        tone(520, 0.04, "triangle", 0.07);
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        laneRef.current = Math.min(2, laneRef.current + 1) as 0 | 1 | 2;
        if (!ui.running && !ui.dead) start();
        if (ui.dead) resetGame(true);
        tone(520, 0.04, "triangle", 0.07);
      }
      if (e.code === "Space") {
        e.preventDefault();
        if (!ui.running && !ui.dead) start();
        if (ui.dead) resetGame(true);
      }
      if (e.key === "r" || e.key === "R") resetGame(true);
      if (e.key === "m" || e.key === "M") toggleSound();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.running, ui.dead, ui.sound]);

  useEffect(() => {
    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);
      const last = lastTRef.current ?? t;
      const dt = Math.min(CFG.dtClamp, (t - last) / 1000);
      lastTRef.current = t;

      timeRef.current += dt;

      const laneDiff = laneRef.current - laneVisualRef.current;
      laneVisualRef.current += laneDiff * Math.min(1, dt * CFG.laneChangeSpeed);

      const targetSpeed = ui.running ? getSpeed(ui.score) : 0;
      currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * Math.min(1, dt * CFG.accelLerp);
      const speed = currentSpeedRef.current;

      if (ui.running) {
        distanceRef.current += speed * dt;
      }

      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          vx: p.vx * (1 - dt * 2.6),
          vy: p.vy * (1 - dt * 2.6),
          t: p.t + dt,
        }))
        .filter((p) => p.t < p.life)
        .slice(-260);

      if (!ui.running) {
        setTick((x) => (x + 1) % 1_000_000);
        return;
      }

      const spawnRate = getSpawnRate(ui.score);
      if (Math.random() < spawnRate * dt) spawnEnemy();

      emitTrail(dt, speed);

      enemiesRef.current = enemiesRef.current
        .map((e) => ({ ...e, y: e.y + speed * dt }))
        .filter((e) => e.y < CFG.H + 160);

      const playerRect = {
        x: laneX(laneVisualRef.current) - CFG.playerW / 2 + 6,
        y: CFG.playerY + 4,
        w: CFG.playerW - 12,
        h: CFG.playerH - 8,
      };

      let gained = 0;
      for (const e of enemiesRef.current) {
        const enemyRect = {
          x: laneX(e.lane) - e.w / 2 + 4,
          y: e.y + 4,
          w: e.w - 8,
          h: e.h - 8,
        };
        if (!e.passed && e.y > CFG.playerY + CFG.playerH) {
          e.passed = true;
          gained += 1;
        }
        if (rectHit(playerRect, enemyRect)) {
          die();
          break;
        }
      }

      if (gained) {
        blip();
        setUi((u) => ({ ...u, score: u.score + gained, hint: false }));
      } else {
        setTick((x) => (x + 1) % 1_000_000);
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.running, ui.score, ui.sound]);

  const onPointerDown = (e: React.PointerEvent) => {
    swipeXRef.current = e.clientX;
    if (!ui.running && !ui.dead) start();
    if (ui.dead) resetGame(true);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const x0 = swipeXRef.current;
    swipeXRef.current = null;
    if (x0 == null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) < 28) return;
    if (dx < 0) laneRef.current = Math.max(0, laneRef.current - 1) as 0 | 1 | 2;
    else laneRef.current = Math.min(2, laneRef.current + 1) as 0 | 1 | 2;
    tone(520, 0.04, "triangle", 0.07);
  };

  const enemies = enemiesRef.current;
  const particles = particlesRef.current;
  const stars = starsRef.current;
  const laneVisual = laneVisualRef.current;
  const distance = distanceRef.current;
  const time = timeRef.current;
  const laneTilt = (laneRef.current - laneVisual) * -12;
  const roadW = CFG.W - CFG.roadPadX * 2;

  const speedNow = getSpeed(ui.score);
  const spawnNow = getSpawnRate(ui.score);

  const lampSpacing = CFG.lampSpacing;
  const lampCount = Math.ceil(CFG.H / lampSpacing) + 3;
  const lampOffset = distance % lampSpacing;

  return (
    <div className="min-h-[100dvh] w-full bg-neutral-950 text-neutral-100 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <div className="text-3xl md:text-4xl font-semibold tracking-tight">404 — Neon Night Run</div>
            <div className="text-neutral-300 mt-1">Mauvaise route… mais la course continue.</div>
            <div className="text-xs text-neutral-400 mt-2">
              Vitesse <span className="tabular-nums">{Math.round(speedNow)}</span> · Densité{" "}
              <span className="tabular-nums">{spawnNow.toFixed(2)}</span>/s
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={toggleSound}
              className="rounded-xl px-3 py-1.5 border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 transition text-xs"
              aria-label="Toggle sound"
            >
              {ui.sound ? "Sound ON" : "Sound OFF"}{" "}
              <span className="hidden sm:inline text-neutral-400">(M)</span>
            </button>
            <div className="text-sm text-neutral-300 mt-2">Score</div>
            <div className="text-2xl font-semibold tabular-nums">{ui.score}</div>
            <div className="text-xs text-neutral-400 mt-1">
              Best: <span className="tabular-nums">{ui.best}</span>
            </div>
          </div>
        </div>

        <div
          className="relative select-none touch-none rounded-2xl overflow-hidden border border-neutral-800 shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
          style={{
            aspectRatio: `${CFG.W} / ${CFG.H}`,
            background: "linear-gradient(180deg, #020617 0%, #030712 100%)",
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          role="application"
          aria-label="Mini-jeu 404 Neon Runner"
        >
          {/* Stars */}
          {stars.map((s, i) => {
            const alpha = s.baseAlpha + Math.sin(time * 1.8 + s.phase) * 0.15;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white pointer-events-none"
                style={{
                  left: s.x,
                  top: s.y,
                  width: s.size,
                  height: s.size,
                  opacity: Math.max(0.05, alpha),
                }}
              />
            );
          })}

          {/* Ambient neon glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(900px 480px at 20% 20%, rgba(236,72,153,0.14), transparent 60%)," +
                "radial-gradient(900px 520px at 80% 30%, rgba(59,130,246,0.14), transparent 60%)",
            }}
          />

          {/* Road */}
          <Road
            lanes={CFG.lanes}
            roadPadX={CFG.roadPadX}
            W={CFG.W}
            H={CFG.H}
            distance={distance}
          />

          {/* Lampposts */}
          {Array.from({ length: lampCount }).map((_, i) => {
            const y = -lampSpacing + i * lampSpacing + lampOffset;
            if (y < -80 || y > CFG.H + 80) return null;
            return (
              <React.Fragment key={`lp-${i}`}>
                {/* Left lamp */}
                <div
                  className="absolute pointer-events-none"
                  style={{ left: CFG.roadPadX - 34, top: y }}
                >
                  <div
                    className="absolute"
                    style={{
                      left: -10,
                      top: -6,
                      width: 70,
                      height: 36,
                      background:
                        "radial-gradient(ellipse at 35% 50%, rgba(255,200,100,0.07), transparent 70%)",
                    }}
                  />
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "rgba(255,220,130,0.85)",
                      boxShadow:
                        "0 0 10px rgba(255,200,100,0.5), 0 0 22px rgba(255,200,100,0.25)",
                    }}
                  />
                  <div
                    style={{
                      width: 2,
                      height: 14,
                      background: "rgba(120,120,120,0.25)",
                      marginLeft: 2.5,
                      marginTop: 1,
                    }}
                  />
                </div>
                {/* Right lamp */}
                <div
                  className="absolute pointer-events-none"
                  style={{ left: CFG.roadPadX + roadW + 20, top: y }}
                >
                  <div
                    className="absolute"
                    style={{
                      right: -10,
                      top: -6,
                      width: 70,
                      height: 36,
                      background:
                        "radial-gradient(ellipse at 65% 50%, rgba(255,200,100,0.07), transparent 70%)",
                    }}
                  />
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "rgba(255,220,130,0.85)",
                      boxShadow:
                        "0 0 10px rgba(255,200,100,0.5), 0 0 22px rgba(255,200,100,0.25)",
                    }}
                  />
                  <div
                    style={{
                      width: 2,
                      height: 14,
                      background: "rgba(120,120,120,0.25)",
                      marginLeft: 2.5,
                      marginTop: 1,
                    }}
                  />
                </div>
              </React.Fragment>
            );
          })}

          {/* Enemy shadows */}
          {enemies.map((e) => (
            <div
              key={`es-${e.id}`}
              className="absolute pointer-events-none"
              style={{
                left: laneX(e.lane) - e.w * 0.55,
                top: e.y + 6,
                width: e.w * 1.1,
                height: e.h * 0.9,
                background:
                  "radial-gradient(ellipse, rgba(0,0,0,0.3), transparent 70%)",
                filter: "blur(4px)",
              }}
            />
          ))}

          {/* Enemy cars */}
          {enemies.map((e) => (
            <div
              key={e.id}
              className="absolute"
              style={{
                left: laneX(e.lane) - e.w / 2,
                top: e.y,
                width: e.w,
                height: e.h,
                opacity: 0.95,
                filter:
                  "drop-shadow(0 0 10px rgba(59,130,246,0.15)) drop-shadow(0 0 8px rgba(236,72,153,0.10))",
              }}
            >
              <EnemyNeonCar variant={e.variant} />
            </div>
          ))}

          {/* Player shadow */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: laneX(laneVisual) - CFG.playerW * 0.55,
              top: CFG.playerY + 6,
              width: CFG.playerW * 1.1,
              height: CFG.playerH * 0.92,
              background:
                "radial-gradient(ellipse, rgba(0,0,0,0.35), transparent 70%)",
              filter: "blur(5px)",
              transform: `rotate(${laneTilt}deg)`,
              transformOrigin: "center center",
            }}
          />

          {/* Headlight glow cone */}
          {ui.running && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: laneX(laneVisual) - 44,
                top: CFG.playerY - 80,
                width: 88,
                height: 90,
                background:
                  "radial-gradient(ellipse at 50% 100%, rgba(251,191,36,0.08), transparent 70%)",
                filter: "blur(3px)",
                transform: `rotate(${laneTilt}deg)`,
                transformOrigin: "center bottom",
              }}
            />
          )}

          {/* Particles */}
          {particles.map((p) => {
            const a = 1 - p.t / p.life;
            return (
              <div
                key={p.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.size,
                  opacity: a,
                  background:
                    p.kind === "spark"
                      ? "linear-gradient(90deg, rgba(236,72,153,0.95), rgba(59,130,246,0.9))"
                      : "rgba(255,255,255,0.35)",
                  filter:
                    p.kind === "spark"
                      ? "blur(0.2px) drop-shadow(0 0 8px rgba(236,72,153,0.5)) drop-shadow(0 0 10px rgba(59,130,246,0.4))"
                      : "blur(0.5px) drop-shadow(0 0 6px rgba(59,130,246,0.2))",
                }}
              />
            );
          })}

          {/* Player car */}
          <div
            className="absolute"
            style={{
              left: laneX(laneVisual) - CFG.playerW / 2,
              top: CFG.playerY,
              width: CFG.playerW,
              height: CFG.playerH,
              transform: `rotate(${laneTilt}deg)`,
              transformOrigin: "center center",
              filter:
                "drop-shadow(0 0 16px rgba(157,23,77,0.4)) drop-shadow(0 0 18px rgba(244,114,182,0.2))",
            }}
          >
            <PlayerNeonCar />
          </div>

          {/* Hint overlay */}
          {ui.hint && (
            <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
              <div className="bg-neutral-950/60 backdrop-blur-md border border-neutral-800 rounded-2xl px-5 py-4 max-w-md text-center">
                <div className="text-lg font-semibold">
                  Évite le trafic, change de voie
                </div>
                <div className="text-neutral-300 text-sm mt-1">
                  <span className="font-medium">&larr; &rarr;</span> / A D ·
                  swipe mobile
                </div>
                <div className="text-neutral-400 text-xs mt-3">
                  Espace = start/restart · M = mute
                </div>
              </div>
            </div>
          )}

          {/* Dead overlay */}
          {ui.dead && (
            <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
              <div className="bg-neutral-950/70 backdrop-blur-md border border-neutral-800 rounded-2xl px-5 py-4 max-w-md text-center">
                <div className="text-lg font-semibold">Crash</div>
                <div className="text-neutral-300 text-sm mt-1">
                  Clique / Espace pour rejouer.
                </div>
              </div>
            </div>
          )}

          {/* Bottom UI */}
          <div className="absolute left-0 right-0 bottom-0 p-3 flex items-center justify-between text-xs text-neutral-300 z-10">
            <div className="opacity-80">
              {ui.running
                ? "Drive"
                : ui.dead
                  ? "Rejouer"
                  : "\u2190 \u2192 pour bouger"}
            </div>
            <div className="opacity-80">
              <span className="hidden sm:inline">&larr; &rarr; · </span>Espace
              start · M mute
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition"
          >
            Retour à l&apos;accueil
          </a>
          <button
            onClick={() => resetGame(true)}
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 transition"
          >
            Rejouer
          </button>
          {!ui.running && !ui.dead && (
            <button
              onClick={() => start()}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 border border-neutral-800 bg-neutral-950 hover:bg-neutral-900 transition"
            >
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Road                                                               */
/* ------------------------------------------------------------------ */

function Road(props: {
  lanes: number;
  roadPadX: number;
  W: number;
  H: number;
  distance: number;
}) {
  const { lanes, roadPadX, W, H, distance } = props;
  const roadW = W - roadPadX * 2;
  const laneW = roadW / lanes;
  const dashPeriod = 68;
  const curbPeriod = 40;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Asphalt */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: roadW,
          background:
            "linear-gradient(90deg, rgba(35,35,45,0.98), rgba(42,42,52,0.98) 50%, rgba(35,35,45,0.98))",
          boxShadow: "inset 0 0 80px rgba(0,0,0,0.4)",
        }}
      />

      {/* Subtle asphalt texture */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 opacity-[0.03]"
        style={{
          width: roadW,
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "6px 6px",
        }}
      />

      {/* Left curb */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: roadPadX - 7,
          width: 7,
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(234,179,8,0.4) 0px, rgba(234,179,8,0.4) 20px, rgba(30,30,35,0.6) 20px, rgba(30,30,35,0.6) 40px)",
          backgroundPositionY: distance % curbPeriod,
        }}
      />

      {/* Right curb */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: roadPadX + roadW,
          width: 7,
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(234,179,8,0.4) 0px, rgba(234,179,8,0.4) 20px, rgba(30,30,35,0.6) 20px, rgba(30,30,35,0.6) 40px)",
          backgroundPositionY: distance % curbPeriod,
        }}
      />

      {/* Neon edge left */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: roadPadX - 1,
          width: 2,
          background:
            "linear-gradient(180deg, rgba(236,72,153,0.8), rgba(59,130,246,0.7))",
          filter: "drop-shadow(0 0 12px rgba(236,72,153,0.4))",
          opacity: 0.55,
        }}
      />

      {/* Neon edge right */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: roadPadX + roadW - 1,
          width: 2,
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.8), rgba(236,72,153,0.7))",
          filter: "drop-shadow(0 0 12px rgba(59,130,246,0.4))",
          opacity: 0.55,
        }}
      />

      {/* Lane dividers — animated dashes */}
      {Array.from({ length: lanes - 1 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0"
          style={{
            left: roadPadX + laneW * (i + 1) - 1,
            width: 2,
            backgroundImage:
              "repeating-linear-gradient(180deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 28px, transparent 28px, transparent 68px)",
            backgroundPositionY: distance % dashPeriod,
            boxShadow: "0 0 6px rgba(255,255,255,0.04)",
          }}
        />
      ))}

      {/* Horizon glow */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: 0,
          height: H * 0.22,
          background:
            "radial-gradient(600px 180px at 50% 20%, rgba(236,72,153,0.16), transparent 60%)," +
            "radial-gradient(600px 180px at 50% 30%, rgba(59,130,246,0.12), transparent 60%)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Player car SVG                                                     */
/* ------------------------------------------------------------------ */

function PlayerNeonCar() {
  return (
    <svg
      viewBox="0 0 140 224"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#831843" />
          <stop offset="0.5" stopColor="#9D174D" />
          <stop offset="1" stopColor="#831843" />
        </linearGradient>
        <linearGradient id="pBodyV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F472B6" stopOpacity="0.25" />
          <stop offset="0.3" stopColor="#9D174D" />
          <stop offset="1" stopColor="#831843" />
        </linearGradient>
        <linearGradient id="pGlass" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#0A1628" stopOpacity="0.96" />
          <stop offset="1" stopColor="#0F172A" stopOpacity="0.88" />
        </linearGradient>
        <radialGradient id="pHL" cx="0.5" cy="1" r="0.65">
          <stop offset="0" stopColor="#FDE68A" stopOpacity="0.4" />
          <stop offset="1" stopColor="#FDE68A" stopOpacity="0" />
        </radialGradient>
        <filter id="pGlow">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      {/* Headlight glow cones */}
      <path d="M44 12 L32 -28 L56 -28 Z" fill="url(#pHL)" />
      <path d="M96 12 L84 -28 L108 -28 Z" fill="url(#pHL)" />

      {/* Body shell — wide aggressive M3 G80 stance */}
      <path
        d="M44 16 C44 4, 96 4, 96 16 L108 56 L112 80 L112 172 L108 196
           C106 214, 34 214, 32 196 L28 172 L28 80 L32 56 Z"
        fill="url(#pBody)"
      />

      {/* Muscular fender flares (wider than standard 3-series) */}
      <path d="M28 52 C20 58, 18 70, 18 78 C18 86, 20 98, 28 102" fill="#831843" opacity="0.75" />
      <path d="M112 52 C120 58, 122 70, 122 78 C122 86, 120 98, 112 102" fill="#831843" opacity="0.75" />
      <path d="M28 148 C20 154, 18 164, 18 172 C18 180, 20 190, 28 194" fill="#831843" opacity="0.75" />
      <path d="M112 148 C120 154, 122 164, 122 172 C122 180, 120 190, 112 194" fill="#831843" opacity="0.75" />

      {/* Long hood */}
      <path
        d="M48 18 C48 10, 92 10, 92 18 L102 52 L38 52 Z"
        fill="url(#pBodyV)"
        opacity="0.95"
      />
      {/* Hood power bulge */}
      <path d="M54 16 C54 12, 86 12, 86 16 L88 40 L52 40 Z" fill="white" opacity="0.035" />
      <rect x="56" y="30" width="28" height="1.5" rx="0.75" fill="black" opacity="0.1" />

      {/* === G80 SIGNATURE: Giant vertical kidney grilles === */}
      <path d="M52 6 L66 6 L66 22 C66 26, 52 26, 52 22 Z" fill="#080808" />
      <path d="M74 6 L88 6 L88 22 C88 26, 74 26, 74 22 Z" fill="#080808" />
      {/* Chrome surround */}
      <path d="M52 6 L66 6 L66 22 C66 26, 52 26, 52 22 Z" fill="none" stroke="#6B7280" strokeWidth="1" opacity="0.45" />
      <path d="M74 6 L88 6 L88 22 C88 26, 74 26, 74 22 Z" fill="none" stroke="#6B7280" strokeWidth="1" opacity="0.45" />
      {/* Vertical slats */}
      <line x1="55" y1="8" x2="55" y2="23" stroke="#333" strokeWidth="0.8" opacity="0.6" />
      <line x1="58" y1="8" x2="58" y2="24" stroke="#333" strokeWidth="0.8" opacity="0.6" />
      <line x1="61" y1="8" x2="61" y2="24" stroke="#333" strokeWidth="0.8" opacity="0.6" />
      <line x1="64" y1="8" x2="64" y2="23" stroke="#333" strokeWidth="0.8" opacity="0.6" />
      <line x1="77" y1="8" x2="77" y2="23" stroke="#333" strokeWidth="0.8" opacity="0.6" />
      <line x1="80" y1="8" x2="80" y2="24" stroke="#333" strokeWidth="0.8" opacity="0.6" />
      <line x1="83" y1="8" x2="83" y2="24" stroke="#333" strokeWidth="0.8" opacity="0.6" />
      <line x1="86" y1="8" x2="86" y2="23" stroke="#333" strokeWidth="0.8" opacity="0.6" />

      {/* Angular headlights flanking the grilles */}
      <path d="M34 8 L52 6 L52 16 L36 16 Z" fill="#FDE68A" opacity="0.88" />
      <path d="M88 6 L106 8 L104 16 L88 16 Z" fill="#FDE68A" opacity="0.88" />
      {/* LED DRL signature line */}
      <path d="M36 12 L50 8" stroke="#F0FDFA" strokeWidth="1.2" opacity="0.55" />
      <path d="M90 8 L104 12" stroke="#F0FDFA" strokeWidth="1.2" opacity="0.55" />

      {/* Lower front bumper / air intakes */}
      <rect x="36" y="16" width="18" height="4" rx="2" fill="#111" opacity="0.5" />
      <rect x="86" y="16" width="18" height="4" rx="2" fill="#111" opacity="0.5" />

      {/* Windshield */}
      <path d="M40 56 L100 56 L96 102 L44 102 Z" fill="url(#pGlass)" />
      <path d="M46 60 L72 60 L70 90 L48 90 Z" fill="white" opacity="0.06" />

      {/* Roof (carbon on M3 CS) */}
      <rect x="46" y="106" width="48" height="36" rx="5" fill="#1A1A1A" opacity="0.85" />
      <rect x="54" y="110" width="32" height="3" rx="1.5" fill="white" opacity="0.025" />

      {/* Rear window */}
      <path d="M46 146 L94 146 L100 178 L40 178 Z" fill="url(#pGlass)" opacity="0.75" />

      {/* Trunk lip spoiler */}
      <rect x="32" y="198" width="76" height="4" rx="2" fill="#374151" opacity="0.65" />

      {/* === G80 rear: black diffuser with quad exhaust === */}
      <rect x="36" y="208" width="68" height="8" rx="3" fill="#111" opacity="0.7" />
      {/* Quad exhaust tips */}
      <circle cx="46" cy="212" r="3.5" fill="#1F1F1F" stroke="#555" strokeWidth="0.8" opacity="0.8" />
      <circle cx="56" cy="212" r="3.5" fill="#1F1F1F" stroke="#555" strokeWidth="0.8" opacity="0.8" />
      <circle cx="84" cy="212" r="3.5" fill="#1F1F1F" stroke="#555" strokeWidth="0.8" opacity="0.8" />
      <circle cx="94" cy="212" r="3.5" fill="#1F1F1F" stroke="#555" strokeWidth="0.8" opacity="0.8" />
      {/* Exhaust inner glow */}
      <circle cx="46" cy="212" r="2" fill="#292524" opacity="0.6" />
      <circle cx="56" cy="212" r="2" fill="#292524" opacity="0.6" />
      <circle cx="84" cy="212" r="2" fill="#292524" opacity="0.6" />
      <circle cx="94" cy="212" r="2" fill="#292524" opacity="0.6" />

      {/* Side mirrors (body color) */}
      <ellipse cx="22" cy="68" rx="6" ry="4.5" fill="#831843" opacity="0.65" />
      <ellipse cx="118" cy="68" rx="6" ry="4.5" fill="#831843" opacity="0.65" />
      <ellipse cx="23" cy="67" rx="2.5" ry="2" fill="#0A1628" opacity="0.5" />
      <ellipse cx="117" cy="67" rx="2.5" ry="2" fill="#0A1628" opacity="0.5" />

      {/* Wide wheels on M compound brakes */}
      <rect x="14" y="50" width="18" height="46" rx="8" fill="#0A0A0A" stroke="#404040" strokeWidth="1.2" />
      <rect x="108" y="50" width="18" height="46" rx="8" fill="#0A0A0A" stroke="#404040" strokeWidth="1.2" />
      <rect x="14" y="148" width="18" height="46" rx="8" fill="#0A0A0A" stroke="#404040" strokeWidth="1.2" />
      <rect x="108" y="148" width="18" height="46" rx="8" fill="#0A0A0A" stroke="#404040" strokeWidth="1.2" />
      {/* Alloy rim circles */}
      <circle cx="23" cy="73" r="5.5" fill="none" stroke="#666" strokeWidth="0.8" opacity="0.35" />
      <circle cx="117" cy="73" r="5.5" fill="none" stroke="#666" strokeWidth="0.8" opacity="0.35" />
      <circle cx="23" cy="171" r="5.5" fill="none" stroke="#666" strokeWidth="0.8" opacity="0.35" />
      <circle cx="117" cy="171" r="5.5" fill="none" stroke="#666" strokeWidth="0.8" opacity="0.35" />
      {/* Rim center caps */}
      <circle cx="23" cy="73" r="2" fill="#333" opacity="0.4" />
      <circle cx="117" cy="73" r="2" fill="#333" opacity="0.4" />
      <circle cx="23" cy="171" r="2" fill="#333" opacity="0.4" />
      <circle cx="117" cy="171" r="2" fill="#333" opacity="0.4" />

      {/* L-shaped tail lights (G80 signature) */}
      <path d="M32 200 L48 200 L48 203 L40 203 L40 210 L32 210 Z" fill="#DC2626" opacity="0.9" />
      <path d="M92 200 L108 200 L108 210 L100 210 L100 203 L92 203 Z" fill="#DC2626" opacity="0.9" />
      <path d="M32 200 L48 200 L48 203 L40 203 L40 210 L32 210 Z" fill="#EF4444" opacity="0.2" filter="url(#pGlow)" />
      <path d="M92 200 L108 200 L108 210 L100 210 L100 203 L92 203 Z" fill="#EF4444" opacity="0.2" filter="url(#pGlow)" />

      {/* Side skirt — M shadow line (gloss black) */}
      <line x1="28" y1="102" x2="28" y2="148" stroke="#222" strokeWidth="2" opacity="0.4" />
      <line x1="112" y1="102" x2="112" y2="148" stroke="#222" strokeWidth="2" opacity="0.4" />

      {/* Body character line (Hofmeister kink area) */}
      <line x1="32" y1="64" x2="32" y2="194" stroke="white" strokeWidth="0.5" opacity="0.035" />
      <line x1="108" y1="64" x2="108" y2="194" stroke="white" strokeWidth="0.5" opacity="0.035" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Enemy car SVG (3 color variants)                                   */
/* ------------------------------------------------------------------ */

const ENEMY_COLORS = [
  { c1: "#60A5FA", c2: "#3B82F6", accent: "#93C5FD", tail: "#EF4444" },
  { c1: "#A78BFA", c2: "#7C3AED", accent: "#C4B5FD", tail: "#F87171" },
  { c1: "#34D399", c2: "#10B981", accent: "#6EE7B7", tail: "#FB923C" },
] as const;

function EnemyNeonCar({ variant }: { variant: 0 | 1 | 2 }) {
  const c = ENEMY_COLORS[variant];
  const bId = `eB${variant}`;
  const gId = `eG${variant}`;

  return (
    <svg
      viewBox="0 0 140 220"
      width="100%"
      height="100%"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={bId} x1="0" x2="1">
          <stop offset="0" stopColor={c.c1} />
          <stop offset="1" stopColor={c.c2} />
        </linearGradient>
        <linearGradient id={gId} x1="0" x2="1">
          <stop offset="0" stopColor="#0B1220" stopOpacity="0.9" />
          <stop offset="1" stopColor="#111827" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* Body */}
      <path
        d="M48 20 C48 8, 92 8, 92 20 L100 62 L104 84 L104 168 L100 192
           C98 208, 42 208, 40 192 L36 168 L36 84 L40 62 Z"
        fill={`url(#${bId})`}
        opacity="0.92"
      />

      {/* Hood */}
      <path
        d="M52 22 C52 14, 88 14, 88 22 L92 56 L48 56 Z"
        fill={`url(#${bId})`}
        opacity="0.85"
      />
      <rect x="56" y="26" width="28" height="20" rx="8" fill="white" opacity="0.05" />

      {/* Windshield */}
      <path d="M48 60 L92 60 L88 100 L52 100 Z" fill={`url(#${gId})`} />

      {/* Roof */}
      <rect x="52" y="104" width="36" height="34" rx="4" fill={`url(#${bId})`} opacity="0.78" />

      {/* Rear window */}
      <path d="M52 142 L88 142 L92 168 L48 168 Z" fill={`url(#${gId})`} opacity="0.7" />

      {/* Wheels */}
      <rect x="24" y="50" width="14" height="40" rx="6" fill="#111827" stroke="#374151" strokeWidth="1" opacity="0.7" />
      <rect x="102" y="50" width="14" height="40" rx="6" fill="#111827" stroke="#374151" strokeWidth="1" opacity="0.7" />
      <rect x="24" y="144" width="14" height="40" rx="6" fill="#111827" stroke="#374151" strokeWidth="1" opacity="0.7" />
      <rect x="102" y="144" width="14" height="40" rx="6" fill="#111827" stroke="#374151" strokeWidth="1" opacity="0.7" />

      {/* Headlights */}
      <rect x="42" y="10" width="14" height="8" rx="4" fill={c.accent} opacity="0.7" />
      <rect x="84" y="10" width="14" height="8" rx="4" fill={c.accent} opacity="0.7" />

      {/* Tail lights */}
      <rect x="40" y="198" width="16" height="5" rx="2.5" fill={c.tail} opacity="0.75" />
      <rect x="84" y="198" width="16" height="5" rx="2.5" fill={c.tail} opacity="0.75" />

      {/* Side mirrors */}
      <ellipse cx="30" cy="72" rx="5" ry="3.5" fill={c.accent} opacity="0.3" />
      <ellipse cx="110" cy="72" rx="5" ry="3.5" fill={c.accent} opacity="0.3" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function rectHit(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
