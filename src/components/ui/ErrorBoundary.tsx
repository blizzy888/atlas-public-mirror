import { colors, spacing, typography } from "@/styles";
import { AlertCircle } from "lucide-react-native";
import React, { Component, ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "./Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Error logging can be handled by error reporting service if needed
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <AlertCircle size={48} color={colors.error} />
            </View>

            <Text style={styles.title}>Oops, something went wrong</Text>

            <Text style={styles.message}>
              We&apos;re sorry, but something unexpected happened. Please try again.
            </Text>

            <View style={styles.errorDetails}>
              <Text style={styles.errorText}>{this.state.error?.message || "Unknown error"}</Text>
            </View>

            <Button
              title="Try Again"
              onPress={this.handleRetry}
              variant="primary"
              size="large"
              fullWidth
            />
          </View>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.screen,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.errorLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.heading,
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  errorDetails: {
    backgroundColor: colors.gray50,
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    width: "100%",
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    textAlign: "center",
    fontFamily: "monospace",
  },
});
