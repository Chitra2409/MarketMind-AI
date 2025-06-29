export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: any;
  status: 'active' | 'idle' | 'processing' | 'error';
  lastActivity: string;
  insights: number;
  color: string;
  isEnabled: boolean;
  processingTask?: string;
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
  type: 'trend' | 'alert' | 'success' | 'update' | 'warning';
  timestamp: string;
  agent: string;
  confidence: number;
  tags: string[];
  fullContent?: string;
  sources?: string[];
}

export interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  status: 'ready' | 'generating' | 'scheduled' | 'error';
  progress?: number;
  size?: string;
  insights?: number;
  query?: string;
}

export interface QueryResult {
  id: string;
  query: string;
  status: 'processing' | 'completed' | 'error';
  results?: Insight[];
  timestamp: string;
}