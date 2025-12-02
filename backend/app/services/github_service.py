import httpx
import os
from typing import Optional, Dict, Any
from datetime import datetime, timedelta

class GitHubService:
    def __init__(self):
        self.base_url = "https://api.github.com"
        self.token = os.getenv("GITHUB_TOKEN", "")
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        if self.token:
            self.headers["Authorization"] = f"token {self.token}"

    async def _make_request(self, endpoint: str) -> Optional[Dict[str, Any]]:
        """Make a request to GitHub API"""
        url = f"{self.base_url}{endpoint}"
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=self.headers, timeout=10.0)
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                # Handle rate limit errors specifically
                if e.response.status_code == 403:
                    try:
                        error_data = e.response.json()
                        if "rate limit" in error_data.get("message", "").lower():
                            print(f"Rate limit exceeded: {error_data.get('message')}")
                            return {"error": f"GitHub API rate limit exceeded. {error_data.get('message', 'Please try again later or add a GitHub token for higher limits.')}"}
                    except:
                        pass
                # Handle 404 errors
                if e.response.status_code == 404:
                    return {"error": "Resource not found"}
                print(f"Error fetching {url}: {e}")
                return {"error": f"GitHub API error: {e.response.status_code}"}
            except httpx.HTTPError as e:
                print(f"Error fetching {url}: {e}")
                return {"error": f"Network error: {str(e)}"}

    async def get_repo_info(self, owner: str, repo: str) -> Optional[Dict[str, Any]]:
        """Get repository information"""
        return await self._make_request(f"/repos/{owner}/{repo}")

    async def get_repo_stats(self, owner: str, repo: str) -> Dict[str, Any]:
        """Get comprehensive repository statistics"""
        repo_info = await self.get_repo_info(owner, repo)
        if not repo_info:
            return {"error": "Repository not found"}
        if "error" in repo_info:
            return repo_info

        # Get additional metrics
        contributors = await self._make_request(f"/repos/{owner}/{repo}/contributors")
        commits = await self._make_request(f"/repos/{owner}/{repo}/commits?per_page=1")
        issues = await self._make_request(f"/repos/{owner}/{repo}/issues?state=all&per_page=1")
        pulls = await self._make_request(f"/repos/{owner}/{repo}/pulls?state=all&per_page=1")
        releases = await self._make_request(f"/repos/{owner}/{repo}/releases?per_page=1")
        languages = await self._make_request(f"/repos/{owner}/{repo}/languages")
        
        # Get commit activity (last 52 weeks)
        commit_activity = await self._make_request(f"/repos/{owner}/{repo}/stats/commit_activity")
        
        # Get stargazers count
        stargazers = await self._make_request(f"/repos/{owner}/{repo}/stargazers?per_page=1")
        
        stats = {
            "name": repo_info.get("name"),
            "full_name": repo_info.get("full_name"),
            "description": repo_info.get("description"),
            "url": repo_info.get("html_url"),
            "stars": repo_info.get("stargazers_count", 0),
            "forks": repo_info.get("forks_count", 0),
            "watchers": repo_info.get("watchers_count", 0),
            "open_issues": repo_info.get("open_issues_count", 0),
            "language": repo_info.get("language"),
            "languages": languages or {},
            "created_at": repo_info.get("created_at"),
            "updated_at": repo_info.get("updated_at"),
            "pushed_at": repo_info.get("pushed_at"),
            "license": repo_info.get("license", {}).get("name") if repo_info.get("license") else None,
            "contributors_count": len(contributors) if contributors else 0,
            "total_commits": commits[0].get("sha") if commits else None,
            "total_issues": issues[0].get("number") if issues else None,
            "total_pulls": pulls[0].get("number") if pulls else None,
            "total_releases": len(releases) if releases else 0,
            "commit_activity": commit_activity if commit_activity else [],
        }

        # Calculate total commits from commit activity
        if commit_activity:
            total_commits = sum(week.get("total", 0) for week in commit_activity)
            stats["total_commits_52_weeks"] = total_commits

        return stats

    async def get_user_repos(self, username: str) -> list:
        """Get all repositories for a user"""
        repos = await self._make_request(f"/users/{username}/repos?per_page=100&sort=updated")
        if not repos:
            return []
        
        # Format repository list
        return [
            {
                "name": repo.get("name"),
                "full_name": repo.get("full_name"),
                "description": repo.get("description"),
                "stars": repo.get("stargazers_count", 0),
                "forks": repo.get("forks_count", 0),
                "language": repo.get("language"),
                "updated_at": repo.get("updated_at"),
                "url": repo.get("html_url"),
            }
            for repo in repos
        ]

    async def get_user_info(self, username: str) -> Optional[Dict[str, Any]]:
        """Get user information"""
        result = await self._make_request(f"/users/{username}")
        if result and "error" in result:
            return None  # Return None for 404, error dict for rate limits
        return result

    async def get_user_events(self, username: str, max_pages: int = 5) -> list:
        """Get user public events for contribution activity"""
        return await self._make_paginated_request(f"/users/{username}/events/public", max_pages)

    async def get_user_contribution_activity(self, username: str) -> Dict[str, Any]:
        """Get user contribution activity from events"""
        events = await self.get_user_events(username, max_pages=10)
        
        # Count contributions by type
        contributions = {
            "PushEvent": 0,
            "PullRequestEvent": 0,
            "IssuesEvent": 0,
            "CreateEvent": 0,
            "WatchEvent": 0,
            "ForkEvent": 0,
            "ReleaseEvent": 0,
            "CommitCommentEvent": 0,
        }
        
        # Group by date
        activity_by_date = {}
        
        for event in events:
            event_type = event.get("type", "")
            created_at = event.get("created_at", "")
            
            if created_at:
                date = created_at.split("T")[0]  # Get just the date part
                if date not in activity_by_date:
                    activity_by_date[date] = []
                activity_by_date[date].append(event_type)
            
            if event_type in contributions:
                contributions[event_type] += 1
        
        # Get last 30 days activity
        last_30_days = []
        today = datetime.now()
        
        for i in range(30):
            date = (today - timedelta(days=i)).strftime("%Y-%m-%d")
            count = len(activity_by_date.get(date, []))
            last_30_days.append({
                "date": date,
                "count": count
            })
        
        last_30_days.reverse()  # Oldest to newest
        
        return {
            "total_events": len(events),
            "contributions_by_type": contributions,
            "last_30_days": last_30_days,
            "total_contributions": sum(contributions.values())
        }

    async def calculate_user_achievements(self, username: str, user_info: Dict[str, Any], repos: list, activity: Dict[str, Any]) -> list:
        """Calculate user achievements based on profile data"""
        achievements = []
        
        # Repository achievements
        repo_count = len(repos)
        if repo_count >= 100:
            achievements.append({"name": "Repository Master", "icon": "🏆", "description": "Has 100+ repositories"})
        elif repo_count >= 50:
            achievements.append({"name": "Repository Expert", "icon": "🥇", "description": "Has 50+ repositories"})
        elif repo_count >= 20:
            achievements.append({"name": "Repository Enthusiast", "icon": "🥈", "description": "Has 20+ repositories"})
        elif repo_count >= 10:
            achievements.append({"name": "Repository Starter", "icon": "🥉", "description": "Has 10+ repositories"})
        
        # Follower achievements
        followers = user_info.get("followers", 0)
        if followers >= 10000:
            achievements.append({"name": "GitHub Superstar", "icon": "⭐", "description": f"Has {followers:,}+ followers"})
        elif followers >= 1000:
            achievements.append({"name": "GitHub Influencer", "icon": "🌟", "description": f"Has {followers:,}+ followers"})
        elif followers >= 100:
            achievements.append({"name": "GitHub Popular", "icon": "✨", "description": f"Has {followers:,}+ followers"})
        
        # Contribution achievements
        total_contributions = activity.get("total_contributions", 0)
        if total_contributions >= 10000:
            achievements.append({"name": "Contribution Legend", "icon": "🔥", "description": f"{total_contributions:,}+ total contributions"})
        elif total_contributions >= 1000:
            achievements.append({"name": "Contribution Hero", "icon": "💪", "description": f"{total_contributions:,}+ total contributions"})
        elif total_contributions >= 100:
            achievements.append({"name": "Active Contributor", "icon": "🚀", "description": f"{total_contributions:,}+ total contributions"})
        
        # Star achievements (sum of all repo stars)
        total_stars = sum(repo.get("stars", 0) for repo in repos)
        if total_stars >= 10000:
            achievements.append({"name": "Star Collector", "icon": "⭐", "description": f"{total_stars:,}+ total stars across repos"})
        elif total_stars >= 1000:
            achievements.append({"name": "Star Attractor", "icon": "🌟", "description": f"{total_stars:,}+ total stars across repos"})
        elif total_stars >= 100:
            achievements.append({"name": "Star Gainer", "icon": "✨", "description": f"{total_stars:,}+ total stars across repos"})
        
        # Account age achievement
        if user_info.get("created_at"):
            created = datetime.fromisoformat(user_info["created_at"].replace("Z", "+00:00"))
            age_years = (datetime.now(created.tzinfo) - created).days / 365
            if age_years >= 10:
                achievements.append({"name": "Veteran Developer", "icon": "🎖️", "description": "10+ years on GitHub"})
            elif age_years >= 5:
                achievements.append({"name": "Experienced Developer", "icon": "🎗️", "description": "5+ years on GitHub"})
        
        # Hireable achievement
        if user_info.get("hireable"):
            achievements.append({"name": "Open to Work", "icon": "💼", "description": "Available for hire"})
        
        return achievements

    async def get_user_profile_comprehensive(self, username: str) -> Dict[str, Any]:
        """Get comprehensive user profile with achievements and activity"""
        # Get all user data in parallel
        user_info = await self.get_user_info(username)
        if not user_info:
            return {"error": "User not found"}
        # Check if user_info is an error dict (rate limit, etc.)
        if isinstance(user_info, dict) and "error" in user_info:
            return user_info
        
        repos = await self.get_user_repos(username)
        activity = await self.get_user_contribution_activity(username)
        achievements = await self.calculate_user_achievements(username, user_info, repos, activity)
        
        return {
            "user": user_info,
            "repositories": repos,
            "activity": activity,
            "achievements": achievements,
            "summary": {
                "total_repos": len(repos),
                "total_stars": sum(repo.get("stars", 0) for repo in repos),
                "total_forks": sum(repo.get("forks", 0) for repo in repos),
                "followers": user_info.get("followers", 0),
                "following": user_info.get("following", 0),
                "total_contributions": activity.get("total_contributions", 0),
                "achievements_count": len(achievements)
            }
        }

    async def _make_paginated_request(self, endpoint: str, max_pages: int = 10) -> list:
        """Make paginated requests to GitHub API"""
        all_items = []
        page = 1
        per_page = 100
        
        while page <= max_pages:
            url = f"{self.base_url}{endpoint}"
            if "?" in endpoint:
                url += f"&page={page}&per_page={per_page}"
            else:
                url += f"?page={page}&per_page={per_page}"
            
            async with httpx.AsyncClient() as client:
                try:
                    response = await client.get(url, headers=self.headers, timeout=10.0)
                    response.raise_for_status()
                    items = response.json()
                    
                    if not items or len(items) == 0:
                        break
                    
                    all_items.extend(items)
                    
                    # If we got less than per_page, we're done
                    if len(items) < per_page:
                        break
                    
                    page += 1
                except httpx.HTTPError:
                    break
        
        return all_items

