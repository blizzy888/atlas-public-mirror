import React, { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Clock, Edit, MoreVertical, Package, Pill, Plus, Trash } from "lucide-react-native";
import * as Haptics from "expo-haptics";

import { Card, EmptyState } from "@/components/ui";
import { useProducts, useSupplements, useAnalysis } from "@/lib/hooks";
import type { Supplement } from "@/types";
import { colors, spacing, typography } from "@/styles";
import { shadows } from "@/styles/shadows";

export default function Supplements() {
  const router = useRouter();
  const { supplements, removeSupplement, refresh } = useSupplements();
  const { products, removeProduct } = useProducts();
  const { analysis } = useAnalysis();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleEdit = (supplement: Supplement) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/supplements/edit",
      params: { id: supplement.id },
    });
  };

  const handleDelete = (supplement: Supplement) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Delete Supplement", `Are you sure you want to remove ${supplement.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          removeSupplement(supplement.id);
          // Check if there's an analysis and prompt to reanalyze
          if (analysis) {
            setTimeout(() => {
              Alert.alert(
                "Stack Updated",
                "Your supplement stack has changed. Would you like to reanalyze?",
                [
                  { text: "Later", style: "cancel" },
                  {
                    text: "Reanalyze",
                    onPress: () => router.push("/(tabs)/(home)"),
                  },
                ]
              );
            }, 500);
          }
        },
      },
    ]);
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [refresh]);

  const handleProductMenu = (product: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(product.name, "What would you like to do?", [
      {
        text: "Edit Product",
        onPress: () => {
          // TODO: Navigate to product edit screen
          Alert.alert("Coming Soon", "Product editing will be available soon.");
        },
      },
      {
        text: "Delete Product",
        style: "destructive",
        onPress: () => handleDeleteProduct(product),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleDeleteProduct = (product: any) => {
    const productSupplements = supplements.filter(s => s.productId === product.id);
    Alert.alert(
      "Delete Product",
      `This will delete "${product.name}" and its ${productSupplements.length} supplement${
        productSupplements.length === 1 ? "" : "s"
      }. Are you sure?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Delete all supplements associated with this product
              for (const supplement of productSupplements) {
                await removeSupplement(supplement.id);
              }
              // Delete the product
              await removeProduct(product.id);

              // Check if there's an analysis and prompt to reanalyze
              if (analysis) {
                setTimeout(() => {
                  Alert.alert(
                    "Stack Updated",
                    "Your supplement stack has changed. Would you like to reanalyze?",
                    [
                      { text: "Later", style: "cancel" },
                      {
                        text: "Reanalyze",
                        onPress: () => router.push("/(tabs)/(home)"),
                      },
                    ]
                  );
                }, 500);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete product. Please try again.");
            }
          },
        },
      ]
    );
  };

  const renderSupplement = ({ item }: { item: Supplement }) => (
    <Card
      variant="elevated"
      compact
      onPress={() => handleEdit(item)}
      left={
        <View style={styles.iconWrapper}>
          <Pill size={20} color={colors.primary} />
        </View>
      }
      title={item.name}
      subtitle={`${item.dosage} • ${item.frequency}`}
      right={
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.actionButtonPressed]}
            onPress={() => handleEdit(item)}
            hitSlop={16}
          >
            <Edit size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.deleteButton,
              pressed && styles.actionButtonPressed,
            ]}
            onPress={() => handleDelete(item)}
            hitSlop={16}
          >
            <Trash size={18} color={colors.error} />
          </Pressable>
        </View>
      }
    >
      {item.timing && (
        <View style={styles.timingContainer}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={styles.timingText}>{item.timing}</Text>
        </View>
      )}
    </Card>
  );

  const FloatingAddButton = () => (
    <Pressable
      style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/supplements/add");
      }}
      accessibilityRole="button"
      accessibilityLabel="Add new supplement"
    >
      <Plus size={20} color={colors.white} strokeWidth={2.5} />
    </Pressable>
  );

  if (!supplements || supplements.length === 0) {
    return (
      <>
        <View style={styles.emptyContainer}>
          <EmptyState
            icon={<Pill size={64} color={colors.primary} />}
            title="Start Your Supplement Journey"
            description="Track your supplements, get personalized insights, and optimize your health stack"
            actionText="Add Your First Supplement"
            onAction={() => router.push("/supplements/add")}
          />
        </View>
        <FloatingAddButton />
      </>
    );
  }

  // Group supplements by product
  const ungroupedSupplements = supplements.filter(s => !s.productId);
  const grouped = [
    ...products
      .map(p => ({
        product: p,
        items: supplements.filter(s => s.productId === p.id),
      }))
      .filter(g => g.items.length > 0), // Only include products with supplements
    ...(ungroupedSupplements.length > 0
      ? [{ product: null as any, items: ungroupedSupplements }]
      : []),
  ];

  return (
    <>
      <FlatList
        data={grouped}
        keyExtractor={item => item.product?.id || "ungrouped"}
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior="automatic"
        removeClippedSubviews={true}
        maxToRenderPerBatch={6}
        initialNumToRender={4}
        windowSize={8}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.container}
        ListHeaderComponent={() => (
          <View style={styles.headerSection}>
            <Text style={styles.headerTitle}>Your Supplements</Text>
            <Text style={styles.headerSubtitle}>
              {supplements?.length || 0} supplement{(supplements?.length || 0) === 1 ? "" : "s"}{" "}
              tracked
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const isUngrouped = !item.product;

          return (
            <View style={[styles.groupSection, isUngrouped && styles.ungroupedSection]}>
              {item.product ? (
                <View style={styles.productCard}>
                  <View style={styles.productHeader}>
                    <View style={styles.productIconWrapper}>
                      <Package size={24} color={colors.primary} />
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.groupTitle}>{item.product.name}</Text>
                      {item.product.brand && (
                        <Text style={styles.groupBrand}>{item.product.brand}</Text>
                      )}
                    </View>
                    <Pressable
                      style={({ pressed }) => [
                        styles.productMenuButton,
                        pressed && styles.productMenuButtonPressed,
                      ]}
                      onPress={() => handleProductMenu(item.product)}
                      hitSlop={12}
                    >
                      <MoreVertical size={20} color={colors.textSecondary} />
                    </Pressable>
                  </View>
                  {item.product.timing && (
                    <View style={styles.productTimingRow}>
                      <Clock size={12} color={colors.textSecondary} />
                      <Text style={styles.productTiming}>{item.product.timing}</Text>
                    </View>
                  )}
                  <View style={styles.supplementsList}>
                    {item.items.map((s, index) => (
                      <View
                        key={s.id}
                        style={[{ marginBottom: index < item.items.length - 1 ? spacing.sm : 0 }]}
                      >
                        {renderSupplement({ item: s })}
                      </View>
                    ))}
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.ungroupedHeader}>
                    <View style={styles.ungroupedIconWrapper}>
                      <Pill size={20} color={colors.textSecondary} />
                    </View>
                    <Text style={styles.ungroupedTitle}>Individual Supplements</Text>
                  </View>
                  <View style={styles.ungroupedList}>
                    {item.items.map((s, index) => (
                      <View
                        key={s.id}
                        style={[{ marginBottom: index < item.items.length - 1 ? spacing.sm : 0 }]}
                      >
                        {renderSupplement({ item: s })}
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          );
        }}
      />
      <FloatingAddButton />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonPressed: {
    backgroundColor: colors.border,
    transform: [{ scale: 0.95 }],
  },
  deleteButton: {
    backgroundColor: colors.error + "08",
  },
  listContent: {
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  headerSection: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.display,
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 15,
  },
  groupSection: {
    marginBottom: spacing.xl,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  groupTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.sm,
  },
  groupTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 17,
  },
  groupBrand: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
    marginTop: 2,
  },
  timingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  groupSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.screen,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.screen,
    width: 56,
    height: 56,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
    borderWidth: 2,
    borderColor: colors.white,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.95 }],
  },
  timingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  timingText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  productMenuButton: {
    width: 32,
    height: 32,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  productMenuButtonPressed: {
    backgroundColor: colors.background,
    transform: [{ scale: 0.95 }],
  },
  productCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: spacing.lg,
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  productIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.md,
    backgroundColor: colors.primary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  productInfo: {
    flex: 1,
  },
  supplementsList: {
    marginTop: spacing.md,
  },
  productTimingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
    paddingLeft: 40 + spacing.md,
  },
  productTiming: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  ungroupedSection: {
    marginBottom: spacing.lg,
  },
  ungroupedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  ungroupedIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: spacing.radius.full,
    backgroundColor: colors.textSecondary + "10",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  ungroupedTitle: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  ungroupedList: {
    gap: spacing.sm,
  },
});
