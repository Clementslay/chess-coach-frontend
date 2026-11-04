import { PlayerProfile, GameListItem, GameAnalysisResponse } from '../types/chess';

const RAW_API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = RAW_API_URL 
  ? `${RAW_API_URL.replace(/\/+$/, '')}/api` 
  : '/api';

export async function checkHealth(): Promise<{ status: string; stockfish_available: boolean; stockfish_path?: string }> {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error('Failed to connect to chess engine backend');
  return res.json();
}

export async function getPlayerProfile(username: string): Promise<PlayerProfile> {
  const res = await fetch(`${BASE_URL}/player/${encodeURIComponent(username.trim())}/profile`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Could not find Chess.com player "${username}"`);
  }
  return res.json();
}

export async function getPlayerGames(username: string, limit: number = 20): Promise<GameListItem[]> {
  const res = await fetch(`${BASE_URL}/player/${encodeURIComponent(username.trim())}/games?limit=${limit}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Failed to fetch games for "${username}"`);
  }
  return res.json();
}

export async function analyzeGame(urlOrPgn: string): Promise<GameAnalysisResponse> {
  const res = await fetch(`${BASE_URL}/game/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url_or_pgn: urlOrPgn.trim() })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Game evaluation failed. Please check the URL or PGN.');
  }
  return res.json();
}
