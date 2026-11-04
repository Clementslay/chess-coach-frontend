import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chess } from 'chess.js';
import { Navbar } from './components/Navbar';
import { MatchSearch } from './components/MatchSearch';
import { ChessboardView } from './components/ChessboardView';
import { EvalBar } from './components/EvalBar';
import { PlayerHeader } from './components/PlayerHeader';
import { StockfishCoachPanel } from './components/StockfishCoachPanel';
import { MoveList } from './components/MoveList';
import { GameReviewSummary } from './components/GameReviewSummary';
import { AdvantageChart } from './components/AdvantageChart';
import { MoveControls } from './components/MoveControls';
import { GameAnalysisResponse, MoveEvaluation } from './types/chess';
import { checkHealth, analyzeGame } from './services/api';
import { 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  RotateCcw, 
  Sparkles, 
  ListOrdered, 
  Trophy, 
  TrendingUp 
} from 'lucide-react';

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0
};

export const App: React.FC = () => {
  const [stockfishAvailable, setStockfishAvailable] = useState(false);
  const [analysis, setAnalysis] = useState<GameAnalysisResponse | null>(null);
  const [currentPly, setCurrentPly] = useState(0);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'coach' | 'moves' | 'summary' | 'graph'>('coach');

  // Check health on mount
  useEffect(() => {
    checkHealth()
      .then((data) => setStockfishAvailable(data.stockfish_available))
      .catch(() => setStockfishAvailable(false));
  }, []);

  // Handle game analysis
  const handleAnalyzeGame = async (urlOrPgn: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await analyzeGame(urlOrPgn);
      setAnalysis(result);
      setCurrentPly(0);
      setIsPlaying(false);
      setMobileTab('coach');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze game.');
    } finally {
      setIsLoading(false);
    }
  };

  // Current move
  const currentMove: MoveEvaluation | undefined = useMemo(() => {
    if (!analysis || currentPly <= 0) return undefined;
    return analysis.moves[currentPly - 1];
  }, [analysis, currentPly]);

  // Current FEN
  const currentFen = useMemo(() => {
    if (!analysis || currentPly === 0) {
      return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }
    return analysis.moves[currentPly - 1]?.fen_after || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  }, [analysis, currentPly]);

  // Calculate captured pieces & material difference
  const { whiteCaptured, blackCaptured, materialDifference } = useMemo(() => {
    try {
      const chess = new Chess(currentFen);
      const board = chess.board();
      const whitePieces: string[] = [];
      const blackPieces: string[] = [];

      for (const row of board) {
        for (const square of row) {
          if (square) {
            if (square.color === 'w') whitePieces.push(square.type);
            else blackPieces.push(square.type);
          }
        }
      }

      // Initial piece counts
      const standard = ['p','p','p','p','p','p','p','p','n','n','b','b','r','r','q'];
      
      const countPieces = (arr: string[]) => {
        const counts: Record<string, number> = {};
        for (const p of arr) counts[p] = (counts[p] || 0) + 1;
        return counts;
      };

      const wCounts = countPieces(whitePieces);
      const bCounts = countPieces(blackPieces);

      // Captured by White = missing black pieces
      const capturedByWhite: string[] = [];
      // Captured by Black = missing white pieces
      const capturedByBlack: string[] = [];

      for (const p of standard) {
        if (bCounts[p] && bCounts[p] > 0) bCounts[p]--;
        else capturedByWhite.push(p);

        if (wCounts[p] && wCounts[p] > 0) wCounts[p]--;
        else capturedByBlack.push(p.toUpperCase());
      }

      // Material score calculation
      let whiteScore = 0;
      let blackScore = 0;
      for (const p of whitePieces) whiteScore += PIECE_VALUES[p] || 0;
      for (const p of blackPieces) blackScore += PIECE_VALUES[p] || 0;

      return {
        whiteCaptured: capturedByWhite,
        blackCaptured: capturedByBlack,
        materialDifference: whiteScore - blackScore // > 0 White leads
      };
    } catch {
      return { whiteCaptured: [], blackCaptured: [], materialDifference: 0 };
    }
  }, [currentFen]);

  // Navigation handlers
  const handleFirst = useCallback(() => setCurrentPly(0), []);
  const handlePrev = useCallback(() => setCurrentPly((p) => Math.max(0, p - 1)), []);
  const handleNext = useCallback(() => {
    if (!analysis) return;
    setCurrentPly((p) => Math.min(analysis.moves.length, p + 1));
  }, [analysis]);
  const handleLast = useCallback(() => {
    if (!analysis) return;
    setCurrentPly(analysis.moves.length);
  }, [analysis]);
  const handleTogglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  const handleFlipBoard = useCallback(() => {
    setBoardOrientation((o) => (o === 'white' ? 'black' : 'white'));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!analysis) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleFirst();
      } else if (e.key === 'End') {
        e.preventDefault();
        handleLast();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleFlipBoard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [analysis, handlePrev, handleNext, handleTogglePlay, handleFirst, handleLast, handleFlipBoard]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || !analysis) return;

    if (currentPly >= analysis.moves.length) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentPly((p) => p + 1);
    }, 1300);

    return () => clearTimeout(timer);
  }, [isPlaying, currentPly, analysis]);

  // Win probability and score for eval bar
  const scoreDisplay = currentMove ? currentMove.score_display : '0.0';
  const winProbability = useMemo(() => {
    if (!currentMove) return 50.0;
    // Normalized to White win %
    if (currentMove.player === 'white') {
      return currentMove.win_probability;
    } else {
      return 100.0 - currentMove.win_probability;
    }
  }, [currentMove]);

  return (
    <div className="min-h-screen bg-[#161719] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        onNewSearch={() => setAnalysis(null)}
        stockfishAvailable={stockfishAvailable}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 py-3 sm:px-4 sm:py-6 lg:px-8">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-4 text-white p-4">
            <Loader2 className="w-10 h-10 text-[#81b64c] animate-spin" />
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-bold">Stockfish Engine Analyzing Match...</h3>
              <p className="text-xs sm:text-sm text-gray-400">Evaluating moves, centipawn losses & tactical commentary</p>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs sm:text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white font-bold ml-4 p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* View 1: Search Form */}
        {!analysis ? (
          <MatchSearch onAnalyze={handleAnalyzeGame} isLoading={isLoading} />
        ) : (
          /* View 2: Active Match Review */
          <div className="space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Top Match Info Banner */}
            <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#262522] border border-[#363531]">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <button
                  onClick={() => setAnalysis(null)}
                  className="p-2 rounded-xl bg-[#1e2022] hover:bg-[#363531] text-gray-400 hover:text-white transition-colors shrink-0 active:scale-95"
                  title="Return to Match Search"
                  aria-label="Return to Match Search"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                    <h2 className="text-xs sm:text-base font-bold text-white truncate max-w-[160px] xs:max-w-[240px] sm:max-w-none">
                      {analysis.header.white} vs {analysis.header.black}
                    </h2>
                    <span className="text-[10px] sm:text-xs font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded bg-[#81b64c]/20 text-[#81b64c] border border-[#81b64c]/30 shrink-0">
                      {analysis.header.result}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400 mt-0.5">
                    {analysis.header.event && <span className="truncate max-w-[120px] xs:max-w-none">{analysis.header.event}</span>}
                    {analysis.header.eco && (
                      <span className="font-mono bg-[#1e2022] px-1 py-0.2 rounded shrink-0">
                        {analysis.header.eco}
                      </span>
                    )}
                    {analysis.header.date && (
                      <span className="hidden xs:flex items-center gap-1 shrink-0">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        {analysis.header.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick action to flip board */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleFlipBoard}
                  title={`Playing as ${boardOrientation === 'white' ? 'White' : 'Black'}. Click to flip.`}
                  className="px-2.5 py-1.5 rounded-xl bg-[#1e2022] hover:bg-[#363531] text-[11px] sm:text-xs font-semibold text-gray-300 border border-[#363531] transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                  <span className="hidden sm:inline">Flip: {boardOrientation === 'white' ? 'Black' : 'White'}</span>
                  <span className="sm:hidden capitalize">{boardOrientation === 'white' ? 'Black' : 'White'}</span>
                </button>
              </div>
            </div>

            {/* ======================================================== */}
            {/* DESKTOP LAYOUT (Screen >= lg) */}
            {/* ======================================================== */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Board + Headers + EvalBar + Universal Controls + Flow (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                {/* Top Player Header (Opponent) */}
                <PlayerHeader
                  color={boardOrientation === 'white' ? 'black' : 'white'}
                  name={boardOrientation === 'white' ? analysis.header.black : analysis.header.white}
                  rating={boardOrientation === 'white' ? analysis.header.black_elo : analysis.header.white_elo}
                  capturedPieces={boardOrientation === 'white' ? blackCaptured : whiteCaptured}
                  materialDifference={boardOrientation === 'white' ? -materialDifference : materialDifference}
                  isCurrentTurn={currentPly % 2 === (boardOrientation === 'white' ? 1 : 0)}
                  result={analysis.header.result}
                />

                {/* Board + Dynamic Eval Bar */}
                <div className="flex items-stretch justify-center gap-2 sm:gap-3 w-full">
                  <div className="w-7 sm:w-8 shrink-0 flex flex-col">
                    <EvalBar
                      scoreDisplay={scoreDisplay}
                      winProbability={winProbability}
                      orientation={boardOrientation}
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex justify-center">
                    <ChessboardView
                      currentFen={currentFen}
                      currentMove={currentMove}
                      orientation={boardOrientation}
                      onFlipOrientation={handleFlipBoard}
                      onSwipeLeft={handleNext}
                      onSwipeRight={handlePrev}
                    />
                  </div>
                </div>

                {/* Bottom Player Header (User) */}
                <PlayerHeader
                  color={boardOrientation === 'white' ? 'white' : 'black'}
                  name={boardOrientation === 'white' ? analysis.header.white : analysis.header.black}
                  rating={boardOrientation === 'white' ? analysis.header.white_elo : analysis.header.black_elo}
                  capturedPieces={boardOrientation === 'white' ? whiteCaptured : blackCaptured}
                  materialDifference={boardOrientation === 'white' ? materialDifference : -materialDifference}
                  isCurrentTurn={currentPly % 2 === (boardOrientation === 'white' ? 0 : 1)}
                  result={analysis.header.result}
                />

                {/* Universal Move Navigation Bar */}
                <MoveControls
                  currentPly={currentPly}
                  totalPlies={analysis.moves.length}
                  currentMove={currentMove}
                  isPlaying={isPlaying}
                  onFirst={handleFirst}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onLast={handleLast}
                  onTogglePlay={handleTogglePlay}
                  onFlipBoard={handleFlipBoard}
                />

                {/* Advantage Chart */}
                <AdvantageChart
                  evalCurve={analysis.eval_curve}
                  currentPly={currentPly}
                  onSelectPly={(ply) => setCurrentPly(ply)}
                />
              </div>

              {/* Right Column: Coach Commentary, Move List & Accuracy (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {/* Stockfish Coach Panel */}
                <StockfishCoachPanel
                  currentMove={currentMove}
                  currentPly={currentPly}
                  totalPlies={analysis.moves.length}
                  isPlaying={isPlaying}
                  onFirst={handleFirst}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onLast={handleLast}
                  onTogglePlay={handleTogglePlay}
                />

                {/* Move List */}
                <MoveList
                  moves={analysis.moves}
                  currentPly={currentPly}
                  onSelectPly={(ply) => setCurrentPly(ply)}
                />

                {/* Game Review Summary */}
                <GameReviewSummary
                  whiteName={analysis.header.white}
                  blackName={analysis.header.black}
                  whiteAccuracy={analysis.white_accuracy}
                  blackAccuracy={analysis.black_accuracy}
                  summary={analysis.classifications_summary}
                />
              </div>
            </div>

            {/* ======================================================== */}
            {/* MOBILE & TABLET LAYOUT (Screen < lg) */}
            {/* ======================================================== */}
            <div className="lg:hidden flex flex-col gap-3">
              {/* Top Player Header (Opponent) */}
              <PlayerHeader
                color={boardOrientation === 'white' ? 'black' : 'white'}
                name={boardOrientation === 'white' ? analysis.header.black : analysis.header.white}
                rating={boardOrientation === 'white' ? analysis.header.black_elo : analysis.header.white_elo}
                capturedPieces={boardOrientation === 'white' ? blackCaptured : whiteCaptured}
                materialDifference={boardOrientation === 'white' ? -materialDifference : materialDifference}
                isCurrentTurn={currentPly % 2 === (boardOrientation === 'white' ? 1 : 0)}
                result={analysis.header.result}
              />

              {/* Board + Slim Eval Bar */}
              <div className="flex items-stretch justify-center gap-1.5 xs:gap-2 w-full">
                <div className="w-4 xs:w-5 sm:w-6 shrink-0 flex flex-col">
                  <EvalBar
                    scoreDisplay={scoreDisplay}
                    winProbability={winProbability}
                    orientation={boardOrientation}
                  />
                </div>

                <div className="flex-1 min-w-0 flex justify-center">
                  <ChessboardView
                    currentFen={currentFen}
                    currentMove={currentMove}
                    orientation={boardOrientation}
                    onFlipOrientation={handleFlipBoard}
                    onSwipeLeft={handleNext}
                    onSwipeRight={handlePrev}
                  />
                </div>
              </div>

              {/* Bottom Player Header (User) */}
              <PlayerHeader
                color={boardOrientation === 'white' ? 'white' : 'black'}
                name={boardOrientation === 'white' ? analysis.header.white : analysis.header.black}
                rating={boardOrientation === 'white' ? analysis.header.white_elo : analysis.header.black_elo}
                capturedPieces={boardOrientation === 'white' ? whiteCaptured : blackCaptured}
                materialDifference={boardOrientation === 'white' ? materialDifference : -materialDifference}
                isCurrentTurn={currentPly % 2 === (boardOrientation === 'white' ? 0 : 1)}
                result={analysis.header.result}
              />

              {/* High-visibility Thumb-Friendly Move Navigator */}
              <MoveControls
                currentPly={currentPly}
                totalPlies={analysis.moves.length}
                currentMove={currentMove}
                isPlaying={isPlaying}
                onFirst={handleFirst}
                onPrev={handlePrev}
                onNext={handleNext}
                onLast={handleLast}
                onTogglePlay={handleTogglePlay}
                onFlipBoard={handleFlipBoard}
              />

              {/* Segmented Mobile Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#1e2022] rounded-xl border border-[#363531] mt-1 select-none">
                <button
                  onClick={() => setMobileTab('coach')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 sm:py-2.5 px-1 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
                    mobileTab === 'coach'
                      ? 'bg-[#81b64c] text-white shadow-md shadow-[#81b64c]/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#262522]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Coach</span>
                </button>

                <button
                  onClick={() => setMobileTab('moves')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 sm:py-2.5 px-1 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
                    mobileTab === 'moves'
                      ? 'bg-[#81b64c] text-white shadow-md shadow-[#81b64c]/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#262522]'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Moves</span>
                </button>

                <button
                  onClick={() => setMobileTab('summary')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 sm:py-2.5 px-1 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
                    mobileTab === 'summary'
                      ? 'bg-[#81b64c] text-white shadow-md shadow-[#81b64c]/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#262522]'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Summary</span>
                </button>

                <button
                  onClick={() => setMobileTab('graph')}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 sm:py-2.5 px-1 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
                    mobileTab === 'graph'
                      ? 'bg-[#81b64c] text-white shadow-md shadow-[#81b64c]/20'
                      : 'text-gray-400 hover:text-white hover:bg-[#262522]'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Flow</span>
                </button>
              </div>

              {/* Mobile Active Tab Content */}
              <div className="transition-all duration-200">
                {mobileTab === 'coach' && (
                  <StockfishCoachPanel
                    currentMove={currentMove}
                    currentPly={currentPly}
                    totalPlies={analysis.moves.length}
                    isPlaying={isPlaying}
                    onFirst={handleFirst}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onLast={handleLast}
                    onTogglePlay={handleTogglePlay}
                    hideNavControls={true}
                  />
                )}

                {mobileTab === 'moves' && (
                  <MoveList
                    moves={analysis.moves}
                    currentPly={currentPly}
                    onSelectPly={(ply) => setCurrentPly(ply)}
                  />
                )}

                {mobileTab === 'summary' && (
                  <GameReviewSummary
                    whiteName={analysis.header.white}
                    blackName={analysis.header.black}
                    whiteAccuracy={analysis.white_accuracy}
                    blackAccuracy={analysis.black_accuracy}
                    summary={analysis.classifications_summary}
                  />
                )}

                {mobileTab === 'graph' && (
                  <AdvantageChart
                    evalCurve={analysis.eval_curve}
                    currentPly={currentPly}
                    onSelectPly={(ply) => setCurrentPly(ply)}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
