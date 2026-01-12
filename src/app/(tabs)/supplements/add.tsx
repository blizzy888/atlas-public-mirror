import { Button, TextInput } from "@/components/ui";
import supplementsList from "@/constants/supplements.json";
import { useSupplements, useAnalysis } from "@/lib/hooks";
import { colors, spacing, typography } from "@/styles";
import { shadows } from "@/styles/shadows";
import { Stack, useRouter } from "expo-router";
import { Check, Search, Plus } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function AddSupplement() {
  const router = useRouter();
  const { addSupplement } = useSupplements();
  const { analysis } = useAnalysis();
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    timing: "",
  });

  // Common dosage and frequency suggestions
  const dosageSuggestions = [
    "500mg",
    "1000mg",
    "200mg",
    "100mg",
    "1 tablet",
    "2 tablets",
    "1 capsule",
    "2 capsules",
    "1000 IU",
    "2000 IU",
    "5000 IU",
  ];
  const frequencySuggestions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "With meals",
    "As needed",
  ];
  const timingSuggestions = [
    "With breakfast",
    "With lunch",
    "With dinner",
    "Before bed",
    "On empty stomach",
    "Post-workout",
    "Pre-workout",
  ];

  // Filter supplements based on search
  const filteredSupplements = useMemo(() => {
    if (!formData.name.trim() || formData.name.length < 2) return [];

    const query = formData.name.toLowerCase().trim();
    return supplementsList
      .filter(supplement => supplement.toLowerCase().includes(query))
      .slice(0, 8); // Limit to 8 suggestions
  }, [formData.name]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === "name") {
      setShowSuggestions(value.length >= 2);
    }
  };

  const selectSuggestion = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.dosage.trim() || !formData.frequency.trim()) {
      Alert.alert("Missing Information", "Please fill in name, dosage, and frequency");
      return;
    }

    setLoading(true);
    try {
      await addSupplement({
        name: formData.name.trim(),
        dosage: formData.dosage.trim(),
        frequency: formData.frequency.trim(),
        timing: formData.timing.trim(),
      });

      // Check if there's an analysis and prompt to reanalyze
      if (analysis) {
        Alert.alert(
          "Stack Updated",
          "Your supplement stack has changed. Would you like to reanalyze for updated insights?",
          [
            { text: "Later", style: "cancel", onPress: () => router.back() },
            {
              text: "Reanalyze",
              onPress: () => {
                router.back();
                router.push("/(tabs)/(home)");
              },
            },
          ]
        );
      } else {
        router.back();
      }
    } catch {
      Alert.alert("Error", "Failed to add supplement");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (text: string) => {
    updateField("name", text);
    setShowSuggestions(text.length >= 2);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Add Supplement" }} />

      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bottomOffset={100}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchHeader}>
            <View style={styles.searchIconContainer}>
              <Search size={20} color={colors.primary} />
            </View>
            <Text style={styles.searchTitle}>Find Your Supplement</Text>
            <Pressable
              style={({ pressed }) => [styles.scanButton, pressed && { opacity: 0.85 }]}
              onPress={() => router.push("./scan")}
              hitSlop={12}
              accessibilityLabel="Scan label"
            >
              <Text style={styles.scanButtonLabel}>Scan Label</Text>
            </Pressable>
          </View>
          <TextInput
            label="Supplement Name"
            placeholder="e.g., Vitamin D3, Omega-3"
            value={formData.name}
            onChangeText={text => handleNameChange(text)}
            onFocus={() => setShowSuggestions(true)}
            autoCapitalize="words"
            returnKeyType="next"
            size="large"
          />

          {/* Search Suggestions */}
          {showSuggestions && formData.name.length >= 2 && (
            <View style={styles.suggestionsContainer}>
              {filteredSupplements.length > 0 ? (
                <>
                  <Text style={styles.suggestionsLabel}>Popular supplements</Text>
                  {filteredSupplements.map((supplement, index) => (
                    <Pressable
                      key={index}
                      style={({ pressed }) => [
                        styles.suggestionItem,
                        pressed && styles.suggestionItemPressed,
                      ]}
                      onPress={() => {
                        updateField("name", supplement);
                        setShowSuggestions(false);
                      }}
                    >
                      <Text style={styles.suggestionText}>{supplement}</Text>
                      <Check size={16} color={colors.primary} />
                    </Pressable>
                  ))}
                </>
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>No matches found</Text>
                  <Pressable
                    style={styles.keepAsTypedButton}
                    onPress={() => setShowSuggestions(false)}
                  >
                    <Text style={styles.keepAsTypedText}>Keep &quot;{formData.name}&quot;</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Dosage Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Dosage</Text>
            <Text style={styles.cardHint}>Required</Text>
          </View>
          <TextInput
            placeholder="e.g., 500mg, 1 tablet"
            value={formData.dosage}
            onChangeText={value => updateField("dosage", value)}
            keyboardType="default"
            returnKeyType="next"
          />
          <View style={styles.quickSuggestions}>
            {dosageSuggestions.slice(0, 5).map(suggestion => (
              <Pressable
                key={suggestion}
                style={({ pressed }) => [
                  styles.quickSuggestion,
                  pressed && styles.quickSuggestionPressed,
                ]}
                onPress={() => selectSuggestion("dosage", suggestion)}
              >
                <Text style={styles.quickSuggestionText}>{suggestion}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Frequency Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Frequency</Text>
            <Text style={styles.cardHint}>Required</Text>
          </View>
          <TextInput
            placeholder="e.g., Once daily, Twice daily"
            value={formData.frequency}
            onChangeText={value => updateField("frequency", value)}
            returnKeyType="next"
          />
          <View style={styles.quickSuggestions}>
            {frequencySuggestions.map(suggestion => (
              <Pressable
                key={suggestion}
                style={({ pressed }) => [
                  styles.quickSuggestion,
                  pressed && styles.quickSuggestionPressed,
                ]}
                onPress={() => selectSuggestion("frequency", suggestion)}
              >
                <Text style={styles.quickSuggestionText}>{suggestion}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Timing Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Timing</Text>
            <Text style={styles.cardHint}>Optional</Text>
          </View>
          <TextInput
            placeholder="e.g., With breakfast, Before bed"
            value={formData.timing}
            onChangeText={value => updateField("timing", value)}
            returnKeyType="done"
          />
          <View style={styles.quickSuggestions}>
            {timingSuggestions.slice(0, 4).map(suggestion => (
              <Pressable
                key={suggestion}
                style={({ pressed }) => [
                  styles.quickSuggestion,
                  pressed && styles.quickSuggestionPressed,
                ]}
                onPress={() => selectSuggestion("timing", suggestion)}
              >
                <Text style={styles.quickSuggestionText}>{suggestion}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitContainer}>
          <Button
            title="Add Supplement"
            onPress={handleSubmit}
            isLoading={loading}
            variant="primary"
            size="large"
            icon={<Plus size={20} color={colors.white} />}
            fullWidth
          />
          <Text style={styles.submitHint}>You can add more supplements later</Text>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
  },
  searchSection: {
    margin: spacing.screen,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.xl,
    borderRadius: spacing.radius.xl,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  searchIconContainer: {
    marginRight: spacing.sm,
  },
  searchTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    flex: 1,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.full,
  },
  scanButtonLabel: {
    ...typography.caption,
    color: colors.white,
    fontWeight: "700",
  },
  card: {
    backgroundColor: colors.white,
    margin: spacing.screen,
    marginTop: 0,
    marginBottom: spacing.md,
    padding: spacing.xl,
    borderRadius: spacing.radius.xl,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  cardTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  cardHint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  searchContainer: {
    position: "relative",
  },
  clearButton: {
    position: "absolute",
    right: spacing.md,
    top: "50%",
    transform: [{ translateY: -8 }],
    padding: spacing.xs,
  },
  suggestionsContainer: {
    marginTop: spacing.md,
    backgroundColor: colors.background,
    borderRadius: spacing.radius.md,
    overflow: "hidden",
    maxHeight: 200,
  },
  suggestionsLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  suggestionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + "20",
  },
  suggestionsTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  keepAsTypedButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary + "15",
    borderRadius: spacing.radius.full,
    borderWidth: 1,
    borderColor: colors.primary + "30",
  },
  keepAsTypedText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
  suggestionsList: {
    maxHeight: 160,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + "20",
  },
  suggestionItemPressed: {
    backgroundColor: colors.primary + "10",
  },
  suggestionText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  noResultsContainer: {
    padding: spacing.md,
    alignItems: "center",
  },
  noResultsText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  quickSuggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  quickSuggestion: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.full,
    borderWidth: 1,
    borderColor: colors.primary + "30",
  },
  quickSuggestionPressed: {
    backgroundColor: colors.primary + "20",
  },
  quickSuggestionText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
  },
  submitContainer: {
    margin: spacing.screen,
    marginTop: spacing.xl,
    marginBottom: spacing.xxxl,
  },
  submitHint: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
