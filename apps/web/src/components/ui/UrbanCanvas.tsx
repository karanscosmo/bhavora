"use client";

import { useEffect, useRef } from 'react';

// Seeded random for deterministic particle positions
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function UrbanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Particle system
    const rand = seededRandom(42);
    const PARTICLE_COUNT = 90;

    interface Particle {
      x: number; y: number; vx: number; vy: number;
      ox: number; oy: number; r: number; opacity: number;
    }

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: rand() * W,
      y: rand() * H,
      vx: (rand() - 0.5) * 0.3,
      vy: (rand() - 0.5) * 0.3,
      ox: 0, oy: 0,
      r: rand() * 1.2 + 0.6,
      opacity: rand() * 0.03 + 0.05, // 5% to 8% opacity
    }));

    // Pulse rings
    interface Ring { x: number; y: number; radius: number; opacity: number; }
    const rings: Ring[] = [];
    let lastRingTime = 0;

    // Ambient light positions
    let ambX1 = rand() * W, ambY1 = rand() * H;
    let ambX2 = rand() * W, ambY2 = rand() * H;
    let ambT = 0;

    let lastTime = 0;
    let hidden = false;

    const onVisibility = () => { hidden = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMouse);

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener('resize', onResize);

    function draw(ts: number) {
      if (hidden) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      if (!ctx) return;

      const dt = Math.min(ts - lastTime, 33); // cap at 30fps delta
      lastTime = ts;
      ambT += dt * 0.001;

      ctx.clearRect(0, 0, W, H);

      // LAYER 4 — Ambient bloom (very subtle)
      ambX1 = W * 0.3 + Math.sin(ambT * 0.7) * W * 0.25;
      ambY1 = H * 0.4 + Math.cos(ambT * 0.5) * H * 0.3;
      ambX2 = W * 0.7 - Math.sin(ambT * 0.4) * W * 0.25;
      ambY2 = H * 0.6 - Math.cos(ambT * 0.6) * H * 0.3;

      const bloom1 = ctx.createRadialGradient(ambX1, ambY1, 0, ambX1, ambY1, 350);
      bloom1.addColorStop(0, 'rgba(37,99,235,0.03)');
      bloom1.addColorStop(1, 'transparent');
      ctx.fillStyle = bloom1;
      ctx.fillRect(0, 0, W, H);

      const bloom2 = ctx.createRadialGradient(ambX2, ambY2, 0, ambX2, ambY2, 300);
      bloom2.addColorStop(0, 'rgba(124,58,237,0.02)');
      bloom2.addColorStop(1, 'transparent');
      ctx.fillStyle = bloom2;
      ctx.fillRect(0, 0, W, H);

      // LAYER 2 — Network particles
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of particles) {
        // Mouse attraction within 200px
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (1 - dist / 200) * 0.03;
          p.vx += dx * force;
          p.vy += dy * force;
        }

        // Dampen velocity
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(27,43,75,${p.opacity})`;
        ctx.fill();
      }

      // Draw edges between nearby particles (3% connection lines)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.03;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(27,43,75,${alpha})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      // LAYER 3 — Pulse rings (8% electric blue)
      if (ts - lastRingTime > (5000 + rand() * 4000)) {
        rings.push({
          x: rand() * W,
          y: rand() * H,
          radius: 0,
          opacity: 0.08,
        });
        lastRingTime = ts;
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.radius += 1.0;
        ring.opacity -= 0.0006;

        if (ring.opacity <= 0) {
          rings.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(37,99,235,${ring.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // LAYER 5 — Scanline
      const scanY = ((ts % 9000) / 9000) * H;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(W, scanY);
      ctx.strokeStyle = 'rgba(27,43,75,0.015)';
      ctx.lineWidth = 1;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
