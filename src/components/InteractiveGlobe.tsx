import React, { useEffect, useRef } from 'react';
import AnimatedStrings from './AnimatedStrings';

// Bounding box continent checker for a stylized world globe
const isEarthLand = (lat: number, lon: number) => {
  // Africa
  if (lat >= -35 && lat <= 37 && lon >= -17 && lon <= 51) {
    if (lat >= -5 && lat <= 15 && lon >= -10 && lon <= 10) return false; // Gulf of Guinea
    return true;
  }
  // Europe
  if (lat >= 36 && lat <= 70 && lon >= -10 && lon <= 40) return true;
  // Asia (Mainland)
  if (lat >= 5 && lat <= 75 && lon >= 40 && lon <= 180) return true;
  // India
  if (lat >= 8 && lat <= 30 && lon >= 68 && lon <= 90) return true;
  // Japan & Korea
  if (lat >= 30 && lat <= 45 && lon >= 125 && lon <= 145) return true;
  // Indonesia / Malaysia / Philippines
  if (lat >= -10 && lat <= 20 && lon >= 95 && lon <= 141) return true;
  // North America
  if (lat >= 15 && lat <= 75 && lon >= -170 && lon <= -55) return true;
  // Greenland
  if (lat >= 60 && lat <= 83 && lon >= -75 && lon <= -15) return true;
  // Central America
  if (lat >= 7 && lat <= 15 && lon >= -92 && lon <= -77) return true;
  // South America
  if (lat >= -55 && lat <= 15 && lon >= -82 && lon <= -35) {
    if (lat >= 5 && lon >= -50) return false;
    return true;
  }
  // Australia
  if (lat >= -45 && lat <= -10 && lon >= 113 && lon <= 153) return true;
  // New Zealand
  if (lat >= -47 && lat <= -34 && lon >= 166 && lon <= 179) return true;
  // Madagascar
  if (lat >= -25 && lat <= -12 && lon >= 43 && lon <= 51) return true;
  // Antarctica
  if (lat <= -60) return true;

  return false;
};

// Generate random particles for the wave transition at the bottom
const EXTRA_PARTICLES = Array.from({ length: 2000 }).map((_, index) => ({
  colOffset: (Math.random() - 0.5) * 100, // spread across columns
  rowOffset: Math.random() * 60, // scatter downwards
  speedOffset: Math.random() * 0.1,
  growthPotential: index < 10 ? 10 + Math.random() * 15 : Math.random() * 1.5
}));

type InteractiveGlobeProps = {
  variant?: 'default' | 'vivid';
};

const InteractiveGlobe: React.FC<InteractiveGlobeProps> = ({ variant = 'default' }) => {
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

    // Generate Globe Point grid parameters
    const latLines = 32;
    const lonLines = 64;
    const globePoints: {
      phi: number;
      theta: number;
      isLand: boolean;
      isMorocco: boolean;
      isSenegal: boolean;
    }[] = [];

    for (let i = 0; i < latLines; i++) {
      const phi = (Math.PI * (i + 1)) / (latLines + 1); // 0 to PI
      const latDeg = 90 - (phi * 180) / Math.PI; // +90 to -90
      
      for (let j = 0; j < lonLines; j++) {
        const theta = (2 * Math.PI * j) / lonLines; // 0 to 2PI
        const lonDeg = (theta * 180) / Math.PI - 180; // -180 to +180
        
        const morocco = (latDeg >= 28 && latDeg <= 36) && (lonDeg >= -13 && lonDeg <= -1);
        const senegal = (latDeg >= 12 && latDeg <= 17) && (lonDeg >= -18 && lonDeg <= -11);
        const land = isEarthLand(latDeg, lonDeg);

        globePoints.push({
          phi,
          theta,
          isLand: land || morocco || senegal,
          isMorocco: morocco,
          isSenegal: senegal
        });
      }
    }

    const render = () => {
      time += 0.015; // Animation speed for wave and rotation
      ctx.clearRect(0, 0, width, height);

      // Hero dimensions
      const heroHeight = height / 2.0;
      
      // Determine Globe center and radius
      const centerX = width / 2;
      const centerY = (heroHeight / 2) + 25; // Centered vertically in Hero space with slight vertical push
      const baseRadius = Math.max(130, Math.min(width * 0.35, heroHeight * 0.45, 230));

      // 1. Draw Globe Silhouette Ring (Glass-like thin contour)
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = variant === 'vivid' ? 'rgba(255, 107, 158, 0.12)' : 'rgba(233, 155, 169, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Rotation angle
      const rotationAngle = time * 0.08;

      // 2. Draw Globe particles
      for (const pt of globePoints) {
        // Wave Undulation Effect (Radial breathing wave)
        const wave = Math.sin(time * 2.0 + pt.phi * 8 + pt.theta * 4);
        const radiusOffset = wave * 2.5; 
        const currentRadius = baseRadius + radiusOffset;

        // Spherical 3D coordinates + Rotation around Y-axis
        const thetaRot = pt.theta + rotationAngle;
        const xRot = currentRadius * Math.sin(pt.phi) * Math.cos(thetaRot);
        const yRot = currentRadius * Math.cos(pt.phi);
        const zRot = currentRadius * Math.sin(pt.phi) * Math.sin(thetaRot);

        // Apply Earth Axis Tilt (-23.4 degrees = -0.4 radians around Z-axis)
        const tilt = -0.4;
        const xFinal = xRot * Math.cos(tilt) - yRot * Math.sin(tilt);
        const yFinal = xRot * Math.sin(tilt) + yRot * Math.cos(tilt);
        const zFinal = zRot;

        // Project 3D to 2D
        const x = centerX + xFinal;
        const y = centerY + yFinal;

        // Depth Check: Front facing vs Back facing
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
            const pointKey = `${pt.phi.toFixed(2)}-${pt.theta.toFixed(2)}`;
            if (lastVibratedPoint !== pointKey) {
              lastVibratedPoint = pointKey;
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(8);
              }
            }
          }
        }

        // Particle Styling (Land vs Water)
        let radius = pt.isLand ? 1.6 : 0.8;
        let alpha = pt.isLand ? (0.32 + wave * 0.1) : 0.06;

        let rC = 200, gC = 190, bC = 190; // Default muted grey/pink

        if (variant === 'vivid') {
          rC = 255; gC = 107; bC = 158; // Pinkish vivid
          alpha = pt.isLand ? (0.42 + wave * 0.15) : 0.08;
        }

        // Highlight regions (Morocco / Senegal)
        if (pt.isMorocco || pt.isSenegal) {
          if (variant === 'vivid') {
            rC = 255; gC = 80; bC = 130;
          } else {
            rC = 233; gC = 155; bC = 169; // #e99ba9
          }
          radius = 3.5;
          alpha = 0.8 + wave * 0.15;
        }

        // Back-face styling (creates translucent 3D sphere depth)
        if (!isFront) {
          alpha *= 0.15;
          radius *= 0.6;
        }

        // Mouse hover effects (front side only)
        if (isFront && hoverRatio > 0) {
          radius += hoverRatio * 3.5;
          alpha = Math.min(1, alpha + hoverRatio * 0.8);
          rC = 233; gC = 155; bC = 169; // Highlight color
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

export default InteractiveGlobe;
