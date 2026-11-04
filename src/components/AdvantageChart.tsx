import React, { useRef, useCallback } from 'react';
import { TrendingUp } from 'lucide-react';
import { EvalCurvePoint } from '../types/chess';

interface AdvantageChartProps {
  evalCurve: EvalCurvePoint[];
  currentPly: number;
  onSelectPly: (ply: number) => void;
}

export const AdvantageChart: React.FC<AdvantageChartProps> = ({
  evalCurve,
  currentPly,
  onSelectPly
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Jump to ply based on touch or click horizontal coordinate
  const handlePointerInteraction = useCallback((clientX: number) => {
    if (!chartRef.current || !evalCurve || evalCurve.length === 0) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const targetIndex = Math.min(evalCurve.length - 1, Math.max(0, Math.round(ratio * (evalCurve.length - 1))));
    const point = evalCurve[targetIndex];
    if (point && point.ply !== undefined) {
      onSelectPly(point.ply);
    }
  }, [evalCurve, onSelectPly]);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handlePointerInteraction(e.touches[0].clientX);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    handlePointerInteraction(e.clientX);
  };

  if (!evalCurve || evalCurve.length === 0) return null;

  const currentPoint = evalCurve.find((p) => p.ply === currentPly);

  return (
    <div className="rounded-xl sm:rounded-2xl bg-[#262522] border border-[#363531] p-3 sm:p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
          <TrendingUp className="w-3.5 h-3.5 text-[#81b64c]" />
          <span>Evaluation Flow</span>
        </div>
        <div className="flex items-center gap-2">
          {currentPoint && (
            <span className="text-[11px] font-mono text-[#81b64c] font-bold">
              Move {currentPoint.move_number} ({currentPoint.score >= 0 ? '+' : ''}{currentPoint.score})
            </span>
          )}
          <span className="text-[10px] text-gray-500 font-mono hidden xs:inline">
            Drag to scrub
          </span>
        </div>
      </div>

      {/* SVG Bar Chart with touch scrub */}
      <div 
        ref={chartRef}
        onClick={handleClick}
        onTouchMove={handleTouchMove}
        className="relative h-20 sm:h-24 bg-[#1e2022] rounded-xl border border-[#363531] p-2 flex items-center overflow-x-hidden cursor-crosshair touch-none select-none"
      >
        {/* Zero baseline */}
        <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 border-b border-[#3d3f42] border-dashed pointer-events-none z-0" />

        <div className="flex items-center justify-between w-full h-full gap-[1.5px] sm:gap-[2px] z-10 pointer-events-none">
          {evalCurve.map((pt) => {
            const isSelected = pt.ply === currentPly;
            // Clamp score between -6 and +6 for visual scaling
            const clampedScore = Math.max(-6, Math.min(6, pt.score));
            const heightPercent = Math.min(48, Math.max(6, Math.abs(clampedScore) * 8));
            const isWhiteAdv = pt.score >= 0;

            return (
              <div
                key={pt.ply}
                className="group relative flex-1 h-full flex flex-col justify-center items-center min-w-[2px]"
              >
                {/* Bar */}
                <div
                  className={`w-full rounded-sm transition-all ${
                    isSelected
                      ? 'bg-amber-400 scale-x-150 z-20 shadow-md shadow-amber-400/50 ring-1 ring-white'
                      : isWhiteAdv
                      ? 'bg-gray-300'
                      : 'bg-gray-700'
                  }`}
                  style={{
                    height: `${heightPercent}%`,
                    marginBottom: isWhiteAdv ? `${heightPercent}%` : 0,
                    marginTop: !isWhiteAdv ? `${heightPercent}%` : 0
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
