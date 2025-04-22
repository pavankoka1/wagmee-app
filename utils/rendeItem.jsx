import { SlideItem } from "@/components/SlideItem";

export const renderItem =
    ({ item, rounded = false, style }) =>
    ({ index }) =>
        (
            <SlideItem
                source={item}
                key={index}
                index={index}
                rounded={rounded}
                style={style}
            />
        );
