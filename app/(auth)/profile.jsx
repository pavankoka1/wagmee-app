import React, { useState } from "react";

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
        return <Portfolio handleTabChange={() => setActiveTab("posts")} />;
    }

    return <Posts handleTabChange={() => setActiveTab("portfolio")} />;
};

export default Profile;
