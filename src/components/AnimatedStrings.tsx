import React from "react";

const AnimatedStrings = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 mix-blend-overlay opacity-60">
      <svg className="absolute w-[200%] h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
        <defs>
          <linearGradient id="string-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="80%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <style>
            {`
              @keyframes moveRightStrings {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0%); }
              }
              .string-anim {
                animation: moveRightStrings linear infinite;
              }
            `}
          </style>
        </defs>

        {/* String 1: Large amplitude, slow */}
        <g className="string-anim" style={{ animationDuration: "25s" }}>
          <path
            d="M 0 50 Q 50 10 100 50 T 200 50 T 300 50 T 400 50 T 500 50 T 600 50 T 700 50 T 800 50 T 900 50 T 1000 50 T 1100 50 T 1200 50 T 1300 50 T 1400 50 T 1500 50 T 1600 50 T 1700 50 T 1800 50 T 1900 50 T 2000 50"
            fill="none"
            stroke="url(#string-gradient)"
            strokeWidth="1.5"
          />
        </g>
        
        {/* String 2: Medium amplitude, offset vertically, faster */}
        <g className="string-anim" style={{ animationDuration: "18s" }}>
          <path
            d="M 0 70 Q 50 40 100 70 T 200 70 T 300 70 T 400 70 T 500 70 T 600 70 T 700 70 T 800 70 T 900 70 T 1000 70 T 1100 70 T 1200 70 T 1300 70 T 1400 70 T 1500 70 T 1600 70 T 1700 70 T 1800 70 T 1900 70 T 2000 70"
            fill="none"
            stroke="url(#string-gradient)"
            strokeWidth="0.8"
            opacity="0.8"
          />
        </g>

        {/* String 3: Small amplitude, offset vertically, medium speed */}
        <g className="string-anim" style={{ animationDuration: "22s" }}>
          <path
            d="M 0 30 Q 50 10 100 30 T 200 30 T 300 30 T 400 30 T 500 30 T 600 30 T 700 30 T 800 30 T 900 30 T 1000 30 T 1100 30 T 1200 30 T 1300 30 T 1400 30 T 1500 30 T 1600 30 T 1700 30 T 1800 30 T 1900 30 T 2000 30"
            fill="none"
            stroke="url(#string-gradient)"
            strokeWidth="2"
            opacity="0.6"
          />
        </g>

        {/* String 4: Fast string, bottom area */}
        <g className="string-anim" style={{ animationDuration: "14s" }}>
          <path
            d="M 0 85 Q 50 70 100 85 T 200 85 T 300 85 T 400 85 T 500 85 T 600 85 T 700 85 T 800 85 T 900 85 T 1000 85 T 1100 85 T 1200 85 T 1300 85 T 1400 85 T 1500 85 T 1600 85 T 1700 85 T 1800 85 T 1900 85 T 2000 85"
            fill="none"
            stroke="url(#string-gradient)"
            strokeWidth="1"
            opacity="0.9"
          />
        </g>
        
        {/* String 5: Intersecting string */}
        <g className="string-anim" style={{ animationDuration: "28s" }}>
          <path
            d="M 0 50 Q 50 90 100 50 T 200 50 T 300 50 T 400 50 T 500 50 T 600 50 T 700 50 T 800 50 T 900 50 T 1000 50 T 1100 50 T 1200 50 T 1300 50 T 1400 50 T 1500 50 T 1600 50 T 1700 50 T 1800 50 T 1900 50 T 2000 50"
            fill="none"
            stroke="url(#string-gradient)"
            strokeWidth="0.5"
            opacity="0.5"
          />
        </g>
      </svg>
    </div>
  );
};

export default AnimatedStrings;
