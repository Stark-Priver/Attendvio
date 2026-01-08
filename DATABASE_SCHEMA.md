# Database Schema Documentation

## Overview
This document describes the database schema for Attendvio, an attendance management system with geofencing capabilities.

## Tables

### users
Custom user model with role-based access control.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | BigInteger | Primary key | Auto-increment |
| email | VARCHAR(254) | User email address | Unique, Not null |
| password | VARCHAR(128) | Hashed password | Not null |
| first_name | VARCHAR(50) | First name | Not null |
| last_name | VARCHAR(50) | Last name | Not null |
| role | VARCHAR(10) | User role (TEACHER/STUDENT) | Not null |
| student_id | VARCHAR(50) | Student ID (for students) | Unique, Nullable |
| department | VARCHAR(100) | Department/Faculty | Nullable |
| is_active | Boolean | Account active status | Default: true |
| is_staff | Boolean | Staff access | Default: false |
| is_superuser | Boolean | Admin access | Default: false |
| date_joined | Timestamp | Account creation date | Not null |
| last_login | Timestamp | Last login timestamp | Nullable |

**Indexes:**
- `users_email_idx` on (email)
- `users_student_id_idx` on (student_id)

**Constraints:**
- email must be unique
- student_id must be unique (when not null)
- role must be either 'TEACHER' or 'STUDENT'

---

### attendance_sessions
Represents attendance sessions created by teachers with geofencing parameters.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | BigInteger | Primary key | Auto-increment |
| teacher_id | BigInteger | Foreign key to users | Not null |
| subject_name | VARCHAR(200) | Subject/class name | Not null |
| latitude | DECIMAL(9,6) | Session center latitude | Not null |
| longitude | DECIMAL(9,6) | Session center longitude | Not null |
| radius | Integer | Allowed radius in meters | Not null, >= 10 |
| start_time | Timestamp | Session start time | Not null |
| end_time | Timestamp | Session end time | Not null |
| status | VARCHAR(10) | Session status (ACTIVE/ENDED/SCHEDULED) | Not null |
| created_at | Timestamp | Record creation time | Not null |
| updated_at | Timestamp | Last update time | Not null |

**Indexes:**
- `sessions_teacher_status_idx` on (teacher_id, status)
- `sessions_time_idx` on (start_time, end_time)

**Foreign Keys:**
- `teacher_id` references `users(id)` ON DELETE CASCADE

**Constraints:**
- end_time must be greater than start_time
- radius must be between 10 and 1000 meters
- teacher_id must reference a user with role='TEACHER'

---

### attendance_records
Individual attendance records marked by students.

| Column | Type | Description | Constraints |
|--------|------|-------------|-------------|
| id | BigInteger | Primary key | Auto-increment |
| session_id | BigInteger | Foreign key to attendance_sessions | Not null |
| student_id | BigInteger | Foreign key to users | Not null |
| marked_latitude | DECIMAL(9,6) | Student's latitude when marking | Not null |
| marked_longitude | DECIMAL(9,6) | Student's longitude when marking | Not null |
| distance_from_center | Float | Distance in meters from session center | Not null |
| marked_at | Timestamp | Attendance mark timestamp | Not null |
| is_verified | Boolean | Verification status | Default: true |
| notes | Text | Additional notes | Nullable |

**Indexes:**
- `attendance_session_student_idx` on (session_id, student_id)
- `attendance_marked_at_idx` on (marked_at)

**Foreign Keys:**
- `session_id` references `attendance_sessions(id)` ON DELETE CASCADE
- `student_id` references `users(id)` ON DELETE CASCADE

**Constraints:**
- UNIQUE constraint on (session_id, student_id) - prevents duplicate attendance
- student_id must reference a user with role='STUDENT'
- distance_from_center must be <= session.radius (enforced at application level)

---

## Relationships

### One-to-Many Relationships

1. **User → AttendanceSessions** (as Teacher)
   - One teacher can create many sessions
   - Foreign key: `attendance_sessions.teacher_id`

2. **User → AttendanceRecords** (as Student)
   - One student can have many attendance records
   - Foreign key: `attendance_records.student_id`

3. **AttendanceSession → AttendanceRecords**
   - One session can have many attendance records
   - Foreign key: `attendance_records.session_id`

## Business Rules

### User Rules
1. Email must be unique across all users
2. Students must have a student_id
3. Teachers do not require student_id
4. Role cannot be changed after creation (enforced at API level)

### Session Rules
1. Only teachers can create sessions
2. Session end_time must be after start_time
3. Radius must be between 10-1000 meters
4. Only one active session per teacher at a time (recommended, not enforced at DB level)
5. Status is auto-calculated based on current time vs start/end times

### Attendance Rules
1. Students can only mark attendance once per session (UNIQUE constraint)
2. Attendance can only be marked if:
   - Session is currently active (start_time <= now <= end_time)
   - Student is within the geofence radius
3. Distance validation uses Haversine formula
4. Duplicate attendance attempts are rejected

## Data Integrity

### Cascading Deletes
- Deleting a teacher deletes all their sessions
- Deleting a session deletes all attendance records for that session
- Deleting a student deletes all their attendance records

### Indexes for Performance
- Email lookup (authentication): O(log n)
- Session filtering by teacher and status: O(log n)
- Duplicate attendance check: O(log n)
- Time-based session queries: O(log n)

## Sample Queries

### Get active sessions
```sql
SELECT * FROM attendance_sessions 
WHERE status = 'ACTIVE' 
AND start_time <= NOW() 
AND end_time >= NOW();
```

### Check if student already marked attendance
```sql
SELECT COUNT(*) FROM attendance_records 
WHERE session_id = ? AND student_id = ?;
```

### Get attendance report for a session
```sql
SELECT 
  ar.*,
  u.first_name,
  u.last_name,
  u.student_id,
  u.email
FROM attendance_records ar
JOIN users u ON ar.student_id = u.id
WHERE ar.session_id = ?
ORDER BY ar.marked_at;
```

### Get teacher's session statistics
```sql
SELECT 
  s.id,
  s.subject_name,
  s.status,
  COUNT(ar.id) as attendance_count
FROM attendance_sessions s
LEFT JOIN attendance_records ar ON s.id = ar.session_id
WHERE s.teacher_id = ?
GROUP BY s.id
ORDER BY s.created_at DESC;
```

## Migration Order

1. Create `users` table first (no dependencies)
2. Create `attendance_sessions` table (depends on users)
3. Create `attendance_records` table (depends on both)

## Backup Recommendations

### Critical Data
- **Users**: Contains authentication and profile data
- **Attendance Records**: Contains historical attendance data

### Backup Strategy
1. Daily full backup of entire database
2. Real-time replication for disaster recovery
3. Point-in-time recovery capability
4. Retention: 30 days for daily backups, 1 year for monthly

## Performance Considerations

### Expected Load
- 1000+ students
- 100+ teachers
- 50+ concurrent sessions
- 10,000+ attendance records per month

### Optimization
- Indexed foreign keys for fast joins
- Composite index on (session_id, student_id) for duplicate checks
- Time-based partitioning for attendance_records (if needed)
- Regular VACUUM and ANALYZE operations (PostgreSQL)

## Security Considerations

- Passwords are hashed using PBKDF2_SHA256
- No plain text passwords stored
- Location data is sensitive - access controlled by API
- Session tokens stored separately (not in database)
- Audit logging recommended for production

---

**Database Engine:** PostgreSQL 12+
**ORM:** Django ORM
**Charset:** UTF-8
**Collation:** en_US.UTF-8
