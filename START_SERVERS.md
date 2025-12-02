# How to Start the Servers

## Quick Start

You need to run **TWO** servers - one for the backend (Python/FastAPI) and one for the frontend (React).

### Option 1: Manual Start (Two Terminal Windows)

#### Terminal 1 - Backend Server:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

You should see: `Uvicorn running on http://127.0.0.1:8000`

#### Terminal 2 - Frontend Server:
```bash
cd frontend
npm install
npm run dev
```

You should see: `Local: http://localhost:3000`

### Option 2: Using Scripts (macOS/Linux)

Create two separate terminal windows and run:

**Terminal 1:**
```bash
cd /Users/krishnaaggarwalx/Desktop/ojtprojecthere/backend
source venv/bin/activate 2>/dev/null || python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Terminal 2:**
```bash
cd /Users/krishnaaggarwalx/Desktop/ojtprojecthere/frontend
npm install
npm run dev
```

## Verify Servers Are Running

1. **Backend**: Open http://localhost:8000 in your browser
   - Should show: `{"message":"GitHub Metrics Service API"}`
   - API docs: http://localhost:8000/docs

2. **Frontend**: Open http://localhost:3000 in your browser
   - Should show the GitHub Metrics Service UI

## Troubleshooting

### Port Already in Use
If port 3000 or 8000 is already in use:
- **Backend**: Change port with `uvicorn main:app --reload --port 8001`
- **Frontend**: Vite will automatically use the next available port (check terminal output)

### Frontend Can't Connect to Backend
- Make sure backend is running on port 8000
- Check that CORS is enabled (it is by default)
- Verify the API URL in frontend code matches your backend port

### Module Not Found Errors
- **Backend**: Make sure virtual environment is activated and dependencies are installed
- **Frontend**: Run `npm install` in the frontend directory

### Connection Refused
- Make sure both servers are actually running
- Check terminal output for any error messages
- Verify you're using the correct ports

