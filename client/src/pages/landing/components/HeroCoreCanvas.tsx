import React, { useEffect, useRef, useState } from 'react';

interface HeroCoreCanvasProps {
  onNodeClick?: (nodeId: string) => void;
}

export const HeroCoreCanvas: React.FC<HeroCoreCanvasProps> = ({ onNodeClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isVisible = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Responsive dimensions
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement with momentum interpolation
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      mousePos.current.targetX = Math.max(-1, Math.min(1, nx)) * 30;
      mousePos.current.targetY = Math.max(-1, Math.min(1, ny)) * 30;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Observer to pause when offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    // Nodes in the ecosystem
    const nodes = [
      {
        id: 'student',
        label: 'VERIFIED STUDENTS',
        sub: 'Aarav Sharma • 8.85 CGPA',
        angle: 0,
        distance: 170,
        color: '#72F4D1',
        glow: 'rgba(114, 244, 209, 0.4)',
      },
      {
        id: 'jobs',
        label: 'OPPORTUNITY MATRIX',
        sub: '6 Active Enterprise Drives',
        angle: Math.PI * 0.5,
        distance: 170,
        color: '#59D9FF',
        glow: 'rgba(89, 217, 255, 0.4)',
      },
      {
        id: 'recruiter',
        label: 'TALENT EVALUATION',
        sub: 'Priya Nair • NovaTech Systems',
        angle: Math.PI,
        distance: 170,
        color: '#72F4D1',
        glow: 'rgba(114, 244, 209, 0.4)',
      },
      {
        id: 'admin',
        label: 'INSTITUTIONAL T&P',
        sub: '55% Placed • NAAC Verified',
        angle: Math.PI * 1.5,
        distance: 170,
        color: '#F5F7FA',
        glow: 'rgba(245, 247, 250, 0.3)',
      },
    ];

    // Shimmering particle stream along orbital tracks
    const particles: Array<{
      track: number;
      angle: number;
      speed: number;
      size: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        track: 110 + (i % 3) * 60,
        angle: Math.random() * Math.PI * 2,
        speed: (0.003 + Math.random() * 0.005) * (i % 2 === 0 ? 1 : -1),
        size: 1 + Math.random() * 2,
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

      // Spring momentum interpolation for pointer position
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      const rect = canvas.getBoundingClientRect();
      const cx = rect.width / 2 + mousePos.current.x;
      const cy = rect.height / 2 + mousePos.current.y;

      ctx.clearRect(0, 0, rect.width, rect.height);

      // 1. Ambient Background Core Glow
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 280);
      bgGrad.addColorStop(0, 'rgba(15, 118, 110, 0.25)');
      bgGrad.addColorStop(0.5, 'rgba(11, 17, 27, 0.15)');
      bgGrad.addColorStop(1, 'rgba(6, 11, 18, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // 2. Orbital Concentric Rings
      [110, 170, 230].forEach((radius, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 1 ? 'rgba(114, 244, 209, 0.25)' : 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = idx === 1 ? 1.5 : 1;
        if (idx === 0) ctx.setLineDash([4, 6]);
        else ctx.setLineDash([]);
        ctx.stroke();
      });

      // 3. Shimmering Data Flow Particles
      particles.forEach((p) => {
        if (!prefersReducedMotion) p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.track;
        const py = cy + Math.sin(p.angle) * p.track;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(114, 244, 209, ${p.opacity})`;
        ctx.shadowColor = '#72F4D1';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 4. Central Quantum Recruitment Core
      const corePulse = Math.sin(time * 2) * 4;
      const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 38 + corePulse);
      coreGrad.addColorStop(0, '#72F4D1');
      coreGrad.addColorStop(0.4, '#0F766E');
      coreGrad.addColorStop(1, 'rgba(15, 118, 110, 0)');

      ctx.beginPath();
      ctx.arc(cx, cy, 38 + corePulse, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.fill();

      // Core Solid Center
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#72F4D1';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 5. Interconnecting Radial Energy Conduits to Orbiting Nodes
      nodes.forEach((node, i) => {
        const currentAngle = node.angle + (prefersReducedMotion ? 0 : time * 0.2);
        const nx = cx + Math.cos(currentAngle) * node.distance;
        const ny = cy + Math.sin(currentAngle) * node.distance;

        // Energy laser conduit from core to node
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.strokeStyle = activeNode === node.id ? 'rgba(114, 244, 209, 0.8)' : 'rgba(114, 244, 209, 0.2)';
        ctx.lineWidth = activeNode === node.id ? 2 : 1;
        ctx.stroke();

        // Cross-connect adjacent nodes to form the complete recruitment mesh
        const nextNode = nodes[(i + 1) % nodes.length];
        const nextAngle = nextNode.angle + (prefersReducedMotion ? 0 : time * 0.2);
        const nnx = cx + Math.cos(nextAngle) * nextNode.distance;
        const nny = cy + Math.sin(nextAngle) * nextNode.distance;

        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(nnx, nny);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node Glow Halo
        ctx.beginPath();
        ctx.arc(nx, ny, 16, 0, Math.PI * 2);
        ctx.fillStyle = node.glow;
        ctx.fill();

        // Node Outer Ring
        ctx.beginPath();
        ctx.arc(nx, ny, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#060B12';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fill();

        // Node Solid Pupil
        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node Typography Callout
        ctx.fillStyle = '#F5F7FA';
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, nx, ny + 24);

        ctx.fillStyle = '#8793A5';
        ctx.font = '9px system-ui, -apple-system, sans-serif';
        ctx.fillText(node.sub, nx, ny + 36);
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [activeNode]);

  return (
    <div data-ui="hero-core-canvas" ref={containerRef} className="relative w-full h-[480px] sm:h-[540px] flex items-center justify-center overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Floating Telemetry Chips Around the Core */}
      <div className="absolute top-6 left-4 sm:left-12 pointer-events-none transform -rotate-1 hidden sm:block animate-pulse duration-1000">
        <div className="bg-[#0B111B]/90 backdrop-blur-md border border-[#72F4D1]/30 rounded-lg px-3 py-2 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#72F4D1] animate-ping" />
            <span className="text-[10px] font-sans tracking-wider text-[#72F4D1] uppercase font-bold">Eligibility Engine</span>
          </div>
          <p className="text-xs font-semibold text-white mt-1">Aarav Sharma • 8.85 CGPA</p>
          <p className="text-[10px] text-slate-400">NovaTech SWE Cutoff Satisfied (Min: 8.00)</p>
        </div>
      </div>

      <div className="absolute bottom-8 right-4 sm:right-12 pointer-events-none transform rotate-1 hidden sm:block animate-pulse">
        <div className="bg-[#0B111B]/90 backdrop-blur-md border border-[#59D9FF]/30 rounded-lg px-3 py-2 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#59D9FF] animate-ping" />
            <span className="text-[10px] font-sans tracking-wider text-[#59D9FF] uppercase font-bold">Institutional Metrics</span>
          </div>
          <p className="text-xs font-semibold text-white mt-1">Class of 2026 • 55% Placed</p>
          <p className="text-[10px] text-slate-400">11 of 20 Students Selected in Drives</p>
        </div>
      </div>
    </div>
  );
};
