# Contributing Guide

## Development Setup

### Prerequisites

- Node.js 18+
- iOS Simulator or Android Emulator
- OpenAI API Key

### Getting Started

```bash
# Install dependencies (Bun preferred)
bun install

# Start development server
bunx expo start

# Run on specific platform
bunx expo run:ios      # iOS
bunx expo run:android  # Android
```

## Code Organization

### File Structure

```
src/
├── app/            # Expo Router screens (file-based routing)
├── components/     # Reusable UI components
│   ├── features/   # Feature-specific components
│   └── ui/        # Reusable primitives
├── lib/           # Core business logic
│   ├── api/       # External API services
│   ├── hooks/     # React hooks for data management
│   └── storage.ts # AsyncStorage operations
├── styles/        # Design system tokens
├── types/         # TypeScript definitions
└── constants/     # App constants
```

## Best Practices

### 1. Use Service Hooks Pattern

```typescript
// ✅ Good - Simple hook pattern
const { supplements, addSupplement } = useSupplements();

// ❌ Avoid - Complex store patterns
const store = useStore();
store.supplements.load();
```

### 2. Use Design Tokens

```typescript
// ✅ Good - Semantic tokens
backgroundColor: colors.primary[500];
padding: spacing.screen;
fontSize: typography.heading;

// ❌ Avoid - Hardcoded values
backgroundColor: "#10b981";
padding: 16;
fontSize: 20;
```

### 3. Keep Components Simple

```typescript
// ✅ Good - Simple, focused component
export function SupplementCard({ supplement, onPress }) {
  return <Pressable onPress={onPress}>...</Pressable>;
}

// ❌ Avoid - Complex component with too many responsibilities
```

### 4. Error Handling

```typescript
// ✅ Good - User-friendly errors
try {
  await analyze(supplements, profile);
} catch (error) {
  Alert.alert("Error", "Failed to analyze. Please try again.");
}
```

### 5. Type Safety

```typescript
// ✅ Good - Proper types
interface SupplementProps {
  supplement: Supplement;
  onPress: () => void;
}

// ❌ Avoid - Any types
const handlePress = (data: any) => { ... }
```

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `Button.tsx`, `AnalysisCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useSupplements.ts`)
- **Utils**: camelCase (e.g., `storage.ts`, `analysisService.ts`)
- **Types**: PascalCase (e.g., `Supplement`, `AnalysisRequest`)

### Variables

- **Constants**: UPPER_SNAKE_CASE (e.g., `STORAGE_KEYS`)
- **Functions**: camelCase (e.g., `addSupplement`, `loadProfile`)
- **Components**: PascalCase (e.g., `Button`, `HomeScreen`)
- **Hooks**: camelCase with `use` prefix (e.g., `useSupplements`)

## Code Style

### Imports

```typescript
// Group imports logically
import React from "react";
import { View, Text } from "react-native";

import { useSupplements } from "@/lib/hooks";
import { colors, spacing } from "@/styles";
import type { Supplement } from "@/types/supplements";
```

### Comments

```typescript
// ✅ Good - Concise, clear comments
// Load supplements on mount
useEffect(() => {
  loadSupplements();
}, []);

// ❌ Avoid - Verbose or obvious comments
// This function loads the supplements from storage when the component mounts
```

## Testing

### Before Submitting

- ✅ Run `npm run lint` - No linting errors
- ✅ Run `npm run type-check` - No TypeScript errors
- ✅ Test on iOS and Android
- ✅ Verify all features work as expected

## Common Tasks

### Adding a New Feature

1. Create types in `/types`
2. Add storage operations to `storageService`
3. Create hook in `/lib/hooks`
4. Build UI components in `/components/features`
5. Add screen in `/app`

### Adding a New Component

1. Create in `/components/ui` or `/components/features`
2. Use design tokens for styling
3. Add proper TypeScript types
4. Export from `index.ts`

### Adding New Design Tokens

1. Update appropriate file in `/styles`
2. Use semantic naming
3. Document the token's purpose
4. Update existing code to use new token

## Questions?

Follow the existing patterns in the codebase - consistency is key!
