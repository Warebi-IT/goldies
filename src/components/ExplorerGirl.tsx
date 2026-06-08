import React from "react";
import doraSprite from "../assets/dora_spritesheet.png";

interface ExplorerGirlProps {
  isSmiling: boolean;
  className?: string;
}

const ExplorerGirl: React.FC<ExplorerGirlProps> = ({ isSmiling, className = "" }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-full transition-all duration-300 ${className}`}
    >
      <div 
        className="w-full h-full bg-no-repeat transition-all duration-300 ease-in-out"
        style={{
          backgroundImage: `url(${doraSprite})`,
          // 200% width, auto height -> maintains perfect aspect ratio! No stretching.
          backgroundSize: '200% auto',
          // Frame her face and backpack inside the sphere. 
          // 15% Y-axis perfectly centers her upper body.
          backgroundPosition: isSmiling ? '100% 15%' : '0% 15%',
          transform: isSmiling ? 'scale(1.1)' : 'scale(1)',
        }}
      />
      {/* Little Star sparkles around her when she smiles */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 delay-100 ${isSmiling ? 'opacity-100' : 'opacity-0'}`}>
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full absolute inset-0">
          <path d="M 10 16 L 12 10 L 14 16 L 20 18 L 14 20 L 12 26 L 10 20 L 4 18 Z" fill="#F7CA44" className="animate-ping" style={{ animationDuration: '2s' }} />
          <path d="M 50 20 L 51 16 L 52 20 L 56 21 L 52 22 L 51 26 L 50 22 L 46 21 Z" fill="#F7CA44" className="animate-ping" style={{ animationDelay: '0.3s', animationDuration: '1.5s' }} />
        </svg>
      </div>
    </div>
  );
};

export default ExplorerGirl;
