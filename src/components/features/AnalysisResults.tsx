import React from "react";
import { StyleSheet, Text, View } from "react-native";

import type { SupplementAnalysis } from "@/types";
import { colors, spacing, typography } from "@/styles";

const CriticalAlerts = ({ alerts }: { alerts: SupplementAnalysis["alerts"] }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Important</Text>
    {alerts
      .filter(a => a.priority === "critical")
      .map((alert, index) => (
        <View key={index} style={styles.alertItem}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertText}>{alert.message}</Text>
        </View>
      ))}
  </View>
);

const SupplementsSection = ({
  supplements,
}: {
  supplements: SupplementAnalysis["supplements"];
}) => (
  <View style={styles.supplementsContainer}>
    {supplements.map((supplement, index) => (
      <SupplementCard key={index} supplement={supplement} />
    ))}
  </View>
);

const SupplementCard = ({ supplement }: { supplement: SupplementAnalysis["supplements"][0] }) => {
  const ratingColor =
    supplement.effectiveness.rating >= 7
      ? colors.success
      : supplement.effectiveness.rating >= 5
      ? colors.primary
      : colors.error;

  return (
    <View style={[styles.supplementCard, { borderLeftColor: ratingColor }]}>
      <View style={styles.supplementMainInfo}>
        <Text style={styles.supplementName}>{supplement.name}</Text>
        <View style={[styles.ratingCircle, { backgroundColor: ratingColor + "10" }]}>
          <Text style={[styles.ratingNumber, { color: ratingColor }]}>
            {supplement.effectiveness.rating}
          </Text>
          <Text style={[styles.ratingSlash, { color: ratingColor }]}>/10</Text>
        </View>
      </View>

      <Text style={styles.supplementAssessment}>{supplement.assessment}</Text>

      <View style={styles.dosageCards}>
        <View style={styles.dosageCard}>
          <Text style={styles.dosageLabel}>CURRENT</Text>
          <Text style={styles.dosageValue}>{supplement.current.dosage}</Text>
          <Text style={styles.dosageFrequency}>{supplement.current.frequency}</Text>
        </View>

        <View style={styles.dosageCard}>
          <Text style={styles.dosageLabel}>OPTIMAL</Text>
          <Text style={styles.dosageValue}>{supplement.optimal.dosageRange}</Text>
          <Text style={styles.dosageFrequency}>{supplement.optimal.frequency}</Text>
        </View>
      </View>

      {supplement.effectiveness.expectedBenefits.length > 0 && (
        <View style={styles.benefitsRow}>
          {supplement.effectiveness.expectedBenefits.slice(0, 2).map((benefit, i) => (
            <View key={i} style={styles.benefitChip}>
              <Text style={styles.benefitChipText}>{benefit}</Text>
            </View>
          ))}
        </View>
      )}

      {supplement.safety.concerns.length > 0 && (
        <View style={styles.safetyAlert}>
          <Text style={styles.safetyAlertText}>⚠️ {supplement.safety.concerns[0]}</Text>
        </View>
      )}
    </View>
  );
};

const InteractionsSection = ({
  interactions,
}: {
  interactions: SupplementAnalysis["interactions"];
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Supplement Interactions</Text>
    {interactions.map((interaction, index) => (
      <View key={index} style={styles.interactionItem}>
        <Text style={styles.interactionSupplements}>{interaction.supplements.join(" + ")}</Text>
        <View style={{ marginBottom: spacing.xs }}>
          <Text style={styles.interactionType}>{interaction.type}</Text>
        </View>
        <Text style={styles.interactionDescription}>{interaction.description}</Text>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: spacing.xs }}>
          <Text style={{ ...typography.caption, color: colors.textSecondary, fontWeight: "600" }}>
            Recommendation:
          </Text>
          <Text style={[styles.interactionRecommendation, { flex: 1 }]}>
            {interaction.management.recommendation}
          </Text>
        </View>
      </View>
    ))}
  </View>
);

