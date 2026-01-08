#!/bin/bash

echo "====================================="
echo "  Attendvio Backend Setup Script"
echo "====================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed"
    echo "Please install Python 3.10 or higher"
    exit 1
fi

echo "[1/8] Creating virtual environment..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to create virtual environment"
    exit 1
fi

echo "[2/8] Activating virtual environment..."
source venv/bin/activate

echo "[3/8] Upgrading pip..."
pip install --upgrade pip

echo "[4/8] Installing dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi

echo "[5/8] Checking for .env file..."
if [ ! -f .env ]; then
    echo ".env file not found. Copying from .env.example..."
    cp .env.example .env
    echo ""
    echo "[IMPORTANT] Please edit .env file with your database credentials!"
    echo ""
fi

echo "[6/8] Running migrations..."
python manage.py makemigrations
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "[ERROR] Migration failed. Check database connection."
    exit 1
fi

echo "[7/8] Creating logs directory..."
mkdir -p logs

echo "[8/8] Setup complete!"
echo ""
echo "====================================="
echo "  Setup Complete!"
echo "====================================="
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your database credentials"
echo "  2. Create a superuser: python manage.py createsuperuser"
echo "  3. Run the server: python manage.py runserver"
echo ""
echo "To activate the virtual environment later:"
echo "  source venv/bin/activate"
echo ""
