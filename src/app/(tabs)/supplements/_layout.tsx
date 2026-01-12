import { Stack } from "expo-router";

export default function SupplementsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add"
        options={{
          presentation: "modal",
          title: "Add Supplement",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          presentation: "modal",
          title: "Edit Supplement",
        }}
      />
      <Stack.Screen
        name="scan"
        options={{
          presentation: "modal",
          title: "Scan Label",
        }}
      />
      <Stack.Screen
        name="review"
        options={{
          presentation: "modal",
          title: "Review Product",
        }}
      />
    </Stack>
  );
}
