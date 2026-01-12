import { generateObject } from "ai";
import { getModel, getOpenAIApiKey, DEFAULT_TEXT_MODEL } from "./aiClient";
import { SupplementAnalysisSchema } from "@/types";
import type {
  UserProfile,
  Supplement,
  SupplementAnalysis,
  AnalysisRequest,
  AnalysisConfig,
} from "@/types";

const DEFAULT_CONFIG: AnalysisConfig = {
  model: DEFAULT_TEXT_MODEL,
};

const SYSTEM_PROMPT = `You are an expert supplement analysis AI. Analyze the user's supplement stack and provide comprehensive, evidence-based recommendations.

ANALYSIS REQUIREMENTS:
1. SAFETY FIRST: Identify potential interactions, contraindications, and dosage concerns
2. PERSONALIZATION: Consider age, gender, health goals, and medical conditions
3. EFFECTIVENESS ASSESSMENT: Rate each supplement 1-10 for expected benefits
4. OPTIMIZATION STRATEGIES: Suggest improvements and better dosing protocols

OUTPUT FORMAT:
- Provide detailed analysis with specific actionable recommendations
- Include safety warnings and interaction alerts
- Suggest optimal dosages and timing
- Consider long-term health implications

Always respond in valid JSON format matching the required schema.`;

function validateInput(supplements: Supplement[], profile: UserProfile): void {
  if (!supplements?.length) {
    throw new Error("At least one supplement is required for analysis");
  }

  if (supplements.some(s => !s.name || !s.dosage)) {
    throw new Error("All supplements must have a name and dosage");
  }
}

function prepareRequestData(supplements: Supplement[], profile: UserProfile): AnalysisRequest {
  return {
    supplements: supplements.map(s => ({
      name: s.name,
      dosage: s.dosage,
      frequency: s.frequency,
      timing: s.timing || "Not specified",
    })),
    profile: {
      age: profile?.age || "Not specified",
      gender: profile?.gender || "Not specified",
      weight: profile?.weight || "Not specified",
      healthGoals: profile?.healthGoals || "General health and wellness",
      medicalConditions: profile?.medicalConditions || "None reported",
      currentMedications: profile?.currentMedications || "None reported",
      allergies: profile?.allergies || "None reported",
    },
  };
}

function getErrorMessage(error: Error): string {
  if (error.message.includes("API key")) {
    return "API configuration error. Please check your OpenAI API key.";
  }

  if (error.message.includes("network") || error.message.includes("timeout")) {
    return "Network error. Please check your connection and try again.";
  }

  if (error.message.includes("rate limit")) {
    return "Rate limit exceeded. Please wait a moment and try again.";
  }

  if (error.message.includes("supplement") || error.message.includes("dosage")) {
    return error.message;
  }

  return `Analysis failed: ${error.message}`;
}

export async function analyzeSupplements(
  supplements: Supplement[],
  profile: UserProfile,
  config: Partial<AnalysisConfig> = {}
): Promise<SupplementAnalysis> {
  try {
    validateInput(supplements, profile);

    const apiKey = getOpenAIApiKey();
    const analysisConfig = { ...DEFAULT_CONFIG, ...config };
    const requestData = prepareRequestData(supplements, profile);
    const model = getModel(analysisConfig.model, apiKey);

    const result = await generateObject({
      model,
      schema: SupplementAnalysisSchema,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: JSON.stringify(requestData, null, 2),
        },
      ],
    });

    return {
      ...result.object,
      metadata: {
        analysisDate: new Date().toISOString(),
        analysisVersion: "1.0.0",
      },
    };
  } catch (error) {

    if (error instanceof Error) {
      throw new Error(getErrorMessage(error));
    }

    throw new Error("Unknown error occurred during analysis. Please try again.");
  }
}
