# Attendvio Visual Design Specification

## Executive Summary

This document defines the complete visual design language for the Attendvio mobile application. Every design decision prioritizes **calm, minimal, and confident** user experience suitable for institutional use.

---

## 1. Color System

### Primary Palette

#### Dark Blue `#0A1F44`
**Usage**: Headers, navigation, primary surfaces, emphasis
- Navigation bars and tab bars
- Screen titles
- Primary buttons
- Important text
- Active states

#### Orange `#F97316`
**Usage**: Actions, highlights, confirmations (USE SPARINGLY)
- Primary action buttons
- Active tab indicator
- Success confirmations
- Call-to-action elements
- NEVER use for backgrounds or large areas

### Supporting Colors

#### White `#FFFFFF`
- Card backgrounds
- Primary surfaces
- Button text on dark backgrounds

#### Light Gray `#F5F5F7`
- Screen backgrounds
- Input field backgrounds
- Secondary surfaces

#### Background Secondary `#FAFAFA`
- Alternative background
- Subtle differentiation

### Text Colors

#### Primary Text `#1D1D1F`
- Body text
- Headings
- Important information

#### Secondary Text `#6E6E73`
- Subtitles
- Supporting information
- Captions

#### Tertiary Text `#86868B`
- Placeholder text
- Disabled text
- Less important information

### System Colors

#### Success `#34C759`
- Success messages
- Completed states
- Positive feedback

#### Error `#FF3B30`
- Error messages
- Destructive actions
- Warning states

#### Warning `#FF9500`
- Warning messages
- Attention needed

### Borders & Separators

#### Separator `#D2D2D7`
- List dividers
- Section separators
- Subtle borders

#### Border `#E5E5EA`
- Input borders
- Card borders
- Container outlines

### Disabled States

#### Disabled `#C7C7CC`
- Disabled text
- Inactive elements

#### Disabled Background `#EFEFF4`
- Disabled button backgrounds
- Unavailable actions

### Color Usage Rules

✅ **DO:**
- Use Dark Blue for navigation and emphasis
- Use Orange sparingly for important actions
- Maintain high contrast ratios (WCAG AA)
- Use system colors for feedback

❌ **DON'T:**
- Don't use gradients
- Don't overuse Orange
- Don't mix multiple bright colors
- Don't use dark text on dark backgrounds

---

## 2. Typography

### Font Family

**Primary**: System font
- iOS: SF Pro / Helvetica Neue
- Android: Roboto
- Fallback: sans-serif

**Never mix fonts** - Use system font consistently throughout.

### Type Scale

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Large Title | 34px | Bold (700) | Screen titles, main headings |
| Title 1 | 28px | Bold (700) | Section headers |
| Title 2 | 22px | Bold (700) | Card titles |
| Title 3 | 20px | Bold (700) | Sub-section headers |
| Headline | 17px | Semibold (600) | Important text |
| Body | 17px | Regular (400) | Body text, default |
| Callout | 16px | Regular (400) | Emphasized body text |
| Subheadline | 15px | Regular (400) | Secondary text |
| Footnote | 13px | Regular (400) | Fine print |
| Caption 1 | 12px | Regular (400) | Labels, badges |
| Caption 2 | 11px | Regular (400) | Smallest text |

### Font Weights

- **Regular (400)**: Body text, descriptions
- **Medium (500)**: Slight emphasis
- **Semibold (600)**: Important labels, buttons
- **Bold (700)**: Titles, headers

### Line Height

- **Tight (1.2)**: Large titles, compact text
- **Normal (1.4)**: Most text
- **Relaxed (1.6)**: Body paragraphs
- **Loose (1.8)**: Highly readable text

### Letter Spacing

- Large titles: -1.5px to -1px
- Headlines: -0.3px
- Body text: 0px (default)
- All caps: +0.5px

### Typography Rules

✅ **DO:**
- Use generous line height
- Maintain clear hierarchy
- Use proper weights for emphasis
- Keep text readable at default size

❌ **DON'T:**
- Don't mix fonts
- Don't use decorative fonts
- Don't use all caps for body text
- Don't sacrifice readability for style

---

## 3. Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Minimal spacing, tight gaps |
| sm | 8px | Small gaps, compact layouts |
| md | 12px | Medium spacing |
| base | 16px | Default spacing, standard gap |
| lg | 20px | Large spacing |
| xl | 24px | Extra large spacing |
| xxl | 32px | Section gaps |
| xxxl | 48px | Major section separation |

### Special Spacing

| Token | Value | Usage |
|-------|-------|-------|
| screenHorizontal | 20px | Left/right screen padding |
| screenVertical | 16px | Top/bottom screen padding |
| sectionGap | 32px | Between major sections |
| listItemHeight | 44px | Minimum touch target |

