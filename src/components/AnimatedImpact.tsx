import React, { useMemo } from "react";

const AnimatedImpact = () => {
  // Generate random particles resembling fireflies / embers
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const size = Math.random() * 4 + 1; // 1px to 5px
      const left = Math.random() * 100; // 0% to 100%
      const animationDuration = Math.random() * 15 + 15; // 15s to 30s
      const animationDelay = Math.random() * -30; // Random start time
      const opacity = Math.random() * 0.6 + 0.2; // 0.2 to 0.8
      
      return { id: i, size, left, animationDuration, animationDelay, opacity };
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <style>
        {`
          @keyframes float-up {
            0% {
              transform: translateY(120vh) translateX(0) scale(0.5);
              opacity: 0;
            }
            10% {
              opacity: var(--max-opacity);
            }
            90% {
              opacity: var(--max-opacity);
            }
            100% {
              transform: translateY(-20vh) translateX(30px) scale(1.5);
              opacity: 0;
            }
          }
          @keyframes ripple-expand {
            0% { 
              transform: translate(-50%, -50%) scale(0.1); 
              opacity: 0.6; 
              border-width: 4px;
            }
            100% { 
              transform: translate(-50%, -50%) scale(2.5); 
              opacity: 0; 
              border-width: 1px;
            }
          }
          .particle {
            animation: float-up linear infinite;
          }
          .ripple-circle {
            animation: ripple-expand 14s cubic-bezier(0.1, 0.1, 0.3, 1) infinite;
          }
        `}
      </style>
      
      {/* Background ripples symbolizing "Impact" */}
      <div className="absolute top-1/2 left-[25%] w-[600px] h-[600px] rounded-full border-white/30 ripple-circle mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-[25%] w-[600px] h-[600px] rounded-full border-white/30 ripple-circle mix-blend-overlay" style={{ animationDelay: '4.6s' }}></div>
      <div className="absolute top-1/2 left-[25%] w-[600px] h-[600px] rounded-full border-white/30 ripple-circle mix-blend-overlay" style={{ animationDelay: '9.2s' }}></div>

      {/* Floating particles (Embers / Fireflies) */}
      <div className="mix-blend-screen opacity-70">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle absolute rounded-full bg-white"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              top: '-20%', // Starting position handled by animation
              animationDuration: `${p.animationDuration}s`,
              animationDelay: `${p.animationDelay}s`,
              boxShadow: `0 0 ${p.size * 2}px rgba(255, 255, 255, 0.8)`,
              '--max-opacity': p.opacity,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedImpact;
