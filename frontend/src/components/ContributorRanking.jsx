import React from 'react'
import './ContributorRanking.css'

function ContributorRanking({ data }) {
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0'
    return num.toLocaleString()
  }

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  if (!data || !data.contributors || data.contributors.length === 0) {
    return (
      <div className="contributor-ranking">
        <h3>Contributor Ranking</h3>
        <p className="no-contributors">No contributors found</p>
      </div>
    )
  }

  return (
    <div className="contributor-ranking">
      <div className="ranking-header">
        <h3>Contributor Ranking</h3>
        <p className="ranking-subtitle">
          {data.total_contributors} contributors for {data.owner}/{data.repo}
        </p>
      </div>

      <div className="ranking-table">
        <div className="table-header">
          <div className="col-rank">Rank</div>
          <div className="col-contributor">Contributor</div>
          <div className="col-commits">Commits</div>
          <div className="col-prs">PRs</div>
          <div className="col-issues">Issues</div>
          <div className="col-total">Total</div>
        </div>

        {data.contributors.map((contributor) => (
          <div key={contributor.username} className="table-row">
            <div className="col-rank">
              <span className="rank-badge">{getRankBadge(contributor.rank)}</span>
            </div>
            <div className="col-contributor">
              <div className="contributor-info">
                <img
                  src={contributor.avatar_url}
                  alt={contributor.username}
                  className="contributor-avatar"
                />
                <a
                  href={contributor.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contributor-name"
                >
                  {contributor.username}
                </a>
              </div>
            </div>
            <div className="col-commits">
              <span className="stat-value">{formatNumber(contributor.commits)}</span>
            </div>
            <div className="col-prs">
              <span className="stat-value">{formatNumber(contributor.prs)}</span>
            </div>
            <div className="col-issues">
              <span className="stat-value">{formatNumber(contributor.issues)}</span>
            </div>
            <div className="col-total">
              <span className="stat-total">{formatNumber(contributor.total_contributions)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContributorRanking


