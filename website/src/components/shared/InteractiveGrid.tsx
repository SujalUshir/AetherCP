"use client";

import { useEffect, useRef } from "react";

export function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates relative to viewport
    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    const GRID_SIZE = 50; // Size of each grid square in pixels

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);

      // We draw thin, subtle lines.
      // Base line opacity: 0.025
      // Active line opacity near mouse: up to 0.09
      
      const drawGridLines = () => {
        // Draw vertical lines
        for (let x = 0; x < width; x += GRID_SIZE) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);

          // Calculate distance from mouse to vertical line
          const dist = Math.abs(x - mouse.x);
          let alpha = 0.025; // Base subtle opacity

          if (mouse.x > -1000 && dist < 250) {
            // Stronger gradient closer to mouse client y
            const factor = 1 - dist / 250;
            alpha = 0.025 + factor * 0.065;
          }

          ctx.strokeStyle = `rgba(240, 235, 216, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y < height; y += GRID_SIZE) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);

          // Calculate distance from mouse to horizontal line
          const dist = Math.abs(y - mouse.y);
          let alpha = 0.025; // Base subtle opacity

          if (mouse.y > -1000 && dist < 250) {
            const factor = 1 - dist / 250;
            alpha = 0.025 + factor * 0.065;
          }

          ctx.strokeStyle = `rgba(240, 235, 216, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      };

      drawGridLines();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-50 h-full w-full bg-transparent"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
