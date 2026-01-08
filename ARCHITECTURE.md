# Attendvio System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Mobile Application                      │
│                    (React Native + Expo)                     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Teacher    │  │   Student    │  │     Auth     │     │
│  │   Screens    │  │   Screens    │  │   Screens    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    ┌───────▼────────┐                       │
│                    │  API Services  │                       │
│                    │   (Axios)      │                       │
│                    └───────┬────────┘                       │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    JWT Auth │ HTTPS/TLS
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                    Django REST API                           │
│                                                              │
│  ┌──────────┐  ┌───────────┐  ┌────────────┐  ┌─────────┐ │
│  │ Accounts │  │ Sessions  │  │ Attendance │  │ Reports │ │
│  │   API    │  │    API    │  │    API     │  │   API   │ │
│  └────┬─────┘  └─────┬─────┘  └──────┬─────┘  └────┬────┘ │
│       │              │                │             │       │
│       └──────────────┴────────────────┴─────────────┘       │
│                            │                                 │
│                    ┌───────▼────────┐                       │
│                    │  Django ORM    │                       │
│                    └───────┬────────┘                       │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
                    Database │ Connection
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                    PostgreSQL Database                       │
│                                                              │
│  ┌─────────┐  ┌────────────────┐  ┌──────────────────┐    │
│  │  Users  │  │   Attendance   │  │    Attendance    │    │
│  │  Table  │  │    Sessions    │  │     Records      │    │
│  └─────────┘  └────────────────┘  └──────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### Mobile App Layer

```
src/
├── screens/
│   ├── Auth/
│   │   ├── LoginScreen ──────────► Email/Password Login
│   │   └── RegisterScreen ───────► User Registration
│   ├── Teacher/
│   │   ├── TeacherDashboard ─────► Stats & Sessions List
│   │   ├── CreateSession ────────► Form with GPS selection
│   │   └── SessionDetails ───────► Report & Attendance List
│   └── Student/
│       ├── StudentDashboard ─────► Active Sessions & Stats
│       ├── MarkAttendance ───────► GPS Verification
│       └── AttendanceHistory ────► Personal Records
│
├── services/
│   ├── authService ──────────────► Login, Register, Logout
│   ├── sessionService ───────────► CRUD for Sessions
│   ├── attendanceService ────────► Mark & View Attendance
│   └── reportService ────────────► Reports & Analytics
│
├── components/
│   ├── Button ───────────────────► Styled Button
│   ├── TextInput ────────────────► Form Input
│   ├── Card ─────────────────────► Content Container
│   └── Loading ──────────────────► Loading Indicator
│
└── context/
    └── AuthContext ──────────────► Global Auth State
```

### Backend API Layer

```
backend/
├── accounts/
│   ├── models.py ────────────────► Custom User Model
│   ├── serializers.py ───────────► User Serialization
│   ├── views.py ─────────────────► Auth Endpoints
│   └── urls.py ──────────────────► /api/auth/*
│
├── sessions/
│   ├── models.py ────────────────► AttendanceSession Model
│   ├── serializers.py ───────────► Session Serialization
│   ├── views.py ─────────────────► Session CRUD
│   ├── permissions.py ───────────► Role Checks
│   └── urls.py ──────────────────► /api/sessions/*
│
├── attendance/
│   ├── models.py ────────────────► AttendanceRecord Model
│   ├── serializers.py ───────────► Attendance Validation
│   ├── views.py ─────────────────► Mark Attendance
│   ├── utils.py ─────────────────► Haversine Formula
│   └── urls.py ──────────────────► /api/attendance/*
│
└── reports/
    ├── views.py ─────────────────► Reports & Analytics
    └── urls.py ──────────────────► /api/reports/*
```

## Data Flow Diagrams

### User Authentication Flow

```
Mobile App                  Backend API               Database
    │                           │                         │
    ├──[POST /auth/login]──────►│                         │
    │   {email, password}        │                         │
    │                            ├──[Validate User]───────►│
    │                            │                         │
    │                            │◄──[User Data]──────────┤
    │                            │                         │
    │                            ├──[Generate JWT]         │
    │                            │                         │
    │◄──[User + Tokens]─────────┤                         │
    │                            │                         │
    ├──[Store in SecureStore]   │                         │
    │                            │                         │
    ├──[Subsequent Requests]────►│                         │
    │   Authorization: Bearer    │                         │
    │                            ├──[Verify JWT]           │
    │                            │                         │
    │◄──[Protected Data]────────┤                         │
```

