import React from "react";

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = "" }) => {
  return (
    <svg 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Globe Background */}
      <circle cx="16" cy="16" r="14" fill="#BCE3F1" />
      
      {/* Globe Grid Lines (Longitude/Latitude) */}
      <circle cx="16" cy="16" r="14" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
      <ellipse cx="16" cy="16" rx="7" ry="14" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="16" y1="2" x2="16" y2="30" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="2" y1="16" x2="30" y2="16" stroke="#FFFFFF" strokeWidth="1.5" />
      <ellipse cx="16" cy="16" rx="14" ry="7" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />

      {/* Pink Heart - Top Right, with natural heartbeat animation */}
      <g className="animate-heartbeat" style={{ transformOrigin: "24px 8px" }}>
        {/* Heart Path */}
        <path 
          d="M 24 13 C 24 13 19 8 19 4.5 C 19 1.5 22 0.5 24 3 C 26 0.5 29 1.5 29 4.5 C 29 8 24 13 24 13 Z" 
          fill="#FF6B9E" 
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
};

export default AnimatedLogo;
