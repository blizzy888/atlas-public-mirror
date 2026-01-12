/**
 * Analysis Hook - Uses global app context for reactive state management
 * Provides live data updates across all components
 */
import { useAppContext } from "../AppContext";
import type { SupplementAnalysis, Supplement, UserProfile } from "@/types";

export interface UseAnalysisReturn {
  analysis: SupplementAnalysis | null;
  lastAnalyzedAt: Date | null;
  isLoading: boolean;
  error: string | null;
  analyze: (supplements: Supplement[], profile: UserProfile) => Promise<void>;
  clearAnalysis: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useAnalysis(): UseAnalysisReturn {
  const { analysis, lastAnalyzedAt, isLoading, error, analyze, clearAnalysis, refresh } =
    useAppContext();

  return {
    analysis,
    lastAnalyzedAt,
    isLoading,
    error,
    analyze,
    clearAnalysis,
    refresh,
  };
}
