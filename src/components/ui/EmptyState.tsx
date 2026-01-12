import { colors, spacing, typography } from "@/styles";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import Button from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  variant?: "default" | "dashed";
}

export default function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  variant = "default",
}: EmptyStateProps) {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnimation, scaleAnimation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          variant === "dashed" && styles.dashedContent,
          {
            opacity: fadeAnimation,
            transform: [{ scale: scaleAnimation }],
          },
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <Text style={styles.title}>{title}</Text>

        {description && <Text style={styles.description}>{description}</Text>}

        {actionText && onAction && (
          <View style={styles.actionContainer}>
            <Button title={actionText} onPress={onAction} variant="primary" size="lg" />
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: spacing.screen * 2,
    paddingVertical: spacing.xxxl,
  },
  content: {
    alignItems: "center",
    gap: spacing.lg,
    maxWidth: 320,
    width: "100%",
  },
  dashedContent: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: spacing.radius.xl,
    padding: spacing.xxxl,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: spacing.radius.xl,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.heading,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  description: {
    ...typography.body,
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  actionContainer: {
    marginTop: spacing.sm,
  },
});
