# Quick Start Guide

## Step 1: Set up the Backend

Open a terminal and run:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

The backend will start at: **http://localhost:8000**

You can test it by visiting:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Step 2: Set up the Frontend

Open a **NEW terminal window** (keep the backend running) and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start at: **http://localhost:3000**

## Step 3: Use the Application

1. Open your browser and go to: **http://localhost:3000**
2. Click on "Repository Metrics" tab
3. Enter a repository in format: `owner/repo` (e.g., `facebook/react`)
4. Or click "User Profile" tab and enter a GitHub username

## Optional: GitHub Token (for higher rate limits)

If you want to increase API rate limits from 60 to 5,000 requests/hour:

1. Create a file `backend/.env`
2. Add: `GITHUB_TOKEN=your_github_token_here`
3. Get a token from: https://github.com/settings/tokens

## Troubleshooting

- **Backend won't start**: Make sure port 8000 is not in use
- **Frontend won't start**: Make sure port 3000 is not in use
- **API errors**: Check that the backend is running on port 8000
- **Module not found**: Make sure you activated the virtual environment and installed requirements


