# AdoSpy - C2 Control Server

## ⚠️ DISCLAIMER & WARNING

**AdoSpy is a project for EDUCATIONAL AND RESEARCH PURPOSES ONLY.**

This is a **Command & Control (C2) server** designed to connect Android devices via Flutter clients. This tool is a research hobby and is not a complete, production-ready framework.

### ⛔ LEGAL WARNING
- **DO NOT USE THIS TOOL FOR UNAUTHORIZED, MALICIOUS, OR ILLEGAL ACTIVITIES**
- Unauthorized access to mobile systems is **illegal and punishable by law**
- Unauthorized surveillance or data collection is a serious crime
- Users assume full responsibility for any illegal use

This tool should only be used on systems you own or have explicit written permission to access for legitimate educational and research purposes.

---

## 📋 Project Overview

AdoSpy is a Command & Control server that facilitates communication between:
- **Backend Server**: Django-based C2 server with real-time WebSocket support
- **Frontend Dashboard**: React-based admin dashboard built with Inertia.js
- **Mobile Client**: Flutter-based Android client for device control

The project demonstrates concepts in device management, remote communication, and real-time data synchronization for educational purposes.

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Backend Framework** | Django 4.x |
| **Frontend Framework** | React 18.x + Inertia.js |
| **Database** | SQLite (default, configurable to PostgreSQL, MySQL, etc.) |
| **Real-time Communication** | WebSocket + Django Channels |
| **Task Queue** | Celery with Redis |
| **Message Broker** | Redis |
| **ASGI Server** | Daphne |
| **Mobile Client** | Flutter |

---

## 📦 Prerequisites

Before running AdoSpy, ensure you have installed:

- **Python 3.8+**
- **Node.js 16+** (for React frontend)
- **Redis Server** (for Celery and real-time features)
- **Git**

### Installing Redis

**On Ubuntu/Debian:**
```bash
sudo apt-get install redis-server
sudo service redis-server start
```

**On macOS:**
```bash
brew install redis
brew services start redis
```

**On Windows:**
Download from https://github.com/microsoftarchive/redis/releases or use WSL

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/adomigold/adospy-backend.git
cd adospy-backend
```

### Step 2: Set Up Python Virtual Environment

```bash
python -m venv venv

# On Linux/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### Step 3: Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure Database

Create or update the `.env` file (optional) if you need custom settings.

Then run migrations:
```bash
python manage.py migrate
```

### Step 5: Install Frontend Dependencies

```bash
npm install
```

---

## 🏃 Running the Project

You'll need to run multiple services. **Open 4 separate terminals** in the project root directory:

### Terminal 1: Start the Django + Daphne ASGI Server

```bash
# Make sure you're in the project root and venv is activated
daphne core.asgi:application -b 0.0.0.0 -p 8000
```

The backend server will run on `http://localhost:8000`

### Terminal 2: Start the React Frontend Development Server

```bash
cd front_end
npm install    # If not done already
npm run dev
```

The frontend will typically run on `http://localhost:5173` (check console output)

### Terminal 3: Start Celery Worker

```bash
# Make sure you're in the project root and venv is activated
celery -A core worker -l info
```

This starts the task queue worker for background jobs.

### Terminal 4: Start Redis Server (if not already running)

```bash
# On Linux/macOS:
redis-server

# On macOS with Homebrew:
brew services start redis

# On Windows (if installed via WSL or direct):
redis-server
```

---

## 📱 Mobile Client

The Flutter mobile client is available in a separate repository:

**Repository:** https://github.com/adomigold/adospy_mobile_client

Clone and follow the instructions in that repository to build and run the Android client.

---

## 📁 Project Structure

```
adospy-backend/
├── authentication/          # User authentication & device management
│   ├── models.py           # User and Device models
│   ├── apis.py             # REST API endpoints
│   ├── consumers.py        # WebSocket consumers
│   ├── services.py         # Business logic
│   ├── tasks.py            # Celery tasks
│   └── migrations/         # Database migrations
├── dashboard/              # Admin dashboard app
├── front_end/              # React frontend application
│   ├── src/
│   │   ├── Pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   └── hooks/         # Custom React hooks
│   └── package.json
├── core/                   # Django project settings
│   ├── settings.py        # Django configuration
│   ├── asgi.py            # ASGI configuration (WebSocket)
│   ├── celery.py          # Celery configuration
│   └── urls.py            # URL routing
├── manage.py              # Django management script
├── requirements.txt       # Python dependencies
├── package.json           # Node.js dependencies
└── db.sqlite3            # SQLite database (generated after migrate)
```

---

## 🔧 Configuration

### Database Configuration

By default, SQLite is used. To use a different database (PostgreSQL, MySQL), update `core/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # or mysql, sqlite3
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Redis Configuration

Update `core/settings.py` if Redis is running on a different host/port:

```python
REDIS_URL = 'redis://localhost:6379/0'
```

---

## 🌐 Accessing the Application

Once all services are running:

- **Frontend Dashboard**: http://localhost:5173 (or as shown in npm output)
- **Backend API**: http://localhost:8000
- **WebSocket**: ws://localhost:8000/ws/

---

## 📝 Common Tasks

### Create a Django Super User

```bash
python manage.py createsuperuser
```

### Create Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Reset Database

```bash
# Remove old database
rm db.sqlite3

# Run migrations fresh
python manage.py migrate
```

### Stop All Services

Press `Ctrl+C` in each terminal running a service.

---

## ⚙️ Troubleshooting

### Redis Connection Error
- Ensure Redis is running: `redis-cli ping` (should return PONG)
- Check Redis is listening on the correct port

### Frontend Not Connecting to Backend
- Ensure backend is running on `http://localhost:8000`
- Check CORS settings in `core/settings.py`
- Check browser console for WebSocket errors

### Celery Tasks Not Running
- Ensure Celery worker terminal is active
- Check Redis connection
- Verify tasks are properly decorated with `@shared_task`

### Database Migration Errors
- Run `python manage.py migrate` after changes
- Clear migration cache if needed: `python manage.py makemigrations --no-input`

---

## 📚 Development Notes

- This is a **proof-of-concept** project and is still under active development
- The project demonstrates device management, real-time communication, and task queuing
- Not all features may be fully tested or production-ready
- **NEVER deploy this to production without security hardening**

---

## 📄 License

This project is for educational and research purposes only. Users are responsible for their use of this software.

---

## 🤝 Contributing

This is an educational project. Contributions are welcome but should maintain the educational and research-focused nature of the tool.

---

## ⚖️ Legal Acknowledgment

By using AdoSpy, you acknowledge that:
- You will only use it for legitimate educational and research purposes
- You have authorization to test on all target systems
- You understand the legal implications of unauthorized access
- You are responsible for any misuse of this tool

**For more information and mobile client setup, visit:** https://github.com/adomigold/adospy_mobile_client
