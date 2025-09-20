import React, { useState } from "react";
import { SafeAreaView } from "react-native";

import Portfolio from "@/components/profile/Portfolio";
import Posts from "@/components/profile/Posts";

const tabs = [
    { key: "portfolio", title: "Your Portfolio", component: Portfolio },
    {
        key: "posts",
        title: "Posts",
        component: Posts,
    },
];

const Profile = () => {
    const [activeTab, setActiveTab] = useState(tabs[0].key);

    if (activeTab === "portfolio") {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: "#161616" }}>
                <Portfolio handleTabChange={() => setActiveTab("posts")} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#161616" }}>
            <Posts handleTabChange={() => setActiveTab("portfolio")} />
        </SafeAreaView>
    );
};

export default Profile;
