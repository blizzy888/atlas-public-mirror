import { colors, spacing, typography } from "@/styles";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  label?: string;
}

export default function SegmentedControl({
  options,
  selectedIndex,
  onSelect,
  label,
}: SegmentedControlProps) {
  const handleSelect = (index: number) => {
    if (index !== selectedIndex) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelect(index);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.controlContainer}>
        {options.map((option, index) => (
          <Pressable
            key={option}
            style={[
              styles.segment,
              index === 0 && styles.firstSegment,
              index === options.length - 1 && styles.lastSegment,
              selectedIndex === index && styles.selectedSegment,
            ]}
            onPress={() => handleSelect(index)}
          >
            <Text style={[styles.segmentText, selectedIndex === index && styles.selectedText]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    ...typography.small,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  controlContainer: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: spacing.radius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    borderRadius: spacing.radius.full - 2,
  },
  firstSegment: {
    marginRight: 2,
  },
  lastSegment: {
    marginLeft: 2,
  },
  selectedSegment: {
    backgroundColor: colors.surface,
  },
  segmentText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  selectedText: {
    color: colors.primary,
    fontWeight: "700",
  },
});
