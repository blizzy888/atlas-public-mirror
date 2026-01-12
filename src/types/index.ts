/**
 * App Types - All domain models and types for the supplement tracker
 */
import { z } from "zod";

// Supplement types
export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing?: string;
  productId?: string;
  createdAt: string;
}

export interface NewSupplement {
  name: string;
  dosage: string;
  frequency: string;
  timing?: string;
  productId?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  brand?: string;
  timing?: string;
  imageUri?: string;
  createdAt: string;
}

export interface NewProduct {
  name: string;
  brand?: string;
  timing?: string;
  imageUri?: string;
}

// User profile type
export interface UserProfile {
  name?: string;
  age?: string;
  gender?: string;
  weight?: string;
  healthGoals?: string;
  medicalConditions?: string;
  currentMedications?: string;
  allergies?: string;
}

// Analysis types
export const SupplementAnalysisSchema = z.object({
  summary: z.object({
    overallStatus: z.enum(["optimal", "good", "needs_attention", "critical"]),
    keyMessage: z.string(),
    supplementCount: z.number(),
    issueCount: z.number(),
    benefitCount: z.number(),
    nextAction: z.string().optional(),
    scoreBreakdown: z
      .object({
        safety: z.number().min(0).max(100),
        effectiveness: z.number().min(0).max(100),
        personalization: z.number().min(0).max(100),
      })
      .optional(),
  }),
  alerts: z.array(
    z.object({
      priority: z.enum(["critical", "warning", "info"]),
      title: z.string(),
      message: z.string(),
    })
  ),
  supplements: z.array(
    z.object({
      name: z.string(),
      assessment: z.string(),
      current: z.object({
        dosage: z.string(),
        frequency: z.string(),
      }),
      optimal: z.object({
        dosageRange: z.string(),
        frequency: z.string(),
      }),
      effectiveness: z.object({
        rating: z.number().min(1).max(10),
        expectedBenefits: z.array(z.string()),
      }),
      safety: z.object({
        rating: z.number().min(1).max(10),
        concerns: z.array(z.string()),
      }),
    })
  ),
  interactions: z.array(
    z.object({
      supplements: z.array(z.string()),
      type: z.enum(["synergistic", "competitive", "antagonistic", "neutral"]),
      severity: z.enum(["beneficial", "mild", "moderate", "severe", "critical"]),
      description: z.string(),
      management: z.object({
        recommendation: z.string(),
      }),
    })
  ),
  opportunities: z.array(
    z.object({
      priority: z.enum(["high", "medium", "low"]),
      title: z.string(),
      description: z.string(),
      expectedBenefit: z.string(),
      implementation: z.object({
        steps: z.array(z.string()),
        timeframe: z.string(),
        cost: z.enum(["free", "low", "medium", "high"]),
        difficulty: z.enum(["easy", "moderate", "challenging"]),
      }),
      evidence: z.enum(["strong", "moderate", "limited", "emerging"]),
    })
  ),
  insights: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      relevance: z.enum(["high", "medium", "low"]),
      recommendations: z.array(z.string()).optional(),
    })
  ),
  progressTracking: z
    .object({
      biomarkers: z.array(
        z.object({
          name: z.string(),
          target: z.string().optional(),
          timeline: z.string(),
        })
      ),
      checkpoints: z.array(
        z.object({
          timeframe: z.string(),
          expectations: z.array(z.string()),
        })
      ),
    })
    .optional(),
  education: z
    .array(
      z.object({
        topic: z.string(),
        content: z.string(),
        importance: z.enum(["high", "medium", "low"]),
      })
    )
    .optional(),
  disclaimer: z.string(),
  metadata: z.object({
    analysisDate: z.string(),
    analysisVersion: z.string().optional(),
    requestId: z.string().optional(),
  }),
});

export type SupplementAnalysis = z.infer<typeof SupplementAnalysisSchema>;

export interface AnalysisRequest {
  supplements: {
    name: string;
    dosage: string;
    frequency: string;
    timing?: string;
  }[];
  profile: {
    age?: string;
    gender?: string;
    weight?: string;
    healthGoals?: string;
    medicalConditions?: string;
    currentMedications?: string;
    allergies?: string;
  };
}

export interface AnalysisConfig {
  model: string;
}

// Stored analysis type
export interface StoredAnalysis {
  analysis: SupplementAnalysis | null;
  lastAnalyzedAt: string | null;
}

// Storage keys
export const STORAGE_KEYS = {
  SUPPLEMENTS: "@atlas_supplements",
  PRODUCTS: "@atlas_products",
  PROFILE: "@atlas_profile",
  ANALYSIS: "@atlas_analysis",
} as const;
