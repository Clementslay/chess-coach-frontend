import React from 'react';

interface EvalBarProps {
  scoreDisplay: string;
  winProbability: number; // 0 to 100 (% for White)
  orientation: 'white' | 'black';
}

export const EvalBar: React.FC<EvalBarProps> = ({ scoreDisplay, winProbability, orientation }) => {
  // Clamp white percentage between 3% and 97%
  const whitePercent = Math.min(97, Math.max(3, winProbability));
  const blackPercent = 100 - whitePercent;

  // Determine who is ahead
  const isWhiteAhead = whitePercent >= 50;

  // If flipped (playing as Black), invert vertical orientation
  const isFlipped = orientation === 'black';
  const topPercent = isFlipped ? whitePercent : blackPercent;
  const bottomPercent = isFlipped ? blackPercent : whitePercent;
  const topColor = isFlipped ? 'bg-white text-gray-900' : 'bg-[#2b2926] text-gray-200';
  const bottomColor = isFlipped ? 'bg-[#2b2926] text-gray-200' : 'bg-white text-gray-900';

  return (
    <div 
      className="relative w-full h-full min-h-0 rounded-md sm:rounded-lg overflow-hidden flex flex-col bg-[#1e1d1b] border border-[#363531] shadow-inner select-none"
      title={`Evaluation: ${scoreDisplay} (${isWhiteAhead ? 'White' : 'Black'} advantage)`}
    >
      {/* Top Section */}
      <div
        className={`w-full transition-all duration-300 ease-out flex items-start justify-center pt-1.5 sm:pt-2 font-mono text-[8px] sm:text-[10px] md:text-[11px] font-extrabold ${topColor}`}
        style={{ height: `${topPercent}%` }}
      >
        {!isWhiteAhead && (
          <span className="drop-shadow-sm px-0.5 truncate max-w-full text-center">
            {scoreDisplay}
          </span>
        )}
      </div>

      {/* Bottom Section */}
      <div
        className={`w-full transition-all duration-300 ease-out flex items-end justify-center pb-1.5 sm:pb-2 font-mono text-[8px] sm:text-[10px] md:text-[11px] font-extrabold ${bottomColor}`}
        style={{ height: `${bottomPercent}%` }}
      >
        {isWhiteAhead && (
          <span className="drop-shadow-sm px-0.5 truncate max-w-full text-center">
            {scoreDisplay}
          </span>
        )}
      </div>
    </div>
  );
};
