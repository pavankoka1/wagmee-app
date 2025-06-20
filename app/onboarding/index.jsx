import React, { useState } from "react";
import UsernamePage from "./username";
import PickTradersPage from "./pickTraders";
import { useRouter } from "expo-router";

export default function OnboardingFlow() {
    const [step, setStep] = useState(0);
    const router = useRouter();

    const handleUsernameContinue = () => setStep(1);
    const handleTradersContinue = () => router.replace("/(auth)/home");

    return (
        <>
            {step === 0 && <UsernamePage onContinue={handleUsernameContinue} />}
            {step === 1 && (
                <PickTradersPage onContinue={handleTradersContinue} />
            )}
        </>
    );
}
