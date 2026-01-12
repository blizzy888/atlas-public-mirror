/**
 * Profile Hook - Uses global app context for reactive state management
 * Provides live data updates across all components
 */
import { useAppContext } from "../AppContext";
import type { UserProfile } from "@/types";

export interface UseProfileReturn {
  profile: UserProfile;
  isLoading: boolean;
  error: string | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setProfile: (profile: UserProfile) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const { profile, isLoading, error, updateProfile, setProfile, refresh } = useAppContext();

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    setProfile,
    refresh,
  };
}
