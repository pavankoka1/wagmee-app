import { View, RefreshControl } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { PostsLoader } from "../home/feed";
import FeedPost from "../home/FeedPost";

const ESTIMATED_ITEM_SIZE = 400;
const ITEMS_PER_PAGE = 10;
const LOADING_ITEMS = 4;

const MemoizedPostsLoader = React.memo(PostsLoader);

const OptimizedList = ({
    data,
    isLoading,
    onEndReached,
    onRefresh,
    refreshing,
    ListEmptyComponent,
    ListHeaderComponent,
    keyPrefix = "list",
    fetchMoreThreshold = 1.5,
    initialNumToRender = 10,
    contentContainerStyle,
    onScroll,
    scrollEventThrottle = 16,
    className,
}) => {
    const listRef = useRef(null);
    const isFetchingMore = useRef(false);

    // Memoize the list data to prevent unnecessary re-renders
    const listData = useMemo(() => {
        if (isLoading) {
            return [...data, ...Array(LOADING_ITEMS).fill(null)];
        }
        return data;
    }, [data, isLoading]);

    // Memoize the renderItem function
    const renderItem = useCallback(({ item, index }) => {
        if (!item) {
            return <MemoizedPostsLoader />;
        }
        return <FeedPost id={item} />;
    }, []);

    // Memoize the keyExtractor function
    const keyExtractor = useCallback(
        (item, index) => {
            if (!item) {
                return `${keyPrefix}-loader-${index}`;
            }
            return `${keyPrefix}-${item}`;
        },
        [keyPrefix]
    );

    // Memoize the onEndReached callback with debounce
    const handleEndReached = useCallback(() => {
        if (!isLoading && !isFetchingMore.current && onEndReached) {
            isFetchingMore.current = true;
            onEndReached().finally(() => {
                isFetchingMore.current = false;
            });
        }
    }, [isLoading, onEndReached]);

    // Memoize the refresh control
    const refreshControl = useMemo(
        () =>
            onRefresh ? (
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#b4ef02"
                    colors={["#b4ef02"]}
                    progressBackgroundColor="transparent"
                    progressViewOffset={20}
                />
            ) : null,
        [refreshing, onRefresh]
    );

    return (
        <View className={`flex-1 ${className || "bg-[#161616]"}`}>
            <FlashList
                ref={listRef}
                data={listData}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onEndReached={handleEndReached}
                onEndReachedThreshold={fetchMoreThreshold}
                refreshControl={refreshControl}
                initialNumToRender={initialNumToRender}
                estimatedItemSize={ESTIMATED_ITEM_SIZE}
                showsVerticalScrollIndicator={false}
                overScrollMode="never"
                contentContainerStyle={[
                    { flexGrow: 1, backgroundColor: "#161616" },
                    contentContainerStyle,
                ]}
                ListEmptyComponent={ListEmptyComponent}
                ListHeaderComponent={ListHeaderComponent}
                drawDistance={ESTIMATED_ITEM_SIZE * 2}
                overrideItemLayout={(layout) => {
                    layout.size = ESTIMATED_ITEM_SIZE;
                }}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 10,
                }}
                scrollEventThrottle={scrollEventThrottle}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={50}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 50,
                }}
                onScroll={onScroll}
            />
        </View>
    );
};

export default React.memo(OptimizedList);
