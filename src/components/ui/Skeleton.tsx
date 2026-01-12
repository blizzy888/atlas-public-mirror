import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { colors, spacing } from "@/styles";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: "text" | "rect" | "circle";
}

export default function Skeleton({
  width = "100%",
  height = 20,
  borderRadius,
  style,
  variant = "rect",
}: SkeletonProps) {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const getVariantStyles = () => {
    switch (variant) {
      case "text":
        return {
          height: 16,
          borderRadius: spacing.radius.sm,
        };
      case "circle":
        return {
          width: height,
          height: height,
          borderRadius: typeof height === "number" ? height / 2 : 999,
        };
      default:
        return {
          borderRadius: borderRadius || spacing.radius.md,
        };
    }
  };

  return (
    <View
      style={[
        styles.skeleton,
        getVariantStyles(),
        {
          width,
          height: variant === "circle" ? height : height,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity: shimmerAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.6],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.border,
  },
});
