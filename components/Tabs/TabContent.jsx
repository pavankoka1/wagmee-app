import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import ForYouScreen from "../home/ForYouScreen";

const TabContent = ({ activeTab, tabs }) => {
    const ActiveTabComponent = tabs.find(
        (tab) => tab.key === activeTab
    )?.component;

    return (
        <React.Suspense
            fallback={
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "#161616",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator color="#b4ef02" />
                </View>
            }
        >
            <View style={{ flex: 1, backgroundColor: "#161616" }}>
                {ActiveTabComponent ? <ActiveTabComponent /> : null}
            </View>
        </React.Suspense>
    );
};

export default TabContent;
