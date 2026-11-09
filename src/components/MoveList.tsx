import React, { useEffect, useRef } from 'react';
import { MoveEvaluation } from '../types/chess';

interface MoveListProps {
  moves: MoveEvaluation[];
  currentPly: number;
  onSelectPly: (ply: number) => void;
}

const CLASSIFICATION_ICONS: Record<string, { icon: string; color: string }> = {
  BRILLIANT: { icon: '!!', color: 'text-[#1baca6]' },
  GREAT: { icon: '!', color: 'text-[#5c8bb0]' },
  BEST: { icon: '★', color: 'text-[#81b64c]' },
  EXCELLENT: { icon: '✓', color: 'text-[#96bc4b]' },
  GOOD: { icon: '•', color: 'text-[#96bc4b]' },
  BOOK: { icon: '📖', color: 'text-[#d5a47d]' },
  INACCURACY: { icon: '?!', color: 'text-[#f0c15c]' },
  MISTAKE: { icon: '?', color: 'text-[#ffa400]' },
  BLUNDER: { icon: '??', color: 'text-[#fa412d]' },
  MISS: { icon: '✕', color: 'text-[#fa412d]' }
};

export const MoveList: React.FC<MoveListProps> = ({ moves, currentPly, onSelectPly }) => {
  const activeRowRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Group moves into full turns (pairs of White & Black plies)
  const groupedTurns = React.useMemo(() => {
    const turns: Array<{ moveNumber: number; white?: MoveEvaluation; black?: MoveEvaluation }> = [];
    for (let i = 0; i < moves.length; i += 2) {
      turns.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: moves[i],
        black: moves[i + 1]
      });
    }
    return turns;
  }, [moves]);

  // Localized scroll: scrolls inner container only, NEVER the window or page
  useEffect(() => {
    const container = containerRef.current;
    const activeRow = activeRowRef.current;
    if (!container || !activeRow) return;

    const rowTop = activeRow.offsetTop - container.offsetTop;
    const rowBottom = rowTop + activeRow.offsetHeight;

    if (rowTop < container.scrollTop) {
      container.scrollTop = rowTop;
    } else if (rowBottom > container.scrollTop + container.clientHeight) {
      container.scrollTop = rowBottom - container.clientHeight;
    }
  }, [currentPly]);

  return (
    <div className="rounded-xl sm:rounded-2xl bg-[#262522] border border-[#363531] p-3 sm:p-4 flex flex-col h-[280px] sm:h-[340px]">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#363531]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Move Review ({moves.length} plies)
        </h4>
        <span className="text-[10px] sm:text-[11px] text-gray-500">Tap to jump</span>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
        {groupedTurns.map((turn) => {
          const isWhiteActive = turn.white && turn.white.ply === currentPly;
          const isBlackActive = turn.black && turn.black.ply === currentPly;

          return (
            <div
              key={turn.moveNumber}
              ref={isWhiteActive || isBlackActive ? activeRowRef : null}
              className="grid grid-cols-[32px_1fr_1fr] sm:grid-cols-[38px_1fr_1fr] gap-1 sm:gap-1.5 items-center px-1 sm:px-1.5 py-0.5 rounded-lg hover:bg-[#2e2d2a] transition-colors"
            >
              {/* Move number */}
              <span className="text-gray-500 text-[10px] sm:text-[11px]">
                {turn.moveNumber}.
              </span>

              {/* White Move */}
              {turn.white ? (
                <button
                  onClick={() => onSelectPly(turn.white!.ply)}
                  className={`flex items-center justify-between px-2 py-1.5 sm:py-1 rounded text-left transition-all active:scale-95 ${
                    isWhiteActive
                      ? 'bg-[#81b64c] text-white font-bold shadow-sm'
                      : 'text-gray-200 hover:bg-[#363531]'
                  }`}
                >
                  <span className="truncate">{turn.white.san}</span>
                  <span className={`text-[10px] font-bold shrink-0 ml-1 ${
                    isWhiteActive ? 'text-white' : CLASSIFICATION_ICONS[turn.white.classification]?.color || 'text-gray-400'
                  }`}>
                    {CLASSIFICATION_ICONS[turn.white.classification]?.icon}
                  </span>
                </button>
              ) : (
                <span />
              )}

              {/* Black Move */}
              {turn.black ? (
                <button
                  onClick={() => onSelectPly(turn.black!.ply)}
                  className={`flex items-center justify-between px-2 py-1.5 sm:py-1 rounded text-left transition-all active:scale-95 ${
                    isBlackActive
                      ? 'bg-[#81b64c] text-white font-bold shadow-sm'
                      : 'text-gray-200 hover:bg-[#363531]'
                  }`}
                >
                  <span className="truncate">{turn.black.san}</span>
                  <span className={`text-[10px] font-bold shrink-0 ml-1 ${
                    isBlackActive ? 'text-white' : CLASSIFICATION_ICONS[turn.black.classification]?.color || 'text-gray-400'
                  }`}>
                    {CLASSIFICATION_ICONS[turn.black.classification]?.icon}
                  </span>
                </button>
              ) : (
                <span />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
