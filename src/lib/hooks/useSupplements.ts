/**
 * Supplements Hook - Uses global app context for reactive state management
 * Provides live data updates across all components
 */
import { useAppContext } from "../AppContext";
import type { Supplement, NewSupplement } from "@/types";

export interface UseSupplementsReturn {
  supplements: Supplement[];
  isLoading: boolean;
  error: string | null;
  addSupplement: (supplement: NewSupplement) => Promise<Supplement>;
  updateSupplement: (id: string, updates: Partial<Supplement>) => Promise<void>;
  removeSupplement: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useSupplements(): UseSupplementsReturn {
  const {
    supplements,
    isLoading,
    error,
    addSupplement,
    updateSupplement,
    removeSupplement,
    refresh,
  } = useAppContext();

  return {
    supplements,
    isLoading,
    error,
    addSupplement,
    updateSupplement,
    removeSupplement,
    refresh,
  };
}
