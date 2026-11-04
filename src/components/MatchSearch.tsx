import React, { useState } from 'react';
import { Search, Link as LinkIcon, User, Swords, ArrowRight, Loader2, Trophy, Clock, FileText } from 'lucide-react';
import { GameListItem, PlayerProfile } from '../types/chess';
import { getPlayerProfile, getPlayerGames } from '../services/api';

interface MatchSearchProps {
  onAnalyze: (urlOrPgn: string) => void;
  isLoading: boolean;
}

const SAMPLE_GAMES = [
  {
    name: 'Hikaru Nakamura (Live Blitz)',
    url: 'https://www.chess.com/game/live/184727190848',
    desc: '3+0 Blitz, King\'s Indian Defense'
  },
  {
    name: 'Scholar\'s Mate Miniature',
    pgn: `[Event "Scholar's Mate Demo"]\n[White "Aggressive Attacker"]\n[Black "Casual Player"]\n[Result "1-0"]\n\n1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7# 1-0`,
    desc: '4-move tactical demonstration with blunder & checkmate'
  },
  {
    name: 'Immortal Game (Adolf Anderssen)',
    pgn: `[Event "London 1851"]\n[White "Adolf Anderssen"]\n[Black "Lionel Kieseritzky"]\n[Result "1-0"]\n\n1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7# 1-0`,
    desc: 'Double rook & queen sacrifice'
  }
];

