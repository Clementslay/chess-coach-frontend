import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  Star,
  CheckCircle2,
  BookOpen,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { MoveEvaluation, MoveClassification } from '../types/chess';

interface MoveControlsProps {
  currentPly: number;
  totalPlies: number;
  currentMove?: MoveEvaluation;
  isPlaying: boolean;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onTogglePlay: () => void;
  onFlipBoard: () => void;
}

const CLASSIFICATION_BADGES: Record<MoveClassification, {
  label: string;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
}> = {
  BRILLIANT: {
    label: 'Brilliant',
    badge: '!!',
    color: 'text-[#1baca6]',
    bgColor: 'bg-[#1baca6]/15',
    borderColor: 'border-[#1baca6]/40',
    icon: <Sparkles className="w-3.5 h-3.5 text-[#1baca6]" />
  },
  GREAT: {
    label: 'Great',
    badge: '!',
    color: 'text-[#5c8bb0]',
    bgColor: 'bg-[#5c8bb0]/15',
    borderColor: 'border-[#5c8bb0]/40',
    icon: <Star className="w-3.5 h-3.5 text-[#5c8bb0]" />
  },
  BEST: {
    label: 'Best',
    badge: '★',
    color: 'text-[#81b64c]',
    bgColor: 'bg-[#81b64c]/15',
    borderColor: 'border-[#81b64c]/40',
    icon: <Star className="w-3.5 h-3.5 text-[#81b64c]" />
  },
  EXCELLENT: {
    label: 'Excellent',
    badge: '✓',
    color: 'text-[#96bc4b]',
    bgColor: 'bg-[#96bc4b]/15',
    borderColor: 'border-[#96bc4b]/40',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#96bc4b]" />
  },
  GOOD: {
    label: 'Good',
    badge: '✓',
    color: 'text-[#96bc4b]',
    bgColor: 'bg-[#96bc4b]/15',
    borderColor: 'border-[#96bc4b]/40',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#96bc4b]" />
  },
  BOOK: {
    label: 'Book',
    badge: '📖',
    color: 'text-[#d5a47d]',
    bgColor: 'bg-[#d5a47d]/15',
    borderColor: 'border-[#d5a47d]/40',
    icon: <BookOpen className="w-3.5 h-3.5 text-[#d5a47d]" />
  },
  INACCURACY: {
    label: 'Inaccuracy',
    badge: '?!',
    color: 'text-[#f0c15c]',
    bgColor: 'bg-[#f0c15c]/15',
    borderColor: 'border-[#f0c15c]/40',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-[#f0c15c]" />
  },
  MISTAKE: {
    label: 'Mistake',
    badge: '?',
    color: 'text-[#ffa400]',
    bgColor: 'bg-[#ffa400]/15',
    borderColor: 'border-[#ffa400]/40',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-[#ffa400]" />
  },
  BLUNDER: {
    label: 'Blunder',
    badge: '??',
    color: 'text-[#fa412d]',
    bgColor: 'bg-[#fa412d]/15',
    borderColor: 'border-[#fa412d]/40',
    icon: <XCircle className="w-3.5 h-3.5 text-[#fa412d]" />
  },
  MISS: {
    label: 'Miss',
    badge: '✕',
    color: 'text-[#fa412d]',
    bgColor: 'bg-[#fa412d]/15',
    borderColor: 'border-[#fa412d]/40',
    icon: <XCircle className="w-3.5 h-3.5 text-[#fa412d]" />
  }
};

export const MoveControls: React.FC<MoveControlsProps> = ({
  currentPly,
  totalPlies,
  currentMove,
  isPlaying,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onTogglePlay,
  onFlipBoard
}) => {
  const badgeConfig = currentMove ? CLASSIFICATION_BADGES[currentMove.classification] : null;

  return (
    <div className="w-full bg-[#262522] border border-[#363531] rounded-xl sm:rounded-2xl p-2.5 sm:p-3 shadow-md flex flex-col gap-2 select-none">
      {/* Current move info strip */}
      <div className="flex items-center justify-between gap-2 px-1 text-xs">
        {/* Left: Move number & SAN */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-gray-400 text-xs">
            {currentPly === 0 ? 'Start' : `${currentMove ? Math.ceil(currentPly / 2) : 0}.`}
          </span>

          {currentMove ? (
            <span className="font-mono font-extrabold text-white text-sm">
              {currentMove.san}
            </span>
          ) : (
            <span className="text-gray-400 text-xs">Starting Position</span>
          )}

          {badgeConfig && (
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold ${badgeConfig.bgColor} ${badgeConfig.borderColor}`}>
              {badgeConfig.icon}
              <span className={badgeConfig.color}>{badgeConfig.label}</span>
              <span className={`font-mono ${badgeConfig.color}`}>{badgeConfig.badge}</span>
            </div>
          )}
        </div>

        {/* Right: Ply count / Eval score */}
        <div className="flex items-center gap-2 shrink-0">
          {currentMove && (
            <span className={`font-mono text-xs font-bold ${
              currentMove.score_display.startsWith('+') ? 'text-[#81b64c]' :
              currentMove.score_display.startsWith('-') ? 'text-red-400' :
              'text-gray-300'
            }`}>
              {currentMove.score_display}
            </span>
          )}
          <span className="text-[11px] font-mono text-gray-400 bg-[#1e2022] px-2 py-0.5 rounded border border-[#363531]">
            {currentPly}/{totalPlies}
          </span>
        </div>
      </div>

      {/* Main Touch-Friendly Navigation Controls */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Jump First */}
        <button
          onClick={onFirst}
          disabled={currentPly <= 0}
          title="First Move (Home)"
          className="h-11 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-[#1e2022] hover:bg-[#363531] disabled:opacity-30 disabled:pointer-events-none text-gray-300 hover:text-white border border-[#363531] transition-colors flex items-center justify-center shrink-0 active:scale-95"
          aria-label="First Move"
        >
          <ChevronsLeft className="w-5 h-5 sm:w-4 sm:h-4" />
        </button>

        {/* Previous Move (Primary Large Touch Button) */}
        <button
          onClick={onPrev}
          disabled={currentPly <= 0}
          title="Previous Move (Left Arrow)"
          className="flex-1 h-11 sm:h-10 rounded-xl bg-[#1e2022] hover:bg-[#363531] disabled:opacity-30 disabled:pointer-events-none text-gray-200 hover:text-white border border-[#363531] transition-all flex items-center justify-center gap-1 font-bold text-sm active:scale-95 shadow-sm"
          aria-label="Previous Move"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden xs:inline text-xs">Prev</span>
        </button>

        {/* Auto Play / Pause Button */}
        <button
          onClick={onTogglePlay}
          title={isPlaying ? 'Pause (Space)' : 'Auto-Play (Space)'}
          className={`h-11 sm:h-10 px-4 sm:px-5 rounded-xl text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 shadow-md ${
            isPlaying 
              ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30 ring-2 ring-amber-400/40' 
              : 'bg-[#81b64c] hover:bg-[#98c863] shadow-[#81b64c]/30'
          }`}
          aria-label={isPlaying ? 'Pause Auto-Play' : 'Start Auto-Play'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span className="text-[11px] uppercase tracking-wider">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span className="text-[11px] uppercase tracking-wider">Play</span>
            </>
          )}
        </button>

        {/* Next Move (Primary Large Touch Button) */}
        <button
          onClick={onNext}
          disabled={currentPly >= totalPlies}
          title="Next Move (Right Arrow)"
          className="flex-1 h-11 sm:h-10 rounded-xl bg-[#1e2022] hover:bg-[#363531] disabled:opacity-30 disabled:pointer-events-none text-gray-200 hover:text-white border border-[#363531] transition-all flex items-center justify-center gap-1 font-bold text-sm active:scale-95 shadow-sm"
          aria-label="Next Move"
        >
          <span className="hidden xs:inline text-xs">Next</span>
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Jump Last */}
        <button
          onClick={onLast}
          disabled={currentPly >= totalPlies}
          title="Last Move (End)"
          className="h-11 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-[#1e2022] hover:bg-[#363531] disabled:opacity-30 disabled:pointer-events-none text-gray-300 hover:text-white border border-[#363531] transition-colors flex items-center justify-center shrink-0 active:scale-95"
          aria-label="Last Move"
        >
          <ChevronsRight className="w-5 h-5 sm:w-4 sm:h-4" />
        </button>

        {/* Quick Flip Board button */}
        <button
          onClick={onFlipBoard}
          title="Flip Board Orientation"
          className="h-11 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-[#1e2022] hover:bg-[#363531] text-gray-400 hover:text-white border border-[#363531] transition-colors flex items-center justify-center shrink-0 active:scale-95"
          aria-label="Flip Board"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
