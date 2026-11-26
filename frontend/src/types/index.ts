export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  credits?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AttentionWord {
  word: string;
  alpha: number[];
}

export interface CaptionResponse {
  id: string;
  caption_text: string;
  title?: string | null;
  language?: string;
  tone?: string;
  length?: string;
  platform_captions?: Record<string, string> | null;
  confidence: number;
  inference_time_ms: number;
  image_url?: string | null;
  created_at?: string;
  attention_data: AttentionWord[] | null;
  attention_overlay_url: string | null;
}

export interface EvaluationMetrics {
  'BLEU-1'?: number;
  'BLEU-2'?: number;
  'BLEU-3'?: number;
  'BLEU-4'?: number;
  'METEOR'?: number;
  'CIDEr'?: number;
}

export interface EvaluationRunResponse {
  id: string;
  triggered_by: string;
  execution_time_s: number;
  bleu_1: number;
  bleu_2: number;
  bleu_3: number;
  bleu_4: number;
  meteor: number;
  cider: number;
  created_at: string;
}
