# Attendvio Backend - Quick Start Guide

## Prerequisites
- Python 3.10 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

## Installation Steps

### 1. Set Up Virtual Environment
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set Up Database

Install PostgreSQL and create a database:
```sql
CREATE DATABASE attendvio_db;
CREATE USER attendvio_user WITH PASSWORD 'your_password';
ALTER ROLE attendvio_user SET client_encoding TO 'utf8';
ALTER ROLE attendvio_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE attendvio_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE attendvio_db TO attendvio_user;
```

### 4. Configure Environment Variables

Copy the example env file:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```
DEBUG=True
SECRET_KEY=your-secret-key-generate-a-new-one
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=attendvio_db
DB_USER=attendvio_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

CORS_ALLOWED_ORIGINS=http://localhost:19006,exp://localhost:19000
```

Generate a secret key:
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 5. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser
```bash
python manage.py createsuperuser
```

### 7. Create Test Data (Optional)

Run Django shell:
```bash
python manage.py shell
```

Create test users:
```python
from accounts.models import User

# Create teacher
teacher = User.objects.create_user(
    email='teacher@test.com',
    password='test123456',
    first_name='John',
    last_name='Doe',
    role='TEACHER'
)

# Create student
student = User.objects.create_user(
    email='student@test.com',
    password='test123456',
    first_name='Jane',
    last_name='Smith',
    role='STUDENT',
    student_id='STU001',
    department='Computer Science'
)

print("Test users created!")
exit()
```

### 8. Run Development Server
```bash
python manage.py runserver
```

The API will be available at:
- API: http://localhost:8000/api/
- Admin: http://localhost:8000/admin/

## Testing the API

### Using curl:

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"test123456"}'
```

**Create Session (Teacher):**
```bash
curl -X POST http://localhost:8000/api/sessions/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "subject_name":"Test Session",
    "latitude":37.7749,
    "longitude":-122.4194,
    "radius":50,
    "start_time":"2026-01-10T10:00:00Z",
    "end_time":"2026-01-10T12:00:00Z"
  }'
```

### Using Postman or Insomnia:
Import the API endpoints and test manually.

## Production Deployment

### 1. Update Settings
- Set `DEBUG=False`
- Configure proper `ALLOWED_HOSTS`
- Use strong `SECRET_KEY`
- Configure production database

### 2. Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 3. Use Gunicorn
```bash
gunicorn attendvio.wsgi:application --bind 0.0.0.0:8000
```

### 4. Set Up Nginx
Configure Nginx as reverse proxy:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /static/ {
        alias /path/to/attendvio/backend/staticfiles/;
    }
}
```

## Common Issues

### Database Connection Error
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### Migration Errors
```bash
python manage.py makemigrations --empty accounts
python manage.py migrate --fake-initial
```

### CORS Issues
- Add your frontend URL to `CORS_ALLOWED_ORIGINS` in `.env`
- Restart the server after changes

## Logs

Create logs directory:
```bash
mkdir -p backend/logs
```

Logs will be written to `backend/logs/attendvio.log`

## Support

For issues, refer to:
- Django docs: https://docs.djangoproject.com/
- DRF docs: https://www.django-rest-framework.org/
- Project README: ../README.md
