/**
 * App Configuration
 * Central configuration for the app
 */

export const APP_CONFIG = {
  // API Configuration
  API_BASE_URL: __DEV__ 
    ? 'http://10.0.2.2:8000/api'  // Android emulator
    : 'https://your-production-url.com/api',
  
  // App Information
  APP_NAME: 'Attendvio',
  APP_VERSION: '1.0.0',
  
  // Geofencing Configuration
  DEFAULT_RADIUS: 50, // meters
  MIN_RADIUS: 10,
  MAX_RADIUS: 1000,
  
  // Session Configuration
  DEFAULT_SESSION_DURATION: 2, // hours
  
  // Animation Configuration
  ANIMATION_DURATION_FAST: 150,
  ANIMATION_DURATION_NORMAL: 250,
  ANIMATION_DURATION_SLOW: 350,
  
  // List Configuration
  STAGGER_ANIMATION_DELAY: 50, // milliseconds between list items
  
  // Toast Configuration
  TOAST_DURATION: 3000, // milliseconds
} as const;
