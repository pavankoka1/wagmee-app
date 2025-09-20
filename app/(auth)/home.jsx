import ForYouScreen from "@/components/home/ForYouScreen";
import TrendingScreen from "@/components/home/TrendingScreen";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useState } from "react";
import { Dimensions, SafeAreaView } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";

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
        <SafeAreaView style={{ flex: 1, backgroundColor: "#161616" }}>
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
        </SafeAreaView>
    );
};

export default Home;
