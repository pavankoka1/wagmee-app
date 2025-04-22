import network from "@/network";
import API_PATHS from "@/network/apis";
import { create } from "zustand";
import useUserStore from "./useUserStore";

const useActivityStore = create((set, get) => ({
    isPostingComment: false,
    comments: {},
    activeCommentPostId: null,

    setActiveCommentPostId: (postId) => {
        set({ activeCommentPostId: postId });
    },

    // Function to add a comment for the active postId
    addComment: ({ comment, userId }) => {
        return new Promise((resolve, reject) => {
            set({ isPostingComment: true });
            const activeCommentPostId = get().activeCommentPostId;

            network
                .post(API_PATHS.addComment, {
                    userId,
                    postId: activeCommentPostId,
                    content: comment,
                })
                .then((res) => {
                    set((state) => {
                        const postComments =
                            state.comments[activeCommentPostId] || [];
                        return {
                            comments: {
                                ...state.comments,
                                [activeCommentPostId]: [res, ...postComments], // Add new comment to the front
                            },
                            isPostingComment: false,
                        };
                    });
                    resolve(res); // Resolve the promise with the response
                })
                .catch((error) => {
                    set({ isPostingComment: false });
                    reject(error);
                });
        });
    },

    setCommentsById: (postId, comments) => {
        set((state) => ({
            comments: {
                ...state.comments,
                [postId]: comments,
            },
        }));
    },
}));

export default useActivityStore;
