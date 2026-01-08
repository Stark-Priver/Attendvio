# Attendvio Mobile - Quick Start Guide

## Prerequisites
- Node.js 18 or higher
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

## Installation Steps

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. Configure API Endpoint

Edit `src/config/api.ts` and set the correct backend URL:

**For Android Emulator:**
```typescript
export const API_BASE_URL = 'http://10.0.2.2:8000/api';
```

**For iOS Simulator:**
```typescript
export const API_BASE_URL = 'http://localhost:8000/api';
```

**For Physical Device:**
```typescript
export const API_BASE_URL = 'http://YOUR_COMPUTER_IP:8000/api';
// Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
```

**For Production:**
```typescript
export const API_BASE_URL = 'https://your-api-domain.com/api';
```

### 3. Start Development Server
```bash
npm start
```

This will open Expo Developer Tools in your browser.

### 4. Run on Device/Simulator

**Android:**
```bash
npm run android
```

**iOS (Mac only):**
```bash
npm run ios
```

**Physical Device:**
- Install "Expo Go" app from App Store or Play Store
- Scan the QR code from Expo Developer Tools

## Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── TextInput.tsx
│   │   ├── Card.tsx
│   │   └── Loading.tsx
│   ├── config/              # Configuration files
│   │   └── api.ts          # API endpoints & base URL
│   ├── context/             # React Context
│   │   └── AuthContext.tsx # Authentication state
│   ├── navigation/          # Navigation setup
│   │   └── RootNavigator.tsx
│   ├── screens/             # App screens
│   │   ├── Auth/           # Login & Register
│   │   ├── Teacher/        # Teacher screens
│   │   └── Student/        # Student screens
│   ├── services/            # API services
│   │   ├── apiClient.ts    # Axios instance
│   │   ├── authService.ts
│   │   ├── sessionService.ts
│   │   ├── attendanceService.ts
│   │   └── reportService.ts
│   ├── theme/               # Theme configuration
│   │   └── index.ts        # Colors, typography, spacing
│   └── types/               # TypeScript types
│       └── index.ts
├── App.tsx                  # Main app component
├── app.json                 # Expo configuration
├── package.json
└── tsconfig.json
```

## Testing the App

### Test Credentials

Create test users in Django backend first (see backend/SETUP_GUIDE.md).

**Teacher Account:**
- Email: `teacher@test.com`
- Password: `test123456`

**Student Account:**
- Email: `student@test.com`
- Password: `test123456`

### Testing Geofencing

To test attendance marking without physically moving:

1. **Use Android Emulator:**
   - Open Extended Controls (三 icon)
   - Go to Location tab
   - Enter custom GPS coordinates
   - Click "Send"

2. **Use iOS Simulator:**
   - Debug → Location → Custom Location
   - Enter latitude and longitude

3. **Test Coordinates:**
   - Session Center: `37.7749, -122.4194`
   - Within Range (50m): `37.7750, -122.4195`
   - Out of Range: `37.7850, -122.4294`

## Building for Production

### Android APK/AAB

Install Expo Application Services (EAS):
```bash
npm install -g eas-cli
```

Configure EAS:
```bash
eas build:configure
```

Build for Android:
```bash
# For APK (development)
eas build --platform android --profile preview

# For AAB (Google Play)
eas build --platform android --profile production
```

### iOS IPA

Build for iOS (requires Apple Developer account):
```bash
eas build --platform ios --profile production
```

### Submit to App Stores

```bash
# Google Play
eas submit --platform android

# App Store
eas submit --platform ios
```

## Customization

### Change App Name
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-name"
  }
}
```

### Change App Icon
Replace files in `assets/`:
- `icon.png` (1024x1024)
- `adaptive-icon.png` (1024x1024)
- `splash.png` (1284x2778)

### Change Theme Colors
Edit `src/theme/index.ts`:
```typescript
export const Colors = {
  primary: '#0A1F44',    // Your primary color
  secondary: '#F97316',  // Your secondary color
  // ...
};
```

## Common Issues

### Metro Bundler Cache
Clear cache if you encounter issues:
```bash
npm start --clear
```

### iOS Simulator Issues
Reset simulator:
```bash
xcrun simctl erase all
```

### Android Build Issues
Clear Gradle cache:
```bash
cd android
./gradlew clean
```

### Location Permission Issues

**Android:**
Edit `app.json` to ensure permissions are set:
```json
"android": {
  "permissions": [
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION"
  ]
}
```

**iOS:**
Edit `app.json` to set usage description:
```json
"ios": {
  "infoPlist": {
    "NSLocationWhenInUseUsageDescription": "Your message here"
  }
}
```

## Development Tips

### Enable Remote Debugging
- Shake device or press `Ctrl+M` (Android) / `Cmd+D` (iOS)
- Select "Debug Remote JS"

### View Console Logs
```bash
# In terminal where you ran npm start
# Logs will appear automatically
```

### Hot Reloading
- Enabled by default
- Changes appear automatically
- If not working, shake device and select "Reload"

## Performance Optimization

### Production Build Optimizations
- Minimize image sizes
- Use vector icons where possible
- Lazy load screens
- Optimize API calls
- Cache responses appropriately

### Network Optimization
The app already includes:
- Axios interceptors for token refresh
- Secure token storage with Expo SecureStore
- Error handling and retry logic

## Support & Resources

- Expo Docs: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/
- React Navigation: https://reactnavigation.org/
- TypeScript: https://www.typescriptlang.org/

For project-specific issues, refer to:
- Main README: ../README.md
- API Documentation: ../API_DOCUMENTATION.md
