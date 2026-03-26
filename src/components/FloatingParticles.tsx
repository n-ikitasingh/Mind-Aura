import React, { useEffect, useRef } from 'react';

const FloatingParticles: React.FC<{ count?: number }> = ({ count = 30 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; r: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    const style = getComputedStyle(document.documentElement);
    const getAccentColor = () => {
      const h = style.getPropertyValue('--accent-h').trim() || '170';
      const s = style.getPropertyValue('--accent-s').trim() || '48%';
      const l = style.getPropertyValue('--accent-l').trim() || '33%';
      return `hsla(${h}, ${s}, ${l},`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const colorBase = getAccentColor();

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${colorBase}${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

export default FloatingParticles;
