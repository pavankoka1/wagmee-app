import React, {
    useEffect,
    useState,
    useMemo,
    useCallback,
    useRef,
} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from "react-native";
import useBottomSheetStore from "@/hooks/useBottomSheetStore";
import UserItem from "@/components/search/UserItem";
import CloseIcon from "@/icons/CloseIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import replacePlaceholders from "@/utils/replacePlaceholders";
import UserListSkeleton from "@/components/search/UserListSkeleton";

// Memoized TextInput to prevent unnecessary re-renders
const SearchInput = React.memo(({ value, onChangeText, inputRef }) => (
    <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search"
        placeholderTextColor="#B1B1B1"
        className="bg-[#232323] text-white rounded-lg px-4 py-2 font-manrope"
        style={{ fontSize: 16 }}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
    />
));

const FollowBottomSheet = () => {
    const {
        isFollowSheetOpen,
        closeFollowSheet,
        followSheetTitle,
        followSheetUserId,
    } = useBottomSheetStore();

    const [isLoading, setIsLoading] = useState(false);
    const [listData, setListData] = useState([]);
    const [search, setSearch] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (isFollowSheetOpen && followSheetUserId) {
            const fetchData = async () => {
                setIsLoading(true);
                setListData([]);
                const endpoint =
                    followSheetTitle === "Followers"
                        ? API_PATHS.getFollowersList
                        : API_PATHS.getFollowingList;
                try {
                    const res = await network.get(
                        replacePlaceholders(endpoint, followSheetUserId)
                    );
                    setListData(res);
                } catch (error) {
                    console.error(
                        `Failed to fetch ${followSheetTitle}:`,
                        error
                    );
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [isFollowSheetOpen, followSheetUserId, followSheetTitle]);

    const filteredList = useMemo(() => {
        if (!search.trim()) return listData;
        const q = search.trim().toLowerCase();
        return listData.filter(
            (item) =>
                item.name?.toLowerCase().includes(q) ||
                item.nickname?.toLowerCase().includes(q) ||
                item.userName?.toLowerCase().includes(q)
        );
    }, [listData, search]);

    const handleSearchChange = useCallback((text) => {
        setSearch(text);
    }, []);

    if (!isFollowSheetOpen) {
        return null;
    }

    return (
        <View
            style={StyleSheet.absoluteFill}
            className="bg-black/50 justify-end z-[9999999]"
        >
            <View className="bg-[#1F1F1F] rounded-t-2xl" style={{ flex: 1 }}>
                <View className="p-4 flex-row justify-between items-center">
                    <Text className="font-manrope-bold text-18 text-white text-center flex-1">
                        {followSheetTitle}
                    </Text>
                    <TouchableOpacity
                        onPress={closeFollowSheet}
                        className="absolute top-4 right-4 z-10 p-2"
                    >
                        <CloseIcon />
                    </TouchableOpacity>
                </View>
                <View className="px-4 pb-2">
                    <SearchInput
                        value={search}
                        onChangeText={handleSearchChange}
                        inputRef={inputRef}
                    />
                </View>
                <View style={{ flex: 1 }}>
                    {isLoading ? (
                        <UserListSkeleton />
                    ) : (
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingHorizontal: 16,
                                paddingBottom: 20,
                            }}
                            showsVerticalScrollIndicator={true}
                            keyboardShouldPersistTaps="always"
                            keyboardDismissMode="on-drag"
                        >
                            {filteredList.map((item) => (
                                <UserItem
                                    key={item.id.toString()}
                                    item={item}
                                />
                            ))}
                        </ScrollView>
                    )}
                </View>
            </View>
        </View>
    );
};

export default FollowBottomSheet;
