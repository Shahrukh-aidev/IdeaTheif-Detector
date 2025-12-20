
export enum MatchType {
  CONCEPTUAL = 'Conceptual',
  IMPLEMENTATION = 'Implementation',
  PAPER = 'Research Paper',
  QA = 'Q&A / Discussions',
  STARTUP = 'Startup/Product',
  HACKATHON = 'Hackathon Project',
  BLOG = 'Technical Blog/Write-up'
}

export interface Match {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  similarity: number;
  matchType: MatchType;
  metadata?: {
    stars?: number;
    citations?: number;
    year?: string;
    classification?: {
      type: string;
      focus: 'Conceptual' | 'Execution' | 'Hybrid';
    };
    tags?: string[];
  };
}

export interface IdeaLineage {
  ancestors: string[]; // Older foundational concepts
  siblings: string[]; // Current similar attempts
  unexploredBranches: string[]; // Potential unique pivots
}

export interface NoveltyDimensions {
  concept: number; // 0-100
  execution: number; // 0-100
  domainTransfer: number; // 0-100
}

export interface psychologicalAnalysis {
  marketHook: string; // Why it matters emotionally/practically
  failureSignals: string[]; // UX issues, timing, etc.
}

export interface NeighborhoodIntel {
  industryTrend: 'Rising' | 'Saturated' | 'Stagnant';
  activityLevel: number; // 1-10
  intelDrop: string; // "3 similar ideas popped up in your industry this month"
}

export interface AnalysisResult {
  id: string; // For local sync/history
  timestamp: number;
  ideaText: string;
  uniquenessScore: number;
  noveltyLevel: 'Novel' | 'Incremental' | 'Reapplication' | 'Duplicate';
  honestVerdict: string; // "Brutally honest verdict sentence"
  summary: string;
  dimensions: NoveltyDimensions;
  lineage: IdeaLineage;
  psychology: psychologicalAnalysis;
  intel: NeighborhoodIntel;
  hotZoneAlert: boolean;
  matches: Match[];
  suggestions: string[];
  confidence: number;
  groundingUrls: string[];
  explainability: string; // Plain English breakdown of the score
}

export interface LocalProject {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
}
