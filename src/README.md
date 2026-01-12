# Source Code Structure

## 📁 Directory Overview

### `/app` - Expo Router screens
File-based routing with tab navigation structure.

### `/components` - UI components
- `/features` - Feature-specific components (AnalysisCard, AnalysisResults, etc.)
- `/ui` - Reusable UI primitives (Button, TextInput, etc.)

### `/lib` - Core business logic
- `/api` - External API services (AI analysis, API clients)
- `/hooks` - Simple React hooks for data management
- `storage.ts` - Direct AsyncStorage operations

### `/styles` - Design system
Token-based design system for consistent theming:
- `colors.ts` - Semantic color tokens with variants
- `spacing.ts` - 4px-based spacing scale
- `typography.ts` - Responsive typography system
- `shadows.ts` - Elevation-based shadow system

### `/types` - TypeScript definitions
Domain-driven type definitions organized by feature.

### `/constants` - App constants
Static data like presets and supplement lists.

## 🎯 Architecture Principles

1. **Simple is Better** - No complex abstractions, just direct operations
2. **Service Hooks Pattern** - Direct storage access via React hooks
3. **Design Tokens** - Semantic design system for consistent UI
4. **Type Safety** - Comprehensive TypeScript coverage
5. **Clean Code** - Proper naming, comments, and organization

## 🔧 Key Patterns

### Data Flow
```
AsyncStorage → storageService → hooks → components
```

### State Management
```typescript
// Use service hooks instead of complex stores
const { supplements, addSupplement } = useSupplements();
const { profile, updateProfile } = useProfile();
const { analysis, analyze } = useAnalysis();
```

### Design Tokens
```typescript
// Use semantic tokens for consistent styling
backgroundColor: colors.primary[500]
padding: spacing.screen
fontSize: typography.heading
elevation: shadows.sm
```

## 🚀 Best Practices

- **Keep it Simple** - Avoid unnecessary complexity
- **Use Design Tokens** - Never hardcode styles
- **Type Everything** - Comprehensive TypeScript types
- **Clean Imports** - Use path aliases (@/...)
- **Error Handling** - Graceful degradation
- **Comments** - Clear, concise documentation

