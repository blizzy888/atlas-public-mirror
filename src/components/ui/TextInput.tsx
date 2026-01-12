import { colors, spacing, typography } from "@/styles";
import React, { forwardRef, useState } from "react";
import {
  Platform,
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TextInputProps,
  View,
} from "react-native";

export interface CustomTextInputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: "medium" | "large";
  containerStyle?: any;
}

const TextInput = forwardRef<RNTextInput, CustomTextInputProps>(
  (
    { label, error, helperText, size = "medium", containerStyle, onFocus, onBlur, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text
            style={[styles.label, isFocused && styles.labelFocused, error && styles.labelError]}
          >
            {label}
          </Text>
        )}

        <View
          style={[
            styles.inputContainer,
            size === "large" && styles.largeContainer,
            error && styles.errorContainer,
            isFocused && styles.focusedContainer,
          ]}
        >
          <RNTextInput
            ref={ref}
            style={[
              styles.input,
              size === "large" && styles.largeInput,
              Platform.OS === "ios" && props.multiline && styles.multilineInput,
            ]}
            placeholderTextColor={colors.textTertiary}
            selectionColor={colors.primary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...(Platform.OS === "ios" && {
              textAlignVertical: props.multiline ? "top" : "center",
              includeFontPadding: false,
            })}
            {...props}
          />
        </View>

        {(error || helperText) && (
          <Text style={[styles.helperText, error && styles.errorText]}>{error || helperText}</Text>
        )}
      </View>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  label: {
    ...typography.small,
    fontWeight: "600" as const,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  labelFocused: {
    color: colors.primary,
  },
  labelError: {
    color: colors.error,
  },
  inputContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radius.lg,
    minHeight: 48,
    ...(Platform.OS === "ios" && {
      minHeight: 44,
      justifyContent: "center",
    }),
  },
  largeContainer: {
    minHeight: 56,
    ...(Platform.OS === "ios" && {
      minHeight: 52,
    }),
  },
  errorContainer: {
    borderColor: colors.error,
  },
  focusedContainer: {
    borderColor: colors.primary,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flex: 1,
    ...(Platform.OS === "ios" && {
      paddingVertical: spacing.sm,
      lineHeight: 20,
    }),
  },
  largeInput: {
    paddingVertical: spacing.lg,
    ...(Platform.OS === "ios" && {
      paddingVertical: 0,
    }),
  },
  multilineInput: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    lineHeight: 22,
  },
  helperText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
  },
});
