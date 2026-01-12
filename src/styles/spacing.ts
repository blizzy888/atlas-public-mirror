/**
 * Design Tokens - Spacing System
 * Consistent spacing scale based on 4px increments for perfect alignment
 */
export const spacing = {
  // Base spacing scale - Use these for consistent spacing
  0: 0,
  1: 4, // xs - Extra small spacing
  2: 8, // sm - Small spacing
  3: 12, // md - Medium spacing
  4: 16, // lg - Large spacing (default)
  6: 24, // xl - Extra large spacing
  8: 32, // xxl - Double extra large spacing
  12: 48, // xxxl - Triple extra large spacing

  // Semantic spacing tokens - Use these for consistent UI patterns
  xs: 4, // Micro spacing for tight layouts
  sm: 8, // Small spacing for compact elements
  md: 12, // Medium spacing for comfortable spacing
  lg: 16, // Large spacing for section separation
  xl: 24, // Extra large for major sections
  xxl: 32, // Double extra large for page sections
  xxxl: 48, // Triple extra large for hero sections

  // Layout-specific spacing
  screen: 16, // Standard screen padding
  section: 24, // Section separators
  component: 16, // Component internal spacing

  // Component dimensions - Use these for consistent sizing
  button: {
    height: {
      sm: 36,
      md: 48,
      lg: 56,
    },
    padding: {
      horizontal: 16,
      vertical: 12,
    },
  },

  input: {
    height: 48,
    padding: {
      horizontal: 16,
      vertical: 12,
    },
  },

  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },

  avatar: {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  },

  // Border radius scale - Use these for consistent corner rounding
  radius: {
    none: 0,
    sm: 4, // Slightly rounded for subtle elements
    md: 8, // Standard rounding for buttons/cards
    lg: 12, // More pronounced for larger elements
    xl: 16, // Very rounded for special elements
    full: 9999, // Completely circular
  },

  // Container heights for consistent layouts
  container: {
    min: 200,
    small: 320,
    medium: 400,
    large: 600,
    max: 800,
  },
} as const;
