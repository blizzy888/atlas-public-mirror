import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { storage, addStorageListener } from "./storage";
import { analyzeSupplements } from "./api/analysisService";
import type { Supplement, Product, UserProfile, SupplementAnalysis } from "@/types";

interface AppState {
  supplements: Supplement[];
  products: Product[];
  profile: UserProfile;
  analysis: SupplementAnalysis | null;
  lastAnalyzedAt: Date | null;
  isLoading: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  addSupplement: (supplement: Omit<Supplement, "id" | "createdAt">) => Promise<Supplement>;
  updateSupplement: (id: string, updates: Partial<Supplement>) => Promise<void>;
  removeSupplement: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setProfile: (profile: UserProfile) => Promise<void>;
  analyze: (supplements: Supplement[], profile: UserProfile) => Promise<void>;
  clearAnalysis: () => Promise<void>;
  clearStorage: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const initialState: AppState = {
  supplements: [],
  products: [],
  profile: {},
  analysis: null,
  lastAnalyzedAt: null,
  isLoading: true,
  error: null,
};

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    let isMounted = true;

    const loadAllData = async () => {
      if (!isMounted) return;

      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        const [supplements, products, profileData, analysisData] = await Promise.all([
          storage.supplements.get(),
          storage.products.get(),
          storage.profile.get(),
          storage.analysis.get(),
        ]);

        if (isMounted) {
          setState(prev => ({
            ...prev,
            supplements,
            products,
            profile: profileData,
            analysis: analysisData.analysis,
            lastAnalyzedAt: analysisData.lastAnalyzedAt,
            isLoading: false,
            error: null,
          }));
        }
      } catch (error) {
        if (isMounted) {
          setState(prev => ({
            ...prev,
            error: error instanceof Error ? error.message : "Failed to load app data",
            isLoading: false,
          }));
        }
      }
    };

    loadAllData();

    const unsubscribe = addStorageListener(() => {
      loadAllData();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const addSupplement = async (supplementData: Omit<Supplement, "id" | "createdAt">) => {
    try {
      setState(prev => ({ ...prev, error: null, isLoading: true }));
      const newSupplement = await storage.supplements.add(supplementData);
      return newSupplement;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to add supplement",
        isLoading: false,
      }));
      throw error;
    }
  };

  const updateSupplement = async (id: string, updates: Partial<Supplement>) => {
    try {
      setState(prev => ({ ...prev, error: null, isLoading: true }));
      await storage.supplements.update(id, updates);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to update supplement",
        isLoading: false,
      }));
      throw error;
    }
  };

  const removeSupplement = async (id: string) => {
    try {
      setState(prev => ({ ...prev, error: null, isLoading: true }));
      await storage.supplements.remove(id);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to remove supplement",
        isLoading: false,
      }));
      throw error;
    }
  };

  const addProduct = async (productData: Omit<Product, "id" | "createdAt">) => {
    try {
      setState(prev => ({ ...prev, error: null, isLoading: true }));
      const newProduct = await storage.products.add(productData);
      return newProduct;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to add product",
        isLoading: false,
      }));
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setState(prev => ({ ...prev, error: null, isLoading: true }));
      await storage.products.update(id, updates);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to update product",
        isLoading: false,
      }));
      throw error;
    }
  };

  const removeProduct = async (id: string) => {
    try {
      setState(prev => ({ ...prev, error: null, isLoading: true }));
      await storage.products.remove(id);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to remove product",
        isLoading: false,
      }));
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await storage.profile.update(updates);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to update profile",
      }));
      throw error;
    }
  };

  const setProfile = async (profile: UserProfile) => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await storage.profile.set(profile);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to set profile",
      }));
      throw error;
    }
  };

  const analyze = async (supplements: Supplement[], profile: UserProfile) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const analysisData = await analyzeSupplements(supplements, profile);
      const analysisDate = new Date();
      await storage.analysis.set(analysisData, analysisDate);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to analyze supplements",
      }));
      throw error;
    }
  };

  const clearAnalysis = async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await storage.analysis.set(null, null);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to clear analysis",
      }));
      throw error;
    }
  };

  const clearStorage = async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      await storage.clear();
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to clear storage",
      }));
      throw error;
    }
  };

  const refresh = async () => {
      try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const [supplements, products, profileData, analysisData] = await Promise.all([
        storage.supplements.get(),
        storage.products.get(),
        storage.profile.get(),
        storage.analysis.get(),
      ]);

      setState(prev => ({
        ...prev,
        supplements,
        products,
        profile: profileData,
        analysis: analysisData.analysis,
        lastAnalyzedAt: analysisData.lastAnalyzedAt,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to refresh data",
        isLoading: false,
      }));
    }
  };

  const contextValue: AppContextType = {
    ...state,
    supplements: state.supplements || [],
    products: state.products || [],
    profile: state.profile || {},
    analysis: state.analysis,
    lastAnalyzedAt: state.lastAnalyzedAt,
    isLoading: state.isLoading,
    error: state.error,
    addSupplement,
    updateSupplement,
    removeSupplement,
    addProduct,
    updateProduct,
    removeProduct,
    updateProfile,
    setProfile,
    analyze,
    clearAnalysis,
    clearStorage,
    refresh,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// Hook to use the app context
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