const OpportunitiesSection = ({
  opportunities,
}: {
  opportunities: SupplementAnalysis["opportunities"];
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Optimization Opportunities</Text>
    {opportunities.map((opp, index) => (
      <View key={index} style={styles.opportunityItem}>
        <Text style={styles.opportunityTitle}>{opp.title}</Text>
        <Text style={styles.opportunityDescription}>{opp.description}</Text>
        <Text style={styles.opportunityBenefit}>{opp.expectedBenefit}</Text>
        <View style={styles.opportunityDetails}>
          <Text style={styles.opportunitySteps}>Steps:</Text>
          {opp.implementation.steps.map((step, i) => (
            <Text key={i} style={styles.stepText}>
              {i + 1}. {step}
            </Text>
          ))}
        </View>
        <Text style={styles.opportunityEvidence}>Evidence: {opp.evidence}</Text>
      </View>
    ))}
  </View>
);

const InsightsSection = ({ insights }: { insights: SupplementAnalysis["insights"] }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Key Insights</Text>
    {insights.map((insight, index) => (
      <View key={index} style={styles.insightItem}>
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <Text style={styles.insightDescription}>{insight.description}</Text>
        {insight.recommendations && insight.recommendations.length > 0 && (
          <View style={styles.insightRecommendations}>
            {insight.recommendations.map((rec, i) => (
              <Text key={i} style={styles.recommendationText}>
                • {rec}
              </Text>
            ))}
          </View>
        )}
      </View>
    ))}
  </View>
);

const ProgressTrackingSection = ({
  progressTracking,
}: {
  progressTracking: NonNullable<SupplementAnalysis["progressTracking"]>;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Progress Tracking</Text>

    {progressTracking.biomarkers.length > 0 && (
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Biomarkers to Monitor</Text>
        {progressTracking.biomarkers.map((biomarker, index) => (
          <View key={index} style={styles.biomarkerItem}>
            <Text style={styles.biomarkerName}>{biomarker.name}</Text>
            {biomarker.target && (
              <Text style={styles.biomarkerTarget}>Target: {biomarker.target}</Text>
            )}
            <Text style={styles.biomarkerTimeline}>{biomarker.timeline}</Text>
          </View>
        ))}
      </View>
    )}

    {progressTracking.checkpoints.length > 0 && (
      <View style={styles.subsection}>
        <Text style={styles.subsectionTitle}>Checkpoints</Text>
        {progressTracking.checkpoints.map((checkpoint, index) => (
          <View key={index} style={styles.checkpointItem}>
            <View style={styles.checkpointHeader}>
              <Text style={styles.checkpointTimeframe}>{checkpoint.timeframe}</Text>
            </View>
            <View style={styles.checkpointExpectations}>
              {checkpoint.expectations.map((expectation, i) => (
                <Text key={i} style={styles.checkpointExpectation}>
                  • {expectation}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    )}
  </View>
);

const EducationSection = ({ education }: { education: SupplementAnalysis["education"] }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Educational Resources</Text>
    {education?.map((edu, index) => (
      <View key={index} style={styles.educationItem}>
        <Text style={styles.educationTopic}>{edu.topic}</Text>
        <Text style={styles.educationContent}>{edu.content}</Text>
      </View>
    ))}
  </View>
);

const DisclaimerSection = ({ disclaimer }: { disclaimer: string }) => (
  <View style={styles.section}>
    <Text style={styles.disclaimer}>{disclaimer}</Text>
  </View>
);

interface AnalysisResultsProps {
  analysis: SupplementAnalysis;
}

export default React.memo(function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <View style={styles.container}>
      {analysis.alerts.filter(a => a.priority === "critical").length > 0 && (
        <CriticalAlerts alerts={analysis.alerts} />
      )}

      <SupplementsSection supplements={analysis.supplements} />

      {analysis.interactions.length > 0 && (
        <InteractionsSection interactions={analysis.interactions} />
      )}

      {analysis.opportunities.length > 0 && (
        <OpportunitiesSection opportunities={analysis.opportunities} />
      )}

      {analysis.insights.length > 0 && <InsightsSection insights={analysis.insights} />}

      {analysis.progressTracking && (
        <ProgressTrackingSection progressTracking={analysis.progressTracking!} />
      )}

      {analysis.education && analysis.education.length > 0 && (
        <EducationSection education={analysis.education} />
      )}

      <DisclaimerSection disclaimer={analysis.disclaimer} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
  },
  supplementsContainer: {
    gap: spacing.md,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.lg,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    fontWeight: "700",
  },
  alertItem: {
    backgroundColor: colors.background,
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.error,
  },
  alertTitle: {
    ...typography.body,
    fontWeight: "700",
    marginBottom: spacing.xs,
    color: colors.textPrimary,
    fontSize: 15,
  },
  alertText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 20,
    fontSize: 14,
  },
  supplementCard: {
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: spacing.radius.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderLeftWidth: 4,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },
  supplementMainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  supplementName: {
    ...typography.title,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: "700",
    flex: 1,
  },
  ratingCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  ratingNumber: {
    ...typography.display,
    fontSize: 24,
    fontWeight: "800",
  },
  ratingSlash: {
    ...typography.body,
    fontSize: 14,
    fontWeight: "600",
  },
  supplementAssessment: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    fontSize: 15,
    marginBottom: spacing.lg,
  },
  dosageCards: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  dosageCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
    alignItems: "center",
  },
  dosageLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  dosageValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 2,
  },
  dosageFrequency: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 13,
  },
  benefitsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  benefitChip: {
    backgroundColor: colors.primary + "10",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.full,
  },
  benefitChipText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  safetyAlert: {
    backgroundColor: colors.warning + "10",
    borderRadius: spacing.radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.warning,
  },
  safetyAlertText: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  interactionItem: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.warning + "40",
    marginBottom: spacing.md,
  },
  interactionSupplements: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  interactionType: {
    ...typography.caption,
    fontWeight: "600",
    textTransform: "uppercase",
    color: colors.warning,
    backgroundColor: colors.warning + "15",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: spacing.radius.full,
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
  },
  interactionDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  interactionRecommendation: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  opportunityItem: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  opportunityTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  opportunityDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  opportunityBenefit: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  opportunityDetails: {
    marginTop: spacing.sm,
  },
  opportunitySteps: {
    ...typography.small,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  stepText: {
    ...typography.small,
    color: colors.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  opportunityEvidence: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  insightItem: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  insightTitle: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  insightDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  insightRecommendations: {
    gap: spacing.xs,
  },
  recommendationText: {
    ...typography.small,
    color: colors.textPrimary,
  },
  subsection: {
    marginBottom: spacing.xl,
  },
  subsectionTitle: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  biomarkerItem: {
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  biomarkerName: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: spacing.xs,
  },
  biomarkerTimeline: {
    ...typography.small,
    color: colors.textSecondary,
  },
  biomarkerTarget: {
    ...typography.small,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  checkpointItem: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  checkpointHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  checkpointTimeframe: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: "600",
  },
  checkpointExpectations: {
    gap: spacing.xs,
  },
  checkpointExpectation: {
    ...typography.body,
    color: colors.textPrimary,
  },
  educationItem: {
    padding: spacing.lg,
    backgroundColor: colors.primary + "08",
    borderRadius: spacing.radius.lg,
    borderWidth: 1,
    borderColor: colors.primary + "30",
    marginBottom: spacing.md,
  },
  educationTopic: {
    ...typography.heading,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  educationContent: {
    ...typography.body,
    color: colors.textSecondary,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textTertiary,
    paddingVertical: spacing.xl,
    textAlign: "center",
  },
});
