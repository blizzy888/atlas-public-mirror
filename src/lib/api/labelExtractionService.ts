import { z } from "zod";
import { generateObject } from "ai";
import { getVisionModel, getOpenAIApiKey } from "./aiClient";

const EXTRACTED_SUPPLEMENT_SCHEMA = z.object({
  name: z.string().min(1, "Supplement name is required"),
  dosage: z.string().min(1, "Dosage information is required"),
  frequency: z.string().optional().default("Daily"),
  timing: z.string().optional().default("As directed"),
  form: z.string().optional().default("Tablet/Capsule"),
  notes: z.string().optional(),
});

const EXTRACTED_PRODUCT_SCHEMA = z.object({
  product: z.object({
    name: z.string().min(1, "Product name is required"),
    brand: z.string().optional(),
    manufacturer: z.string().optional(),
    category: z
      .enum(["vitamins", "minerals", "herbs", "amino_acids", "probiotics", "other"])
      .default("other"),
    servingsPerContainer: z.string().optional(),
    suggestedUse: z.string().optional(),
    warnings: z.array(z.string()).optional().default([]),
  }),
  supplements: z
    .array(EXTRACTED_SUPPLEMENT_SCHEMA)
    .min(1, "At least one supplement must be extracted"),
  confidence: z.number().min(0).max(100).optional(),
});

export type ExtractedProduct = z.infer<typeof EXTRACTED_PRODUCT_SCHEMA>;

const SYSTEM_PROMPT = `You are an expert at analyzing supplement and nutrition product labels from images. You have comprehensive knowledge of nutritional supplements, their typical labeling formats, and can accurately extract structured information.

ANALYSIS REQUIREMENTS:
1. PRODUCT IDENTIFICATION: Identify the main product name, brand, and manufacturer
2. SUPPLEMENT EXTRACTION: Extract all active ingredients with precise dosages
3. USAGE INFORMATION: Capture serving size, frequency, and timing recommendations
4. SAFETY DATA: Note any warnings, contraindications, or allergen information
5. QUALITY ASSESSMENT: Provide confidence score for extraction accuracy

EXTRACTION RULES:
- Extract exact text from labels when possible
- Convert dosages to standard formats (mg, mcg, IU, etc.)
- Identify supplement categories (vitamins, minerals, herbs, etc.)
- Capture frequency as "Once daily", "Twice daily", etc.
- Include any special instructions or warnings
- Provide confidence percentage (0-100) for extraction accuracy

Always respond in valid JSON format matching the required schema.`;

function prepareImageForAnalysis(imageBase64: string): string {
  if (imageBase64.startsWith("data:image/")) {
    return imageBase64;
  }
  return `data:image/jpeg;base64,${imageBase64}`;
}

export async function extractFromLabel(imageBase64: string): Promise<ExtractedProduct> {
  try {
    if (!imageBase64 || imageBase64.trim().length === 0) {
      throw new Error("Image data is required for label extraction");
    }

    const processedImage = prepareImageForAnalysis(imageBase64);
    const apiKey = getOpenAIApiKey();
    const model = getVisionModel(apiKey);

    const visionMessage = {
      role: "user" as const,
      content: [
        {
          type: "image" as const,
          image: processedImage,
        },
        {
          type: "text" as const,
          text: "Extract all supplement information from this product label. Include product details, all active ingredients with dosages, usage instructions, and any warnings.",
        },
      ],
    };

    const result = await generateObject({
      model,
      schema: EXTRACTED_PRODUCT_SCHEMA,
      system: SYSTEM_PROMPT,
      messages: [visionMessage],
    });

    return {
      ...result.object,
      confidence: result.object.confidence || 95,
    };
  } catch (error) {

    if (error instanceof Error) {
      // Handle specific vision API errors
      if (error.message.includes("image_too_large")) {
        throw new Error("Image is too large. Please use a smaller, clearer photo.");
      }

      if (error.message.includes("invalid_image_format")) {
        throw new Error("Invalid image format. Please use a clear JPEG or PNG photo.");
      }

      if (error.message.includes("vision_not_available")) {
        throw new Error("Vision analysis not available. Please check your API access.");
      }

      throw new Error(`Label extraction failed: ${error.message}`);
    }

    throw new Error("Unknown error occurred during label extraction. Please try again.");
  }
}

export function validateExtractedData(extracted: ExtractedProduct): {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
} {
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check for essential data
  if (!extracted.product.name) {
    warnings.push("Product name not clearly identified");
  }

  if (extracted.supplements.length === 0) {
    warnings.push("No supplements extracted from label");
  }

  // Validate supplement data
  extracted.supplements.forEach((supplement, index) => {
    if (!supplement.name) {
      warnings.push(`Supplement ${index + 1}: Name not identified`);
    }

    if (!supplement.dosage) {
      warnings.push(`Supplement ${index + 1}: Dosage not found`);
    }

    // Check for common dosage patterns
    if (supplement.dosage && !/\d+/.test(supplement.dosage)) {
      suggestions.push(`Supplement ${index + 1}: Dosage format may need verification`);
    }
  });

  // Check confidence threshold
  if ((extracted.confidence || 0) < 80) {
    warnings.push("Low confidence in extraction - please verify manually");
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions,
  };
}
