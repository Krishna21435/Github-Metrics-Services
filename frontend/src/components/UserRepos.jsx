import React from 'react'
import './UserRepos.css'

function UserRepos({ repos }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!repos || !repos.repos || repos.repos.length === 0) {
    return (
      <div className="user-repos">
        <h3>Repositories</h3>
        <p className="no-repos">No repositories found</p>
      </div>
    )
  }

  return (
    <div className="user-repos">
      <h3>Repositories ({repos.count})</h3>
      <div className="repos-grid">
        {repos.repos.map((repo) => (
          <div key={repo.full_name} className="repo-card">
            <div className="repo-card-header">
              <h4>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </h4>
              {repo.language && (
                <span className="repo-language">{repo.language}</span>
              )}
            </div>
            {repo.description && (
              <p className="repo-card-description">{repo.description}</p>
            )}
            <div className="repo-card-stats">
              <span className="repo-stat">
                <span className="repo-stat-icon">⭐</span>
                {repo.stars}
              </span>
              <span className="repo-stat">
                <span className="repo-stat-icon">🍴</span>
                {repo.forks}
              </span>
              <span className="repo-stat">
                <span className="repo-stat-icon">📅</span>
                {formatDate(repo.updated_at)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserRepos


