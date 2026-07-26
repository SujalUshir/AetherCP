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

    // Mouse coordinates (Target & Eased for smooth lerping)
    const targetMouse = { x: -1000, y: -1000 };
    const easedMouse = { x: -1000, y: -1000 };

    // Velocity Tracking variables
    let lastMoveTime = Date.now();
    const lastMouse = { x: 0, y: 0 };
    let velocity = 0; // Current velocity
    let easedVelocity = 0; // Lerped velocity

    // Active state indicators (Smooth decay fade on mouseleave)
    let targetFade = 0;
    let easedFade = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // If mouse is just entering, snap eased position to mouse coordinates to prevent sliding lines
      if (targetMouse.x < -500) {
        easedMouse.x = e.clientX;
        easedMouse.y = e.clientY;
        lastMouse.x = e.clientX;
        lastMouse.y = e.clientY;
      }
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
      targetFade = 1.0;

      // Track velocity
      const now = Date.now();
      const dt = now - lastMoveTime;
      if (dt > 0) {
        const dx = e.clientX - lastMouse.x;
        const dy = e.clientY - lastMouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Instantaneous speed (pixels per millisecond)
        const instantVelocity = dist / dt;
        velocity += (instantVelocity - velocity) * 0.15;
      }
      lastMoveTime = now;
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      targetMouse.x = -1000;
      targetMouse.y = -1000;
      targetFade = 0.0; // Decay to 0 over 300-500ms
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    const GRID_SIZE = 14; // Tight square cells

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, width, height);

      // Lerp mouse coordinates
      if (targetMouse.x > -500) {
        easedMouse.x += (targetMouse.x - easedMouse.x) * 0.08;
        easedMouse.y += (targetMouse.y - easedMouse.y) * 0.08;
      }
      
      // Lerp active fade multiplier (provides 300-500ms smooth fade-out: 1.0 -> 0.7 -> 0.4 -> 0.15 -> 0.0)
      easedFade += (targetFade - easedFade) * 0.09;
      
      // Decelerate velocity gradually if mouse is stationary
      velocity *= 0.95;
      easedVelocity += (velocity - easedVelocity) * 0.08;

      // Dynamic influence parameters based on velocity
      // Moving quickly -> wider influence radius, softer intensity
      // Moving slowly -> tighter focus radius, darker intensity
      const speedFactor = Math.min(1.0, easedVelocity * 0.4); // reduced velocity range mapping
      
      // Interpolate radius: 110px when slow -> 150px when fast (subtle variation)
      const hoverRadius = 110 + speedFactor * 40;
      
      // Interpolate max cell tint opacity: 0.026 when slow -> 0.010 when fast (increased intensity by 30%)
      const maxCellOpacity = 0.026 - speedFactor * 0.016;

      // Draw hover cells (warm caramel tint) if active fade multiplier > 0.01
      if (easedFade > 0.01) {
        const startCol = Math.max(0, Math.floor((easedMouse.x - hoverRadius) / GRID_SIZE));
        const endCol = Math.min(Math.ceil(width / GRID_SIZE), Math.floor((easedMouse.x + hoverRadius) / GRID_SIZE));
        const startRow = Math.max(0, Math.floor((easedMouse.y - hoverRadius) / GRID_SIZE));
        const endRow = Math.min(Math.ceil(height / GRID_SIZE), Math.floor((easedMouse.y + hoverRadius) / GRID_SIZE));

        for (let col = startCol; col <= endCol; col++) {
          for (let row = startRow; row <= endRow; row++) {
            const cellX = col * GRID_SIZE;
            const cellY = row * GRID_SIZE;

            const centerX = cellX + GRID_SIZE / 2;
            const centerY = cellY + GRID_SIZE / 2;
            const dx = easedMouse.x - centerX;
            const dy = easedMouse.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < hoverRadius) {
              const distanceFactor = 1 - distance / hoverRadius;
              const cellOpacity = Math.pow(distanceFactor, 2) * maxCellOpacity * easedFade;

              // Cell Background fill (caramel tone tint)
              ctx.fillStyle = `rgba(139, 79, 41, ${cellOpacity})`;
              ctx.fillRect(cellX, cellY, GRID_SIZE, GRID_SIZE);
            }
          }
        }
      }

      // Draw Grid Lines (0.35px thickness)
      ctx.lineWidth = 0.35;
      
      // Vertical Grid Lines
      for (let x = 0; x <= width; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        
        let alpha = 0.01; // Base grid opacity (subtle texture background)
        if (easedFade > 0.01) {
          const dist = Math.abs(x - easedMouse.x);
          if (dist < hoverRadius) {
            const distanceFactor = 1 - dist / hoverRadius;
            // Warm magnetic darkening of vertical lines near cursor (increased by 50%)
            alpha = 0.01 + (distanceFactor * 0.018) * easedFade;
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

        let alpha = 0.01; // Base grid opacity (subtle texture background)
        if (easedFade > 0.01) {
          const dist = Math.abs(y - easedMouse.y);
          if (dist < hoverRadius) {
            const distanceFactor = 1 - dist / hoverRadius;
            // Warm magnetic darkening of horizontal lines near cursor (increased by 50%)
            alpha = 0.01 + (distanceFactor * 0.018) * easedFade;
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
