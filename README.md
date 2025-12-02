<<<<<<< HEAD
# Github-Metrics-Services
=======
# GitHub Metrics Service

A full-stack web application for exploring GitHub repository and user metrics, built with FastAPI (Python) and React.

## Features

- **Repository Metrics**: View detailed statistics for any GitHub repository including:
  - Stars, forks, watchers, and contributors
  - Language breakdown
  - Commit activity
  - Open issues and releases
  - Repository metadata

- **User Profiles**: Explore GitHub user profiles with:
  - User information and bio
  - Public repositories list
  - Followers and following counts
  - Profile metadata

- **REST API**: Complete REST API endpoints to share and integrate metrics

## Tech Stack

- **Backend**: Python, FastAPI
- **Frontend**: React, Vite
- **API**: GitHub REST API

## Project Structure

```
ojtprojecthere/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   └── metrics.py      # API routes
│   │   └── services/
│   │       └── github_service.py  # GitHub API integration
│   ├── main.py                  # FastAPI application
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── package.json            # Node dependencies
│   └── vite.config.js          # Vite configuration
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. (Optional) Set up GitHub token for higher rate limits:
   - Create a `.env` file in the `backend` directory
   - Add: `GITHUB_TOKEN=your_github_token_here`
   - Get a token from: https://github.com/settings/tokens

5. Run the server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

### Repository Metrics

1. Click on "Repository Metrics" tab
2. Enter repository in format: `owner/repo` (e.g., `facebook/react`)
3. View comprehensive repository statistics

### User Profile

1. Click on "User Profile" tab
2. Enter a GitHub username
3. View user information and their repositories

## REST API Endpoints

All endpoints return JSON data and can be used to share metrics programmatically.

### Repository Endpoints

- `GET /api/repo/{owner}/{repo}` - Get comprehensive repository metrics
  - Returns: Repository stats, languages, commit activity, etc.
  - Example: `GET /api/repo/facebook/react`

### User Endpoints

- `GET /api/user/{username}` - Get user information
  - Returns: User profile data
  - Example: `GET /api/user/octocat`

- `GET /api/user/{username}/profile` - Get comprehensive user profile
  - Returns: Complete user profile with achievements, contribution activity, repositories, and summary
  - Example: `GET /api/user/octocat/profile`
  - Response includes:
    - User information
    - Achievements (based on repos, followers, contributions, etc.)
    - Contribution activity (last 30 days, contributions by type)
    - Repository list
    - Summary statistics

- `GET /api/user/{username}/repos` - Get user repositories
  - Returns: List of user's repositories
  - Example: `GET /api/user/octocat/repos`

### Search Endpoints

- `GET /api/search/repos?q={query}&sort={sort}&order={order}` - Search repositories
  - Parameters:
    - `q` (required): Search query
    - `sort` (optional): Sort by `stars`, `forks`, or `updated` (default: `stars`)
    - `order` (optional): `asc` or `desc` (default: `desc`)
  - Example: `GET /api/search/repos?q=react&sort=stars&order=desc`

### Utility Endpoints

- `GET /health` - Health check endpoint
- `GET /` - API information
- `GET /docs` - Interactive API documentation (Swagger UI)

## Development

### Backend Development

The backend uses FastAPI with automatic API documentation. Visit `http://localhost:8000/docs` to explore the API interactively.

### Frontend Development

The frontend uses Vite for fast development. Hot module replacement is enabled by default.

## Notes

- Without a GitHub token, the API is limited to 60 requests per hour per IP
- With a GitHub token, the limit increases to 5,000 requests per hour
- The service uses the public GitHub REST API v3

## License

MIT

>>>>>>> 638cc7e (Initial commit)
