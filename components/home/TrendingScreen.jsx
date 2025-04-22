import { Text, View } from "react-native";

const TrendingScreen = () => {
    return (
        <View className="flex-1 flex-col justify-center items-center bg-[#161616]">
            <Text className="text-[#B1B1B1] font-manrope-bold text-16 mb-1">
                No Trending Posts
            </Text>
            <Text className="text-white font-manrope text-14">
                You're caught up, please check For You tab
            </Text>
        </View>
    );
};

export default TrendingScreen;
