import BottomSheet from "@/components/BottomSheet";
import BlockIcon from "@/icons/BlockIcon";
import FlagIcon from "@/icons/FlagIcon";
import network from "@/network";
import API_PATHS from "@/network/apis";
import React, { useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

const UserOptionsBottomSheet = ({
    isOpen,
    onClose,
    userDetails,
    currentUserId,
    onBlockUser,
}) => {
    const [showReportForm, setShowReportForm] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [selectedReportType, setSelectedReportType] = useState(null);
    const [isReporting, setIsReporting] = useState(false);
    const [isBlocking, setIsBlocking] = useState(false);

    const reportTypes = [
        { id: "impersonation", label: "Impersonation" },
        { id: "harassment", label: "Harassment or Hate Speech" },
        { id: "spam", label: "Spam or Scam Activity" },
        { id: "fraud", label: "Fraudulent Activity" },
        { id: "other", label: "Other" },
    ];

    const handleReportUser = () => {
        if (!selectedReportType) {
            Alert.alert("Error", "Please select a reason for reporting");
            return;
        }

        setIsReporting(true);
        network
            .post(API_PATHS.reportUser, {
                reporterId: currentUserId,
                reportedUserId: userDetails.id,
                reason: selectedReportType,
                description: reportReason,
            })
            .then(() => {
                if (Platform.OS === "android") {
                    ToastAndroid.showWithGravityAndOffset(
                        "Report submitted. We'll review it within 24 hours.",
                        ToastAndroid.LONG,
                        ToastAndroid.TOP,
                        25,
                        50
                    );
                } else {
                    Alert.alert(
                        "Report Submitted",
                        "Thank you. We'll review this user within 24 hours."
                    );
                }
                onClose();
                setShowReportForm(false);
                setReportReason("");
                setSelectedReportType(null);
            })
            .catch((error) => {
                Alert.alert(
                    "Error",
                    "Failed to submit report. Please try again."
                );
            })
            .finally(() => {
                setIsReporting(false);
            });
    };

    const handleBlockUser = () => {
        Alert.alert(
            "Block User",
            `Are you sure you want to block @${
                userDetails.userName || "this user"
            }? You won't see their posts or interact with them.`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Block",
                    style: "destructive",
                    onPress: () => {
                        setIsBlocking(true);
                        network
                            .post(API_PATHS.blockUser, {
                                blockerId: currentUserId,
                                blockedUserId: userDetails.id,
                            })
                            .then(() => {
                                if (Platform.OS === "android") {
                                    ToastAndroid.showWithGravityAndOffset(
                                        "User blocked successfully",
                                        ToastAndroid.SHORT,
                                        ToastAndroid.TOP,
                                        25,
                                        50
                                    );
                                } else {
                                    Alert.alert(
                                        "User Blocked",
                                        "You've blocked this user successfully."
                                    );
                                }
                                onBlockUser && onBlockUser(userDetails.id);
                                onClose();
                            })
                            .catch(() => {
                                Alert.alert(
                                    "Error",
                                    "Failed to block user. Please try again."
                                );
                            })
                            .finally(() => {
                                setIsBlocking(false);
                            });
                    },
                },
            ]
        );
    };

    const handleClose = () => {
        setShowReportForm(false);
        setReportReason("");
        setSelectedReportType(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <BottomSheet isOpen={isOpen} onClose={handleClose} paddingNeeded={true}>
            <View className="py-4">
                {!showReportForm ? (
                    <>
                        <Text className="font-manrope-bold text-18 text-white mb-6">
                            User Options
                        </Text>

                        <TouchableOpacity
                            onPress={() => setShowReportForm(true)}
                            className="flex flex-row items-center py-4 border-b border-[#2f2f2f]"
                        >
                            <FlagIcon color="#fff" size={20} />
                            <Text className="font-manrope-medium text-14 text-white ml-3">
                                Report User
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleBlockUser}
                            className="flex flex-row items-center py-4"
                            disabled={isBlocking}
                        >
                            {isBlocking ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#ef4444"
                                />
                            ) : (
                                <>
                                    <BlockIcon color="#ef4444" size={20} />
                                    <Text className="font-manrope-medium text-14 text-[#ef4444] ml-3">
                                        Block User
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleClose}
                            className="mt-4 bg-[#1F1F1F] py-4 rounded-xl flex items-center"
                        >
                            <Text className="font-manrope-medium text-14 text-white">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text className="font-manrope-bold text-18 text-white mb-2">
                            Report User
                        </Text>
                        <Text className="font-manrope text-12 text-[#B1B1B1] mb-6">
                            Help us understand the problem. All reports are
                            reviewed within 24 hours.
                        </Text>

                        <Text className="font-manrope-bold text-14 text-white mb-3">
                            Select a reason:
                        </Text>

                        {reportTypes.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                onPress={() => setSelectedReportType(type.id)}
                                className={`py-4 px-4 mb-2 rounded-xl border ${
                                    selectedReportType === type.id
                                        ? "border-primary-main bg-[#2A2A2A]"
                                        : "border-[#2f2f2f] bg-[#1F1F1F]"
                                }`}
                            >
                                <Text
                                    className={`font-manrope-medium text-14 ${
                                        selectedReportType === type.id
                                            ? "text-primary-main"
                                            : "text-white"
                                    }`}
                                >
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <Text className="font-manrope-bold text-14 text-white mb-2 mt-4">
                            Additional details (optional):
                        </Text>
                        <TextInput
                            className="w-full text-white bg-[#1F1F1F] rounded-xl p-4 mb-6 border border-[#2f2f2f]"
                            placeholder="Provide more context about this report..."
                            placeholderTextColor="#B1B1B1"
                            value={reportReason}
                            onChangeText={setReportReason}
                            cursorColor="#B4EF02"
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        <TouchableOpacity
                            onPress={handleReportUser}
                            disabled={isReporting || !selectedReportType}
                            className={`py-4 rounded-xl flex items-center ${
                                !selectedReportType || isReporting
                                    ? "bg-[#2A2A2A] opacity-50"
                                    : "bg-primary-main"
                            }`}
                        >
                            {isReporting ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#161616"
                                />
                            ) : (
                                <Text className="font-manrope-bold text-14 text-[#161616]">
                                    Submit Report
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setShowReportForm(false);
                                setReportReason("");
                                setSelectedReportType(null);
                            }}
                            className="mt-3 py-4 rounded-xl flex items-center bg-[#1F1F1F]"
                        >
                            <Text className="font-manrope-medium text-14 text-white">
                                Back
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
        </BottomSheet>
    );
};

export default UserOptionsBottomSheet;
