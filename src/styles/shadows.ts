import { StyleSheet } from "react-native";

/**
 * Design Tokens - Shadow System
 * Consistent elevation system for depth and visual hierarchy
 */
const SHADOW_COLOR = "rgba(0, 0, 0, 0.1)";

export const shadows = StyleSheet.create({
  // No elevation - flat elements
  none: {
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },

  // Subtle elevation - for borders and separators
  xs: {
    elevation: 1,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  // Low elevation - for cards and small components
  sm: {
    elevation: 2,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  // Medium elevation - for elevated cards and modals
  md: {
    elevation: 4,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },

  // High elevation - for floating elements and dialogs
  lg: {
    elevation: 8,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },

  // Maximum elevation - for important overlays
  xl: {
    elevation: 12,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },

  // Inner shadow - for pressed/inset effects
  inner: {
    elevation: 0,
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

// Shadow utility functions
export const shadowUtils = {
  // Create custom shadow with specific properties
  custom: (config: {
    color?: string;
    offset?: { width: number; height: number };
    opacity?: number;
    radius?: number;
    elevation?: number;
  }) => ({
    elevation: config.elevation || 0,
    shadowColor: config.color || SHADOW_COLOR,
    shadowOffset: config.offset || { width: 0, height: 0 },
    shadowOpacity: config.opacity || 0,
    shadowRadius: config.radius || 0,
  }),

  // Get shadow based on semantic meaning
  semantic: (type: "card" | "modal" | "overlay" | "button") => {
    switch (type) {
      case "card":
        return shadows.sm;
      case "modal":
        return shadows.lg;
      case "overlay":
        return shadows.xl;
      case "button":
        return shadows.xs;
      default:
        return shadows.none;
    }
  },
};