export const MatchSearch: React.FC<MatchSearchProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'username' | 'link' | 'pgn'>('username');
  const [inputVal, setInputVal] = useState('hikaru');
  const [pgnVal, setPgnVal] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [playerGames, setPlayerGames] = useState<GameListItem[]>([]);

  const handleSearchPlayer = async (usernameToSearch?: string) => {
    const username = (usernameToSearch || inputVal).trim();
    if (!username) return;

    setSearchLoading(true);
    setErrorMessage(null);
    try {
      const [profile, games] = await Promise.all([
        getPlayerProfile(username),
        getPlayerGames(username, 15)
      ]);
      setPlayerProfile(profile);
      setPlayerGames(games);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error fetching player details');
      setPlayerProfile(null);
      setPlayerGames([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmitLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onAnalyze(inputVal.trim());
  };

  const handleSubmitPgn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pgnVal.trim()) return;
    onAnalyze(pgnVal.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Search Header */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#81b64c]/15 text-[#81b64c] text-xs font-semibold uppercase tracking-wider mb-2 sm:mb-3 border border-[#81b64c]/30">
          <Trophy className="w-3.5 h-3.5" />
          Stockfish Game Review
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Evaluate Any Chess.com Match
        </h2>
        <p className="text-gray-400 text-xs sm:text-base max-w-lg mx-auto">
          Search by player username, paste a Chess.com game link, or enter custom PGN. Stockfish will evaluate every move and generate coach commentary.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6 flex-wrap">
        <button
          onClick={() => { setActiveTab('username'); setInputVal('hikaru'); setErrorMessage(null); }}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
            activeTab === 'username'
              ? 'bg-[#81b64c] text-white shadow-lg shadow-[#81b64c]/25'
              : 'bg-[#262522] text-gray-400 hover:text-white border border-[#363531]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Username</span>
        </button>

        <button
          onClick={() => { setActiveTab('link'); setInputVal(''); setErrorMessage(null); }}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
            activeTab === 'link'
              ? 'bg-[#81b64c] text-white shadow-lg shadow-[#81b64c]/25'
              : 'bg-[#262522] text-gray-400 hover:text-white border border-[#363531]'
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          <span>Match Link</span>
        </button>

        <button
          onClick={() => { setActiveTab('pgn'); setErrorMessage(null); }}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
            activeTab === 'pgn'
              ? 'bg-[#81b64c] text-white shadow-lg shadow-[#81b64c]/25'
              : 'bg-[#262522] text-gray-400 hover:text-white border border-[#363531]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Paste PGN</span>
        </button>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-200 text-xs sm:text-sm text-center">
          {errorMessage}
        </div>
      )}

      {/* Mode 1: Search Username */}
      {activeTab === 'username' && (
        <div>
          <form
            onSubmit={(e) => { e.preventDefault(); handleSearchPlayer(); }}
            className="flex flex-col sm:flex-row gap-2 mb-4 sm:mb-6"
          >
            <div className="relative flex-1">
              <User className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter Chess.com username (e.g. hikaru, magnuscarlsen)..."
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl bg-[#262522] border border-[#363531] focus:border-[#81b64c] focus:outline-none text-white placeholder-gray-500 text-xs sm:text-sm transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={searchLoading || !inputVal.trim()}
              className="px-5 py-3 sm:py-3.5 rounded-xl bg-[#81b64c] hover:bg-[#98c863] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#81b64c]/20 shrink-0 active:scale-95"
            >
              {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Find Games</span>
            </button>
          </form>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-6 text-xs text-gray-400">
            <span className="font-medium text-gray-500 text-[11px] sm:text-xs">Popular:</span>
            {['hikaru', 'magnuscarlsen', 'danielnaroditsky', 'danyapawn'].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => { setInputVal(u); handleSearchPlayer(u); }}
                className="px-2 py-1 rounded-lg bg-[#262522] hover:bg-[#363531] text-gray-300 border border-[#363531] text-[11px] sm:text-xs transition-colors active:scale-95"
              >
                @{u}
              </button>
            ))}
          </div>

          {/* Player Profile & Recent Games */}
          {playerProfile && (
            <div className="mb-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#262522] border border-[#363531] flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <img
                  src={playerProfile.avatar || 'https://www.chess.com/bundles/web/images/user-image.svg'}
                  alt={playerProfile.username}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-[#81b64c] shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {playerProfile.title && (
                      <span className="text-[9px] sm:text-[10px] font-bold bg-[#fa412d] text-white px-1.5 py-0.5 rounded shrink-0">
                        {playerProfile.title}
                      </span>
                    )}
                    <h3 className="text-sm sm:text-base font-bold text-white truncate">{playerProfile.username}</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-400 capitalize">{playerProfile.status || 'Active Member'}</p>
                </div>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-2 sm:gap-3 text-xs">
                {playerProfile.rapid_rating && (
                  <div className="text-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-[#1e2022] border border-[#363531]">
                    <span className="text-gray-400 block text-[9px] sm:text-[10px]">Rapid</span>
                    <span className="text-white font-bold">{playerProfile.rapid_rating}</span>
                  </div>
                )}
                {playerProfile.blitz_rating && (
                  <div className="text-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-[#1e2022] border border-[#363531]">
                    <span className="text-gray-400 block text-[9px] sm:text-[10px]">Blitz</span>
                    <span className="text-[#81b64c] font-bold">{playerProfile.blitz_rating}</span>
                  </div>
                )}
                {playerProfile.bullet_rating && (
                  <div className="text-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-[#1e2022] border border-[#363531]">
                    <span className="text-gray-400 block text-[9px] sm:text-[10px]">Bullet</span>
                    <span className="text-amber-400 font-bold">{playerProfile.bullet_rating}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Games list */}
          {playerGames.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Recent Matches ({playerGames.length})
                </h4>
                <span className="text-[11px] text-gray-500 hidden xs:inline">Tap match to review</span>
              </div>

              <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                {playerGames.map((game) => {
                  const isWhite = game.white_username.toLowerCase() === (playerProfile?.username.toLowerCase() || '');
                  const userResult = isWhite ? game.white_result : game.black_result;
                  const isWin = userResult === 'win';
                  const isLoss = ['checkmated', 'resigned', 'timeout', 'abandoned'].includes(userResult || '');

                  return (
                    <div
                      key={game.id || game.url}
                      onClick={() => onAnalyze(game.url)}
                      className="group p-2.5 sm:p-3.5 rounded-xl bg-[#262522] hover:bg-[#2e2d2a] border border-[#363531] hover:border-[#81b64c] cursor-pointer transition-all flex items-center justify-between gap-2.5 sm:gap-4 active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        {/* Result badge */}
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isWin ? 'bg-[#81b64c]/20 text-[#81b64c] border border-[#81b64c]/30' :
                          isLoss ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {isWin ? 'W' : isLoss ? 'L' : 'D'}
                        </div>

                        {/* Players */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white truncate">
                            <span className="truncate">{game.white_username} ({game.white_rating || '?'})</span>
                            <span className="text-gray-500 text-[10px] sm:text-xs font-normal shrink-0">vs</span>
                            <span className="truncate">{game.black_username} ({game.black_rating || '?'})</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400 mt-0.5">
                            {game.time_class && (
                              <span className="flex items-center gap-1 shrink-0">
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span className="capitalize">{game.time_class}</span>
                              </span>
                            )}
                            {game.eco && (
                              <span className="bg-[#1e2022] px-1.5 py-0.2 rounded font-mono text-gray-400 shrink-0">
                                {game.eco}
                              </span>
                            )}
                            {game.date && <span className="truncate hidden xs:inline">{game.date}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Review Action */}
                      <div className="flex items-center gap-1 text-xs font-semibold text-[#81b64c] group-hover:translate-x-1 transition-transform shrink-0">
                        <span className="hidden xs:inline">Review</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Match Link */}
      {activeTab === 'link' && (
        <form onSubmit={handleSubmitLink} className="space-y-4">
          <div className="relative">
            <LinkIcon className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Paste Chess.com game URL (e.g. https://www.chess.com/game/live/184727190848)..."
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 rounded-xl bg-[#262522] border border-[#363531] focus:border-[#81b64c] focus:outline-none text-white placeholder-gray-500 text-xs sm:text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="w-full py-3.5 rounded-xl bg-[#81b64c] hover:bg-[#98c863] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#81b64c]/20 active:scale-95"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Swords className="w-4 h-4" />}
            <span>Analyze Match with Stockfish</span>
          </button>
        </form>
      )}

      {/* Mode 3: Raw PGN */}
      {activeTab === 'pgn' && (
        <form onSubmit={handleSubmitPgn} className="space-y-4">
          <textarea
            rows={5}
            value={pgnVal}
            onChange={(e) => setPgnVal(e.target.value)}
            placeholder="Paste raw chess PGN text here (e.g. [Event ... ] 1. e4 e5 2. Nf3...)..."
            className="w-full p-3 sm:p-4 rounded-xl bg-[#262522] border border-[#363531] focus:border-[#81b64c] focus:outline-none text-white font-mono text-xs placeholder-gray-500 transition-all"
          />

          <button
            type="submit"
            disabled={isLoading || !pgnVal.trim()}
            className="w-full py-3.5 rounded-xl bg-[#81b64c] hover:bg-[#98c863] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-[#81b64c]/20 active:scale-95"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Swords className="w-4 h-4" />}
            <span>Analyze PGN with Stockfish</span>
          </button>
        </form>
      )}

      {/* Preset Demo Games */}
      <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#2d2e30]">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">
          Or try a sample game
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {SAMPLE_GAMES.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => onAnalyze(sample.url || sample.pgn || '')}
              className="p-3 sm:p-3.5 rounded-xl bg-[#262522] hover:bg-[#2f2e2a] border border-[#363531] hover:border-[#81b64c] cursor-pointer transition-all text-left group active:scale-[0.99]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white group-hover:text-[#81b64c] transition-colors truncate pr-1">
                  {sample.name}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#81b64c] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>
              <p className="text-[11px] text-gray-400 leading-snug">{sample.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