### Create Session Flow (Teacher)

```
Teacher App              Backend API               Database
    │                        │                         │
    ├──[Open Create Form]   │                         │
    │                        │                         │
    ├──[Get GPS Location]   │                         │
    │   (Expo Location)      │                         │
    │                        │                         │
    ├──[POST /sessions/]────►│                         │
    │   {subject, lat,       │                         │
    │    lng, radius, time}  │                         │
    │                        │                         │
    │                        ├──[Validate Teacher]     │
    │                        │                         │
    │                        ├──[Validate Input]       │
    │                        │                         │
    │                        ├──[Create Session]──────►│
    │                        │                         │
    │                        │◄──[Session Created]────┤
    │                        │                         │
    │◄──[Session Data]──────┤                         │
    │                        │                         │
    └──[Navigate to List]   │                         │
```

### Mark Attendance Flow (Student)

```
Student App               Backend API              Database
    │                         │                        │
    ├──[View Active Session] │                        │
    │                         │                        │
    ├──[Tap "Mark Attn"]     │                        │
    │                         │                        │
    ├──[Request GPS]          │                        │
    │   (Expo Location)       │                        │
    │                         │                        │
    ├──[Calculate Distance]   │                        │
    │   (Client-side)         │                        │
    │                         │                        │
    ├──[Show Feedback]        │                        │
    │   "You are 25m away"    │                        │
    │                         │                        │
    ├──[POST /attendance/     │                        │
    │        mark/]───────────►│                        │
    │   {session_id, lat,     │                        │
    │    lng}                 │                        │
    │                         │                        │
    │                         ├──[Verify Student]      │
    │                         │                        │
    │                         ├──[Get Session]────────►│
    │                         │                        │
    │                         │◄──[Session Data]──────┤
    │                         │                        │
    │                         ├──[Calculate Distance]  │
    │                         │   (Haversine Formula)  │
    │                         │                        │
    │                         ├──[Check Distance ≤    │
    │                         │    radius]             │
    │                         │                        │
    │                         ├──[Check Duplicate]────►│
    │                         │                        │
    │                         │◄──[No Duplicate]──────┤
    │                         │                        │
    │                         ├──[Create Record]──────►│
    │                         │                        │
    │                         │◄──[Record Created]────┤
    │                         │                        │
    │◄──[Success Message]────┤                        │
    │                         │                        │
    └──[Show Success Alert]  │                        │
```

### Geofencing Validation Detail

