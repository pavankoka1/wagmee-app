import React, { useState } from "react";
import TabBar from "@/components/Tabs/TabBar";
import TabContent from "@/components/Tabs/TabContent";
import { View } from "react-native";
import CommentsBottomSheet from "../home/CommentsBottomSheet";

const TabWrapper = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].key);

    return (
        <View className="flex-1">
            <TabBar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
            />
            <TabContent tabs={tabs} activeTab={activeTab} />
        </View>
    );
};

export default TabWrapper;