### Spacing Rules

✅ **DO:**
- Use consistent spacing throughout
- Maintain 44x44px minimum touch targets
- Create visual breathing room
- Group related elements

❌ **DON'T:**
- Don't use arbitrary spacing
- Don't crowd elements together
- Don't sacrifice usability for density

---

## 4. Layout & Structure

### Screen Dimensions

- **Max Width**: 600px (for tablet optimization)
- **Header Height**: 44px
- **Tab Bar Height**: 50px
- **Input Height**: 44px
- **Button Height**: 50px

### Grid System

- **Margins**: 20px left/right
- **Gutters**: 16px between elements
- **Columns**: Flexible, responsive

### Z-Index Layers

| Layer | Value | Usage |
|-------|-------|-------|
| Base | 0 | Normal content |
| Dropdown | 1000 | Dropdowns, menus |
| Modal | 2000 | Modals, dialogs |
| Toast | 3000 | Notifications |
| Loading | 4000 | Loading overlays |

---

## 5. Components

### Buttons

#### Primary Button
- **Background**: Dark Blue (#0A1F44)
- **Text**: White
- **Height**: 50px
- **Border Radius**: 10px
- **Press Animation**: Scale to 0.96 with spring

#### Secondary Button
- **Background**: White
- **Border**: 1px Dark Blue
- **Text**: Dark Blue
- **Height**: 50px
- **Border Radius**: 10px

#### Danger Button
- **Background**: Error Red (#FF3B30)
- **Text**: White
- **Height**: 50px
- **Border Radius**: 10px

#### Button States
- **Normal**: Full opacity, scale 1.0
- **Pressed**: Scale 0.96, spring animation
- **Disabled**: Gray background, reduced opacity
- **Loading**: Spinner replaces text

### Input Fields

#### Text Input
- **Height**: 44px
- **Background**: Light Gray (#F5F5F7)
- **Border**: 1px transparent
- **Border Radius**: 10px
- **Padding**: 16px horizontal

#### Focused State
- **Background**: White
- **Border**: 1px Dark Blue
- **Transition**: 150ms ease

#### Error State
- **Border**: 1px Error Red
- **Error Text**: 12px, Error Red, 4px margin top

### Cards

#### Standard Card
- **Background**: White
- **Border Radius**: 12px
- **Padding**: 16px
- **Shadow**: 
  - Offset: 0, 4px
  - Opacity: 0.05
  - Radius: 4px

#### Card Hover/Press
- **Background**: Subtle gray tint
- **Transition**: 100ms timing

### Lists

#### List Item
- **Min Height**: 44px
- **Padding**: 12px vertical, 16px horizontal
- **Separator**: 0.5px, #D2D2D7
- **Separator Indent**: 48px from left (with icon)

#### List Item Press
- **Background**: Light Gray
- **Transition**: 100ms timing

### Settings Items (iOS-Style)

#### Structure
```
[Icon Container] [Text Container]           [Value] [Chevron]
     32x32           Title                    Text     20px
                     Subtitle
```

#### Icon Container
- **Size**: 32x32px
- **Border Radius**: 8px
- **Background**: Colored (varies)
- **Icon**: 20px, white

### Navigation

#### Tab Bar
- **Height**: 60px
- **Background**: White
- **Border Top**: 0.5px, Separator color
- **Icon Size**: 24px
- **Label**: Caption 1 (12px), medium weight
- **Padding Top**: 8px

#### Active Tab
- **Color**: Orange (#F97316)
- **Indicator**: None (color change only)

#### Inactive Tab
- **Color**: Tertiary Text (#86868B)

#### Navigation Header
- **Height**: 44px (excluding status bar)
- **Background**: White
- **Border Bottom**: 0.5px, Separator color
- **Title**: Title 3 (20px), bold, Dark Blue

---

## 6. Shadows & Elevation

### Shadow Levels

#### Small Shadow
```
shadowColor: #000
shadowOffset: { width: 0, height: 2 }
shadowOpacity: 0.05
shadowRadius: 4
elevation: 2 (Android)
```
**Usage**: Cards, small containers

#### Medium Shadow
```
shadowColor: #000
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.08
shadowRadius: 8
elevation: 4 (Android)
```
**Usage**: Raised cards, modals

#### Large Shadow
```
shadowColor: #000
shadowOffset: { width: 0, height: 8 }
shadowOpacity: 0.1
shadowRadius: 16
elevation: 8 (Android)
```
**Usage**: Floating elements, overlays

### Shadow Rules

✅ **DO:**
- Use shadows subtly
- Match shadow direction (top-down)
- Keep shadows soft and diffused

❌ **DON'T:**
- Don't use harsh shadows
- Don't use colored shadows
- Don't overuse elevation

---

## 7. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 8px | Small elements, badges |
| md | 10px | Inputs, small buttons |
| lg | 12px | Cards, containers |
| xl | 16px | Large cards, modals |
| full | 9999px | Circles, pills |
| button | 10px | Standard buttons |
| card | 12px | Card containers |
| input | 10px | Input fields |

### Radius Rules

✅ **DO:**
- Use consistent radius values
- Match radius to element size
- Keep corners smooth

❌ **DON'T:**
- Don't use too much variation
- Don't use sharp corners for interactive elements

---

## 8. Icons

### Icon Sizes

| Size | Value | Usage |
|------|-------|-------|
| xs | 16px | Small badges, inline |
| sm | 20px | List items, small buttons |
| md | 24px | Tab bar, standard size |
| lg | 28px | Large buttons |
| xl | 32px | Headers, featured icons |

### Icon Style
- **Library**: Ionicons
- **Style**: iOS style (outline for inactive, filled for active)
- **Color**: Matches text hierarchy
- **Stroke**: Consistent, not too thin

### Icon Usage

✅ **DO:**
- Use recognizable icons
- Pair with labels when needed
- Maintain consistent size
- Use semantic colors

❌ **DON'T:**
- Don't use decorative icons
- Don't mix icon styles
- Don't use icons without meaning

---

## 9. Animation Specifications

### Duration

| Speed | Value | Usage |
|-------|-------|-------|
| Fast | 150ms | Quick feedback, button press |
| Normal | 250ms | Screen transitions, fade |
| Slow | 350ms | Complex animations, entrance |

### Easing Functions

#### Ease Out
- **Cubic Bezier**: (0.25, 0.1, 0.25, 1)
- **Usage**: Most animations, natural deceleration

#### Ease In
- **Cubic Bezier**: (0.42, 0, 1, 1)
- **Usage**: Exit animations

#### Ease In Out
- **Cubic Bezier**: (0.42, 0, 0.58, 1)
- **Usage**: Transitions

#### Spring
- **Damping**: 20
- **Stiffness**: 300
- **Mass**: 1
- **Usage**: Interactive elements, button press

### Animation Types

#### Screen Transition
- **Type**: Fade + Slide
- **Duration**: 250ms
- **Easing**: Ease Out
- **Slide Distance**: 30px from bottom

#### Button Press
- **Type**: Scale
- **Scale**: 0.96
- **Animation**: Spring
- **Duration**: ~200ms (spring)

#### List Item Entrance
- **Type**: Staggered Fade In
- **Delay**: 50ms per item
- **Duration**: 400ms
- **Easing**: Ease Out

#### Success Feedback
- **Type**: Scale Pulse
- **Scale**: 1.0 → 1.05 → 1.0
- **Duration**: 300ms (150ms each)
- **Easing**: Ease In Out

#### Error Feedback
- **Type**: Horizontal Shake
- **Distance**: ±10px
- **Iterations**: 4
- **Duration**: 250ms total

#### Loading State
- **Type**: Opacity Pulse
- **Opacity**: 1.0 → 0.5 → 1.0
- **Duration**: 1600ms loop
- **Easing**: Linear

### Animation Rules

✅ **DO:**
- Keep animations fast (150-350ms)
- Use spring for interactive elements
- Maintain smooth frame rate (60fps)
- Add purpose to every animation

❌ **DON'T:**
- Don't use bounce-heavy animations
- Don't animate unnecessarily
- Don't use long durations (>500ms)
- Don't distract with motion

---

## 10. Feedback & States

### Loading States

#### Button Loading
- Replace text with ActivityIndicator
- Maintain button dimensions
- Disable interaction
- Show spinner in button color

#### Screen Loading
- Full-screen spinner
- Optional message below
- Dark Blue spinner color
- Centered vertically

#### Pull-to-Refresh
- Native iOS/Android behavior
- Dark Blue spinner
- Subtle animation

### Success States

#### Toast Notification
- **Background**: Success Green
- **Position**: Top, 60px from top
- **Duration**: 3000ms auto-hide
- **Animation**: Slide from top with spring
- **Icon**: Checkmark circle, white, 20px

#### Inline Success
- Green checkmark icon
- Success text, green color
- Fade in animation

### Error States

#### Toast Notification
- **Background**: Error Red
- **Position**: Top, 60px from top
- **Duration**: 3000ms auto-hide
- **Animation**: Slide from top + shake
- **Icon**: Close circle, white, 20px

#### Form Error
- Red border on input
- Error text below, 12px, red
- 4px margin top
- Gentle shake animation

#### Empty States
- Large icon (64px), disabled color
- Title, Title 3, primary text
- Description, Body, secondary text
- Centered vertically
- Optional action button below

### Disabled States

#### Disabled Button
- **Background**: #EFEFF4 (light gray)
- **Text**: #C7C7CC (disabled gray)
- **No interaction**: opacity events disabled

#### Disabled Input
- **Background**: #EFEFF4
- **Text**: #C7C7CC
- **Border**: None
- **Cursor**: Not allowed

---

## 11. Accessibility

### Touch Targets

- **Minimum**: 44x44px
- **Preferred**: 48x48px
- **Spacing**: 8px minimum between targets

### Color Contrast

- **Text on White**: 4.5:1 minimum (WCAG AA)
- **Large Text**: 3:1 minimum
- **Interactive Elements**: Clear visual difference

### Font Sizes

- **Minimum**: 11px (Caption 2)
- **Body Text**: 17px
- **Support**: Dynamic Type (iOS)

### Focus States

- Clear visual indication
- 2px outline for keyboard navigation
- High contrast color

---

## 12. Platform-Specific Considerations

### iOS-Style on Android

Even though the app is Android-only, it follows iOS patterns:

#### Navigation
- Stack navigation (push/pop)
- Swipe back gesture
- Clear hierarchy

#### Lists
- iOS-style separators
- Swipe actions
- Pull-to-refresh

#### Settings
- Grouped list style
- iOS Settings app layout
- Section headers

#### Typography
- iOS font sizes (but Roboto font)
- iOS-style hierarchy

#### Gestures
- Swipe back
- Pull-to-refresh
- Long press

### What to Avoid

❌ Material Design FABs
❌ Material ripple effects
❌ Material bottom sheets
❌ Material snackbars
❌ Material transitions

✅ Use iOS-equivalent patterns instead

---

## 13. Implementation Guidelines

### Component Creation

When creating new components:

1. **Start with design tokens** (colors, spacing, typography)
2. **Add proper TypeScript types**
3. **Include all states** (normal, pressed, disabled, loading)
4. **Implement animations** (if interactive)
5. **Test accessibility** (touch targets, contrast)
6. **Document usage** (when to use, examples)

### Code Style

```typescript
// Good: Uses design tokens
<View style={{ 
  padding: Spacing.base,
  backgroundColor: Colors.white,
  borderRadius: BorderRadius.card 
}}>

// Bad: Magic numbers
<View style={{ 
  padding: 16,
  backgroundColor: '#ffffff',
  borderRadius: 12 
}}>
```

### Animation Implementation

```typescript
// Good: Smooth spring animation
const scale = useSharedValue(1);
scale.value = withSpring(0.96, Animation.spring);

// Bad: Instant change
const scale = 0.96;
```

---

## 14. Design Review Checklist

Before considering any design complete, verify:

### Visual Design
- [ ] Uses correct colors from palette
- [ ] Typography follows scale
- [ ] Spacing is consistent
- [ ] Shadows are subtle
- [ ] Border radius is consistent

### Interaction
- [ ] Touch targets are 44x44px minimum
- [ ] Animations are smooth (150-350ms)
- [ ] Feedback is clear and calm
- [ ] Loading states exist
- [ ] Error states are handled

### Accessibility
- [ ] Text is readable (17px default)
- [ ] Contrast ratios pass WCAG AA
- [ ] Interactive elements are distinguishable
- [ ] Focus states are visible

### Polish
- [ ] No jarring transitions
- [ ] Animations have purpose
- [ ] Empty states are designed
- [ ] Edge cases are handled
- [ ] Feels calm and professional

---

## 15. Brand Identity

### Personality

**Calm**: No aggressive elements, gentle feedback
**Minimal**: Clean, uncluttered, focused
**Confident**: Strong typography, clear actions
**Professional**: Institutional quality
**Trustworthy**: Serious, no casual elements

### Voice & Tone

**Messages**:
- Clear and direct
- Human-readable errors
- Calm confirmations
- No exclamation marks overuse
- Professional language

**Examples**:
- ✅ "Attendance marked successfully"
- ❌ "Awesome! You're all set! 🎉"

### What Attendvio IS

- A university-approved institutional app
- Professional attendance management
- Serious and trustworthy
- Clean and modern
- iOS-quality experience

### What Attendvio is NOT

- A casual consumer app
- Flashy or playful
- Cluttered with features
- Material Design heavy
- Game-like

---

## Design Philosophy

> "Every interaction should feel intentional. The app should feel easy to understand without instructions, fast and responsive, trustworthy and serious."

**Mission**: Create an attendance app that institutions would proudly deploy, students would trust, and everyone would find easy to use.

---

**Version**: 1.0.0
**Last Updated**: January 2026
**Design Lead**: GitHub Copilot
