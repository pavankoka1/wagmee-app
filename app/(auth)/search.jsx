import {
    View,
    TextInput,
    FlatList,
    Text,
    Dimensions,
    Pressable,
} from "react-native";
import React, { useRef, useState } from "react";
import ArrowIcon from "@/icons/ArrowIcon";
import * as Animatable from "react-native-animatable";
import SearchIcon from "@/icons/SearchIcon";
import network from "@/network";
import { TabBar, TabView } from "react-native-tab-view";
import UserList from "@/components/search/UserList";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
import StocksList from "@/components/search/StocksList";

const { width } = Dimensions.get("window");

const Search = () => {
    const router = useRouter();
    const timerRef = useRef();

    const [index, setIndex] = useState(0);
    const [query, setQuery] = useState("");
    const [list, setList] = useState([]);

    const [routes] = useState([
        { key: "people", title: "People" },
        { key: "stocks", title: "Stocks" },
    ]);

    const handleTabChange = (newIndex) => {
        setIndex(newIndex);
        setQuery(""); // Clear search when switching tabs
    };

    const renderScene = ({ route }) => {
        switch (route.key) {
            case "people":
                return <UserList query={query} />;
            case "stocks":
                return <StocksList query={query} />;
            default:
                return null;
        }
    };

    return (
        <View className="flex-1 py-0 px-4 w-screen bg-[#161616]">
            <View className="flex flex-row items-center my-3 px-4 pl-0">
                <Button
                    onPress={() => {
                        router.replace("/(auth)/home");
                    }}
                    className="m-0 p-0 width-[0]"
                    style={{ minWidth: 0 }}
                >
                    <ArrowIcon />
                </Button>
                <View className="flex gap-3 flex-row border border-[#1F2023] bg-[#1F1F1F] rounded-3xl flex-1 items-center py-3 px-4">
                    <SearchIcon />
                    <TextInput
                        className="flex-1 h-5 text-white"
                        placeholder="Search"
                        placeholderTextColor="#B1B1B1"
                        value={query}
                        onChangeText={setQuery}
                        cursorColor="#B4EF02"
                    />
                </View>
            </View>

            <View className="flex-1 bg-[#161616]">
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={handleTabChange}
                    initialLayout={{ width }}
                    renderTabBar={(props) => (
                        <TabBar
                            {...props}
                            indicatorStyle={{
                                backgroundColor: "#b4ef02",
                                height: 3,
                            }}
                            style={{
                                backgroundColor: "transparent",
                                paddingVertical: 8,
                            }}
                            labelStyle={{ color: "white" }}
                            contentContainerStyle={{ elevation: 0 }}
                            className="font-manrope-bold text-14"
                        />
                    )}
                    swipeEnabled={true}
                />
            </View>
        </View>
    );
};

export default Search;
