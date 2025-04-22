import React, { useState } from "react";
import {
    View,
    TouchableOpacity,
    Image,
    Text,
    ActivityIndicator,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { MaterialIcons } from "@expo/vector-icons"; // Make sure to install this package
import network from "@/network";
import API_PATHS from "@/network/apis";
import * as SecureStore from "expo-secure-store";
import { HEADERS_KEYS } from "@/network/constants";

const ImageUploader = ({
    children,
    images = [],
    setImages,
    selectionLimit = 4,
}) => {
    const userId = SecureStore.getItem(HEADERS_KEYS.USER_ID);

    const handleImagePick = () => {
        const options = {
            mediaType: "photo",
            quality: 1,
            selectionLimit,
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("User  cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else if (response.assets) {
                // Filter selected images to allow only PNG, JPG, or JPEG
                const validImages = response.assets
                    .filter((asset) =>
                        ["image/png", "image/jpeg", "image/jpg"].includes(
                            asset.type
                        )
                    )
                    .map((asset) => ({
                        uri: asset.uri,
                        uploading: true, // Set uploading to true initially
                    }));

                // console.log("Selected Images: ", validImages); // Log selected images
                setImages((prev) => [...prev, ...validImages].slice(0, 4)); // Limiting to the first 4 selected images

                validImages.forEach((image) => {
                    network
                        .uploadFile(API_PATHS.uploadFile, image, userId)
                        .then((response) => {
                            console.log(response);
                            // console.log("Upload successful", response);
                            setImages((prev) =>
                                prev.map((img) =>
                                    img.uri === image.uri
                                        ? {
                                              ...img,
                                              key: response.key,
                                              publicUrl: response.publicUrl,
                                              uploading: false,
                                          } // Set uploading to false on success
                                        : img
                                )
                            );
                        })
                        .catch((error) => {
                            console.error("Upload failed", error);
                            setImages((prev) =>
                                prev.map((img) =>
                                    img.uri === image.uri
                                        ? {
                                              ...img,
                                              uploading: false,
                                              error: true,
                                          } // Set uploading to false and mark error
                                        : img
                                )
                            );
                        });
                });
            }
        });
    };

    const removeImage = (uri) => {
        setImages((prev) => prev.filter((image) => image.uri !== uri));
    };

    return (
        <>
            <TouchableOpacity onPress={handleImagePick}>
                {children}
            </TouchableOpacity>
            <View className="flex flex-row flex-wrap my-2 gap-4">
                {images.length > 0
                    ? images.map((image, index) => (
                          <View
                              key={"image-upload-" + index}
                              className="relative w-16 h-16"
                          >
                              <Image
                                  source={{ uri: image.uri }}
                                  className="w-16 h-16 mr-2 mb-2 rounded border border-gray-300" // Tailwind styles
                              />

                              {image.uploading && (
                                  <View className="absolute p-1 bg-white opacity-75 rounded-full left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
                                      <ActivityIndicator
                                          size="small"
                                          color="#161616"
                                      />
                                  </View>
                              )}
                              <TouchableOpacity
                                  onPress={() => removeImage(image.uri)}
                                  className="absolute top-0 right-0 -translate-y-2 translate-x-2 p-1 bg-white rounded-full"
                              >
                                  <MaterialIcons
                                      name="close"
                                      size={12}
                                      color="#161616"
                                  />
                              </TouchableOpacity>
                          </View>
                      ))
                    : null}
            </View>
        </>
    );
};

export default ImageUploader;
