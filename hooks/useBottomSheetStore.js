import { create } from "zustand";

const useBottomSheetStore = create((set) => ({
    isFollowSheetOpen: false,
    followSheetTitle: "",
    followSheetUserId: null,
    openFollowSheet: (title, userId) =>
        set({
            isFollowSheetOpen: true,
            followSheetTitle: title,
            followSheetUserId: userId,
        }),
    closeFollowSheet: () =>
        set({
            isFollowSheetOpen: false,
            followSheetTitle: "",
            followSheetUserId: null,
        }),
}));

export default useBottomSheetStore;
