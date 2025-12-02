import React, { useState } from 'react'
import './SearchBar.css'

function SearchBar({ placeholder, onSearch, loading }) {
  const [input, setInput] = useState('')

  const parseInput = (inputValue) => {
    const trimmed = inputValue.trim()
    if (!trimmed) return null

    // Check if it's a GitHub URL
    const githubUrlPattern = /github\.com\/([^\/]+)(?:\/([^\/\s?#]+))?/
    const urlMatch = trimmed.match(githubUrlPattern)
    
    if (urlMatch) {
      // Extract from URL: github.com/owner/repo or github.com/username
      const owner = urlMatch[1]
      const repo = urlMatch[2]
      
      if (repo) {
        // It's a repository URL
        return { type: 'repo', owner, repo }
      } else {
        // It's a user profile URL
        return { type: 'user', username: owner }
      }
    }
    
    // Check if it's a plain repo format (owner/repo)
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/').map(s => s.trim()).filter(s => s)
      if (parts.length >= 2) {
        return { type: 'repo', owner: parts[0], repo: parts[1] }
      }
    }
    
    // Otherwise, treat as username
    return { type: 'user', username: trimmed }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const parsed = parseInput(input)
    if (!parsed) return

    if (parsed.type === 'repo') {
      onSearch(parsed.owner, parsed.repo)
    } else {
      onSearch(parsed.username)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="search-input"
        disabled={loading}
      />
      <button type="submit" className="search-button" disabled={loading || !input.trim()}>
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default SearchBar


