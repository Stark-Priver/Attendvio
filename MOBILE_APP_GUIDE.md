# Attendvio Mobile App

> A calm, professional attendance management app with geofencing capabilities

## Design Philosophy

**Calm • Minimal • Confident**

The app follows strict iOS-style design principles, even on Android, delivering a premium institutional experience.

## Key Features

### For Students
- **Active Sessions View**: See available attendance sessions with real-time status
- **Geofence-Based Attendance**: Mark attendance only when within the specified radius
- **Attendance History**: View your complete attendance records
- **Clean Profile Management**: iOS-style settings screen

### For Teachers
- **Session Creation**: Create geofence-enabled attendance sessions
- **Real-time Monitoring**: Track active sessions and attendance counts
- **Session Management**: End sessions and view analytics
- **Professional Interface**: Clean, institutional design

## Design System

### Colors

```typescript
Primary: #0A1F44 (Dark Blue) - Navigation, headers, emphasis
Secondary: #F97316 (Orange) - Actions, highlights, confirmations
Backgrounds: #FFFFFF, #F5F5F7, #FAFAFA
```

**Usage Rules:**
- Dark Blue for headers and primary surfaces
- Orange for actions only (never overuse)
- White and light gray for backgrounds
- No gradients

### Typography

- **Font**: System (Helvetica Neue on iOS, Roboto fallback on Android)
- **Hierarchy**: Clear distinction between titles, headers, and body text
- **Line Height**: Generous spacing for readability

### Animations

All animations are:
- **Smooth**: 150-350ms duration
- **Fast**: No long waits
- **Purposeful**: Enhance clarity, never distract
- **Subtle**: No bounce-heavy or loud effects

#### Animation Types
- Screen transitions: Fade + slide
- Button press: Scale 0.96 with spring
- List items: Staggered fade-in
- Success: Subtle scale pulse
- Error: Gentle shake

### Spacing

```typescript
xs: 4px   | sm: 8px   | md: 12px
base: 16px | lg: 20px  | xl: 24px
xxl: 32px  | xxxl: 48px
```

## Screen Structure

### Authentication Flow
1. **Splash Screen**: Dark blue with icon (1.5s minimum)
2. **Login**: Clean form with email/password
3. **Register**: Role selection (Student/Teacher) + form

### Student Flow
- **Sessions Tab**: Active sessions with mark attendance button
- **History Tab**: Past attendance records
- **Settings Tab**: iOS-style settings list

### Teacher Flow
- **Sessions Tab**: Created sessions with management options
- **Create Tab**: Session creation form with location capture
- **Settings Tab**: Profile and app settings

## Technical Stack

### Core
- **Framework**: React Native (Expo)
- **Navigation**: Expo Router (file-based)
- **Animations**: React Native Reanimated 3
- **State Management**: React Context + Hooks

### Key Libraries
- `expo-location`: Geofencing and location services
- `axios`: HTTP client
- `@react-native-async-storage/async-storage`: Persistent storage
- `@react-native-community/datetimepicker`: Session time selection

## Project Structure

```
attendvio/
├── app/
│   ├── (student)/          # Student screens (tab navigation)
│   │   ├── index.tsx       # Active sessions
│   │   ├── history.tsx     # Attendance history
│   │   └── settings.tsx    # Settings
│   ├── (teacher)/          # Teacher screens (tab navigation)
│   │   ├── index.tsx       # My sessions
│   │   ├── create.tsx      # Create session
│   │   └── settings.tsx    # Settings
│   ├── index.tsx           # Splash screen
│   ├── login.tsx           # Login screen
│   ├── register.tsx        # Register screen
│   └── _layout.tsx         # Root layout
├── components/
│   └── ui/                 # Reusable UI components
│       ├── button.tsx      # iOS-style button
│       ├── input.tsx       # Text input
│       ├── card.tsx        # Card container
│       ├── settings-item.tsx # Settings list item
│       ├── section-header.tsx # Section headers
│       ├── loading-spinner.tsx
│       └── toast.tsx       # Toast notifications
├── constants/
│   ├── design.ts           # Design system tokens
│   └── config.ts           # App configuration
├── contexts/
│   └── auth-context.tsx    # Authentication context
└── utils/
    ├── animations.ts       # Animation utilities
    ├── api.ts              # API client
    └── location.ts         # Geofencing utilities
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android) or Xcode (for iOS)

### Installation

```bash
cd attendvio
npm install
```

### Configuration

Update `constants/config.ts` with your backend URL:

```typescript
API_BASE_URL: 'http://YOUR_BACKEND_URL:8000/api'
```

For Android emulator, use: `http://10.0.2.2:8000/api`
For iOS simulator, use: `http://localhost:8000/api`

