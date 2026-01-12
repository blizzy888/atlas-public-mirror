# UI Standards & Design System

## Standardized Component Patterns

### **Border Radius**

- **Cards/Sections**: `spacing.radius.xl` (16px)
- **List Items/Buttons**: `spacing.radius.lg` (12px)
- **Small Elements**: `spacing.radius.md` (8px)
- **Circular**: `spacing.radius.full` (9999px)

### **Borders**

- **Standard**: `borderWidth: 1, borderColor: colors.border`
- **Emphasized**: `borderWidth: 1, borderColor: colors.primary + "30"`
- **Critical**: `borderWidth: 2, borderColor: colors.error + "30"`
- **Accent**: `borderLeftWidth: 4, borderLeftColor: colors.primary`

### **Shadows**

- **Primary Actions**: `shadows.md`
- **Cards/Sections**: `shadows.sm`
- **List Items**: `shadows.xs`
- **No Shadow**: Flat elements

### **Backgrounds**

- **Main Cards**: `colors.white`
- **Nested Items**: `colors.background`
- **Tinted Areas**: `colors.primary + "08"` or `"10"`
- **Critical**: `colors.error + "10"`
- **Success**: `colors.success + "08"`

### **Padding**

- **Cards/Sections**: `spacing.xl` (24px)
- **List Items**: `spacing.lg` (16px)
- **Nested Content**: `spacing.md` (12px)

### **Gaps**

- **Between Sections**: `spacing.xl` (24px)
- **Between Items**: `spacing.md` (12px) or `spacing.sm` (8px)
- **Within Items**: `spacing.sm` (8px)

### **Typography**

- **Page Headers**: `typography.display` (32px, 700)
- **Section Titles**: `typography.heading` (20px, 600)
- **Subsections**: `typography.subtitle` (18px, 500)
- **Body Text**: `typography.body` (16px, 400)
- **Captions**: `typography.caption` (12px, 400)

### **Interactive States**

```typescript
// Pressable Pattern
<Pressable
  style={({ pressed }) => [
    styles.item,
    pressed && styles.itemPressed
  ]}
  onPress={handlePress}
>
```

**Pressed States:**

- `opacity: 0.9` for primary actions
- `backgroundColor: colors.background` for white items
- `transform: [{ scale: 0.98 }]` for cards
- `transform: [{ scale: 0.99 }]` for list items

### **Color Usage**

- **Primary**: `colors.primary` (#10b981) - Main actions, success
- **Secondary**: `colors.secondary` (#6366f1) - Accents
- **Success**: `colors.success` (#10b981) - Positive states
- **Warning**: `colors.warning` (#f59e0b) - Cautions
- **Error**: `colors.error` (#ef4444) - Critical issues
- **Text Primary**: `colors.textPrimary` (#0f172a)
- **Text Secondary**: `colors.textSecondary` (#64748b)
- **Text Tertiary**: `colors.textTertiary` (#94a3b8)

### **Icon Sizes**

- **Large Icons**: 24px
- **Medium Icons**: 20px
- **Small Icons**: 16px
- **List Chevrons**: 18px

### **Component Hierarchy**

1. **Primary Action** - Large, colored, with shadow
2. **Secondary Actions** - White cards with borders
3. **Content Cards** - White background, subtle shadow
4. **List Items** - White background, border, minimal shadow
5. **Nested Items** - Gray background, border

## Home Screen State Standards

### **State: Empty**

- Primary action: Add supplement (green)
- Tips card with benefits
- No stats or analysis sections

### **State: Ready**

- Primary action: Analyze stack (green)
- Quick actions: Add + View All
- Recent supplements list (top 3)

### **State: Analyzing**

- Loading card with spinner
- Progress message
- No other actions visible

### **State: Complete**

- Quick actions: Add + View All
- Health scores card
- Key insight card
- Recent supplements
- Next action (if exists)
- Full analysis results

### **State: Critical**

- Critical alerts banner (red, at top)
- Quick actions: Add + View All
- Health scores card
- Key insight card
- Recent supplements
- Next action (if exists)
- Full analysis results

## Best Practices

1. **No Card Nesting**: Avoid cards within cards
2. **Consistent Spacing**: Use design tokens, not magic numbers
3. **Semantic Colors**: Use named colors, not hex codes
4. **Type Safety**: Define types for all props and state
5. **Memoization**: Use useMemo/useCallback for performance
6. **Accessibility**: Add hitSlop, numberOfLines, proper labels
7. **Animations**: Subtle scale/opacity on press
8. **Conditional Rendering**: Clear state-based logic
