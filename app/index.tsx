import useAuthorized from '@/hooks/useAuthorized';
import OnboardingScreen from '@/screens/onboarding';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
    const { authorized } = useAuthorized();

    if (authorized) {
        return <Redirect href="/(tabs)/home" />
    }

    return (
        <OnboardingScreen />
    )
}