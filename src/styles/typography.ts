import { StyleSheet } from "react-native";
import { colors } from "./colors";

/**
 * Design Tokens - Typography System
 * Consistent text styling with semantic naming and proper hierarchy
 */
export const typography = StyleSheet.create({
  // Hero text - For main app headers and hero sections
  hero: {
    fontSize: 36,
    fontWeight: "800",
    lineHeight: 44,
    color: colors.textPrimary,
    letterSpacing: -0.025,
  },

  // Display text - For hero sections and major headings
  display: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    color: colors.textPrimary,
    letterSpacing: -0.025,
  },

  // Page titles - Main page/section headings
  title: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 34,
    color: colors.textPrimary,
    letterSpacing: -0.025,
  },

  // Section headings - Subsection titles
  heading: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
    color: colors.textPrimary,
    letterSpacing: -0.025,
  },

  // Subsection headings - Smaller section titles
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 22,
    color: colors.textPrimary,
    letterSpacing: -0.025,
  },

  // Body text - Regular paragraph text
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: colors.textPrimary,
    letterSpacing: 0,
  },

  // Emphasized body text
  bodyBold: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    color: colors.textPrimary,
    letterSpacing: 0,
  },

  // Secondary body text - for supporting information
  bodySecondary: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: colors.textSecondary,
    letterSpacing: 0,
  },

  // Small text - For labels and minor information
  small: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.textSecondary,
    letterSpacing: 0,
  },

  // Small bold text - For emphasized small text
  smallBold: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: colors.textPrimary,
    letterSpacing: 0,
  },

  // Caption text - For very small descriptive text
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    color: colors.textTertiary,
    letterSpacing: 0,
  },

  // Button text - For interactive elements
  button: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 20,
    letterSpacing: 0,
  },

  // Label text - For form labels and UI labels
  label: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: colors.textPrimary,
    letterSpacing: 0,
  },

  // Error text - For validation messages
  error: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.error,
    letterSpacing: 0,
  },

  // Success text - For positive feedback
  success: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.success,
    letterSpacing: 0,
  },
});

// Typography utility functions
export const typographyUtils = {
  // Get responsive font size based on screen size (simplified)
  responsive: (baseSize: number) => ({
    fontSize: Math.min(baseSize, 18), // Cap at reasonable size for mobile
  }),

  // Get line height for a given font size (1.5x for body text)
  lineHeight: (fontSize: number, multiplier: number = 1.5) => Math.round(fontSize * multiplier),
};
