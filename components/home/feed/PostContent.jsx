import React, { memo } from "react";
import { Text } from "react-native";

/**
 * Renders the post's text content.
 * @param {Object} props
 * @param {string} props.content - Post text content
 */
const PostContent = memo(({ content }) =>
    content ? (
        <Text className="font-manrope text-white text-14">{content}</Text>
    ) : null
);

export default PostContent;
