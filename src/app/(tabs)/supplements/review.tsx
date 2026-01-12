import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Plus } from "lucide-react-native";

import { Button, TextInput } from "@/components/ui";
import { Check } from "lucide-react-native";
import { useProducts, useSupplements } from "@/lib/hooks";
import { getExtractionDraft, clearExtractionDraft } from "@/lib";
import { validateExtractedData } from "@/lib/api/labelExtractionService";
import type { ExtractedProduct } from "@/lib/api/labelExtractionService";
import { colors, spacing, typography } from "@/styles";
import { shadows } from "@/styles/shadows";

interface EditableSupplement {
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
}

export default function ReviewExtracted() {
  const router = useRouter();
  const { addSupplement } = useSupplements();
  const { addProduct } = useProducts();

  const draft: ExtractedProduct | null = useMemo(() => getExtractionDraft(), []);

  const [product, setProduct] = useState({
    name: draft?.product.name || "",
    brand: draft?.product.brand || "",
    timing: draft?.product.suggestedUse || "",
  });

  const [supplements, setSupplements] = useState<EditableSupplement[]>(
    draft?.supplements.map(s => ({
      name: s.name,
      dosage: s.dosage,
      frequency: s.frequency || "Daily",
      timing: s.timing || product.timing || "",
    })) || []
  );

  useEffect(() => {
    if (!draft) {
      router.replace("./scan");
    }
  }, [draft, router]);

  const updateSupplement = (index: number, field: keyof EditableSupplement, value: string) => {
    setSupplements(prev => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const handleSave = async () => {
    if (!product.name.trim() || !supplements || supplements.length === 0) {
      Alert.alert("Missing Data", "Please ensure product name and at least one supplement.");
      return;
    }

    try {
      // Validate extracted data
      const validation = validateExtractedData(draft!);
      if (!validation.isValid) {
        Alert.alert(
          "Extraction Issues",
          `Found ${validation.warnings.length} issues. Please review and correct before saving.`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Save Anyway", onPress: () => performSave() },
          ]
        );
        return;
      }

      await performSave();
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Save Failed", error instanceof Error ? error.message : "Try again.");
    }
  };

  const performSave = async () => {
    try {
      const created = await addProduct({
        name: product.name.trim(),
        brand: product.brand?.trim(),
        timing: product.timing?.trim(),
      });

      for (const supplement of supplements) {
        if (!supplement.name.trim() || !supplement.dosage.trim()) continue;

        await addSupplement({
          name: supplement.name.trim(),
          dosage: supplement.dosage.trim(),
          frequency: supplement.frequency?.trim() || "Daily",
          timing: supplement.timing?.trim() || product.timing?.trim() || "",
          productId: created.id,
        });
      }

      clearExtractionDraft();
      // Navigate back to supplements tab and close all modals
      router.dismissAll();
      router.replace("/(tabs)/supplements");
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Save Failed", error instanceof Error ? error.message : "Try again.");
    }
  };

  if (!draft) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No label data found. Please scan a label first.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Review Product" }} />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Extraction Quality Indicator */}
        <View style={styles.extractionStatus}>
          <Text style={styles.statusLabel}>AI Extraction Quality</Text>
          <View style={styles.statusRow}>
            <Text
              style={[
                styles.statusValue,
                { color: (draft.confidence || 0) >= 90 ? colors.success : colors.warning },
              ]}
            >
              {draft.confidence || 0}% Confidence
            </Text>
            <Text style={styles.statusSubtext}>Tap any field to edit</Text>
          </View>
        </View>

        {/* Product Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product Information</Text>
          <TextInput
            label="Product name"
            value={product.name}
            onChangeText={text => setProduct(p => ({ ...p, name: text }))}
            placeholder="Extracted product name"
          />
          <TextInput
            label="Brand (optional)"
            value={product.brand || ""}
            onChangeText={text => setProduct(p => ({ ...p, brand: text }))}
            placeholder="Brand name if available"
          />
          <TextInput
            label="Suggested Use"
            value={product.timing || ""}
            onChangeText={text => setProduct(p => ({ ...p, timing: text }))}
            placeholder="Usage instructions"
          />
        </View>

        {/* Supplements Section */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Extracted Supplements</Text>

          {supplements.map((supplement, index) => (
            <View key={index} style={styles.supplementRow}>
              <View style={styles.supplementInputs}>
                <TextInput
                  label="Name"
                  value={supplement.name}
                  onChangeText={value => updateSupplement(index, "name", value)}
                  placeholder="Supplement name"
                />
                <TextInput
                  label="Dosage"
                  value={supplement.dosage}
                  onChangeText={value => updateSupplement(index, "dosage", value)}
                  placeholder="e.g., 1000mg, 2 tablets"
                />
                <TextInput
                  label="Frequency"
                  value={supplement.frequency}
                  onChangeText={value => updateSupplement(index, "frequency", value)}
                  placeholder="e.g., Daily, Twice daily"
                />
                <TextInput
                  label="Timing"
                  value={supplement.timing}
                  onChangeText={value => updateSupplement(index, "timing", value)}
                  placeholder="e.g., With meals, Before bed"
                />
              </View>

              {/* Remove supplement button */}
              {supplements && supplements.length > 1 && (
                <Pressable
                  style={styles.removeButton}
                  onPress={() => {
                    setSupplements(prev => prev.filter((_, i) => i !== index));
                  }}
                  accessibilityLabel={`Remove supplement ${index + 1}`}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </Pressable>
              )}
            </View>
          ))}

          {/* Add supplement button */}
          <Pressable
            style={styles.addSupplementButton}
            onPress={() => {
              setSupplements(prev => [
                ...prev,
                { name: "", dosage: "", frequency: "Daily", timing: "" },
              ]);
            }}
          >
            <Plus size={16} color={colors.primary} />
            <Text style={styles.addSupplementText}>Add Supplement</Text>
          </Pressable>
        </View>

        {/* Warnings Section */}
        {draft.product.warnings && draft.product.warnings.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Important Warnings</Text>
            {draft.product.warnings.map((warning, index) => (
              <Text key={index} style={styles.warningText}>
                • {warning}
              </Text>
            ))}
          </View>
        )}

        {/* Save Button */}
        <View style={styles.footer}>
          <Button
            title="Save All"
            onPress={handleSave}
            variant="primary"
            size="large"
            icon={<Check size={20} color={colors.white} />}
            fullWidth
          />
          <Text style={styles.saveHint}>Creates a product with all supplements</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.screen,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.screen,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },

  // Extraction Status
  extractionStatus: {
    backgroundColor: colors.primary + "05",
    borderRadius: spacing.radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + "20",
  },
  statusLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusValue: {
    ...typography.body,
    fontWeight: "600",
  },
  statusSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  // Cards
  card: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  // Supplements
  supplementRow: {
    marginBottom: spacing.lg,
    position: "relative",
  },
  supplementInputs: {
    gap: spacing.sm,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "700",
  },

  addSupplementButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: "dashed",
    borderRadius: spacing.radius.lg,
    marginTop: spacing.md,
  },
  addSupplementText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
  },

  // Warnings
  warningText: {
    ...typography.body,
    color: colors.warning,
    marginBottom: spacing.xs,
  },

  // Footer
  footer: {
    marginTop: spacing.lg,
  },
  saveHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
