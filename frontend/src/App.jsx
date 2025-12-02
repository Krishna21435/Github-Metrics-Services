import React, { useState } from 'react'
import SearchBar from './components/SearchBar'
import RepoMetrics from './components/RepoMetrics'
import UserRepos from './components/UserRepos'
import UserInfo from './components/UserInfo'
import './App.css'

function App() {
  const [view, setView] = useState('repo') // 'repo', 'user'
  const [repoData, setRepoData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [userRepos, setUserRepos] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const handleRepoSearch = async (owner, repo) => {
    setLoading(true)
    setError(null)
    setRepoData(null)
    try {
      const response = await fetch(`${API_URL}/api/repo/${owner}/${repo}`)
      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.detail || data.error || 'Repository not found'
        throw new Error(errorMsg)
      }

      if (data.error) {
        throw new Error(data.error)
      }

      setRepoData(data)
      setView('repo')
    } catch (err) {
      console.error('Repository search error:', err)
      setError(err.message || 'Failed to fetch repository. In local dev, ensure backend is running at http://localhost:8000')
      setRepoData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSearch = async (username) => {
    setLoading(true)
    setError(null)
    setUserData(null)
    setUserRepos(null)
    try {
      const response = await fetch(`${API_URL}/api/user/${username}/profile`)
      const profileData = await response.json()

      if (!response.ok) {
        const errorMsg = profileData.detail || profileData.error || 'User not found'
        throw new Error(errorMsg)
      }

      if (profileData.error) {
        throw new Error(profileData.error)
      }

      setUserData(profileData)
      setUserRepos(profileData.repositories ? { repos: profileData.repositories, count: profileData.repositories.length } : null)
      setView('user')
    } catch (err) {
      console.error('User search error:', err)
      setError(err.message || 'Failed to fetch user profile. In local dev, ensure backend is running at http://localhost:8000')
      setUserData(null)
      setUserRepos(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>GitHub Metrics Service</h1>
          <p>Explore GitHub repositories and user statistics</p>
        </header>

        <div className="tabs">
          <button
            className={view === 'repo' ? 'tab active' : 'tab'}
            onClick={() => setView('repo')}
          >
            Repository Metrics
          </button>
          <button
            className={view === 'user' ? 'tab active' : 'tab'}
            onClick={() => setView('user')}
          >
            User Profile
          </button>
        </div>

        {view === 'repo' && (
          <SearchBar
            placeholder="Enter owner/repo or GitHub URL (e.g., facebook/react or https://github.com/facebook/react)"
            onSearch={handleRepoSearch}
            loading={loading}
          />
        )}

        {view === 'user' && (
          <SearchBar
            placeholder="Enter GitHub username or profile URL (e.g., octocat or https://github.com/octocat)"
            onSearch={handleUserSearch}
            loading={loading}
          />
        )}

        {error && <div className="error">{error}</div>}

        {loading && <div className="loading">Loading...</div>}

        {view === 'repo' && repoData && <RepoMetrics data={repoData} />}
        {view === 'user' && userData && <UserInfo user={userData} />}
        {view === 'user' && userRepos && <UserRepos repos={userRepos} />}
      </div>
    </div>
  )
}

export default App

