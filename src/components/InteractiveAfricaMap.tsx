import React, { useEffect, useRef } from 'react';

// Base low-res map of Africa
const BASE_GRID = [
  "                 xxxxxxxx               ",
  "             xxxxxxxxxxxxxxx            ",
  "           xxxxxxxxxxxxxxxxxxxx         ", 
  "         xxxxxxxxxxxxxxxxxxxxxxxx       ",
  "       xxxxxxxxxxxxxxxxxxxxxxxxxxx      ", // Morocco area
  "      xxxxxxxxxxxxxxxxxxxxxxxxxxxxx     ",
  "     xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    ", 
  "    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   ", // Senegal area
  "    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   ",
  "     xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   ",
  "       xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  ",
  "         xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx ", // Horn of Africa
  "             xxxxxxxxxxxxxxxxxxxxxxxxxx ",
  "              xxxxxxxxxxxxxxxxxxxxxxxxx ",
  "              xxxxxxxxxxxxxxxxxxxxxxx   ",
  "               xxxxxxxxxxxxxxxxxxxxx    ",
  "               xxxxxxxxxxxxxxxxxxxx     ",
  "               xxxxxxxxxxxxxxxxxxx      ",
  "                xxxxxxxxxxxxxxxx        ",
  "                xxxxxxxxxxxxxxx    xx   ", // Madagascar
  "                 xxxxxxxxxxxxx    xxxx  ",
  "                 xxxxxxxxxxxxx     xx   ",
  "                  xxxxxxxxxxx           ",
  "                  xxxxxxxxxx            ",
  "                   xxxxxxxx             ",
  "                   xxxxxxx              ",
  "                    xxxxx               ",
  "                     xxx                "
];

// We will programmatically double the resolution to get a dense particle grid
const getHighResGrid = () => {
  const grid: string[] = [];
  for (let r = 0; r < BASE_GRID.length; r++) {
    let row1 = "";
    let row2 = "";
    for (let c = 0; c < BASE_GRID[r].length; c++) {
      const char = BASE_GRID[r][c];
      row1 += char === 'x' ? 'xx' : '  ';
      row2 += char === 'x' ? 'xx' : '  ';
    }
    grid.push(row1);
    grid.push(row2);
  }
  return grid;
};

const HIGH_RES_GRID = getHighResGrid();

// Rough highlights on the HIGH_RES grid
// Morocco was around row 4, col 7 on low-res -> row 8-9, col 14-15 on high-res
// Senegal was around row 7, col 4 on low-res -> row 14-15, col 8-9 on high-res
const isHighlight = (r: number, c: number) => {
  const isMorocco = (r >= 8 && r <= 11) && (c >= 13 && c <= 17);
  const isSenegal = (r >= 14 && r <= 17) && (c >= 7 && c <= 11);
  return isMorocco || isSenegal;
};

// Generate random particles for the wave transition at the bottom
const EXTRA_PARTICLES = Array.from({ length: 2000 }).map((_, index) => ({
  colOffset: (Math.random() - 0.5) * 100, // spread across 100 columns
  rowOffset: Math.random() * 60, // scatter downwards over 60 rows
  speedOffset: Math.random() * 0.1,
  // Exactly 10 points will have massive growth potential, the rest stay small
  growthPotential: index < 10 ? 10 + Math.random() * 15 : Math.random() * 1.5
}));

const InteractiveAfricaMap: React.FC = () => {
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
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    let animationFrameId: number;
    let time = 0;

    const rows = HIGH_RES_GRID.length;
    const cols = HIGH_RES_GRID[0].length;

    const render = () => {
      time += 0.03; // Wave speed
      ctx.clearRect(0, 0, width, height);

      // Determine the ideal gap and map bounds
      // The canvas is 200% of the Hero height, so the "Hero" height is height / 2.0
      const heroHeight = height / 2.0;
      const mapHeight = heroHeight * 0.8;
      const gap = mapHeight / rows;
      const mapWidth = cols * gap;

      // Center the map in the Hero's vertical space
      const offsetX = (width - mapWidth) / 2;
      const offsetY = (heroHeight - mapHeight) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (HIGH_RES_GRID[r][c] === 'x') {
            const baseX = offsetX + c * gap;
            const baseY = offsetY + r * gap;

            // 1. Math Wave (Ocean effect)
            const wave = Math.sin(time + c * 0.1 + r * 0.1);
            const yOffset = wave * (gap * 0.5); // move up/down
            
            const x = baseX;
            const y = baseY + yOffset;

            // 2. Mouse Interaction
            const dx = mouseX - x;
            const dy = mouseY - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const maxDist = 120; // radius of mouse light
            let hoverRatio = 0;
            if (dist < maxDist) {
              hoverRatio = 1 - (dist / maxDist);
            }

            // 3. Highlight Check
            const highlighted = isHighlight(r, c);

            // Determine radius & color
            let radius = gap * 0.15; // default small dot
            
            // Base color is a muted pink/grey matching the background
            let rC = 200, gC = 190, bC = 190;
            let alpha = 0.3 + wave * 0.2; // pulse alpha slightly

            if (highlighted) {
              // Highlighted regions (Senegal & Morocco) glow pink/orange
              rC = 233; gC = 155; bC = 169; // #e99ba9
              alpha = 0.8 + wave * 0.2;
              radius = gap * 0.25;
            }

            if (hoverRatio > 0) {
              // Mouse hover makes it glow brightly and get bigger
              radius += hoverRatio * (gap * 0.4);
              alpha = Math.min(1, alpha + hoverRatio);
              rC = 233; gC = 155; bC = 169; // Turns pinkish on hover
            }

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rC}, ${gC}, ${bC}, ${alpha})`;
            ctx.fill();
          }
        }
      }

      // 4. Draw extra scattered particles for the transition wave
      for (const p of EXTRA_PARTICLES) {
        // Position them starting exactly below the Hero section
        const baseX = offsetX + (cols / 2 + p.colOffset) * gap;
        const baseY = heroHeight + (p.rowOffset * gap);
        
        const wave = Math.sin(time * (0.5 + p.speedOffset) + p.colOffset * 0.1 + p.rowOffset * 0.05);
        const yOffset = wave * (gap * 3); // Bigger wave movement for scattered points

        const x = baseX;
        const y = baseY + yOffset;

        // Strictly prevent particles from rendering inside the Hero section
        if (y < heroHeight) continue;

        // Mouse interaction
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let hoverRatio = 0;
        if (dist < 120) hoverRatio = 1 - (dist / 120);

        let radius = gap * 0.15; // default base size
        
        // Natural swelling: points grow ONLY when the wave peaks over them
        if (wave > 0) {
          // Square the wave to make the swelling smoother and the peak sharper
          radius += (wave * wave) * (gap * 0.2 * p.growthPotential);
        }
        
        radius = Math.max(0.5, radius); // Prevent negative radius
        
        // Fade out as they go further down
        let baseAlpha = Math.max(0, 0.6 - (p.rowOffset / 80));
        let alpha = baseAlpha * (0.3 + wave * 0.7);
        
        // Color is pink (#e99ba9) for the transition wave
        let rC = 233, gC = 155, bC = 169;
        
        if (hoverRatio > 0) {
          radius += hoverRatio * (gap * 0.4);
          alpha = Math.min(1, alpha + hoverRatio);
          // Keep pink, just make it brighter/more opaque
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
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-[200%] z-0 pointer-events-auto"
      style={{ touchAction: 'none' }}
    />
  );
};

export default InteractiveAfricaMap;
