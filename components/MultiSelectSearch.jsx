import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import BottomSheet from "./BottomSheet"; // Adjust the import path as necessary
import { ActivityIndicator, TextInput } from "react-native-paper";
import clsx from "clsx";
import TickIcon from "@/icons/TickIcon";

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
                className={clsx([
                    "py-2 flex-row gap-3 items-center border-b w-full flex border-[#1F2023]",
                ])}
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
                    source={{ uri: item.profilePictureUrl }}
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
                    @{item.nickname}
                </Text>
                {/* {isSelected && <TickIcon color="#b4ef04" />} */}
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1">
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
                className="flex-1"
            >
                <View className="flex-1 mt-6 gap-4">
                    <View className="flex flex-row items-center ml-[2px]">
                        <View className="h-6 bg-primary-main w-[2px]" />
                        <TextInput
                            mode="flat"
                            placeholder={placeholder}
                            placeholderTextColor="#b1b1b1"
                            textColor="#fff"
                            fontSize={20}
                            underlineStyle={{
                                display: "none",
                            }}
                            style={{
                                flex: 1,
                                backgroundColor: "transparent",
                                borderBottomWidth: 0,
                                border: "none",
                                color: "#fff",
                                fontFamily: "Manrope",
                                fontSize: 14,
                            }}
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                    {loading ? (
                        <View className="flex-1 flex justify-center items-center">
                            <ActivityIndicator size="small" />
                        </View>
                    ) : (
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                        />
                    )}
                </View>
            </BottomSheet>
        </View>
    );
};

export default MultiSelectSearch;
