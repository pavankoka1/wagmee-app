import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View, Dimensions } from "react-native";
import { TabBar, TabView, SceneMap } from "react-native-tab-view";
import TrendingScreen from "@/components/home/TrendingScreen";
import ForYouScreen from "@/components/home/ForYouScreen";

const { width } = Dimensions.get("window");

const Tab = createMaterialTopTabNavigator();

const Home = () => {
    const [index, setIndex] = useState(0);

    const [routes] = useState([
        { key: "trending", title: "Trending" },
        { key: "forYou", title: "For You" },
    ]);

    // Update renderScene to return functions that return components
    const renderScene = SceneMap({
        trending: TrendingScreen, // Pass the component directly
        forYou: ForYouScreen, // Pass the component directly
    });

    return (
        <View style={{ flex: 1, backgroundColor: "#161616" }}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
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
                    />
                )}
                swipeEnabled={false}
            />
        </View>
    );
};

export default Home;
