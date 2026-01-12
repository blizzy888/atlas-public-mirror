import { colors, spacing, typography } from "@/styles";
import { shadows } from "@/styles/shadows";
import { Tabs } from "expo-router";
import { Home, Pill, User } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          ...shadows.md,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          ...typography.caption,
          fontWeight: "600",
          marginTop: spacing.xs,
        },
        tabBarHideOnKeyboard: true,
        tabBarItemStyle: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.xs,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused, size }) => (
            <Home size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="supplements"
        options={{
          title: "Supplements",
          tabBarIcon: ({ color, focused, size }) => (
            <Pill size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused, size }) => (
            <User size={size} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
