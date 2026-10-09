export interface DocumentItem {
  id?: number;
  name: string;
  file_type?: string;
  size_bytes?: number;
  chunk_count?: number;
  status?: string;
  created_at?: string;
  pages?: number;
}

export interface DashboardStats {
  overall_score: number;
  experiments: number;
  tests: number;
  failures: number;
  critical_failures: number;
}
