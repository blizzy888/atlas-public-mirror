import React, { useCallback, useMemo, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Clock,
  Plus,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Info,
} from "lucide-react-native";

import AnalysisResults from "@/components/features/AnalysisResults";
import { useAnalysis, useProfile, useSupplements } from "@/lib/hooks";
import { colors, spacing, typography } from "@/styles";

type HomeState = "empty" | "ready" | "analyzing" | "complete" | "critical";

export default function Home() {
  const router = useRouter();
  const { supplements, refresh: refreshSupplements } = useSupplements();
  const { analysis, isLoading, analyze, lastAnalyzedAt } = useAnalysis();
  const { profile, refresh: refreshProfile } = useProfile();

  const progressAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLoading) {
      fadeAnimation.setValue(0);
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const loopAnimation = () => {
        progressAnimation.setValue(0);
        Animated.timing(progressAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }).start(({ finished }) => {
          if (finished && isLoading) {
            loopAnimation();
          }
        });
      };
      loopAnimation();
    } else {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, progressAnimation, fadeAnimation]);

  const state = useMemo<HomeState>(() => {
    if (isLoading) return "analyzing";
    if (!supplements || supplements.length === 0) return "empty";
    if (!analysis) return "ready";
    if (analysis.summary.issueCount > 0) return "critical";
    return "complete";
  }, [supplements, analysis, isLoading]);

  const handleAnalyze = useCallback(async () => {
    if (!supplements || supplements.length === 0) {
      Alert.alert("No Supplements Found", "Add supplements to your stack first", [
        { text: "Cancel", style: "cancel" },
        { text: "Add Supplements", onPress: () => router.push("/supplements") },
      ]);
      return;
    }

    if (!profile?.name && !profile?.age && !profile?.healthGoals) {
      Alert.alert(
        "Profile Recommended",
        "Add profile information for better personalized analysis",
        [
          { text: "Analyze Anyway", onPress: () => analyze(supplements, profile) },
          { text: "Add Profile", onPress: () => router.push("/profile") },
        ]
      );
      return;
    }

    await analyze(supplements, profile);
  }, [supplements, profile, analyze, router]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([refreshProfile(), refreshSupplements()]);
  }, [refreshProfile, refreshSupplements]);

  const lastAnalyzedText = useMemo(() => {
    if (!lastAnalyzedAt) return null;

    const now = new Date();
    const diffMs = now.getTime() - lastAnalyzedAt.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  }, [lastAnalyzedAt]);

  const getSubtitleText = useCallback(() => {
    const count = supplements?.length || 0;
    const plural = count === 1 ? "" : "s";

    switch (state) {
      case "empty":
        return "Track supplements for personalized insights";
      case "ready":
        return `${count} supplement${plural} ready for analysis`;
      case "analyzing":
        return "AI analyzing your stack...";
      case "complete":
      case "critical":
        return `Last analyzed ${lastAnalyzedText || "recently"}`;
      default:
        return "";
    }
  }, [state, supplements, lastAnalyzedText]);

  const handlePrimaryAction = useCallback(() => {
    if (state === "empty") {
      router.push("/supplements/add");
    } else {
      handleAnalyze();
    }
  }, [state, handleAnalyze, router]);

  const renderPrimaryAction = () => {
    if (state !== "empty" && state !== "ready") return null;

    const isEmptyState = state === "empty";
    const icon = isEmptyState ? (
      <Plus size={20} color={colors.primary} strokeWidth={2.5} />
    ) : (
      <Sparkles size={20} color={colors.primary} />
    );
    const title = isEmptyState ? "Add Your First Supplement" : "Analyze Your Stack";
    const subtitle = isEmptyState ? "Start tracking supplements" : "Get AI-powered insights";

    return (
      <Pressable
        style={({ pressed }) => [styles.primaryAction, pressed && styles.primaryActionPressed]}
        onPress={handlePrimaryAction}
      >
        <View style={styles.primaryActionIcon}>{icon}</View>
        <View style={styles.primaryActionText}>
          <Text style={styles.primaryActionTitle}>{title}</Text>
          <Text style={styles.primaryActionSubtitle}>{subtitle}</Text>
        </View>
        <ChevronRight size={20} color={colors.white} />
      </Pressable>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={handleRefresh} tintColor={colors.primary} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {profile?.name ? `Hello, ${profile.name}` : "Welcome back"}
        </Text>
        <Text style={styles.subtitle}>{getSubtitleText()}</Text>
      </View>

      {state === "critical" && analysis && (
        <View style={styles.criticalSection}>
          <View style={styles.criticalCard}>
            <AlertTriangle size={32} color={colors.error} strokeWidth={2.5} />
            <View style={styles.criticalContent}>
              <Text style={styles.criticalNumber}>{analysis.summary.issueCount}</Text>
              <Text style={styles.criticalLabel}>
                Critical Issue{analysis.summary.issueCount === 1 ? "" : "s"}
              </Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.alertsScroll}>
            {analysis.alerts
              .filter(a => a.priority === "critical")
              .slice(0, 3)
              .map((alert, index) => (
                <View key={index} style={styles.alertCard}>
                  <View style={styles.alertDot} />
                  <Text style={styles.alertCardTitle} numberOfLines={1}>
                    {alert.title}
                  </Text>
                  <Text style={styles.alertCardText} numberOfLines={2}>
                    {alert.message}
                  </Text>
                </View>
              ))}
          </ScrollView>
        </View>
      )}

      {renderPrimaryAction()}

      {state === "analyzing" && (
        <Animated.View style={[styles.analyzingCard, { opacity: fadeAnimation }]}>
          <View style={styles.analyzingIconContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          <Text style={styles.analyzingTitle}>Analyzing Your Stack</Text>
          <Text style={styles.analyzingText}>
            Checking {supplements?.length || 0} supplement
            {(supplements?.length || 0) === 1 ? "" : "s"} for safety and interactions
          </Text>
          <View style={styles.analyzingProgress}>
            <View style={styles.analyzingProgressBar}>
              <Animated.View
                style={[
                  styles.analyzingProgressFill,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>
      )}

      {analysis && state !== "analyzing" && (
        <View style={styles.quickStatsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.primary + "10" }]}>
            <View style={styles.statIcon}>
              <TrendingUp size={20} color={colors.primary} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>{supplements?.length || 0}</Text>
            <Text style={styles.statLabel}>Supplements</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.secondary + "10" }]}>
            <View style={styles.statIcon}>
              <Clock size={20} color={colors.secondary} strokeWidth={2.5} />
            </View>
            <Text style={styles.statValue}>{lastAnalyzedText || "Now"}</Text>
            <Text style={styles.statLabel}>Last Check</Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor:
                  analysis.summary.issueCount > 0 ? colors.error + "10" : colors.success + "10",
              },
            ]}
          >
            <View style={styles.statIcon}>
              {analysis.summary.issueCount > 0 ? (
                <AlertTriangle size={20} color={colors.error} strokeWidth={2.5} />
              ) : (
                <CheckCircle size={20} color={colors.success} strokeWidth={2.5} />
              )}
            </View>
            <Text style={styles.statValue}>{analysis.summary.issueCount}</Text>
            <Text style={styles.statLabel}>Issues</Text>
          </View>
        </View>
      )}

      {state !== "empty" && state !== "analyzing" && (
        <View style={styles.actionButtonsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.addButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={() => router.push("/supplements/add")}
          >
            <Plus size={20} color={colors.white} strokeWidth={2.5} />
            <Text style={[styles.actionButtonText, { color: colors.white }]}>Add</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.viewButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={() => router.push("/supplements")}
          >
            <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>View All</Text>
          </Pressable>
        </View>
      )}

      {analysis && state !== "analyzing" && (
        <Pressable
          style={({ pressed }) => [
            styles.reanalyzeButton,
            pressed && styles.reanalyzeButtonPressed,
          ]}
          onPress={handleAnalyze}
        >
          <RefreshCw size={20} color={colors.primary} strokeWidth={2.5} />
          <Text style={styles.reanalyzeButtonText}>Update Analysis</Text>
        </Pressable>
      )}

      {analysis?.summary.scoreBreakdown && (
        <View style={styles.scoreCardsContainer}>
          <Pressable style={[styles.scoreCard, styles.safetyCard]}>
            <Text style={styles.scoreCardLabel}>SAFETY</Text>
            <Text style={styles.scoreCardValue}>{analysis.summary.scoreBreakdown.safety}</Text>
            <View style={styles.scoreCardBar}>
              <View
                style={[
                  styles.scoreCardBarFill,
                  {
                    width: `${analysis.summary.scoreBreakdown.safety * 10}%`,
                    backgroundColor: colors.success,
                  },
                ]}
              />
            </View>
          </Pressable>

          <Pressable style={[styles.scoreCard, styles.effectivenessCard]}>
            <Text style={styles.scoreCardLabel}>EFFECTIVE</Text>
            <Text style={styles.scoreCardValue}>
              {analysis.summary.scoreBreakdown.effectiveness}
            </Text>
            <View style={styles.scoreCardBar}>
              <View
                style={[
                  styles.scoreCardBarFill,
                  {
                    width: `${analysis.summary.scoreBreakdown.effectiveness * 10}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>
          </Pressable>

          <Pressable style={[styles.scoreCard, styles.personalCard]}>
            <Text style={styles.scoreCardLabel}>PERSONAL</Text>
            <Text style={styles.scoreCardValue}>
              {analysis.summary.scoreBreakdown.personalization}
            </Text>
            <View style={styles.scoreCardBar}>
              <View
                style={[
                  styles.scoreCardBarFill,
                  {
                    width: `${analysis.summary.scoreBreakdown.personalization * 10}%`,
                    backgroundColor: colors.secondary,
                  },
                ]}
              />
            </View>
          </Pressable>
        </View>
      )}

      {analysis && (
        <View style={styles.insightsSection}>
          <View style={styles.insightCard}>
            <View style={styles.insightIcon}>
              <Info size={20} color={colors.primary} strokeWidth={2.5} />
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Key Insight</Text>
              <Text style={styles.insightText}>{analysis.summary.keyMessage}</Text>
            </View>
          </View>

          {analysis.summary.issueCount === 0 && (
            <View style={[styles.statusCard, styles.goodStatusCard]}>
              <CheckCircle size={24} color={colors.success} strokeWidth={2.5} />
              <Text style={styles.statusText}>Stack looks good!</Text>
            </View>
          )}
        </View>
      )}

      {supplements &&
        supplements.length > 0 &&
        !analysis &&
        state !== "empty" &&
        state !== "analyzing" && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Supplements</Text>
              {supplements.length > 3 && (
                <Pressable onPress={() => router.push("/supplements")} hitSlop={8}>
                  <Text style={styles.seeAll}>See All ({supplements.length})</Text>
                </Pressable>
              )}
            </View>

            {supplements?.slice(0, 3).map(supplement => (
              <Pressable
                key={supplement.id}
                style={({ pressed }) => [styles.listItem, pressed && styles.listItemPressed]}
                onPress={() => router.push("/supplements")}
              >
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle} numberOfLines={1}>
                    {supplement.name}
                  </Text>
                  <Text style={styles.listItemSubtitle} numberOfLines={1}>
                    {supplement.dosage} • {supplement.frequency}
                    {supplement.timing && ` • ${supplement.timing}`}
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.textTertiary} />
              </Pressable>
            ))}
          </View>
        )}

      {analysis?.summary.nextAction && (
        <View style={styles.nextActionCard}>
          <View style={styles.nextActionHeader}>
            <Clock size={20} color={colors.primary} strokeWidth={2.5} />
            <Text style={styles.nextActionTitle}>Next Step</Text>
          </View>
          <Text style={styles.nextActionText}>{analysis.summary.nextAction}</Text>
        </View>
      )}

      {analysis && <AnalysisResults analysis={analysis} />}

      {state === "empty" && (
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Why Track Supplements?</Text>
          <View style={styles.tipItem}>
            <CheckCircle size={14} color={colors.success} />
            <Text style={styles.tipText}>Identify potential interactions</Text>
          </View>
          <View style={styles.tipItem}>
            <CheckCircle size={14} color={colors.success} />
            <Text style={styles.tipText}>Optimize dosages and timing</Text>
          </View>
          <View style={styles.tipItem}>
            <CheckCircle size={14} color={colors.success} />
            <Text style={styles.tipText}>Get personalized recommendations</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.display,
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: "700",
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 22,
  },
  criticalSection: {
    marginBottom: spacing.xl,
  },
  criticalCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius.xl,
    padding: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
    boxShadow: "0 2px 12px rgba(255, 59, 48, 0.1)",
  },
  criticalContent: {
    flex: 1,
  },
  criticalNumber: {
    ...typography.display,
    fontSize: 36,
    fontWeight: "800",
    color: colors.error,
    marginBottom: -4,
  },
  criticalLabel: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  alertsScroll: {
    marginHorizontal: -spacing.screen,
    paddingHorizontal: spacing.screen,
  },
  alertCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
    marginRight: spacing.sm,
    width: 280,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    marginBottom: spacing.sm,
  },
  alertCardTitle: {
    ...typography.body,
    fontWeight: "700",
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 4,
  },
  alertCardText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryAction: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius.xl,
    marginBottom: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.xl,
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    boxShadow: "0 2px 12px rgba(0, 122, 255, 0.08)",
  },
  primaryActionPressed: {
    backgroundColor: colors.primary + "08",
    transform: [{ scale: 0.98 }],
  },
  primaryActionIcon: {
    width: 48,
    height: 48,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    ...typography.body,
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  primaryActionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
  },
  analyzingCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius.xl,
    padding: spacing.xxl,
    alignItems: "center",
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
  },
  analyzingIconContainer: {
    marginBottom: spacing.xl,
  },
  analyzingTitle: {
    ...typography.title,
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  analyzingText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xl,
    fontSize: 15,
    maxWidth: "85%",
  },
  analyzingProgress: {
    width: "70%",
    alignItems: "center",
  },
  analyzingProgressBar: {
    width: "100%",
    height: 6,
    backgroundColor: colors.background,
    borderRadius: spacing.radius.full,
    overflow: "hidden",
  },
  analyzingProgressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: spacing.radius.full,
  },
  quickStatsContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: spacing.md,
    borderRadius: spacing.radius.lg,
    minHeight: 100,
    justifyContent: "center",
  },
  statIcon: {
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.title,
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    boxShadow: "0 2px 8px rgba(0, 122, 255, 0.15)",
  },
  viewButton: {
    backgroundColor: colors.white,
    borderColor: colors.cardBorder,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },
  actionButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  actionButtonText: {
    ...typography.body,
    fontWeight: "700",
    fontSize: 15,
  },
  scoreCardsContainer: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: spacing.radius.xl,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    minHeight: 140,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },
  safetyCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.success,
  },
  effectivenessCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  personalCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  scoreCardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  scoreCardValue: {
    ...typography.display,
    fontSize: 42,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    lineHeight: 42,
  },
  scoreCardBar: {
    height: 4,
    backgroundColor: colors.background,
    borderRadius: 2,
    overflow: "hidden",
  },
  scoreCardBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  insightsSection: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  insightCard: {
    backgroundColor: colors.primary + "08",
    borderRadius: spacing.radius.xl,
    padding: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + "20",
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  insightText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
    fontSize: 15,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: spacing.radius.lg,
  },
  goodStatusCard: {
    backgroundColor: colors.success + "10",
  },
  statusText: {
    ...typography.body,
    fontWeight: "600",
    color: colors.textPrimary,
    fontSize: 15,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.body,
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  seeAll: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: spacing.radius.lg,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  listItemPressed: {
    backgroundColor: colors.background,
    borderColor: colors.primary,
    transform: [{ scale: 0.99 }],
  },
  listItemContent: {
    flex: 1,
    marginRight: spacing.sm,
  },
  listItemTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: 2,
    fontSize: 15,
  },
  listItemSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 13,
  },
  nextActionCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary,
    boxShadow: "0 2px 8px rgba(0, 122, 255, 0.08)",
  },
  nextActionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  nextActionTitle: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  nextActionText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
    fontSize: 16,
  },
  tipsCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  tipsTitle: {
    ...typography.body,
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tipText: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  reanalyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: spacing.radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignSelf: "center",
    marginBottom: spacing.xl,
    boxShadow: "0 2px 8px rgba(0, 122, 255, 0.1)",
  },
  reanalyzeButtonPressed: {
    backgroundColor: colors.primary + "10",
    transform: [{ scale: 0.98 }],
  },
  reanalyzeButtonText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },
});
