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
    getCommentsByPostId: "/api/v1/comments/post/{0}",
    addComment: "/api/v1/comments",
    addLike: "/api/v1/likes",
    removeLike: "/api/v1/likes/{0}/{1}",
    getSmallcaseTransactionId: "/api/v1/small-case/transaction_id",
    getHoldings: "/api/v1/small-case/user/holdings",
};

export default API_PATHS;
