import React from "react";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";

import { colors, spacing, typography } from "@/styles";
import { shadows } from "@/styles/shadows";

interface ButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "large";
  isLoading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: any;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const handlePress = async () => {
    if (!isDisabled && onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.base,
        size === "sm" && styles.sm,
        size === "md" && styles.md,
        (size === "lg" || size === "large") && styles.lg,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "outline" && styles.outline,
        variant === "ghost" && styles.ghost,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      {...pressableProps}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? colors.textInverse : colors.primary}
          />
        ) : (
          <>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
              style={[
                styles.text,
                variant === "primary" && styles.textPrimary,
                variant === "secondary" && styles.textSecondary,
                variant === "outline" && styles.textOutline,
                variant === "ghost" && styles.textGhost,
                isDisabled && styles.textDisabled,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: spacing.radius.lg,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.xs,
  },
  sm: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
  },
  md: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  lg: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
  },
  fullWidth: {
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    flexShrink: 0,
  },
  text: {
    ...typography.button,
    fontWeight: "600",
  },
  textPrimary: {
    color: colors.textInverse,
  },
  textSecondary: {
    color: colors.textPrimary,
  },
  textOutline: {
    color: colors.primary,
  },
  textGhost: {
    color: colors.textPrimary,
  },
  textDisabled: {
    color: colors.textTertiary,
  },
});
