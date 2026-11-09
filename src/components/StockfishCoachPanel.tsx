import React from 'react';
import { 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen,
  Star,
  Cpu
} from 'lucide-react';
import { MoveEvaluation, MoveClassification } from '../types/chess';

interface StockfishCoachPanelProps {
  currentMove?: MoveEvaluation;
  onNext?: () => void;
  currentPly?: number;
  totalPlies?: number;
  isPlaying?: boolean;
  onFirst?: () => void;
  onPrev?: () => void;
  onLast?: () => void;
  onTogglePlay?: () => void;
  hideNavControls?: boolean;
}

const CLASSIFICATION_CONFIG: Record<MoveClassification, {
  label: string;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
}> = {
  BRILLIANT: {
    label: 'Brilliant Move',
    badge: '!!',
    color: 'text-[#1baca6]',
    bgColor: 'bg-[#1baca6]/15',
    borderColor: 'border-[#1baca6]/40',
    icon: <Sparkles className="w-4 h-4 text-[#1baca6]" />
  },
  GREAT: {
    label: 'Great Move',
    badge: '!',
    color: 'text-[#5c8bb0]',
    bgColor: 'bg-[#5c8bb0]/15',
    borderColor: 'border-[#5c8bb0]/40',
    icon: <Star className="w-4 h-4 text-[#5c8bb0]" />
  },
  BEST: {
    label: 'Best Move',
    badge: '★',
    color: 'text-[#81b64c]',
    bgColor: 'bg-[#81b64c]/15',
    borderColor: 'border-[#81b64c]/40',
    icon: <Star className="w-4 h-4 text-[#81b64c]" />
  },
  EXCELLENT: {
    label: 'Excellent',
    badge: '✓',
    color: 'text-[#96bc4b]',
    bgColor: 'bg-[#96bc4b]/15',
    borderColor: 'border-[#96bc4b]/40',
    icon: <CheckCircle2 className="w-4 h-4 text-[#96bc4b]" />
  },
  GOOD: {
    label: 'Good Move',
    badge: '✓',
    color: 'text-[#96bc4b]',
    bgColor: 'bg-[#96bc4b]/15',
    borderColor: 'border-[#96bc4b]/40',
    icon: <CheckCircle2 className="w-4 h-4 text-[#96bc4b]" />
  },
  BOOK: {
    label: 'Book Move',
    badge: '📖',
    color: 'text-[#d5a47d]',
    bgColor: 'bg-[#d5a47d]/15',
    borderColor: 'border-[#d5a47d]/40',
    icon: <BookOpen className="w-4 h-4 text-[#d5a47d]" />
  },
  INACCURACY: {
    label: 'Inaccuracy',
    badge: '?!',
    color: 'text-[#f0c15c]',
    bgColor: 'bg-[#f0c15c]/15',
    borderColor: 'border-[#f0c15c]/40',
    icon: <AlertTriangle className="w-4 h-4 text-[#f0c15c]" />
  },
  MISTAKE: {
    label: 'Mistake',
    badge: '?',
    color: 'text-[#ffa400]',
    bgColor: 'bg-[#ffa400]/15',
    borderColor: 'border-[#ffa400]/40',
    icon: <AlertTriangle className="w-4 h-4 text-[#ffa400]" />
  },
  BLUNDER: {
    label: 'Blunder',
    badge: '??',
    color: 'text-[#fa412d]',
    bgColor: 'bg-[#fa412d]/15',
    borderColor: 'border-[#fa412d]/40',
    icon: <XCircle className="w-4 h-4 text-[#fa412d]" />
  },
  MISS: {
    label: 'Missed Opportunity',
    badge: '✕',
    color: 'text-[#fa412d]',
    bgColor: 'bg-[#fa412d]/15',
    borderColor: 'border-[#fa412d]/40',
    icon: <XCircle className="w-4 h-4 text-[#fa412d]" />
  }
};

export const StockfishCoachPanel: React.FC<StockfishCoachPanelProps> = ({
  currentMove,
  onNext
}) => {
  if (!currentMove) {
    return (
      <div className="h-[92px] sm:h-[86px] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#262522] border border-[#363531] text-gray-400 flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-[#1e2022] text-[#81b64c] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm text-gray-300 truncate">Starting position. Tap <strong className="text-white">Next</strong> or swipe the board to review moves.</p>
        </div>
        <button
          onClick={onNext}
          className="px-3.5 py-1.5 rounded-xl bg-[#81b64c] hover:bg-[#98c863] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors active:scale-95 shadow-md shadow-[#81b64c]/20 shrink-0"
        >
          <span>Start Review</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const config = CLASSIFICATION_CONFIG[currentMove.classification] || CLASSIFICATION_CONFIG.GOOD;

  return (
    <div className="h-[92px] sm:h-[86px] rounded-xl sm:rounded-2xl bg-[#262522] border border-[#363531] p-2 sm:p-2.5 shadow-xl flex flex-col justify-between select-none overflow-hidden">
      {/* Top Row: Classification Badge, Move info, Tactical tags */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
          <div className={`flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 rounded-lg border ${config.bgColor} ${config.borderColor} shrink-0`}>
            {config.icon}
            <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${config.color}`}>
              {config.label}
            </span>
            <span className={`text-[10px] sm:text-[11px] font-mono font-extrabold ${config.color}`}>
              {config.badge}
            </span>
          </div>

          {(currentMove.tactical_tags.length > 0 || currentMove.centipawn_loss > 0) && (
            <div className="flex items-center gap-1 shrink-0">
              {currentMove.tactical_tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#2d2e30] text-gray-300 border border-[#3d3f42]"
                >
                  {tag}
                </span>
              ))}
              {currentMove.centipawn_loss > 0 && (
                <span className="text-[9px] sm:text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-900/40">
                  -{currentMove.centipawn_loss} CPL
                </span>
              )}
            </div>
          )}
        </div>

        <div className="text-[10px] sm:text-[11px] font-mono text-gray-400 shrink-0">
          Move {currentMove.move_number}
          <span className="text-gray-500"> ({currentMove.player === 'white' ? 'White' : 'Black'})</span>
        </div>
      </div>

      {/* Coach Commentary Box: Fixed height, internal smooth scroll if longer */}
      <div className="flex-1 min-h-0 mt-1 p-1.5 sm:p-2 rounded-lg bg-[#1a1b1e] border border-[#363531] flex items-center gap-2 overflow-hidden">
        <Cpu className="w-3.5 h-3.5 text-[#81b64c] shrink-0" />
        <div className="flex-1 overflow-y-auto max-h-full pr-1 text-xs text-gray-200 leading-snug">
          <span>{currentMove.commentary}</span>
        </div>
      </div>
    </div>
  );
};
