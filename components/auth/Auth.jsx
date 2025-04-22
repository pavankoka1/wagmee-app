// import React, { useEffect, useState, useCallback } from "react";
// import {
//     Button,
//     Platform,
//     ScrollView,
//     StatusBar,
//     Text,
//     View,
//     Dimensions,
//     Modal,
//     TextInput,
// } from "react-native";
// import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
// import * as Linking from "expo-linking";
// import * as WebBrowser from "expo-web-browser";
// import {
//     useAuth,
//     useUser,
//     useOAuth,
//     useClerk,
//     useSignIn,
// } from "@clerk/clerk-expo";

// const { height, width } = Dimensions.get("window");

// export const useWarmUpBrowser = () => {
//     useEffect(() => {
//         const warmUpBrowser = async () => {
//             if (Platform.OS !== "web") {
//                 await WebBrowser.warmUpAsync();
//             }
//         };

//         warmUpBrowser();

//         return () => {
//             if (Platform.OS !== "web") {
//                 void WebBrowser.coolDownAsync();
//             }
//         };
//     }, []);
// };

// WebBrowser.maybeCompleteAuthSession();

// const Auth = () => {
//     useWarmUpBrowser();
//     const [isLoading, setIsLoading] = useState(false);
//     const [isModalVisible, setModalVisible] = useState(false);
//     const [mobileNumber, setMobileNumber] = useState("9515918848");
//     const [signInId, setSignInId] = useState(null);
//     const { user } = useUser();
//     const { signOut } = useClerk();
//     const { isSignedIn } = useAuth();
//     const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
//     const clerkClient = useClerk();

//     const onSocialLoginPress = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const response = await startOAuthFlow({
//                 redirectUrl: Linking.createURL("/dashboard", {
//                     scheme: "myapp",
//                 }),
//             });

//             console.log("OAuth response:", response);
//             handleOAuthResponse(response);
//         } catch (err) {
//             console.error("Error during OAuth flow:", err.message || err);
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     const handleOAuthResponse = (response) => {
//         const { createdSessionId, signIn, signUp } = response;

//         if (createdSessionId) {
//             return;
//         }

//         if (signIn && signIn.status === "needs_identifier") {
//             setSignInId(signIn.id);
//             setModalVisible(true);
//         } else if (signUp && signUp.status === "missing_requirements") {
//             if (signUp.missingFields.includes("phone_number")) {
//                 setSignInId(signUp.id);
//                 setModalVisible(true);
//             }
//         } else {
//             console.error("Failed to create session. Status:", response.status);
//         }
//     };

//     const updateUserWithMobileNumber = async (signInId, mobileNumber) => {
//         if (!clerkClient) {
//             console.error("Clerk client is undefined");
//             return;
//         }

//         console.log(clerkClient.phoneNumbers, clerkClient);

//         // try {
//         //     const response = await clerkClient.users.update(signInId, {
//         //         phone: mobileNumber,
//         //     });

//         //     if (response) {
//         //         console.log("Mobile number updated successfully:", response);
//         //         setModalVisible(false);
//         //         setMobileNumber(""); // Clear input upon success
//         //     } else {
//         //         console.error("Failed to update mobile number, no response.");
//         //     }
//         // } catch (error) {
//         //     console.error("Error updating user with mobile number:", error);
//         //     alert("Failed to update phone number. Please try again.");
//         // }
//     };

//     const handleMobileNumberSubmit = () => {
//         if (mobileNumber) {
//             const phoneRegex = /^[0-9]{10}$/; // Adjust regex as needed
//             if (phoneRegex.test(mobileNumber)) {
//                 updateUserWithMobileNumber(signInId, mobileNumber);
//             } else {
//                 alert("Please enter a valid mobile number (10 digits).");
//             }
//         } else {
//             alert("Please enter a mobile number.");
//         }
//     };

//     return (
//         <SafeAreaProvider>
//             <SafeAreaView
//                 style={{ flex: 1, backgroundColor: "#231F20", padding: 20 }}
//             >
//                 <ScrollView scrollEventThrottle={16}>
//                     <StatusBar
//                         backgroundColor="#231F20"
//                         barStyle="light-content"
//                     />
//                     <Text
//                         style={{
//                             color: "white",
//                             fontSize: 24,
//                             marginBottom: 20,
//                         }}
//                     >
//                         Landing Page
//                     </Text>
//                     {isSignedIn ? (
//                         <Button title="Logout" onPress={() => signOut()} />
//                     ) : (
//                         <Button title="Log in" onPress={onSocialLoginPress} />
//                     )}
//                 </ScrollView>

//                 {/* Modal for Mobile Number Input */}
//                 <Modal
//                     transparent={true}
//                     visible={isModalVisible}
//                     animationType="slide"
//                 >
//                     <View
//                         style={{
//                             flex: 1,
//                             justifyContent: "center",
//                             alignItems: "center",
//                             backgroundColor: "rgba(0, 0, 0, 0.5)",
//                         }}
//                     >
//                         <View
//                             style={{
//                                 width: width * 0.8,
//                                 padding: 20,
//                                 backgroundColor: "white",
//                                 borderRadius: 10,
//                                 alignItems: "center",
//                             }}
//                         >
//                             <Text style={{ fontSize: 18, marginBottom: 10 }}>
//                                 Enter Your Mobile Number
//                             </Text>
//                             <TextInput
//                                 style={{
//                                     height: 40,
//                                     borderColor: "gray",
//                                     borderWidth: 1,
//                                     marginBottom: 10,
//                                     width: "100%",
//                                     paddingHorizontal: 10,
//                                 }}
//                                 placeholder="Mobile Number"
//                                 value={mobileNumber}
//                                 onChangeText={setMobileNumber}
//                                 keyboardType="phone-pad"
//                             />
//                             <Button
//                                 title="Submit"
//                                 onPress={handleMobileNumberSubmit}
//                             />
//                             <Button
//                                 title="Cancel"
//                                 onPress={() => setModalVisible(false)}
//                             />
//                         </View>
//                     </View>
//                 </Modal>
//             </SafeAreaView>
//         </SafeAreaProvider>
//     );
// };

// export default Auth;
