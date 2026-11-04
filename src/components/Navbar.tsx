import React from 'react';
import { Cpu, Search } from 'lucide-react';

interface NavbarProps {
  onNewSearch: () => void;
  stockfishAvailable: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNewSearch, stockfishAvailable }) => {
  return (
    <header className="border-b border-[#2d2e30] bg-[#1a1b1e]/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={onNewSearch}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#81b64c] to-[#5d8736] flex items-center justify-center text-white shadow-lg shadow-[#81b64c]/20 group-hover:scale-105 transition-transform">
            <span className="text-2xl select-none">♟</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white group-hover:text-[#81b64c] transition-colors">
                Chess Coach
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#81b64c]/20 text-[#81b64c] px-2 py-0.5 rounded-full border border-[#81b64c]/30">
                Chess.com Review
              </span>
            </div>
            <p className="text-xs text-gray-400">Pure Stockfish Engine Analysis</p>
          </div>
        </div>

        {/* Right side stats & actions */}
        <div className="flex items-center gap-3">
          {/* Stockfish Engine Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#262522] border border-[#363531] text-xs font-medium">
            <Cpu className={`w-3.5 h-3.5 ${stockfishAvailable ? 'text-[#81b64c]' : 'text-amber-400'}`} />
            <span className="text-gray-300">Engine:</span>
            <span className={stockfishAvailable ? 'text-[#81b64c] font-semibold' : 'text-amber-400'}>
              {stockfishAvailable ? 'Stockfish 19 UCI' : 'Connecting...'}
            </span>
          </div>

          {/* New Search Button */}
          <button
            onClick={onNewSearch}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#81b64c] hover:bg-[#98c863] text-white font-medium text-xs transition-all shadow-md shadow-[#81b64c]/20"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Match</span>
          </button>
        </div>
      </div>
    </header>
  );
};
