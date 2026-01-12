# Atlas - Supplement Analysis App

A React Native/Expo app that uses AI to analyze supplement stacks and provide personalized recommendations.

## Features

- **Supplement Management**: Add, edit, and track your supplement regimen
- **AI-Powered Analysis**: Get personalized insights using OpenAI models via AI SDK
- **Profile Management**: Store personal health information for better analysis
- **Progress Tracking**: Monitor your supplement journey over time

## Architecture

This app follows React Native and Expo best practices with a clean, scalable architecture:

### 📁 Project Structure

```
src/
├── app/                    # Expo Router app directory
│   └── (tabs)/            # Tab navigation structure
├── components/            # Reusable UI components
│   ├── features/          # Feature-specific components
│   └── ui/               # Reusable UI primitives
├── lib/                  # Core business logic
│   ├── api/             # API services and clients
│   └── storage.ts       # AsyncStorage abstraction
├── stores/              # Zustand state management
│   ├── analysis/        # Analysis-related state
│   └── supplements/     # Supplement-related state
├── styles/              # Design system tokens
│   ├── colors.ts        # Color system
│   ├── spacing.ts       # Spacing scale
│   ├── typography.ts    # Typography system
│   └── shadows.ts       # Shadow system
├── types/               # TypeScript definitions
│   ├── analysis/        # Analysis domain types
│   └── supplements/     # Supplement domain types
└── constants/           # App constants and presets
```

### 🎨 Design System

The app uses a comprehensive, flat design token system optimized for React Native:

- **Colors**: Flat, semantic color tokens (e.g., `colors.primary`, `colors.textSecondary`)
- **Spacing**: 4px-based scale for consistent alignment
- **Typography**: Responsive font scales with proper line heights
- **Shadows**: Elevation-based shadow system with consistent opacity

Example usage:

```typescript
// Use semantic color tokens
backgroundColor: colors.primary,
color: colors.textSecondary,
borderColor: colors.border,

// Use spacing scale
padding: spacing.screen,
gap: spacing.xl,

// Use typography styles
...typography.heading,
...typography.body,
```

### 🔧 State Management

- **Service Hooks** for simple, direct data access
- **AsyncStorage** for persistence
- **React Hooks** for component state
- **Error boundaries** for graceful error handling

Example usage:

```typescript
// Simple hooks pattern - no complex stores
const { supplements, addSupplement } = useSupplements();
const { profile, updateProfile } = useProfile();
const { analysis, analyze } = useAnalysis();
```

### 🚀 Key Technologies

- **React Native 0.79** with Expo SDK 53
- **Expo Router** for file-based navigation
- **Service Hooks** for simple state management
- **AsyncStorage** for data persistence
- **AI SDK (OpenAI provider)** for AI-powered analysis
- **TypeScript** for type safety
- **ESLint** for code quality

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd atlas

# Install dependencies (Bun preferred)
bun install

# Start the development server
bunx expo start

# Run on specific platform
bunx expo run:ios      # iOS Simulator
bunx expo run:android  # Android Emulator
bunx expo start --web  # Web browser
```

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```

## Development

### Code Organization

- **Components**: Feature-based organization with reusable UI primitives
- **Hooks**: Simple service hooks for data management
- **Storage**: Direct AsyncStorage operations with type safety
- **API Services**: Clean API abstractions with proper error handling
- **Types**: Comprehensive TypeScript definitions with validation

### Best Practices

- ✅ Flat design tokens for React Native compatibility
- ✅ Simple service hooks pattern (no complex stores)
- ✅ Direct AsyncStorage operations
- ✅ Proper error boundaries and loading states
- ✅ Comprehensive TypeScript coverage
- ✅ Clean imports with path aliases (@/...)
- ✅ Consistent naming conventions
- ✅ Performance optimizations (React.memo, useCallback)

## Contributing

1. Follow the existing code structure and naming conventions
2. Use design tokens for all styling
3. Add proper TypeScript types
4. Include error handling and loading states
5. Write clear, concise comments
6. Test on both iOS and Android

## License

This project is private and not licensed for public use.
