import React from 'react';
import { Trophy } from 'lucide-react';
import { ClassificationBreakdown } from '../types/chess';

interface GameReviewSummaryProps {
  whiteName: string;
  blackName: string;
  whiteAccuracy: number;
  blackAccuracy: number;
  summary: ClassificationBreakdown;
}

const CATEGORIES = [
  { key: 'BRILLIANT', label: 'Brilliant', symbol: '!!', color: 'text-[#1baca6]' },
  { key: 'GREAT', label: 'Great', symbol: '!', color: 'text-[#5c8bb0]' },
  { key: 'BEST', label: 'Best', symbol: '★', color: 'text-[#81b64c]' },
  { key: 'EXCELLENT', label: 'Excellent', symbol: '✓', color: 'text-[#96bc4b]' },
  { key: 'GOOD', label: 'Good', symbol: '•', color: 'text-[#96bc4b]' },
  { key: 'BOOK', label: 'Book', symbol: '📖', color: 'text-[#d5a47d]' },
  { key: 'INACCURACY', label: 'Inaccuracy', symbol: '?!', color: 'text-[#f0c15c]' },
  { key: 'MISTAKE', label: 'Mistake', symbol: '?', color: 'text-[#ffa400]' },
  { key: 'BLUNDER', label: 'Blunder', symbol: '??', color: 'text-[#fa412d]' },
  { key: 'MISS', label: 'Miss', symbol: '✕', color: 'text-[#fa412d]' },
];

export const GameReviewSummary: React.FC<GameReviewSummaryProps> = ({
  whiteName,
  blackName,
  whiteAccuracy,
  blackAccuracy,
  summary
}) => {
  return (
    <div className="rounded-2xl bg-[#262522] border border-[#363531] p-5 flex flex-col gap-5 shadow-xl">
      {/* Title */}
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400">
        <Trophy className="w-4 h-4 text-[#81b64c]" />
        <span>Game Review Summary</span>
      </div>

      {/* Accuracy Section */}
      <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#1e2022] border border-[#363531]">
        {/* White accuracy */}
        <div>
          <span className="text-[11px] text-gray-400 truncate block">{whiteName} (White)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black font-mono text-white">{whiteAccuracy}%</span>
            <span className="text-[10px] text-gray-400">acc</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#363531] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-[#81b64c] h-full rounded-full transition-all duration-500"
              style={{ width: `${whiteAccuracy}%` }}
            />
          </div>
        </div>

        {/* Black accuracy */}
        <div>
          <span className="text-[11px] text-gray-400 truncate block">{blackName} (Black)</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black font-mono text-white">{blackAccuracy}%</span>
            <span className="text-[10px] text-gray-400">acc</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#363531] h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className="bg-[#81b64c] h-full rounded-full transition-all duration-500"
              style={{ width: `${blackAccuracy}%` }}
            />
          </div>
        </div>
      </div>

      {/* Move Classification Breakdown */}
      <div>
        <div className="grid grid-cols-[1fr_auto_1fr] text-[10px] font-bold uppercase tracking-wider text-gray-400 pb-2 border-b border-[#363531]">
          <span className="text-left truncate">{whiteName}</span>
          <span className="text-center px-3">Classification</span>
          <span className="text-right truncate">{blackName}</span>
        </div>

        <div className="divide-y divide-[#363531]/40 text-xs font-mono">
          {CATEGORIES.map((cat) => {
            const wCount = summary.white[cat.key] || 0;
            const bCount = summary.black[cat.key] || 0;
            if (wCount === 0 && bCount === 0 && !['BEST', 'BLUNDER', 'MISTAKE'].includes(cat.key)) {
              return null; // Don't clutter with zero-count categories
            }

            return (
              <div 
                key={cat.key} 
                className="grid grid-cols-[1fr_auto_1fr] items-center py-1.5 text-xs"
              >
                {/* White count */}
                <span className={`text-left font-bold ${wCount > 0 ? 'text-white' : 'text-gray-600'}`}>
                  {wCount}
                </span>

                {/* Classification label & badge */}
                <div className="flex items-center justify-center gap-1.5 px-3">
                  <span className={`font-bold ${cat.color}`}>{cat.symbol}</span>
                  <span className="text-gray-300 font-sans text-[11px]">{cat.label}</span>
                </div>

                {/* Black count */}
                <span className={`text-right font-bold ${bCount > 0 ? 'text-white' : 'text-gray-600'}`}>
                  {bCount}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
