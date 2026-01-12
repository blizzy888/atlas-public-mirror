import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/types";
import type { SupplementAnalysis, Supplement, Product, UserProfile, StoredAnalysis } from "@/types";

type StorageEventListener = () => void;
const listeners = new Set<StorageEventListener>();

export function addStorageListener(listener: StorageEventListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyStorageChange() {
  listeners.forEach(listener => listener());
}

const generateId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      notifyStorageChange();
    } catch {
      // Storage write failed silently
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      notifyStorageChange();
    } catch {
      // Storage remove failed silently
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      notifyStorageChange();
    } catch {
      // Storage clear failed silently
    }
  },

  supplements: {
    async get(): Promise<Supplement[]> {
      const data = await storage.get<Supplement[]>(STORAGE_KEYS.SUPPLEMENTS);
      return Array.isArray(data) ? data : [];
    },

    async set(supplements: Supplement[]): Promise<void> {
      await storage.set(STORAGE_KEYS.SUPPLEMENTS, supplements);
    },

    async add(supplement: Omit<Supplement, "id" | "createdAt">): Promise<Supplement> {
      const supplements = await this.get();
      const newSupplement: Supplement = {
        ...supplement,
        id: generateId("sup"),
        createdAt: new Date().toISOString(),
      };
      await this.set([...supplements, newSupplement]);
      return newSupplement;
    },

    async update(id: string, updates: Partial<Supplement>): Promise<void> {
      const supplements = await this.get();
      const index = supplements.findIndex(s => s.id === id);
      if (index === -1) throw new Error("Supplement not found");

      supplements[index] = { ...supplements[index], ...updates };
      await this.set(supplements);
    },

    async remove(id: string): Promise<void> {
      const supplements = await this.get();
      const filtered = supplements.filter(s => s.id !== id);
      await this.set(filtered);
    },
  },

  // Product operations
  products: {
    async get(): Promise<Product[]> {
      const data = await storage.get<Product[]>(STORAGE_KEYS.PRODUCTS);
      return Array.isArray(data) ? data : [];
    },

    async set(products: Product[]): Promise<void> {
      await storage.set(STORAGE_KEYS.PRODUCTS, products);
    },

    async add(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
      const products = await this.get();
      const newProduct: Product = {
        ...product,
        id: generateId("prod"),
        createdAt: new Date().toISOString(),
      };
      await this.set([...products, newProduct]);
      return newProduct;
    },

    async update(id: string, updates: Partial<Product>): Promise<void> {
      const products = await this.get();
      const index = products.findIndex(p => p.id === id);
      if (index === -1) throw new Error("Product not found");

      products[index] = { ...products[index], ...updates };
      await this.set(products);
    },

    async remove(id: string): Promise<void> {
      const products = await this.get();
      const filtered = products.filter(p => p.id !== id);
      await this.set(filtered);

      // Also detach productId from any supplements belonging to this product
      const supplements = await storage.supplements.get();
      const updatedSupplements = supplements.map(s =>
        s.productId === id ? { ...s, productId: undefined } : s
      );
      await storage.supplements.set(updatedSupplements);
    },
  },

  // Profile operations
  profile: {
    async get(): Promise<UserProfile> {
      const data = await storage.get<UserProfile>(STORAGE_KEYS.PROFILE);
      return data && typeof data === "object" ? data : {};
    },

    async set(profile: UserProfile): Promise<void> {
      await storage.set(STORAGE_KEYS.PROFILE, profile);
    },

    async update(updates: Partial<UserProfile>): Promise<void> {
      const current = await this.get();
      await this.set({ ...current, ...updates });
    },
  },

  // Analysis operations
  analysis: {
    async get(): Promise<{
      analysis: SupplementAnalysis | null;
      lastAnalyzedAt: Date | null;
    }> {
      const stored = await storage.get<StoredAnalysis>(STORAGE_KEYS.ANALYSIS);
      if (!stored || typeof stored !== "object") return { analysis: null, lastAnalyzedAt: null };

      return {
        analysis: stored.analysis,
        lastAnalyzedAt: stored.lastAnalyzedAt ? new Date(stored.lastAnalyzedAt) : null,
      };
    },

    async set(analysis: SupplementAnalysis | null, lastAnalyzedAt: Date | null): Promise<void> {
      const dataToSave: StoredAnalysis = {
        analysis,
        lastAnalyzedAt: lastAnalyzedAt?.toISOString() || null,
      };
      await storage.set(STORAGE_KEYS.ANALYSIS, dataToSave);
    },
  },
};
