from fastapi import APIRouter, HTTPException, Query
from app.services.github_service import GitHubService

router = APIRouter()
github_service = GitHubService()

@router.get("/repo/{owner}/{repo}")
async def get_repo_metrics(owner: str, repo: str):
    """Get metrics for a specific repository"""
    try:
        stats = await github_service.get_repo_stats(owner, repo)
        if stats and "error" in stats:
            # Check if it's a rate limit error
            if "rate limit" in stats["error"].lower():
                raise HTTPException(status_code=429, detail=stats["error"])
            raise HTTPException(status_code=404, detail=stats["error"])
        if not stats:
            raise HTTPException(status_code=404, detail="Repository not found")
        return stats
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{username}/repos")
async def get_user_repos(username: str):
    """Get all repositories for a user"""
    try:
        repos = await github_service.get_user_repos(username)
        return {"username": username, "repos": repos, "count": len(repos)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{username}")
async def get_user_info(username: str):
    """Get user information"""
    try:
        user_info = await github_service.get_user_info(username)
        if not user_info:
            raise HTTPException(status_code=404, detail="User not found")
        return user_info
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{username}/profile")
async def get_user_profile_comprehensive(username: str):
    """Get comprehensive user profile with achievements, activity, and all metrics"""
    try:
        profile = await github_service.get_user_profile_comprehensive(username)
        if "error" in profile:
            raise HTTPException(status_code=404, detail=profile["error"])
        return profile
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search/repos")
async def search_repos(
    q: str = Query(..., description="Search query"),
    sort: str = Query("stars", description="Sort by: stars, forks, updated"),
    order: str = Query("desc", description="Order: asc or desc")
):
    """Search for repositories"""
    try:
        endpoint = f"/search/repositories?q={q}&sort={sort}&order={order}&per_page=20"
        results = await github_service._make_request(endpoint)
        if not results:
            return {"items": [], "total_count": 0}
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


