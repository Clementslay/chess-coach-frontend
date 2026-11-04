import React from 'react';
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
  if (!evalCurve || evalCurve.length === 0) return null;

  return (
    <div className="rounded-2xl bg-[#262522] border border-[#363531] p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
          <TrendingUp className="w-3.5 h-3.5 text-[#81b64c]" />
          <span>Evaluation Flow</span>
        </div>
        <span className="text-[11px] text-gray-500 font-mono">
          Click bar to jump to move
        </span>
      </div>

      {/* SVG Bar Chart */}
      <div className="relative h-20 bg-[#1e2022] rounded-xl border border-[#363531] p-2 flex items-center overflow-x-auto">
        {/* Zero baseline */}
        <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 border-b border-[#3d3f42] border-dashed pointer-events-none" />

        <div className="flex items-center justify-between w-full h-full gap-[2px]">
          {evalCurve.map((pt) => {
            const isSelected = pt.ply === currentPly;
            // Clamp score between -6 and +6 for visual scaling
            const clampedScore = Math.max(-6, Math.min(6, pt.score));
            const heightPercent = Math.min(48, Math.max(6, Math.abs(clampedScore) * 8));
            const isWhiteAdv = pt.score >= 0;

            return (
              <div
                key={pt.ply}
                onClick={() => onSelectPly(pt.ply)}
                title={`Move ${pt.move_number} (${pt.san}): ${pt.score >= 0 ? '+' : ''}${pt.score}`}
                className="group relative flex-1 h-full flex flex-col justify-center items-center cursor-pointer min-w-[3px]"
              >
                {/* Bar */}
                <div
                  className={`w-full rounded-sm transition-all ${
                    isSelected
                      ? 'bg-amber-400 scale-x-125 z-10 shadow-md shadow-amber-400/50'
                      : isWhiteAdv
                      ? 'bg-gray-300 group-hover:bg-[#81b64c]'
                      : 'bg-gray-700 group-hover:bg-red-400'
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
