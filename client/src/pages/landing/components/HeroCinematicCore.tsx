import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const HeroCinematicCore: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      mousePos.current.targetX = Math.max(-1, Math.min(1, nx)) * 35;
      mousePos.current.targetY = Math.max(-1, Math.min(1, ny)) * 35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    // Orbital Nodes
    const nodes = [
      {
        title: 'VERIFIED STUDENTS',
        subtitle: 'Aarav Sharma • 8.85 CGPA',
        angle: 0,
        radius: 200,
        color: '#72F4D1',
      },
      {
        title: 'OPPORTUNITY VAULT',
        subtitle: 'NovaTech Systems • SWE',
        angle: Math.PI * 0.5,
        radius: 200,
        color: '#59D9FF',
      },
      {
        title: 'INTERVIEW DISPATCH',
        subtitle: 'Google Meet Scheduled',
        angle: Math.PI,
        radius: 200,
        color: '#72F4D1',
      },
      {
        title: 'PLACEMENT COMMAND',
        subtitle: '55% Placed • Batch 2026',
        angle: Math.PI * 1.5,
        radius: 200,
        color: '#A78BFA',
      },
    ];

    // Orbital Particles
    const particles: Array<{
      radius: number;
      angle: number;
      speed: number;
      size: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        radius: 120 + (i % 4) * 55,
        angle: Math.random() * Math.PI * 2,
        speed: (0.003 + Math.random() * 0.006) * (i % 2 === 0 ? 1 : -1),
        size: 1.2 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.6,
      });
    }

    let time = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      time += prefersReducedMotion ? 0 : 0.012;

      // Spring Momentum Interpolation
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2 + mousePos.current.x;
      const cy = rect.height / 2 + mousePos.current.y;

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Deep Radial Light Bloom
      const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 340);
      bgGrad.addColorStop(0, 'rgba(15, 118, 110, 0.28)');
      bgGrad.addColorStop(0.4, 'rgba(11, 17, 27, 0.18)');
      bgGrad.addColorStop(1, 'rgba(6, 11, 18, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Orbital Rings
      [120, 175, 230, 285].forEach((radius, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 1 ? 'rgba(114, 244, 209, 0.22)' : 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = idx === 1 ? 1.5 : 1;
        if (idx === 0) ctx.setLineDash([4, 6]);
        else if (idx === 2) ctx.setLineDash([2, 8]);
        else ctx.setLineDash([]);
        ctx.stroke();
      });

      // Stream of Particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(114, 244, 209, ${p.opacity})`;
        ctx.fill();
      });

      // Central Pulse Core
      const corePulse = 18 + Math.sin(time * 2) * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, corePulse + 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 118, 110, 0.35)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, corePulse, 0, Math.PI * 2);
      ctx.fillStyle = '#0F766E';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, corePulse - 8, 0, Math.PI * 2);
      ctx.fillStyle = '#72F4D1';
      ctx.fill();

      // Render Active Ecosystem Nodes
      nodes.forEach((node, idx) => {
        const curAngle = node.angle + (prefersReducedMotion ? 0 : time * 0.25);
        const nx = cx + Math.cos(curAngle) * node.radius;
        const ny = cy + Math.sin(curAngle) * node.radius;

        // Line connecting to core
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = 'rgba(114, 244, 209, 0.14)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node Halo
        ctx.beginPath();
        ctx.arc(nx, ny, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(11, 17, 27, 0.8)';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Typography labels
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.title, nx, ny + 22);

        ctx.fillStyle = '#94A3B8';
        ctx.font = '10px system-ui, -apple-system, sans-serif';
        ctx.fillText(node.subtitle, nx, ny + 35);
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-[90vh] lg:min-h-screen flex flex-col items-center justify-between pt-10 sm:pt-16 pb-12 overflow-hidden select-none bg-[#060B12]"
    >
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Hero Header Narrative */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
          Your Future. In Motion.
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed">
          The unified campus recruitment platform connecting ambitious students, top enterprise employers, and university placement teams.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115e59] text-white font-semibold text-sm transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 border border-[#72F4D1]/40"
          >
            <span>Register as Student</span>
            <ArrowRight className="w-4 h-4 text-[#72F4D1]" />
          </Link>

          <Link
            to="/login"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white font-semibold text-sm transition-all duration-150 active:scale-[0.98] border border-white/10 flex items-center justify-center gap-2"
          >
            <span>Sign In to Portal</span>
          </Link>
        </div>
      </div>

      {/* Visually Dominant Central Canvas Experience */}
      <div className="relative z-10 w-full max-w-5xl h-[420px] sm:h-[500px] lg:h-[560px] my-4 flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

        {/* Floating Real-Time Telemetry HUD: Left Node */}
        <div data-ui="hero-hud-left" className="absolute top-8 left-4 sm:left-8 hidden md:block pointer-events-none">
          <div className="bg-[#0B111B]/95 backdrop-blur-md rounded-2xl p-4 max-w-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-teal-300">
                Eligibility engine
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-sm font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/30">
                QUALIFIED
              </span>
            </div>
            <p className="text-sm font-bold text-white">Aarav Sharma • Class 2026</p>
            <p className="text-sm text-slate-300">
              NovaTech SWE Cutoff Satisfied (CGPA: 8.85 $\ge$ 8.00, 0 Backlogs)
            </p>
          </div>
        </div>

        {/* Floating Real-Time Telemetry HUD: Right Node */}
        <div data-ui="hero-hud-right" className="absolute bottom-8 right-4 sm:right-8 hidden md:block pointer-events-none">
          <div className="bg-[#0B111B]/95 backdrop-blur-md rounded-2xl p-4 max-w-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-cyan-300">
                Placement command
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-sm font-bold text-teal-300 bg-teal-950 border border-teal-500/30">
                DRIVE ACTIVE
              </span>
            </div>
            <p className="text-sm font-bold text-white">55.0% Batch Placement Rate</p>
            <p className="text-sm text-slate-300">
              11 of 20 Candidates Placed • ₹14.0 LPA Avg Package
            </p>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Cue */}
      <a
        href="#platform"
        className="relative z-20 flex flex-col items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <span>Explore Recruitment Platform</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#72F4D1]" />
      </a>
    </section>
  );
};
