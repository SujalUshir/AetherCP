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

    const GRID_SIZE = 12; // Size of each grid square in pixels (4x smaller for refined look)
    const HOVER_RADIUS = 120; // Distance of influence from the mouse

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw highlighted grid cells under/near the mouse first
      if (mouse.x > -1000) {
        const startCol = Math.max(0, Math.floor((mouse.x - HOVER_RADIUS) / GRID_SIZE));
        const endCol = Math.min(Math.ceil(width / GRID_SIZE), Math.floor((mouse.x + HOVER_RADIUS) / GRID_SIZE));
        const startRow = Math.max(0, Math.floor((mouse.y - HOVER_RADIUS) / GRID_SIZE));
        const endRow = Math.min(Math.ceil(height / GRID_SIZE), Math.floor((mouse.y + HOVER_RADIUS) / GRID_SIZE));

        for (let col = startCol; col <= endCol; col++) {
          for (let row = startRow; row <= endRow; row++) {
            const cellX = col * GRID_SIZE;
            const cellY = row * GRID_SIZE;
            
            // Calculate center of cell
            const centerX = cellX + GRID_SIZE / 2;
            const centerY = cellY + GRID_SIZE / 2;
            
            // Calculate distance to mouse
            const dx = mouse.x - centerX;
            const dy = mouse.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < HOVER_RADIUS) {
              const factor = 1 - distance / HOVER_RADIUS;
              // Subtly darken the cell with warm richer brand tone
              ctx.fillStyle = `rgba(139, 79, 41, ${factor * 0.018})`;
              ctx.fillRect(cellX, cellY, GRID_SIZE, GRID_SIZE);
            }
          }
        }
      }

      // 2. Draw vertical grid lines
      for (let x = 0; x <= width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);

        let alpha = 0.015; // Subtle base lines
        if (mouse.x > -1000) {
          const dist = Math.abs(x - mouse.x);
          if (dist < HOVER_RADIUS) {
            alpha = 0.015 + (1 - dist / HOVER_RADIUS) * 0.015;
          }
        }

        ctx.strokeStyle = `rgba(139, 79, 41, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // 3. Draw horizontal grid lines
      for (let y = 0; y <= height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);

        let alpha = 0.015; // Subtle base lines
        if (mouse.y > -1000) {
          const dist = Math.abs(y - mouse.y);
          if (dist < HOVER_RADIUS) {
            alpha = 0.015 + (1 - dist / HOVER_RADIUS) * 0.015;
          }
        }

        ctx.strokeStyle = `rgba(139, 79, 41, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

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
    />
  );
}
