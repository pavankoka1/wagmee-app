import { create } from "zustand";
import network from "@/network";
import API_PATHS from "@/network/apis";
import generateQueryParams from "@/utils/generateQueryParams";

const useUserSearchStore = create((set, get) => ({
    userMap: {}, // { [query]: users[] }
    loadingMap: {}, // { [query]: boolean }
    errorMap: {}, // { [query]: string|null }

    fetchUsers: async (query = "") => {
        const { userMap, loadingMap } = get();
        if (userMap[query]) return; // Already cached
        if (loadingMap[query]) return; // Already loading

        set((state) => ({
            loadingMap: { ...state.loadingMap, [query]: true },
            errorMap: { ...state.errorMap, [query]: null },
        }));
        try {
            const res = await network.get(
                generateQueryParams(API_PATHS.getUsersByParams, { query })
            );
            set((state) => ({
                userMap: { ...state.userMap, [query]: res },
                loadingMap: { ...state.loadingMap, [query]: false },
                errorMap: { ...state.errorMap, [query]: null },
            }));
        } catch (e) {
            set((state) => ({
                loadingMap: { ...state.loadingMap, [query]: false },
                errorMap: {
                    ...state.errorMap,
                    [query]: "Failed to fetch users",
                },
            }));
        }
    },

    clearCache: () => set({ userMap: {}, loadingMap: {}, errorMap: {} }),
}));

export default useUserSearchStore;
