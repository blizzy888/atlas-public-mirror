import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View, ViewProps } from "react-native";
import * as Haptics from "expo-haptics";

import { colors, spacing, typography } from "@/styles";
import { shadows } from "@/styles/shadows";

type CardVariant = "elevated" | "outline" | "filled" | "tinted";

interface CardProps extends ViewProps {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: CardVariant;
  tintColor?: string;
  compact?: boolean;
}

export default function Card({
  title,
  subtitle,
  right,
  left,
  children,
  onPress,
  variant = "elevated",
  tintColor = colors.primary,
  compact = false,
  style,
  ...rest
}: CardProps) {
  const Container = onPress ? Pressable : View;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const containerStyle = ({ pressed }: { pressed: boolean }) => [
    styles.base,
    compact ? styles.compact : styles.spacious,
    variant === "elevated" && styles.elevated,
    variant === "outline" && styles.outline,
    variant === "filled" && styles.filled,
    variant === "tinted" && [
      styles.tinted,
      { backgroundColor: `${tintColor}15`, borderColor: `${tintColor}30` },
    ],
    pressed && onPress && styles.pressed,
    style,
  ];

  const handlePress = async () => {
    if (onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <Container
      onPress={onPress ? handlePress : undefined}
      style={onPress ? containerStyle : (containerStyle as any)({ pressed: false })}
      accessibilityRole={onPress ? "button" : undefined}
      {...rest}
    >
      {(left || title || right) && (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {left}
            <View style={styles.headerText}>
              {title ? <Text style={styles.title}>{title}</Text> : null}
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
          </View>
          {right}
        </View>
      )}
      {children ? <View style={styles.content}>{children}</View> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: spacing.radius.xl,
  },
  compact: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  spacious: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  elevated: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.sm,
  },
  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  filled: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder + "50",
  },
  tinted: {
    backgroundColor: colors.primary + "10",
    borderWidth: 1,
    borderColor: colors.primary + "30",
  },
  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    flex: 1,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  content: {
    gap: spacing.md,
  },
});
