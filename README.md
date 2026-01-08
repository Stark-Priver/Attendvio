# Attendvio

**Tagline:** Attendance, Verified by Location

A production-grade, scalable mobile attendance management system with role-based access (Teacher and Student), strict geofencing-based attendance validation, and comprehensive reporting.

## Tech Stack

### Backend
- Django 4.2 (Python)
- Django REST Framework
- PostgreSQL
- JWT Authentication (SimpleJWT)
- Django CORS Headers
- Django Filters

### Frontend
- React Native with Expo SDK 50
- TypeScript
- Expo Location API
- Axios
- React Navigation
- Expo SecureStore

## Features

### For Teachers
- Create attendance sessions with geofencing parameters
- Define location (lat/long) and radius for each session
- Start and end sessions
- View real-time attendance reports
- Export attendance data to CSV
- Dashboard with session statistics

### For Students
- View active attendance sessions
- Mark attendance with GPS verification
- One-time attendance per session (duplicate prevention)
- View personal attendance history
- Real-time distance calculation from session location

### Security Features
- JWT-based authentication
- Server-side geofence validation (Haversine formula)
- Role-based access control
- Secure token storage
- API rate limiting ready

## Project Structure

```
Attendvio/
├── backend/                    # Django REST API
│   ├── attendvio/             # Main project settings
│   ├── accounts/              # User authentication & management
│   ├── sessions/              # Attendance session management
│   ├── attendance/            # Attendance records & geofencing
│   └── reports/               # Analytics & reporting
├── mobile/                    # React Native Expo app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth context
│   │   ├── navigation/       # Navigation setup
│   │   ├── screens/          # App screens
│   │   ├── services/         # API services
│   │   ├── theme/            # Theme & styling
│   │   └── types/            # TypeScript types
│   └── App.tsx              # App entry point
└── README.md
```

## Setup Instructions

### Backend Setup

1. **Install Python 3.10+**

2. **Create virtual environment:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Set up PostgreSQL:**
   - Install PostgreSQL
   - Create database: `CREATE DATABASE attendvio_db;`
   - Create user and grant privileges

5. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your database credentials and secret key
```

6. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

7. **Create superuser:**
```bash
python manage.py createsuperuser
```

8. **Run development server:**
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`
Admin panel at `http://localhost:8000/admin`

### Mobile Setup

1. **Install Node.js 18+**

2. **Install dependencies:**
```bash
cd mobile
npm install
```

3. **Configure API endpoint:**
   - Edit `src/config/api.ts`
   - Set `API_BASE_URL` to your backend URL
   - Use `http://10.0.2.2:8000/api` for Android emulator
   - Use `http://localhost:8000/api` for iOS simulator

4. **Run the app:**
```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `GET /api/auth/profile/` - Get user profile
- `POST /api/auth/logout/` - Logout
- `POST /api/token/refresh/` - Refresh JWT token

### Sessions (Teacher)
- `GET /api/sessions/` - List all sessions
- `POST /api/sessions/` - Create new session
- `GET /api/sessions/{id}/` - Get session details
- `PATCH /api/sessions/{id}/` - Update session
- `DELETE /api/sessions/{id}/` - Delete session
- `POST /api/sessions/{id}/end_session/` - End session manually
- `GET /api/sessions/active/` - Get active sessions

### Attendance (Student)
- `POST /api/attendance/mark/` - Mark attendance
- `GET /api/attendance/my_history/` - Get attendance history
- `GET /api/attendance/by_session/` - Get attendance by session

### Reports (Teacher)
- `GET /api/reports/session/{id}/` - Get session report
- `GET /api/reports/session/{id}/export/` - Export as CSV
- `GET /api/reports/teacher/dashboard/` - Teacher dashboard
- `GET /api/reports/student/dashboard/` - Student dashboard

## Design Guidelines

### Colors
- Primary (Dark Blue): `#0A1F44`
- Secondary (Orange): `#F97316`
- Background: `#FFFFFF`
- Gray: `#F5F5F5`, `#9CA3AF`, `#4B5563`

### Typography
- Font Family: Helvetica Neue
- Professional, clean, academic look
- No emojis in UI

### Splash Screen
- Background: Dark Blue (#0A1F44)
- Centered icon (attendance/location themed)
- App name: "Attendvio" in white
- Minimalist design

## Geofencing Implementation

The system uses the **Haversine formula** to calculate the great-circle distance between two points on Earth:

```python
def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371000  # Earth's radius in meters
    # Convert to radians and calculate
    ...
    return distance_in_meters
```

### Validation Flow:
1. Student requests to mark attendance with GPS coordinates
2. Frontend calculates distance (for UI feedback)
3. Backend re-validates distance using Haversine formula
4. Attendance approved only if distance ≤ session radius
5. Duplicate attendance attempts blocked at database level

## Testing

### Create Test Users

```python
# In Django shell (python manage.py shell)
from accounts.models import User

# Create teacher
teacher = User.objects.create_user(
    email='teacher@example.com',
    password='password123',
    first_name='John',
    last_name='Doe',
    role='TEACHER'
)

# Create student
student = User.objects.create_user(
    email='student@example.com',
    password='password123',
    first_name='Jane',
    last_name='Smith',
    role='STUDENT',
    student_id='STU001',
    department='Computer Science'
)
```

### Test Geofencing

Use these coordinates for testing:
- Session Location: `37.7749, -122.4194` (San Francisco)
- Within Range: `37.7750, -122.4195` (~15m away)
- Out of Range: `37.7850, -122.4294` (~1.5km away)

## Production Deployment

### Backend (Django)
1. Set `DEBUG=False` in settings
2. Configure proper `ALLOWED_HOSTS`
3. Use environment variables for secrets
4. Set up Gunicorn + Nginx
5. Configure PostgreSQL for production
6. Set up SSL certificates
7. Enable logging and monitoring

### Mobile (Expo)
1. Configure production API URL
2. Build APK/IPA:
```bash
eas build --platform android
eas build --platform ios
```
3. Submit to app stores:
```bash
eas submit
```

## Security Considerations

- ✅ JWT tokens with expiration and refresh
- ✅ Server-side location validation (never trust client)
- ✅ Role-based permissions enforced at API level
- ✅ Database constraints for duplicate prevention
- ✅ Secure password hashing (Django's PBKDF2)
- ✅ CORS properly configured
- ✅ SQL injection protection (ORM)
- ✅ Input validation and sanitization

## License

Proprietary - All rights reserved

## Support

For issues and questions, contact the development team.

---

**Built with ❤️ using Django & React Native**
