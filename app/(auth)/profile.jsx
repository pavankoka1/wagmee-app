import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import Header from "@/components/profile/Header";
import Card from "@/components/profile/Card";
import TabWrapper from "@/components/Tabs/TabWrapper";
import useUserStore from "@/hooks/useUserStore";
import { ActivityIndicator } from "react-native-paper";
import PostsLoader from "@/components/home/PostsLoader";
import SettingsBottomSheet from "@/components/profile/SettingsBottomSheet";

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
    const { openSettingsBottomSheet, setSettingsBottomSheet } = useUserStore();
    const [activeTab, setActiveTab] = useState(tabs[0].key);

    if (activeTab === "portfolio") {
        return <Portfolio handleTabChange={() => setActiveTab("posts")} />;
    }

    return <Posts handleTabChange={() => setActiveTab("portfolio")} />;
};

export default Profile;
