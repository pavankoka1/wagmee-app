import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import React, { useState } from "react";
import BottomSheet from "@/components/BottomSheet";
import { WebView } from "react-native-webview";

const StockDetailsBottomSheet = ({ isOpen, onClose, symbol }) => {
    const [loading, setLoading] = useState(true);

    const tradingViewUrl = `https://www.tradingview.com/chart/?symbol=NSE%3A${symbol}&utm_source=www.tradingview.com&utm_medium=widget&utm_campaign=chart&utm_term=NSE%3A${symbol}&theme=dark`;

    return (
        <BottomSheet
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={onClose}
            paddingNeeded={false}
            className="flex-1 relative bg-[#161616]"
        >
            <View className="flex-1 relative">
                {loading && (
                    <View className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <ActivityIndicator size={32} color="#ffffff" />
                    </View>
                )}
                <WebView
                    originWhitelist={["*"]}
                    source={{ uri: tradingViewUrl }}
                    javaScriptEnabled={true}
                    scalesPageToFit={false}
                    style={{
                        width: "100%",
                        height: "100%",
                        opacity: loading ? 0 : 1,
                        transition: "opacity 1s",
                    }}
                    onLoadEnd={() => {
                        setLoading(false);
                    }}
                />
            </View>
        </BottomSheet>
    );
};

export default StockDetailsBottomSheet;
