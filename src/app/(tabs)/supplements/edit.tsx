import { Button, TextInput } from "@/components/ui";
import { useSupplements, useAnalysis } from "@/lib/hooks";
import { colors, spacing, typography } from "@/styles";
import { shadows } from "@/styles/shadows";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Save } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function EditSupplement() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { supplements, updateSupplement } = useSupplements();
  const { analysis } = useAnalysis();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    timing: "",
  });

  // Common suggestions (same as add page)
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

  useEffect(() => {
    const supplement = supplements?.find(s => s.id === params.id);
    if (supplement) {
      setFormData({
        name: supplement.name,
        dosage: supplement.dosage,
        frequency: supplement.frequency,
        timing: supplement.timing || "",
      });
    } else if (supplements && params.id) {
      Alert.alert("Error", "Supplement not found");
      router.back();
    }
  }, [params.id, supplements, router]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectSuggestion = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.dosage.trim() || !formData.frequency.trim()) {
      Alert.alert("Missing Information", "Please fill in dosage and frequency");
      return;
    }

    setLoading(true);
    try {
      await updateSupplement(params.id!, {
        name: formData.name,
        dosage: formData.dosage.trim(),
        frequency: formData.frequency.trim(),
        timing: formData.timing.trim(),
      });

      // Check if there's an analysis and prompt to reanalyze
      if (analysis) {
        Alert.alert(
          "Stack Updated",
          "Your supplement has been updated. Would you like to reanalyze for updated insights?",
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
      Alert.alert("Error", "Failed to update supplement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Edit Supplement" }} />
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        bottomOffset={100}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Header Card */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>Edit {formData.name}</Text>
        </View>

        {/* Dosage Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dosage</Text>
          <TextInput
            label=""
            placeholder="e.g., 500mg, 2 tablets"
            value={formData.dosage}
            onChangeText={value => updateField("dosage", value)}
          />
          <View style={styles.quickSuggestions}>
            {dosageSuggestions.map(suggestion => (
              <Pressable
                key={suggestion}
                style={styles.quickSuggestion}
                onPress={() => selectSuggestion("dosage", suggestion)}
              >
                <Text style={styles.quickSuggestionText}>{suggestion}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Frequency Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Frequency</Text>
          <TextInput
            label=""
            placeholder="e.g., Once daily, Twice daily"
            value={formData.frequency}
            onChangeText={value => updateField("frequency", value)}
          />
          <View style={styles.quickSuggestions}>
            {frequencySuggestions.map(suggestion => (
              <Pressable
                key={suggestion}
                style={styles.quickSuggestion}
                onPress={() => selectSuggestion("frequency", suggestion)}
              >
                <Text style={styles.quickSuggestionText}>{suggestion}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Timing Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Timing (Optional)</Text>
          <TextInput
            label=""
            placeholder="e.g., With breakfast, Before bed"
            value={formData.timing}
            onChangeText={value => updateField("timing", value)}
          />
          <View style={styles.quickSuggestions}>
            {timingSuggestions.map(suggestion => (
              <Pressable
                key={suggestion}
                style={styles.quickSuggestion}
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
            title="Save Changes"
            onPress={handleSubmit}
            isLoading={loading}
            variant="primary"
            size="large"
            icon={<Save size={20} color={colors.white} />}
            fullWidth
          />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerCard: {
    backgroundColor: colors.white,
    margin: spacing.screen,
    marginTop: spacing.md,
    padding: spacing.xl,
    borderRadius: spacing.radius.xl,
    alignItems: "center",
    ...shadows.sm,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
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
  cardTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
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
});
