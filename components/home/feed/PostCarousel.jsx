import React, { useRef, useState } from "react";
import { View, Dimensions } from "react-native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { useAdvancedSettings } from "@/hooks/useSettings";
import { SlideItem } from "@/components/SlideItem";

/**
 * Renders the post's image carousel.
 * @param {Object} props
 * @param {string[]} props.mediaUrls - Array of image URLs
 * @param {Function} props.onImageClick - Callback function when an image is clicked
 */
const PostCarousel = ({ mediaUrls, onImageClick }) => {
    const screenWidth = Dimensions.get("window").width;
    const carouselRef = useRef(null);
    const progress = useSharedValue(0);
    const [isLoading, setIsLoading] = useState(true);

    const { advancedSettings } = useAdvancedSettings({
        defaultSettings: {
            autoPlay: false,
            autoPlayInterval: 2000,
            autoPlayReverse: false,
            data: mediaUrls,
            height: 258,
            loop: true,
            pagingEnabled: true,
            snapEnabled: true,
            vertical: false,
            width: screenWidth - 32,
        },
    });

    const handleCarouselLayout = () => {
        setIsLoading(false);
    };

    if (!mediaUrls?.length) {
        return null;
    }

    return (
        <View className="w-full mt-4 my-2 relative">
            <Carousel
                ref={carouselRef}
                autoPlayInterval={2000}
                data={mediaUrls}
                height={220}
                loop={mediaUrls.length > 1}
                pagingEnabled={true}
                snapEnabled={true}
                width={screenWidth - 32}
                style={{
                    width: screenWidth - 32,
                    opacity: isLoading ? 0 : 1,
                }}
                onProgressChange={progress}
                onLayout={handleCarouselLayout}
                renderItem={({ item, index }) => (
                    <SlideItem
                        key={index}
                        index={index}
                        rounded={true}
                        source={item}
                        progress={parseInt(progress.value.toFixed(0))}
                        onImageLoad={() => setIsLoading(false)}
                        onImageClick={() => onImageClick?.(item, index)}
                    />
                )}
            />
            {isLoading && (
                <View
                    className="bg-gray-700 animate-pulse absolute w-full h-full"
                    style={{
                        borderRadius: 15,
                        height: 220,
                        width: screenWidth - 32,
                    }}
                />
            )}
            {mediaUrls.length > 1 && (
                <Pagination.Basic
                    progress={progress}
                    length={mediaUrls.length}
                    data={mediaUrls}
                    containerStyle={{
                        position: "relative",
                        alignSelf: "center",
                        marginTop: 16,
                    }}
                    dotStyle={{
                        width: 25,
                        height: 4,
                        backgroundColor: "#b1b1b1",
                        marginHorizontal: 4,
                    }}
                    activeDotStyle={{
                        width: 25,
                        height: 4,
                        backgroundColor: "#b4ef02",
                    }}
                />
            )}
        </View>
    );
};

export default PostCarousel;
