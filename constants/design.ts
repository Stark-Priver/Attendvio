/**
 * Design System for Attendvio
 * Strict design guidelines - iOS-style, calm, minimal, professional
 */

// Color System (Strict)
export const Colors = {
  // Primary colors
  darkBlue: '#0A1F44',
  orange: '#F97316',
  
  // Backgrounds
  white: '#FFFFFF',
  lightGray: '#F5F5F7',
  backgroundSecondary: '#FAFAFA',
  
  // Text colors
  textPrimary: '#1D1D1F',
  textSecondary: '#6E6E73',
  textTertiary: '#86868B',
  
  // Borders and separators
  separator: '#D2D2D7',
  border: '#E5E5EA',
  
  // Status colors
  success: '#34C759',
  error: '#FF3B30',
  warning: '#FF9500',
  
  // Disabled states
  disabled: '#C7C7CC',
  disabledBackground: '#EFEFF4',
} as const;

// Typography
export const Typography = {
  // Font family
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  
  // Font sizes
  fontSize: {
    // Large titles
    largeTitle: 34,
    title1: 28,
    title2: 22,
    title3: 20,
    
    // Headlines
    headline: 17,
    body: 17,
    callout: 16,
    subheadline: 15,
    footnote: 13,
    caption1: 12,
    caption2: 11,
  },
  
  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line heights (generous)
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
} as const;

// Spacing System (iOS-style)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  
  // Screen padding
  screenHorizontal: 20,
  screenVertical: 16,
  
  // Section spacing
  sectionGap: 32,
  listItemHeight: 44,
} as const;

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  full: 9999,
  
  // iOS-style button radius
  button: 10,
  card: 12,
  input: 10,
} as const;

// Shadows (Subtle)
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Animation Timing (Smooth & Fast)
export const Animation = {
  // Duration
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  // Easing curves (iOS-like)
  easing: {
    easeOut: [0.25, 0.1, 0.25, 1] as const,
    easeIn: [0.42, 0, 1, 1] as const,
    easeInOut: [0.42, 0, 0.58, 1] as const,
    spring: [0.5, 1, 0.89, 1] as const,
  },
  
  // Spring configuration
  spring: {
    damping: 20,
    stiffness: 300,
    mass: 1,
  },
} as const;

// Layout
export const Layout = {
  // Container widths
  maxWidth: 600,
  
  // Navigation heights
  headerHeight: 44,
  tabBarHeight: 50,
  
  // Input heights
  inputHeight: 44,
  buttonHeight: 50,
  
  // List item
  listItemMinHeight: 44,
} as const;

// Z-Index hierarchy
export const ZIndex = {
  base: 0,
  dropdown: 1000,
  modal: 2000,
  toast: 3000,
  loading: 4000,
} as const;

// Icon sizes
export const IconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
} as const;
