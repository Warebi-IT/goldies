import React, { useEffect, useRef } from 'react';

// Generate random particles for the wave transition at the bottom
const EXTRA_PARTICLES = Array.from({ length: 2000 }).map((_, index) => ({
  colOffset: (Math.random() - 0.5) * 100, // spread across columns
  rowOffset: Math.random() * 60, // scatter downwards
  speedOffset: Math.random() * 0.1,
  growthPotential: index < 10 ? 10 + Math.random() * 15 : Math.random() * 1.5
}));

type InteractiveHeartProps = {
  variant?: 'default' | 'vivid';
};

const InteractiveHeart: React.FC<InteractiveHeartProps> = ({ variant = 'default' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    // Set actual canvas resolution to match display size for crisp rendering
    const setSize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    setSize();
    window.addEventListener('resize', setSize);

    // Mouse tracking
    let mouseX = -1000;
    let mouseY = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchstart', handleTouchMove, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleMouseLeave);
    canvas.addEventListener('touchcancel', handleMouseLeave);

    let animationFrameId: number;
    let time = 0;
    let lastVibratedPoint = "";

    // Generate 3D Heart Points parameters
    // We sample v (from 0 to PI) and u (from 0 to 2PI).
    // To maintain a relatively uniform density, the number of u samples is proportional to sin(v).
    const vLines = 40;
    const uLinesMax = 70;
    const heartPoints: { u: number; v: number }[] = [];

    for (let j = 0; j < vLines; j++) {
      const v = (Math.PI * j) / (vLines - 1);
      const uCount = Math.max(4, Math.round(uLinesMax * Math.sin(v)));
      for (let i = 0; i < uCount; i++) {
        const u = (2 * Math.PI * i) / uCount;
        heartPoints.push({ u, v });
      }
    }

    const render = () => {
      time += 0.015; // Animation speed for heartbeat, wave, and rotation
      ctx.clearRect(0, 0, width, height);

      // Hero dimensions
      const heroHeight = height / 2.0;
      
      // Determine Heart center and radius
      const centerX = width / 2;
      const centerY = (heroHeight / 2) + 25; // Centered vertically with slight vertical push
      const baseRadius = Math.max(130, Math.min(width * 0.35, heroHeight * 0.45, 230));

      // 1. Draw Heart Silhouette Ring (Glass-like thin contour)
      // Pulsing heartbeat for the silhouette as well
      const beatCycle = time * 5.0;
      const heartbeat = Math.max(0, Math.sin(beatCycle) * 0.6 + Math.sin(beatCycle * 2) * 0.4);
      const pulse = 0.96 + heartbeat * 0.08;
      const currentRadius = baseRadius * pulse;

      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
      ctx.strokeStyle = variant === 'vivid' ? 'rgba(255, 107, 158, 0.1)' : 'rgba(233, 155, 169, 0.12)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Rotation angle
      const rotationAngle = time * 0.35; // Rotates around vertical Y-axis

      // 2. Draw Heart particles
      for (const pt of heartPoints) {
        // Wave Undulation Effect (Radial breathing wave)
        const wave = Math.sin(time * 2.5 + pt.u * 4 + pt.v * 6);
        const radiusOffset = wave * 2.0; 
        const heartScale = currentRadius + radiusOffset;

        // Base 3D heart coordinates scaled to fit [-1, 1] range roughly
        // 3D parametric heart equations:
        // x = sin(v) * (15*sin(u) - 4*sin(3*u)) / 16
        // y = -sin(v) * (15*cos(u) - 5*cos(2*u) - 2*cos(3*u) - cos(4*u)) / 16  (negative to keep tip pointing down)
        // z = 8*cos(v) / 16  (thickness / depth)
        const xBase = Math.sin(pt.v) * (15 * Math.sin(pt.u) - 4 * Math.sin(3 * pt.u)) / 16;
        const zParam = Math.sin(pt.v) * (15 * Math.cos(pt.u) - 5 * Math.cos(2 * pt.u) - 2 * Math.cos(3 * pt.u) - Math.cos(4 * pt.u)) / 16;
        const yBase = -zParam; // invert Z-parameter to make heart upright in screen space (Y goes down)
        const zBase = (8 * Math.cos(pt.v)) / 16;

        // Rotate around Y-axis (spinning)
        const xRot = xBase * Math.cos(rotationAngle) - zBase * Math.sin(rotationAngle);
        const zRot = xBase * Math.sin(rotationAngle) + zBase * Math.cos(rotationAngle);
        const yRot = yBase;

        // Apply a slight pitch (tilt forward around X-axis by 0.25 radians)
        // so the top cleft of the heart is visible from above, highlighting 3D volume
        const pitch = 0.25;
        const yPitch = yRot * Math.cos(pitch) - zRot * Math.sin(pitch);
        const zPitch = yRot * Math.sin(pitch) + zRot * Math.cos(pitch);
        const xPitch = xRot;

        // Apply a slight roll (tilt sideways around Z-axis by -0.15 radians)
        const roll = -0.15;
        const xFinal = xPitch * Math.cos(roll) - yPitch * Math.sin(roll);
        const yFinal = xPitch * Math.sin(roll) + yPitch * Math.cos(roll);
        const zFinal = zPitch;

        // Project 3D to 2D
        const x = centerX + xFinal * heartScale;
        const y = centerY + yFinal * heartScale;

        // Depth Check: Front facing vs Back facing (zFinal represents depth)
        const isFront = zFinal > 0;

        // Distance from mouse
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let hoverRatio = 0;
        const maxDist = 90;

        if (isFront && dist < maxDist) {
          hoverRatio = 1 - (dist / maxDist);

          // Haptic crackling vibration on point intersection
          if (dist < 8) {
            const pointKey = `${pt.u.toFixed(2)}-${pt.v.toFixed(2)}`;
            if (lastVibratedPoint !== pointKey) {
              lastVibratedPoint = pointKey;
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(8);
              }
            }
          }
        }

        // Particle Styling
        // Vary base size to create a glittering star-like texture
        const baseSize = 1.3 + (Math.sin(pt.u * 12 + pt.v * 6) * 0.4);
        let radius = baseSize;
        let alpha = 0.35 + wave * 0.12;

        // Colors: gradient transition based on position for a premium look
        const colorShift = Math.sin(pt.u + pt.v);
        let rC = 233 + Math.round(colorShift * 15); 
        let gC = 155 + Math.round(colorShift * 20); 
        let bC = 169 + Math.round(colorShift * 10);

        if (variant === 'vivid') {
          rC = 255; gC = 107; bC = 158; // Vivid pink base
          alpha = 0.45 + wave * 0.15;
        }

        // Back-face styling (creates translucent 3D sphere/heart depth)
        if (!isFront) {
          alpha *= 0.22;
          radius *= 0.65;
        }

        // Mouse hover effects (front side only)
        if (isFront && hoverRatio > 0) {
          radius += hoverRatio * 4.0;
          alpha = Math.min(1.0, alpha + hoverRatio * 0.8);
          // Highlight colors - shift towards golden orange/citra-orange
          rC = Math.min(255, rC + Math.round(hoverRatio * 40));
          gC = Math.min(255, gC + Math.round(hoverRatio * 60));
          bC = Math.min(255, bC + Math.round(hoverRatio * 20));
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rC}, ${gC}, ${bC}, ${alpha})`;
        ctx.fill();
      }

      // 3. Draw extra scattered transition particles at the bottom
      const extraGap = Math.max(6, Math.min(width / 80, 12));
      for (const p of EXTRA_PARTICLES) {
        const baseX = centerX + (p.colOffset * extraGap);
        const baseY = heroHeight + (p.rowOffset * extraGap);

        const wave = Math.sin(time * 2.0 * (0.5 + p.speedOffset) + p.colOffset * 0.1 + p.rowOffset * 0.05);
        const yOffset = wave * (extraGap * 3);

        const x = baseX;
        const y = baseY + yOffset;

        if (y < heroHeight) continue;

        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let hoverRatio = 0;
        if (dist < 120) hoverRatio = 1 - (dist / 120);

        let radius = extraGap * 0.15;

        if (wave > 0) {
          radius += (wave * wave) * (extraGap * 0.2 * p.growthPotential);
        }
        radius = Math.max(0.5, radius);

        let baseAlpha = Math.max(0, 0.6 - (p.rowOffset / 80));
        let alpha = baseAlpha * (0.3 + wave * 0.7);

        let rC = variant === 'vivid' ? 255 : 233;
        let gC = variant === 'vivid' ? 107 : 155;
        let bC = variant === 'vivid' ? 158 : 169;

        if (hoverRatio > 0) {
          radius += hoverRatio * (extraGap * 0.4);
          alpha = Math.min(1, alpha + hoverRatio);
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rC}, ${gC}, ${bC}, ${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchstart', handleTouchMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleMouseLeave);
      canvas.removeEventListener('touchcancel', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-[200%] z-0 pointer-events-auto"
    />
  );
};

export default InteractiveHeart;
