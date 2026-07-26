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

    // Track coordinates with Target and Eased values for smooth lerp
    const targetMouse = { x: -1000, y: -1000 };
    const easedMouse = { x: -1000, y: -1000 };
    
    // Smoothly transition the hover radius for organic fade-in/out
    let targetRadius = 0;
    let easedRadius = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // If first entry, snap eased mouse to avoid sliding from screen corners
      if (targetMouse.x < -500) {
        easedMouse.x = e.clientX;
        easedMouse.y = e.clientY;
      }
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
      targetRadius = 140; // Max influence radius
    };

    const handleMouseLeave = () => {
      targetMouse.x = -1000;
      targetMouse.y = -1000;
      targetRadius = 0; // Decay radius to 0 for natural fade-back
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    const GRID_SIZE = 14; // Refined smaller cell grid size
    let time = 0;

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);
      time += 0.04;

      // Smoothly update eased coordinates (lerp)
      if (targetMouse.x > -500) {
        easedMouse.x += (targetMouse.x - easedMouse.x) * 0.08;
        easedMouse.y += (targetMouse.y - easedMouse.y) * 0.08;
      }
      easedRadius += (targetRadius - easedRadius) * 0.06;

      // Draw active hover cell ripples & intersection points if active
      if (easedRadius > 1) {
        const startCol = Math.max(0, Math.floor((easedMouse.x - easedRadius) / GRID_SIZE));
        const endCol = Math.min(Math.ceil(width / GRID_SIZE), Math.floor((easedMouse.x + easedRadius) / GRID_SIZE));
        const startRow = Math.max(0, Math.floor((easedMouse.y - easedRadius) / GRID_SIZE));
        const endRow = Math.min(Math.ceil(height / GRID_SIZE), Math.floor((easedMouse.y + easedRadius) / GRID_SIZE));

        for (let col = startCol; col <= endCol; col++) {
          for (let row = startRow; row <= endRow; row++) {
            const cellX = col * GRID_SIZE;
            const cellY = row * GRID_SIZE;

            // Distance from eased cursor to center of cell
            const centerX = cellX + GRID_SIZE / 2;
            const centerY = cellY + GRID_SIZE / 2;
            const dx = easedMouse.x - centerX;
            const dy = easedMouse.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < easedRadius) {
              const baseFactor = 1 - distance / easedRadius;
              // Soft periodic ripple wave propagating outwards
              const rippleFactor = Math.sin(distance * 0.08 - time * 1.5) * 0.3 + 0.7;
              const intensity = Math.pow(baseFactor, 2) * rippleFactor;

              // Cell Background fill (caramel tone)
              ctx.fillStyle = `rgba(139, 79, 41, ${intensity * 0.016})`;
              ctx.fillRect(cellX, cellY, GRID_SIZE, GRID_SIZE);

              // Intersection Dot at cell top-left intersection
              const dotDistX = easedMouse.x - cellX;
              const dotDistY = easedMouse.y - cellY;
              const dotDistance = Math.sqrt(dotDistX * dotDistX + dotDistY * dotDistY);
              if (dotDistance < easedRadius) {
                const dotFactor = Math.pow(1 - dotDistance / easedRadius, 3);
                ctx.beginPath();
                ctx.arc(cellX, cellY, 1.25, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 79, 41, ${dotFactor * 0.08})`;
                ctx.fill();
              }
            }
          }
        }
      }

      // Draw Grid Lines (extremely low opacity, 0.35px thickness)
      ctx.lineWidth = 0.35;
      
      // Vertical Grid Lines
      for (let x = 0; x <= width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        
        let alpha = 0.012; // Extremely low base line opacity
        if (easedRadius > 1) {
          const dist = Math.abs(x - easedMouse.x);
          if (dist < easedRadius) {
            alpha = 0.012 + (1 - dist / easedRadius) * 0.015;
          }
        }

        ctx.strokeStyle = `rgba(139, 79, 41, ${alpha})`;
        ctx.stroke();
      }

      // Horizontal Grid Lines
      for (let y = 0; y <= height; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);

        let alpha = 0.012; // Extremely low base line opacity
        if (easedRadius > 1) {
          const dist = Math.abs(y - easedMouse.y);
          if (dist < easedRadius) {
            alpha = 0.012 + (1 - dist / easedRadius) * 0.015;
          }
        }

        ctx.strokeStyle = `rgba(139, 79, 41, ${alpha})`;
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
