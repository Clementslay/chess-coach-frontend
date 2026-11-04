export interface PlayerProfile {
  username: string;
  player_id?: number;
  title?: string;
  avatar?: string;
  country?: string;
  status?: string;
  rapid_rating?: number;
  blitz_rating?: number;
  bullet_rating?: number;
}

export interface GameListItem {
  id: string;
  url: string;
  white_username: string;
  white_rating?: number;
  white_result?: string;
  black_username: string;
  black_rating?: number;
  black_result?: string;
  time_control?: string;
  time_class?: string;
  eco?: string;
  eco_url?: string;
  date?: string;
  winner?: 'white' | 'black' | 'draw';
}

export type MoveClassification = 
  | 'BRILLIANT'
  | 'GREAT'
  | 'BEST'
  | 'EXCELLENT'
  | 'GOOD'
  | 'BOOK'
  | 'INACCURACY'
  | 'MISTAKE'
  | 'BLUNDER'
  | 'MISS';

export interface MoveEvaluation {
  ply: number;
  move_number: number;
  san: string;
  uci: string;
  fen_before: string;
  fen_after: string;
  player: 'white' | 'black';
  score_cp?: number;
  score_mate?: number;
  score_display: string;
  win_probability: number;
  win_prob_drop: number;
  centipawn_loss: number;
  classification: MoveClassification;
  suggested_move_san?: string;
  suggested_move_uci?: string;
  suggested_score_display?: string;
  pv: string[];
  commentary: string;
  tactical_tags: string[];
}

export interface GameHeader {
  event?: string;
  site?: string;
  date?: string;
  white: string;
  black: string;
  result: string;
  white_elo?: string;
  black_elo?: string;
  time_control?: string;
  eco?: string;
  eco_name?: string;
  url?: string;
}

export interface ClassificationBreakdown {
  white: Record<string, number>;
  black: Record<string, number>;
}

export interface EvalCurvePoint {
  ply: number;
  move_number: number;
  san: string;
  player?: 'white' | 'black';
  score: number;
  win_prob: number;
}

export interface GameAnalysisResponse {
  header: GameHeader;
  white_accuracy: number;
  black_accuracy: number;
  classifications_summary: ClassificationBreakdown;
  moves: MoveEvaluation[];
  eval_curve: EvalCurvePoint[];
}
