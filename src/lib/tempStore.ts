/**
 * Simple in-memory temp store for passing non-persistent data between screens
 * Used for label extraction results before final supplement creation
 */
import type { ExtractedProduct } from "./api/labelExtractionService";

let extractionDraft: ExtractedProduct | null = null;

export function setExtractionDraft(draft: ExtractedProduct) {
  extractionDraft = draft;
}

export function getExtractionDraft(): ExtractedProduct | null {
  return extractionDraft;
}

export function clearExtractionDraft() {
  extractionDraft = null;
}
