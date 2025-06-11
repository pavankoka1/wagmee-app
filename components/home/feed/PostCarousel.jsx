import React, { useRef } from "react";
import { View, Dimensions } from "react-native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { SlideItem } from "@/components/SlideItem";

const PAGE_WIDTH = Dimensions.get("window").width - 32;
const GAP = 4; // Gap between images

/**
 * Renders the post's image carousel with Instagram-like smoothness.
 * @param {Object} props
 * @param {string[]} props.mediaUrls - Array of image URLs
 * @param {Function} props.onImageClick - Callback function when an image is clicked
 */
const PostCarousel = React.memo(({ mediaUrls, onImageClick }) => {
    const carouselRef = useRef(null);
    const progress = useSharedValue(0);

    const renderItem = React.useCallback(
        ({ item, index }) => (
            <View
                style={{
                    width: PAGE_WIDTH,
                    height: 220,
                    paddingHorizontal: GAP / 2,
                }}
            >
                <SlideItem
                    key={`${item}-${index}`}
                    index={index}
                    source={item}
                    progress={progress}
                    onImageClick={() => onImageClick?.(item, index)}
                />
            </View>
        ),
        [onImageClick]
    );

    if (!mediaUrls?.length) {
        return null;
    }

    return (
        <View className="w-full mt-4 my-2">
            <Carousel
                ref={carouselRef}
                data={mediaUrls}
                width={PAGE_WIDTH}
                height={220}
                loop={false}
                pagingEnabled={true}
                snapEnabled={true}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.85,
                    parallaxScrollingOffset: 40,
                    parallaxAdjacentItemScale: 0.85,
                }}
                style={{
                    width: PAGE_WIDTH,
                }}
                onProgressChange={progress}
                renderItem={renderItem}
                defaultIndex={0}
                enabled={true}
                overscrollEnabled={false}
                simultaneousHandlers={[]}
                panGestureHandlerProps={{
                    activeOffsetX: [-1, 1],
                    minDist: 1,
                    maxPointers: 1,
                    minPointers: 1,
                    failOffsetY: [-5, 5],
                }}
                windowSize={3}
                snapToInterval={PAGE_WIDTH}
                snapToAlignment="center"
                scrollAnimationDuration={300}
            />
            {mediaUrls.length > 1 && (
                <Pagination.Basic
                    progress={progress}
                    length={mediaUrls.length}
                    data={mediaUrls}
                    containerStyle={{
                        position: "relative",
                        alignSelf: "center",
                        marginTop: 8,
                    }}
                    dotStyle={{
                        width: 20,
                        height: 3,
                        backgroundColor: "#b1b1b1",
                        marginHorizontal: 3,
                    }}
                    activeDotStyle={{
                        width: 20,
                        height: 3,
                        backgroundColor: "#b4ef02",
                    }}
                />
            )}
        </View>
    );
});

PostCarousel.displayName = "PostCarousel";

export default PostCarousel;
