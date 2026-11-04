import React, { useMemo, useRef } from 'react';
import { Chessboard, Arrow } from 'react-chessboard';
import { RotateCcw } from 'lucide-react';
import { MoveEvaluation } from '../types/chess';

interface ChessboardViewProps {
  currentFen: string;
  currentMove?: MoveEvaluation;
  orientation: 'white' | 'black';
  onFlipOrientation: () => void;
  boardWidth?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const CLASSIFICATION_COLORS: Record<string, string> = {
  BRILLIANT: '#1baca6',
  GREAT: '#5c8bb0',
  BEST: '#81b64c',
  EXCELLENT: '#96bc4b',
  GOOD: '#96bc4b',
  BOOK: '#d5a47d',
  INACCURACY: '#f0c15c',
  MISTAKE: '#ffa400',
  BLUNDER: '#fa412d',
  MISS: '#fa412d'
};

export const ChessboardView: React.FC<ChessboardViewProps> = ({
  currentFen,
  currentMove,
  orientation,
  onFlipOrientation,
  boardWidth,
  onSwipeLeft,
  onSwipeRight
}) => {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Compute arrows
  const arrows = useMemo<Arrow[]>(() => {
    const arrowList: Arrow[] = [];
    if (!currentMove) return arrowList;

    // 1. Played move arrow (color-coded by classification)
    if (currentMove.uci && currentMove.uci.length >= 4) {
      const from = currentMove.uci.slice(0, 2);
      const to = currentMove.uci.slice(2, 4);
      const color = CLASSIFICATION_COLORS[currentMove.classification] || '#81b64c';
      arrowList.push({ startSquare: from, endSquare: to, color });
    }

    // 2. Stockfish suggested move arrow (bright vibrant green)
    if (
      currentMove.suggested_move_uci &&
      currentMove.suggested_move_uci.length >= 4 &&
      currentMove.suggested_move_uci !== currentMove.uci
    ) {
      const sFrom = currentMove.suggested_move_uci.slice(0, 2);
      const sTo = currentMove.suggested_move_uci.slice(2, 4);
      arrowList.push({ startSquare: sFrom, endSquare: sTo, color: '#22c55e' });
    }

    return arrowList;
  }, [currentMove]);

  // Compute highlighted squares
  const squareStyles = useMemo<Record<string, React.CSSProperties>>(() => {
    const styles: Record<string, React.CSSProperties> = {};
    if (!currentMove || !currentMove.uci) return styles;

    const from = currentMove.uci.slice(0, 2);
    const to = currentMove.uci.slice(2, 4);
    const color = CLASSIFICATION_COLORS[currentMove.classification] || '#81b64c';

    styles[from] = {
      backgroundColor: `${color}40`,
    };
    styles[to] = {
      backgroundColor: `${color}66`,
    };

    return styles;
  }, [currentMove]);

  // Touch handlers for mobile swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Detect horizontal swipe if deltaX is sufficiently larger than deltaY
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        // Swiped left -> Next move
        onSwipeLeft?.();
      } else {
        // Swiped right -> Previous move
        onSwipeRight?.();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Board wrapper: fluid 1:1 aspect ratio */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full aspect-square max-w-[540px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-[#2b2a27] bg-[#2b2a27] relative touch-pan-y"
        style={boardWidth ? { maxWidth: boardWidth } : undefined}
      >
        <Chessboard
          options={{
            position: currentFen,
            boardOrientation: orientation,
            arrows,
            squareStyles,
            darkSquareStyle: { backgroundColor: '#739552' },
            lightSquareStyle: { backgroundColor: '#ebecd0' },
            allowDragging: false,
            animationDurationInMs: 250
          }}
        />

        {/* Flip button overlay */}
        <button
          onClick={onFlipOrientation}
          title="Flip Board"
          className="absolute bottom-2 right-2 p-2 sm:p-2.5 rounded-xl bg-[#161719]/80 hover:bg-[#161719] backdrop-blur text-gray-300 hover:text-white border border-[#363531] shadow-lg transition-transform active:scale-90 hover:rotate-180 z-20"
          aria-label="Flip Board"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Legend below board */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2 text-[10px] sm:text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#22c55e]" />
          <span>Stockfish Rec</span>
        </div>
        {currentMove && (
          <div className="flex items-center gap-1.5">
            <span 
              className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full"
              style={{ backgroundColor: CLASSIFICATION_COLORS[currentMove.classification] || '#81b64c' }}
            />
            <span className="capitalize">{currentMove.classification.toLowerCase()} move played</span>
          </div>
        )}
      </div>
    </div>
  );
};
