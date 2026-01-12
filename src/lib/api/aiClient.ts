import { createOpenAI } from "@ai-sdk/openai";

export const DEFAULT_TEXT_MODEL = "gpt-5";
export const DEFAULT_VISION_MODEL = "gpt-5";

// DEMO ONLY: API key is client-side for demo simplicity.
// TODO: Proxy through authenticated backend server before production.
export function getOpenAIApiKey(): string {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured.");
  }
  return apiKey;
}

export function getModel(modelName: string = DEFAULT_TEXT_MODEL, apiKey?: string) {
  const resolvedKey = apiKey ?? getOpenAIApiKey();
  const openai = createOpenAI({ apiKey: resolvedKey });
  return openai(modelName);
}

export function getVisionModel(apiKey?: string) {
  return getModel(DEFAULT_VISION_MODEL, apiKey);
}
