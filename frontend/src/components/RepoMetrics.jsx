import React from 'react'
import './RepoMetrics.css'

function RepoMetrics({ data }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatNumber = (num) => {
    if (num === null || num === undefined) return 'N/A'
    return num.toLocaleString()
  }

  return (
    <div className="repo-metrics">
      <div className="repo-header">
        <h2>
          <a href={data.url} target="_blank" rel="noopener noreferrer">
            {data.full_name}
          </a>
        </h2>
        {data.description && <p className="repo-description">{data.description}</p>}
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">⭐</div>
          <div className="metric-value">{formatNumber(data.stars)}</div>
          <div className="metric-label">Stars</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🍴</div>
          <div className="metric-value">{formatNumber(data.forks)}</div>
          <div className="metric-label">Forks</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👀</div>
          <div className="metric-value">{formatNumber(data.watchers)}</div>
          <div className="metric-label">Watchers</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-value">{formatNumber(data.contributors_count)}</div>
          <div className="metric-label">Contributors</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🐛</div>
          <div className="metric-value">{formatNumber(data.open_issues)}</div>
          <div className="metric-label">Open Issues</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-value">{formatNumber(data.total_releases)}</div>
          <div className="metric-label">Releases</div>
        </div>
      </div>

      <div className="repo-details">
        <div className="detail-section">
          <h3>Repository Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Primary Language:</span>
              <span className="detail-value">{data.language || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">License:</span>
              <span className="detail-value">{data.license || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created:</span>
              <span className="detail-value">{formatDate(data.created_at)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Updated:</span>
              <span className="detail-value">{formatDate(data.updated_at)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Pushed:</span>
              <span className="detail-value">{formatDate(data.pushed_at)}</span>
            </div>
            {data.total_commits_52_weeks && (
              <div className="detail-item">
                <span className="detail-label">Commits (52 weeks):</span>
                <span className="detail-value">{formatNumber(data.total_commits_52_weeks)}</span>
              </div>
            )}
          </div>
        </div>

        {data.languages && Object.keys(data.languages).length > 0 && (
          <div className="detail-section">
            <h3>Languages</h3>
            <div className="languages-list">
              {Object.entries(data.languages)
                .sort((a, b) => b[1] - a[1])
                .map(([lang, bytes]) => (
                  <div key={lang} className="language-item">
                    <span className="language-name">{lang}</span>
                    <span className="language-bytes">{(bytes / 1024).toFixed(2)} KB</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RepoMetrics


