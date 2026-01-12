/**
 * Products Hook - Uses global app context for reactive state management
 * Provides live data updates across all components
 */
import { useAppContext } from "../AppContext";
import type { Product } from "@/types";

export interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const { products, isLoading, error, addProduct, updateProduct, removeProduct, refresh } =
    useAppContext();

  return {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    removeProduct,
    refresh,
  };
}
