# Attendvio API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

### Register User
**POST** `/auth/register/`

Request body:
```json
{
  "email": "student@example.com",
  "password": "password123",
  "password_confirm": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "STUDENT",
  "student_id": "STU001",
  "department": "Computer Science"
}
```

Response:
```json
{
  "user": {
    "id": 1,
    "email": "student@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "STUDENT",
    "student_id": "STU001",
    "department": "Computer Science"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Login
**POST** `/auth/login/`

Request body:
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

Response: Same as register

### Refresh Token
**POST** `/token/refresh/`

Request body:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Sessions (Teacher Only)

### Create Session
**POST** `/sessions/`

Request body:
```json
{
  "subject_name": "Mobile App Development",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "radius": 50,
  "start_time": "2026-01-10T10:00:00Z",
  "end_time": "2026-01-10T12:00:00Z"
}
```

### Get All Sessions
**GET** `/sessions/`

Returns sessions filtered by user role:
- Teachers: Their own sessions
- Students: Active sessions only

### Get Active Sessions
**GET** `/sessions/active/`

### End Session
**POST** `/sessions/{id}/end_session/`

## Attendance (Student Only)

### Mark Attendance
**POST** `/attendance/mark/`

Request body:
```json
{
  "session_id": 1,
  "latitude": 37.7750,
  "longitude": -122.4195
}
```

Response:
```json
{
  "message": "Attendance marked successfully.",
  "attendance": {
    "id": 1,
    "session": 1,
    "session_name": "Mobile App Development",
    "marked_at": "2026-01-10T10:15:00Z",
    "distance_from_center": 15.5
  }
}
```

Error response (out of range):
```json
{
  "error": "You are outside the allowed area. Distance: 150.25m, Required: 50m"
}
```

Error response (duplicate):
```json
{
  "error": "You have already marked attendance for this session."
}
```

### Get Attendance History
**GET** `/attendance/my_history/`

## Reports

### Get Session Report (Teacher Only)
**GET** `/reports/session/{id}/`

Response:
```json
{
  "session": {
    "id": 1,
    "subject_name": "Mobile App Development",
    "start_time": "2026-01-10T10:00:00Z",
    "end_time": "2026-01-10T12:00:00Z",
    "status": "ENDED"
  },
  "statistics": {
    "total_attendance": 25,
    "verified_attendance": 25,
    "unverified_attendance": 0
  },
  "attendees": [
    {
      "student_id": "STU001",
      "student_name": "John Doe",
      "email": "student@example.com",
      "department": "Computer Science",
      "marked_at": "2026-01-10T10:15:00Z",
      "distance": 15.5,
      "is_verified": true
    }
  ]
}
```

### Export CSV
**GET** `/reports/session/{id}/export/`

Returns CSV file download

### Teacher Dashboard
**GET** `/reports/teacher/dashboard/`

### Student Dashboard
**GET** `/reports/student/dashboard/`

## Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to prevent abuse. Limits will be implemented based on deployment environment.

## Geofencing Validation

The backend validates location using the Haversine formula:

1. Student submits GPS coordinates
2. Server calculates distance from session center
3. Validates distance ≤ session radius
4. Checks for duplicate attendance
5. Creates attendance record if all validations pass

**Important:** Never trust client-side validation alone. All geofencing logic is enforced server-side.
