import EulaAcceptanceModal from "@/components/auth/EulaAcceptanceModal";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import PickTradersPage from "./pickTraders";
import UsernamePage from "./username";

const EULA_ACCEPTED_KEY = "eula_accepted";

export default function OnboardingFlow() {
    const [step, setStep] = useState(0);
    const [showEulaModal, setShowEulaModal] = useState(true); // Show EULA first
    const router = useRouter();

    const handleEulaAcceptance = async () => {
        try {
            // Store EULA acceptance
            await SecureStore.setItemAsync(EULA_ACCEPTED_KEY, "true");
            console.log("✅ EULA accepted and stored");

            // Close modal and proceed to username step
            setShowEulaModal(false);
            setStep(0);
        } catch (error) {
            console.error("Error storing EULA acceptance:", error);
            // Still allow user to proceed
            setShowEulaModal(false);
            setStep(0);
        }
    };

    const handleUsernameContinue = () => setStep(1);
    const handleTradersContinue = () => router.replace("/(auth)/home");

    return (
        <>
            <EulaAcceptanceModal
                isVisible={showEulaModal}
                onAccept={handleEulaAcceptance}
            />
            {step === 0 && !showEulaModal && (
                <UsernamePage onContinue={handleUsernameContinue} />
            )}
            {step === 1 && (
                <PickTradersPage onContinue={handleTradersContinue} />
            )}
        </>
    );
}
