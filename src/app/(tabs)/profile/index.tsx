import { Card, SegmentedControl, TextInput } from "@/components/ui";
import { PRESET_DATA } from "@/constants/presets";
import { type UserProfile } from "@/types";
import { useAppContext } from "@/lib/AppContext";
import { colors, spacing, typography } from "@/styles";
import { RotateCcw, Settings, TrendingUp, Shield } from "lucide-react-native";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function Profile() {
  const { profile, updateProfile, setProfile, addSupplement, clearAnalysis, clearStorage } =
    useAppContext();

  const updateField = (field: keyof UserProfile, value: string) => {
    updateProfile({ [field]: value });
  };

  const handleReset = () => {
    Alert.alert(
      "Reset App Data",
      "This will clear all your profile data, supplements, and analysis. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear all data through context
              await clearStorage();
              await setProfile({
                name: "",
                age: "",
                gender: "",
                weight: "",
                healthGoals: "",
                medicalConditions: "",
                currentMedications: "",
                allergies: "",
              });
              await clearAnalysis();
              Alert.alert("Success", "App data has been reset");
            } catch {
              Alert.alert("Error", "Failed to reset app data");
            }
          },
        },
      ]
    );
  };

  const loadPreset = (presetIndex: number) => {
    const preset = PRESET_DATA[presetIndex];
    if (!preset) return;

    Alert.alert(
      `Load ${preset.name} Preset`,
      `This will replace your current data with:\n\n${preset.description}\n\nContinue?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Load Preset",
          onPress: async () => {
            try {
              // Clear existing data through context
              await clearStorage();
              await setProfile(preset.profile);
              await clearAnalysis();

              // Add preset supplements through context
              for (const supplement of preset.supplements) {
                await addSupplement({
                  name: supplement.name,
                  dosage: supplement.dosage,
                  frequency: supplement.frequency,
                  timing: supplement.timing,
                  productId: supplement.productId,
                });
              }

              Alert.alert("Success", `${preset.name} preset loaded successfully`);
            } catch {
              Alert.alert("Error", "Failed to load preset");
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      bottomOffset={100}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Personalize your health journey</Text>
      </View>

      {/* Basic Information */}
      <Card
        variant="elevated"
        title="Basic Information"
        subtitle="Essential details for personalized recommendations"
        left={
          <View style={styles.iconWrapper}>
            <Settings size={20} color={colors.primary} />
          </View>
        }
      >
        <TextInput
          label="Name"
          placeholder="Your name"
          value={profile.name || ""}
          onChangeText={value => updateField("name", value)}
          autoCapitalize="words"
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <TextInput
              label="Age"
              placeholder="e.g., 45"
              keyboardType="number-pad"
              returnKeyType="next"
              value={profile.age || ""}
              onChangeText={value => updateField("age", value)}
            />
          </View>
          <View style={styles.halfWidth}>
            <TextInput
              label="Weight (lbs)"
              placeholder="e.g., 180"
              keyboardType="number-pad"
              returnKeyType="next"
              value={profile.weight || ""}
              onChangeText={value => updateField("weight", value)}
            />
          </View>
        </View>

        <SegmentedControl
          label="Birth Gender"
          options={["Male", "Female"]}
          selectedIndex={profile.gender === "Female" ? 1 : 0}
          onSelect={index => updateField("gender", index === 0 ? "Male" : "Female")}
        />
      </Card>

      {/* Health Goals */}
      <Card
        variant="elevated"
        title="Health & Medical Information"
        subtitle="Help us provide more accurate supplement analysis"
        left={
          <View style={[styles.iconWrapper, { backgroundColor: colors.secondary + "10" }]}>
            <Shield size={20} color={colors.secondary} />
          </View>
        }
      >
        <TextInput
          label="Health Goals"
          placeholder="e.g., Improve energy, sleep better"
          size="large"
          value={profile.healthGoals || ""}
          onChangeText={value => updateField("healthGoals", value)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          returnKeyType="next"
        />

        <View style={styles.medicalSection}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          <View style={styles.sectionContent}>
            <TextInput
              label="Medical Conditions"
              placeholder="e.g., High blood pressure, diabetes"
              size="large"
              value={profile.medicalConditions || ""}
              onChangeText={value => updateField("medicalConditions", value)}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              returnKeyType="next"
            />

            <TextInput
              label="Current Medications"
              placeholder="e.g., Metformin, Lisinopril"
              size="large"
              value={profile.currentMedications || ""}
              onChangeText={value => updateField("currentMedications", value)}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
              returnKeyType="next"
            />

            <TextInput
              label="Allergies"
              placeholder="e.g., Shellfish, penicillin"
              value={profile.allergies || ""}
              onChangeText={value => updateField("allergies", value)}
              returnKeyType="done"
            />
          </View>
        </View>
      </Card>

      {/* Demo Presets */}
      <Card
        variant="outline"
        title="Demo Presets"
        subtitle="Load pre-configured profiles with supplements to see how the app works"
        left={
          <View style={[styles.iconWrapper, { backgroundColor: colors.success + "10" }]}>
            <TrendingUp size={20} color={colors.success} />
          </View>
        }
      >
        {PRESET_DATA.map((preset, index) => (
          <Card
            key={index}
            variant="filled"
            title={preset.name}
            subtitle={preset.description}
            right={
              <View style={styles.presetMeta}>
                <Text style={styles.presetMetaText}>{preset.supplements.length} supplements</Text>
              </View>
            }
            onPress={() => loadPreset(index)}
            style={{ marginBottom: spacing.sm }}
          />
        ))}
      </Card>

      {/* Reset Section */}
      <Card
        variant="tinted"
        tintColor={colors.error}
        title="Reset Data"
        subtitle="Clear all your data and start fresh"
        left={
          <View style={[styles.iconWrapper, { backgroundColor: colors.error + "10" }]}>
            <RotateCcw size={20} color={colors.error} />
          </View>
        }
      >
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <RotateCcw size={18} color={colors.error} />
          <Text style={styles.resetButtonText}>Reset All Data</Text>
        </Pressable>
      </Card>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.screen,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  header: {
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  headerTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  medicalSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + "30",
  },
  sectionContent: {
    gap: spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  presetMeta: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.full,
    alignSelf: "flex-start",
  },
  presetMetaText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.radius.lg,
    borderWidth: 1.5,
    borderColor: colors.error + "40",
    backgroundColor: colors.error + "08",
  },
  resetButtonText: {
    ...typography.body,
    color: colors.error,
    fontWeight: "600",
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
});
