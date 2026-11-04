import React from 'react';
import { User } from 'lucide-react';

interface PlayerHeaderProps {
  color: 'white' | 'black';
  name: string;
  rating?: string;
  avatar?: string;
  capturedPieces: string[]; // e.g. ['p', 'p', 'n', 'b']
  materialDifference: number; // >0 means this player is ahead in material
  isCurrentTurn: boolean;
  result?: string;
}

const PIECE_SYMBOLS: Record<string, string> = {
  p: '♟',
  n: '♞',
  b: '♝',
  r: '♜',
  q: '♛',
  P: '♙',
  N: '♘',
  B: '♗',
  R: '♖',
  Q: '♕',
};

export const PlayerHeader: React.FC<PlayerHeaderProps> = ({
  color,
  name,
  rating,
  avatar,
  capturedPieces,
  materialDifference,
  isCurrentTurn,
  result
}) => {
  const isWhite = color === 'white';

  return (
    <div className={`flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all ${
      isCurrentTurn 
        ? 'bg-[#2a2926] border border-[#81b64c]/50 shadow-sm shadow-[#81b64c]/10' 
        : 'bg-[#21201d] border border-transparent'
    }`}>
      {/* Player info */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 mr-2">
        {/* Avatar */}
        <div className="relative shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-[#363531]"
            />
          ) : (
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
              isWhite ? 'bg-gray-100 text-gray-900' : 'bg-gray-800 text-gray-100 border border-gray-700'
            }`}>
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          )}
          {isCurrentTurn && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#81b64c] ring-2 ring-[#262522]" />
          )}
        </div>

        {/* Name, rating and captured pieces */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-sm shrink-0 ${isWhite ? 'bg-white' : 'bg-black border border-gray-600'}`} />
            <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[240px]">
              {name}
            </h4>
            {rating && (
              <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono shrink-0">
                ({rating})
              </span>
            )}
          </div>

          {/* Captured pieces */}
          <div className="flex items-center gap-1 mt-0.5 min-h-[14px]">
            <div className="flex items-center text-xs tracking-tighter text-gray-400 overflow-hidden max-w-[150px] sm:max-w-[260px]">
              {capturedPieces.map((p, idx) => (
                <span key={idx} className="opacity-80">
                  {PIECE_SYMBOLS[p] || p}
                </span>
              ))}
            </div>
            {materialDifference > 0 && (
              <span className="text-[9px] sm:text-[10px] font-bold text-[#81b64c] ml-1 font-mono shrink-0">
                +{materialDifference}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Result indicator */}
      {result && result !== '*' && (
        <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
          result === '1-0' && isWhite ? 'bg-[#81b64c]/20 text-[#81b64c]' :
          result === '0-1' && !isWhite ? 'bg-[#81b64c]/20 text-[#81b64c]' :
          result === '1/2-1/2' ? 'bg-gray-500/20 text-gray-400' :
          'bg-gray-800 text-gray-500'
        }`}>
          {result === '1-0' && isWhite ? 'Winner' :
           result === '0-1' && !isWhite ? 'Winner' :
           result === '1/2-1/2' ? 'Draw' : ''}
        </span>
      )}
    </div>
  );
};