### Running the App

```bash
# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Design Guidelines

### What to DO
✅ Use generous spacing
✅ Keep animations subtle and fast
✅ Follow iOS-style navigation patterns
✅ Use dark blue for emphasis, orange for actions
✅ Maintain clear visual hierarchy
✅ Show clear feedback for all actions
✅ Test on actual devices for geofencing

### What NOT to Do
❌ Don't use Material Design components
❌ Don't add aggressive animations
❌ Don't overuse the orange color
❌ Don't use gradients
❌ Don't clutter the UI
❌ Don't skip error states
❌ Don't test geofencing only on simulators

## Geofencing Implementation

The app uses the Haversine formula to calculate distances between coordinates:

```typescript
// Check if user is within geofence
const { withinRange, distance } = isWithinGeofence(
  userLat, userLon,
  centerLat, centerLon,
  radius
);
```

**Important Notes:**
- Location permissions are required
- Accuracy depends on device GPS
- Test with real devices for accurate results
- Distance is calculated in meters

## API Integration

The app communicates with the Django backend:

### Endpoints Used
- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login
- `GET /sessions/active/` - Get active sessions (Student)
- `GET /sessions/` - Get all sessions (Teacher)
- `POST /sessions/` - Create session (Teacher)
- `POST /sessions/{id}/end_session/` - End session (Teacher)
- `POST /attendance/mark/` - Mark attendance (Student)
- `GET /attendance/my/` - Get attendance history (Student)

### Authentication
Uses JWT tokens stored in AsyncStorage:
- Access token: Added to all API requests
- Refresh token: Used to renew access token
- Auto-logout on refresh failure

## Contributing

When adding new features:

1. Follow the design system strictly
2. Use existing components when possible
3. Keep animations subtle (150-350ms)
4. Test on both Android and iOS
5. Maintain iOS-style navigation patterns
6. Add proper error handling
7. Use TypeScript for type safety

## Testing

### Manual Testing Checklist
- [ ] Authentication flow (login/register)
- [ ] Student: View active sessions
- [ ] Student: Mark attendance (within/outside geofence)
- [ ] Student: View history
- [ ] Teacher: Create session
- [ ] Teacher: View sessions
- [ ] Teacher: End session
- [ ] Settings screens (both roles)
- [ ] Logout functionality
- [ ] Navigation between screens
- [ ] Error handling
- [ ] Loading states
- [ ] Animations smoothness

### Geofencing Testing
1. Create a session with 50m radius
2. Use a real device (not simulator)
3. Walk inside and outside the radius
4. Verify distance calculation
5. Test marking attendance

## Performance Considerations

- Animations use React Native Reanimated (runs on UI thread)
- List rendering uses FlatList with proper key extraction
- API calls are cached when appropriate
- Images are optimized for mobile
- No unnecessary re-renders

## Accessibility

- All interactive elements have proper hit areas (44x44 minimum)
- Color contrast meets WCAG AA standards
- Text is readable at default system size
- Loading states provide clear feedback

## License

This project is part of the Attendvio attendance management system.

---

**Design Principle**: Every interaction should feel intentional. The app should feel like a real institutional product that a university would approve.
