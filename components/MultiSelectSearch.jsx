import clsx from "clsx";
import React from "react";
import {
    FlatList,
    Image,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator, TextInput } from "react-native-paper";
import BottomSheet from "./BottomSheet"; // Adjust the import path as necessary

const MultiSelectSearch = ({
    loading,
    children,
    data,
    selectedItems,
    setSelectedItems,
    searchText,
    setSearchText,
    placeholder,
}) => {
    const [isBottomSheetOpen, setIsBottomSheetOpen] = React.useState(false);

    // Filter items based on search text
    // const filteredData = data?.filter((item) =>
    //     item.toLowerCase().includes(searchText.toLowerCase())
    // );

    // Render each item in the list
    const renderItem = ({ item }) => {
        const isSelected = selectedItems
            .map((prev) => prev.id)
            .includes(item.id);
        return (
            <TouchableOpacity
                className="py-4 px-4 flex-row gap-4 items-center border-b border-[#2a2a2a] w-full"
                style={{
                    minHeight: Platform.OS === "ios" ? 64 : 56,
                }}
                onPress={() => {
                    setSelectedItems((prev) => {
                        if (prev.map((prev) => prev.id).includes(item.id)) {
                            return prev.filter(
                                (selected) => selected.id !== item.id
                            );
                        } else {
                            return [...prev, item];
                        }
                    });
                }}
            >
                <Image
                    width={40}
                    height={40}
                    className="rounded-full"
                    source={{ uri: item.userAvatarUrl }}
                />
                <Text
                    className={clsx([
                        "font-manrope-medium text-14 leading-none",
                        {
                            "text-primary-main": isSelected,
                            "text-white": !isSelected,
                        },
                    ])}
                >
                    @{item.userName}
                </Text>
                {/* {isSelected && <TickIcon color="#b4ef04" />} */}
            </TouchableOpacity>
        );
    };

    return (
        <>
            <TouchableOpacity
                className="flex flex-row items-center"
                onPress={() => setIsBottomSheetOpen(true)}
            >
                {children}
            </TouchableOpacity>

            <BottomSheet
                isOpen={isBottomSheetOpen}
                onClose={() => setIsBottomSheetOpen(false)}
                closeOnOverlayClick={true}
                paddingNeeded={false}
                className="flex-1"
            >
                <View className="bg-[#161616] flex-1 pt-12">
                    {/* Search Input */}
                    <View className="px-4 pb-4">
                        <View className="flex flex-row items-center">
                            <View
                                className="h-6 bg-primary-main w-[2px] mr-3"
                                style={{
                                    marginTop: Platform.OS === "ios" ? 6 : 4,
                                }}
                            />
                            <TextInput
                                mode="flat"
                                placeholder={placeholder}
                                placeholderTextColor="#b1b1b1"
                                textColor="#fff"
                                underlineStyle={{ display: "none" }}
                                style={{
                                    flex: 1,
                                    backgroundColor: "transparent",
                                    borderBottomWidth: 0,
                                    color: "#fff",
                                    fontFamily: "Manrope",
                                    fontSize: 16,
                                    lineHeight: 24,
                                    paddingVertical:
                                        Platform.OS === "ios" ? 4 : 2,
                                    paddingHorizontal: 0,
                                    minHeight: 40,
                                }}
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                        </View>
                    </View>

                    {/* User List */}
                    <View className="flex-1 px-4">
                        {loading ? (
                            <View className="flex-1 flex justify-center items-center">
                                <ActivityIndicator
                                    size="small"
                                    color="#B4EF02"
                                />
                            </View>
                        ) : data && data.length > 0 ? (
                            <FlatList
                                data={data}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                        ) : (
                            <View className="flex-1 flex justify-center items-center py-8">
                                <Text className="font-manrope text-14 text-[#b1b1b1] text-center">
                                    No users found
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </BottomSheet>
        </>
    );
};

export default MultiSelectSearch;