```
┌────────────────────────────────────────────┐
│        Student Location (GPS)              │
│            (37.7750, -122.4195)            │
└───────────────────┬────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  Calculate Distance   │
        │  (Haversine Formula)  │
        │                       │
        │  R = 6371000 meters   │
        │  Δlat, Δlng in radians│
        │  a = sin²(Δlat/2) +   │
        │      cos(lat1) ×      │
        │      cos(lat2) ×      │
        │      sin²(Δlng/2)     │
        │  c = 2×atan2(√a,√1-a) │
        │  distance = R × c     │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Distance = 15.5m    │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Session Radius = 50m  │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │  15.5m ≤ 50m ?        │
        │      ✓ YES            │
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │ Attendance Approved   │
        └───────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────┐
│            Security Layers                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Layer 1: Network Security                     │
│  ├─ HTTPS/TLS Encryption                       │
│  ├─ Certificate Validation                     │
│  └─ Secure WebSocket (future)                  │
│                                                 │
│  Layer 2: Authentication                       │
│  ├─ JWT Tokens (Access + Refresh)              │
│  ├─ Token Expiration (60 min / 24 hrs)         │
│  ├─ Automatic Refresh                          │
│  └─ Secure Storage (Expo SecureStore)          │
│                                                 │
│  Layer 3: Authorization                        │
│  ├─ Role-Based Access Control                  │
│  ├─ Permission Classes                         │
│  ├─ API-Level Enforcement                      │
│  └─ No Trust of Client Data                    │
│                                                 │
│  Layer 4: Data Validation                      │
│  ├─ Server-Side Validation Only                │
│  ├─ Geofence Re-verification                   │
│  ├─ Input Sanitization                         │
│  └─ Django Serializers                         │
│                                                 │
│  Layer 5: Database Security                    │
│  ├─ Unique Constraints                         │
│  ├─ Foreign Key Constraints                    │
│  ├─ Password Hashing (PBKDF2)                  │
│  └─ SQL Injection Protection (ORM)             │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Technology Stack

```
┌──────────────────────────────────────────────────┐
│                 Frontend                         │
├──────────────────────────────────────────────────┤
│  React Native     │  UI Framework               │
│  Expo SDK 50      │  Development Platform       │
│  TypeScript       │  Type Safety                │
│  React Navigation │  Routing                    │
│  Axios            │  HTTP Client                │
│  Expo Location    │  GPS Access                 │
│  Expo SecureStore │  Secure Storage             │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│                 Backend                          │
├──────────────────────────────────────────────────┤
│  Django 4.2       │  Web Framework              │
│  Django REST FW   │  API Framework              │
│  PostgreSQL 12+   │  Database                   │
│  SimpleJWT        │  Authentication             │
│  CORS Headers     │  Cross-Origin               │
│  Django Filters   │  Query Filtering            │
│  Gunicorn         │  WSGI Server (Prod)         │
│  Nginx            │  Reverse Proxy (Prod)       │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│               Infrastructure                     │
├──────────────────────────────────────────────────┤
│  PostgreSQL       │  Primary Database           │
│  Redis (optional) │  Caching Layer              │
│  Nginx            │  Load Balancer              │
│  Let's Encrypt    │  SSL Certificates           │
│  Sentry           │  Error Tracking             │
│  AWS/DigitalOcean │  Cloud Hosting              │
└──────────────────────────────────────────────────┘
```

## Deployment Architecture

```
                    ┌─────────────────┐
                    │   App Stores    │
                    │  iOS & Android  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Mobile Users   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   CDN / Nginx   │
                    │  Load Balancer  │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
    ┌───────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │  App Server  │ │ App Server  │ │ App Server  │
    │   (Django)   │ │  (Django)   │ │  (Django)   │
    │  + Gunicorn  │ │ + Gunicorn  │ │ + Gunicorn  │
    └───────┬──────┘ └──────┬──────┘ └──────┬──────┘
            │                │                │
            └────────────────┼────────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │  (Primary DB)   │
                    └─────────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │   (Replica DB)  │
                    └─────────────────┘
```

## API Request Flow

```
1. Client Request
   └─► Authorization Header (Bearer token)
   
2. Nginx
   └─► SSL Termination
   └─► Route to Gunicorn
   
3. Django Middleware
   └─► CORS Check
   └─► JWT Validation
   └─► Rate Limiting
   
4. View Function
   └─► Permission Check (Role)
   └─► Input Validation
   └─► Business Logic
   
5. Database
   └─► Query Execution
   └─► Data Retrieval
   
6. Serialization
   └─► Format Response
   └─► Add Metadata
   
7. Response
   └─► JSON Data
   └─► HTTP Status Code
```

## Development vs Production

```
┌─────────────────┬──────────────────┬──────────────────┐
│    Aspect       │   Development    │   Production     │
├─────────────────┼──────────────────┼──────────────────┤
│ Backend Server  │ runserver        │ Gunicorn+Nginx   │
│ Database        │ SQLite/Local PG  │ PostgreSQL       │
│ Debug Mode      │ DEBUG=True       │ DEBUG=False      │
│ HTTPS           │ HTTP (optional)  │ HTTPS Required   │
│ Logging         │ Console          │ File + External  │
│ Error Tracking  │ Console          │ Sentry           │
│ Static Files    │ Django Dev       │ Nginx/CDN        │
│ Mobile Build    │ Expo Go          │ Standalone Build │
│ API URL         │ localhost:8000   │ api.domain.com   │
└─────────────────┴──────────────────┴──────────────────┘
```

---

This architecture ensures:
- ✅ **Scalability**: Horizontal scaling capability
- ✅ **Security**: Multiple security layers
- ✅ **Performance**: Optimized with caching and indexing
- ✅ **Reliability**: Database replication and backups
- ✅ **Maintainability**: Clean code architecture
- ✅ **Extensibility**: Easy to add new features
