import UserItem from "@/components/search/UserItem";
import UserListSkeleton from "@/components/search/UserListSkeleton";
import CloseIcon from "@/icons/CloseIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import replacePlaceholders from "@/utils/replacePlaceholders";
import React, { useEffect, useMemo, useState } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const StockOwnersBottomSheet = ({ visible, onClose, ticker }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [owners, setOwners] = useState([]);
    const [search, setSearch] = useState("");
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (!visible || !ticker) return;

        const fetchOwners = async () => {
            setIsLoading(true);
            setOwners([]);
            try {
                const res = await network.get(
                    replacePlaceholders(API_PATHS.getStockOwners, ticker)
                );
                const mapped =
                    Array.isArray(res) && res.length
                        ? res.map((item) => ({
                              id: item.userId,
                              userName: item.userName,
                              userAvatarUrl:
                                  item.userAvatarUrl || item.profilePictureUrl,
                              isVerifiedUser: item.isVerifiedUser,
                              userPortfolioValue: item.userPortfolioValue ?? 0,
                          }))
                        : [];
                setOwners(mapped);
            } catch (error) {
                console.error("Failed to fetch stock owners:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOwners();
    }, [visible, ticker]);

    const filteredOwners = useMemo(() => {
        if (!search.trim()) return owners;
        const q = search.trim().toLowerCase();
        return owners.filter(
            (item) =>
                item.userName?.toLowerCase().includes(q) ||
                item.nickname?.toLowerCase().includes(q)
        );
    }, [owners, search]);

    if (!visible) {
        return null;
    }

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/70 justify-end">
                    <TouchableWithoutFeedback>
                        <SafeAreaView
                            edges={["bottom"]}
                            className="bg-[#161616] rounded-t-3xl"
                            style={{
                                maxHeight: "90%",
                                minHeight: "50%",
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                flex: 1,
                            }}
                        >
                            {/* Header */}
                            <View
                                className="px-4 pb-4 flex-row justify-between items-center border-b border-[#1F2023]"
                                style={{
                                    paddingTop: Math.max(insets.top, 12) + 12,
                                }}
                            >
                                <View className="flex-1">
                                    <Text className="font-manrope-bold text-20 text-white text-center">
                                        Stock Owners
                                    </Text>
                                    <Text className="font-manrope-medium text-12 text-[#B1B1B1] text-center mt-1">
                                        {ticker}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="absolute right-4 z-10 bg-[#1F1F1F] rounded-full p-2"
                                    style={{
                                        top: Math.max(insets.top, 12) + 12,
                                    }}
                                >
                                    <CloseIcon />
                                </TouchableOpacity>
                            </View>

                            {/* Search */}
                            <View className="px-4 pt-4 pb-3">
                                <View className="bg-[#1F1F1F] rounded-xl px-4 py-3 border border-[#2A2A2A]">
                                    <TextInput
                                        value={search}
                                        onChangeText={setSearch}
                                        placeholder="Search owners..."
                                        placeholderTextColor="#666"
                                        className="text-white font-manrope text-14"
                                        style={{ fontSize: 14 }}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        returnKeyType="search"
                                    />
                                </View>
                            </View>

                            {/* Content */}
                            <View style={{ flex: 1, minHeight: 0 }}>
                                {isLoading ? (
                                    <UserListSkeleton />
                                ) : (
                                    <ScrollView
                                        style={{ flex: 1 }}
                                        contentContainerStyle={{
                                            paddingBottom: 20,
                                        }}
                                        showsVerticalScrollIndicator={false}
                                        keyboardShouldPersistTaps="handled"
                                        nestedScrollEnabled={true}
                                    >
                                        {filteredOwners.length > 0 ? (
                                            filteredOwners.map(
                                                (item, index) => (
                                                    <UserItem
                                                        key={`${item.id}-${index}`}
                                                        item={item}
                                                    />
                                                )
                                            )
                                        ) : (
                                            <View className="items-center justify-center py-16 px-6">
                                                <Text className="font-manrope text-14 text-[#B1B1B1] text-center">
                                                    {search.trim()
                                                        ? "No owners found matching your search."
                                                        : "No owners found for this stock yet."}
                                                </Text>
                                            </View>
                                        )}
                                    </ScrollView>
                                )}
                            </View>
                        </SafeAreaView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default StockOwnersBottomSheet;
