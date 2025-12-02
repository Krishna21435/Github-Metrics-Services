import React from 'react'
import './UserInfo.css'

function UserInfo({ user }) {
  // Handle both old format (direct user object) and new format (comprehensive profile)
  const userData = user?.user || user
  const achievements = user?.achievements || []
  const activity = user?.activity || {}
  const summary = user?.summary || {}

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0'
    return num.toLocaleString()
  }

  const getContributionIntensity = (count) => {
    if (count === 0) return 'none'
    if (count <= 2) return 'low'
    if (count <= 5) return 'medium'
    if (count <= 10) return 'high'
    return 'very-high'
  }

  return (
    <div className="user-info">
      <div className="user-header">
        <div className="user-avatar">
          <img src={userData.avatar_url} alt={userData.login} />
        </div>
        <div className="user-details">
          <h2>
            <a href={userData.html_url} target="_blank" rel="noopener noreferrer">
              {userData.name || userData.login}
            </a>
          </h2>
          <p className="username">@{userData.login}</p>
          {userData.bio && <p className="user-bio">{userData.bio}</p>}
        </div>
      </div>

      <div className="user-stats">
        <div className="stat-item">
          <div className="stat-value">{formatNumber(summary.total_repos || userData.public_repos || 0)}</div>
          <div className="stat-label">Public Repos</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{formatNumber(summary.followers || userData.followers || 0)}</div>
          <div className="stat-label">Followers</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{formatNumber(summary.following || userData.following || 0)}</div>
          <div className="stat-label">Following</div>
        </div>
        {summary.total_stars !== undefined && (
          <div className="stat-item">
            <div className="stat-value">{formatNumber(summary.total_stars)}</div>
            <div className="stat-label">Total Stars</div>
          </div>
        )}
        {summary.total_contributions !== undefined && (
          <div className="stat-item">
            <div className="stat-value">{formatNumber(summary.total_contributions)}</div>
            <div className="stat-label">Contributions</div>
          </div>
        )}
      </div>

      {achievements.length > 0 && (
        <div className="achievements-section">
          <h3>Achievements ({achievements.length})</h3>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-card">
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-description">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activity.last_30_days && activity.last_30_days.length > 0 && (
        <div className="contribution-activity-section">
          <h3>Contribution Activity (Last 30 Days)</h3>
          <div className="activity-stats">
            <div className="activity-stat">
              <span className="activity-label">Total Events:</span>
              <span className="activity-value">{formatNumber(activity.total_events || 0)}</span>
            </div>
            <div className="activity-stat">
              <span className="activity-label">Total Contributions:</span>
              <span className="activity-value">{formatNumber(activity.total_contributions || 0)}</span>
            </div>
          </div>
          
          {activity.contributions_by_type && (
            <div className="contribution-types">
              <h4>Contributions by Type</h4>
              <div className="types-grid">
                {Object.entries(activity.contributions_by_type).map(([type, count]) => (
                  count > 0 && (
                    <div key={type} className="type-item">
                      <span className="type-name">{type.replace('Event', '')}</span>
                      <span className="type-count">{formatNumber(count)}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          <div className="activity-calendar">
            <h4>Daily Activity</h4>
            <div className="calendar-grid">
              {activity.last_30_days.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${getContributionIntensity(day.count)}`}
                  title={`${day.date}: ${day.count} contributions`}
                >
                  {day.count > 0 && <span className="day-count">{day.count}</span>}
                </div>
              ))}
            </div>
            <div className="calendar-legend">
              <span className="legend-item">
                <span className="legend-box none"></span>
                <span>None</span>
              </span>
              <span className="legend-item">
                <span className="legend-box low"></span>
                <span>Low</span>
              </span>
              <span className="legend-item">
                <span className="legend-box medium"></span>
                <span>Medium</span>
              </span>
              <span className="legend-item">
                <span className="legend-box high"></span>
                <span>High</span>
              </span>
              <span className="legend-item">
                <span className="legend-box very-high"></span>
                <span>Very High</span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="user-meta">
        {userData.company && (
          <div className="meta-item">
            <span className="meta-icon">🏢</span>
            <span>{userData.company}</span>
          </div>
        )}
        {userData.location && (
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span>{userData.location}</span>
          </div>
        )}
        {userData.blog && (
          <div className="meta-item">
            <span className="meta-icon">🔗</span>
            <a href={userData.blog} target="_blank" rel="noopener noreferrer">
              {userData.blog}
            </a>
          </div>
        )}
        <div className="meta-item">
          <span className="meta-icon">📅</span>
          <span>Joined {formatDate(userData.created_at)}</span>
        </div>
        {userData.twitter_username && (
          <div className="meta-item">
            <span className="meta-icon">🐦</span>
            <a href={`https://twitter.com/${userData.twitter_username}`} target="_blank" rel="noopener noreferrer">
              @{userData.twitter_username}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserInfo


