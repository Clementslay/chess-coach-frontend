import React, { useMemo } from 'react';
import { Chessboard, Arrow } from 'react-chessboard';
import { RotateCcw } from 'lucide-react';
import { MoveEvaluation } from '../types/chess';

interface ChessboardViewProps {
  currentFen: string;
  currentMove?: MoveEvaluation;
  orientation: 'white' | 'black';
  onFlipOrientation: () => void;
  boardWidth?: number;
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
  boardWidth = 520
}) => {
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

  return (
    <div className="relative flex flex-col items-center">
      {/* Board wrapper */}
      <div 
        className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#2b2a27] bg-[#2b2a27] relative"
        style={{ width: boardWidth, maxWidth: '100%' }}
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
          className="absolute bottom-2 right-2 p-2 rounded-xl bg-[#161719]/80 hover:bg-[#161719] backdrop-blur text-gray-300 hover:text-white border border-[#363531] shadow-lg transition-transform hover:rotate-180 z-20"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend below board */}
      <div className="flex items-center gap-4 mt-2.5 text-[11px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
          <span>Stockfish Recommendation</span>
        </div>
        {currentMove && (
          <div className="flex items-center gap-1.5">
            <span 
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: CLASSIFICATION_COLORS[currentMove.classification] || '#81b64c' }}
            />
            <span className="capitalize">{currentMove.classification.toLowerCase()} move played</span>
          </div>
        )}
      </div>
    </div>
  );
};
