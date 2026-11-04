import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Play, 
  Pause, 
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
  currentPly: number;
  totalPlies: number;
  isPlaying: boolean;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onTogglePlay: () => void;
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
  currentPly,
  totalPlies,
  isPlaying,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onTogglePlay
}) => {
  if (!currentMove) {
    return (
      <div className="p-6 rounded-2xl bg-[#262522] border border-[#363531] text-center text-gray-400">
        <p className="text-sm">Starting position. Use the controls or arrow keys to review moves.</p>
        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={onNext}
            className="px-4 py-2 rounded-xl bg-[#81b64c] hover:bg-[#98c863] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Start Review</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const config = CLASSIFICATION_CONFIG[currentMove.classification] || CLASSIFICATION_CONFIG.GOOD;

  return (
    <div className="rounded-2xl bg-[#262522] border border-[#363531] p-5 shadow-xl flex flex-col gap-4">
      {/* Header: Classification Badge & Ply */}
      <div className="flex items-center justify-between gap-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${config.bgColor} ${config.borderColor}`}>
          {config.icon}
          <span className={`text-xs font-bold uppercase tracking-wider ${config.color}`}>
            {config.label}
          </span>
          <span className={`text-xs font-mono font-extrabold ${config.color}`}>
            {config.badge}
          </span>
        </div>

        <div className="text-xs font-mono text-gray-400">
          Move {currentMove.move_number}
          <span className="text-gray-500"> ({currentMove.player === 'white' ? 'White' : 'Black'})</span>
        </div>
      </div>

      {/* Move Comparison: Played vs Suggested */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Played move card */}
        <div className="p-3 rounded-xl bg-[#1e2022] border border-[#363531]">
          <span className="text-[11px] text-gray-400 block mb-1">Played Move</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-extrabold font-mono text-white">
              {currentMove.san}
            </span>
            <span className={`text-xs font-mono font-bold ${
              currentMove.score_display.startsWith('+') ? 'text-[#81b64c]' :
              currentMove.score_display.startsWith('-') ? 'text-red-400' :
              'text-gray-300'
            }`}>
              {currentMove.score_display}
            </span>
          </div>
        </div>

        {/* Stockfish Suggested move card */}
        <div className="p-3 rounded-xl bg-[#1e2022] border border-[#81b64c]/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#81b64c] text-white text-[9px] font-bold uppercase rounded-bl">
            Engine Best
          </div>
          <span className="text-[11px] text-gray-400 block mb-1">Stockfish Suggests</span>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-extrabold font-mono text-[#81b64c]">
              {currentMove.suggested_move_san || currentMove.san}
            </span>
            <span className="text-xs font-mono font-bold text-gray-300">
              {currentMove.suggested_score_display || currentMove.score_display}
            </span>
          </div>
        </div>
      </div>

      {/* Tactical Tags */}
      {currentMove.tactical_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {currentMove.tactical_tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#2d2e30] text-gray-300 border border-[#3d3f42]"
            >
              {tag}
            </span>
          ))}
          {currentMove.centipawn_loss > 0 && (
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-red-950/40 text-red-400 border border-red-900/40">
              -{currentMove.centipawn_loss} CPL
            </span>
          )}
        </div>
      )}

      {/* Stockfish Commentary Box */}
      <div className="p-3.5 rounded-xl bg-[#1a1b1e] border border-[#363531] text-xs sm:text-sm text-gray-200 leading-relaxed">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#81b64c] mb-1.5">
          <Cpu className="w-3.5 h-3.5" />
          <span>Stockfish Coach Notes</span>
        </div>
        <p>{currentMove.commentary}</p>
      </div>

      {/* Principal Variation (PV) Continuation line */}
      {currentMove.pv.length > 0 && (
        <div className="p-3 rounded-xl bg-[#1e2022] border border-[#363531] text-xs">
          <span className="text-gray-400 font-semibold block mb-1 text-[11px]">
            Engine Continuation (PV):
          </span>
          <div className="flex items-center flex-wrap gap-1.5 font-mono text-gray-300">
            {currentMove.pv.map((m, idx) => (
              <span key={idx} className="bg-[#262522] px-1.5 py-0.5 rounded text-[11px] border border-[#363531]">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="pt-2 border-t border-[#363531] flex items-center justify-between">
        <div className="text-xs font-mono text-gray-400">
          Ply {currentPly} / {totalPlies}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onFirst}
            disabled={currentPly <= 0}
            title="First Move"
            className="p-2 rounded-lg bg-[#1e2022] hover:bg-[#2d2e30] disabled:opacity-40 text-gray-300 transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onPrev}
            disabled={currentPly <= 0}
            title="Previous Move (Left Arrow)"
            className="p-2 rounded-lg bg-[#1e2022] hover:bg-[#2d2e30] disabled:opacity-40 text-gray-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause' : 'Auto Play'}
            className="px-3 py-2 rounded-lg bg-[#81b64c] hover:bg-[#98c863] text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={onNext}
            disabled={currentPly >= totalPlies}
            title="Next Move (Right Arrow)"
            className="p-2 rounded-lg bg-[#1e2022] hover:bg-[#2d2e30] disabled:opacity-40 text-gray-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onLast}
            disabled={currentPly >= totalPlies}
            title="Last Move"
            className="p-2 rounded-lg bg-[#1e2022] hover:bg-[#2d2e30] disabled:opacity-40 text-gray-300 transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
