const API_PATHS = {
    getJwtToken: "/api/v1/auth/generate-token",
    refreshToken: "/api/v1/auth/refresh-token",
    getUsersByParams: "/api/v1/search/users",
    getUserById: "/api/v1/search/user/{0}",
    uploadFile: "/api/v1/media/upload",
    createPost: "/api/v1/posts",
    getFeed: "/api/v1/feed/{0}",
    getPosts: "/api/v1/posts/user/{0}",
    getFollowers: "api/v1/followers/followers/{0}",
    getFollowing: "api/v1/followers/following/{0}",
    unfollow: "/api/v1/followers/{0}/{1}",
    follow: "/api/v1/followers",
    updateUserDetails: "/api/v1/user/{0}",
    deleteUser: "/api/v1/user/{0}",
    getCommentsByPostId: "/api/v1/comments/post/{0}",
    addComment: "/api/v1/comments",
    addLike: "/api/v1/likes",
    removeLike: "/api/v1/likes/{0}/{1}",
    getSmallcaseTransactionId: "/api/v1/small-case/transaction_id",
    getHoldings: "/api/v1/small-case/user/{0}/holdings",
    getTrendingPosts: "/api/v1/posts/trending",
    deletePost: "/api/v1/posts/post/{postId}",
    editPost: "/api/v1/posts/post",
    getFollowersList: "/api/v1/followers/user/{0}/followers",
    getFollowingList: "/api/v1/followers/user/{0}/following",
    // Content moderation endpoints
    reportPost: "/api/v1/moderation/report/post",
    reportUser: "/api/v1/moderation/report/user",
    blockUser: "/api/v1/moderation/block",
    unblockUser: "/api/v1/moderation/block/{0}/{1}",
    getBlockedUsers: "/api/v1/moderation/blocked/{0}",

    // Stock ownership
    getStockOwners: "/api/v1/stocks/{0}/owners",
    getStockOwnerCount: "/api/v1/stocks/{0}/owners/count",

    // Leaderboard
    getLeaderboard: "/api/v1/leaderboard/{0}",
    getUserRank: "/api/v1/leaderboard/{0}/user/{1}",

    // Portfolio Copilot (AI Summary)
    analyzePortfolio: "/api/v1/portfolio-copilot/user/{0}/analyze",
    getDailyPortfolioSummary:
        "/api/v1/portfolio-copilot/user/{0}/daily-summary",
    generatePortfolioSummary:
        "/api/v1/portfolio-copilot/user/{0}/generate-summary",
};

export default API_PATHS;
