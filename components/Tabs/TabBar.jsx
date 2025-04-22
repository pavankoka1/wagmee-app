import { Animated, Dimensions, View } from "react-native";
import { useRef, useEffect } from "react";
import TabButton from "./TabButton";

const TabBar = ({ activeTab, setActiveTab, tabs }) => {
    const slideAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(slideAnimation, {
            toValue:
                activeTab === tabs[0].key
                    ? 0
                    : Dimensions.get("window").width / 2,
            useNativeDriver: false,
            tension: 50,
            friction: 7,
        }).start();
    }, [activeTab]);

    return (
        <View style={{ backgroundColor: "#161616" }}>
            <View
                style={{
                    flexDirection: "row",
                    paddingTop: 12,
                    paddingBottom: 12,
                }}
            >
                {tabs.map((tab) => (
                    <TabButton
                        key={tab.key}
                        title={tab.title}
                        isActive={activeTab === tab.key}
                        onPress={() => setActiveTab(tab.key)}
                    />
                ))}
            </View>
            <Animated.View
                style={{
                    position: "absolute",
                    bottom: 0,
                    height: 3,
                    width: "50%",
                    backgroundColor: "#b4ef02",
                    left: slideAnimation,
                }}
            />
        </View>
    );
};

export default TabBar;
