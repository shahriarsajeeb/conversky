import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useEffect, useRef } from 'react'
import { Animated, Dimensions, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width, height } = Dimensions.get('window')

export default function OnboardingScreen() {
    // Responsive sizing
    const isSmallScreen = width < 375
    const isLargeScreen = width > 414

    // Animation refs
    const pinkRotation = useRef(new Animated.Value(0)).current
    const blueRotation = useRef(new Animated.Value(0)).current
    const yellowRotation = useRef(new Animated.Value(0)).current
    const greenRotation = useRef(new Animated.Value(0)).current

    // Floating animation refs
    const pinkFloat = useRef(new Animated.Value(0)).current
    const blueFloat = useRef(new Animated.Value(0)).current
    const yellowFloat = useRef(new Animated.Value(0)).current
    const greenFloat = useRef(new Animated.Value(0)).current

    useEffect(() => {
        // Continuous rotation animations
        const startRotations = () => {
            Animated.loop(
                Animated.timing(pinkRotation, {
                    toValue: 1,
                    duration: 4000,
                    useNativeDriver: true,
                })
            ).start()

            Animated.loop(
                Animated.timing(blueRotation, {
                    toValue: 1,
                    duration: 6000,
                    useNativeDriver: true,
                })
            ).start()

            Animated.loop(
                Animated.timing(yellowRotation, {
                    toValue: 1,
                    duration: 5000,
                    useNativeDriver: true,
                })
            ).start()

            Animated.loop(
                Animated.timing(greenRotation, {
                    toValue: 1,
                    duration: 7000,
                    useNativeDriver: true,
                })
            ).start()
        }

        // Floating animations
        const startFloating = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pinkFloat, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pinkFloat, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    })
                ])
            ).start()

            Animated.loop(
                Animated.sequence([
                    Animated.timing(blueFloat, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(blueFloat, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    })
                ])
            ).start()

            Animated.loop(
                Animated.sequence([
                    Animated.timing(yellowFloat, {
                        toValue: 1,
                        duration: 1800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(yellowFloat, {
                        toValue: 0,
                        duration: 1800,
                        useNativeDriver: true,
                    })
                ])
            ).start()

            Animated.loop(
                Animated.sequence([
                    Animated.timing(greenFloat, {
                        toValue: 1,
                        duration: 2500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(greenFloat, {
                        toValue: 0,
                        duration: 2500,
                        useNativeDriver: true,
                    })
                ])
            ).start()
        }

        startRotations()
        startFloating()
    }, [])

    // Interpolate rotation values
    const pinkSpin = pinkRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const blueSpin = blueRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-360deg']
    })

    const yellowSpin = yellowRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    })

    const greenSpin = greenRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '-360deg']
    })

    // Interpolate floating values
    const pinkFloatY = pinkFloat.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -8]
    })

    const blueFloatY = blueFloat.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 6]
    })

    const yellowFloatY = yellowFloat.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -5]
    })

    const greenFloatY = greenFloat.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 7]
    })

    return (
        <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Background gradient */}
            <LinearGradient
                colors={['#ffffff', '#f8f9ff', '#f0f4ff']}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Main content container */}
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 24
                }}>

                    {/* Chat bubble with AI greeting */}
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 24,
                        padding: 16,
                        marginBottom: 32,
                        shadowColor: '#8b5cf6',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 5,
                        maxWidth: 300
                    }}>
                        <Text style={{
                            color: '#1f2937',
                            fontSize: 18,
                            fontWeight: '500',
                            textAlign: 'center'
                        }}>
                            👋 Hi there! I'm Alva, your AI assistant.
                        </Text>
                    </View>

                    {/* Glowing AI blob graphic */}
                    <View style={{
                        marginBottom: 32,
                        width: isSmallScreen ? 128 : isLargeScreen ? 224 : 192,
                        height: isSmallScreen ? 128 : isLargeScreen ? 224 : 192,
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Base blob */}
                        <LinearGradient
                            colors={['#8b5cf6', '#a855f7', '#c084fc', '#e879f9']}
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 96,
                                opacity: 0.8
                            }}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />

                        {/* Curly multi-color shadows/swirls */}
                        {/* Pink swirl */}
                        <Animated.View style={{
                            position: 'absolute',
                            width: '60%',
                            height: '60%',
                            backgroundColor: 'rgba(236, 72, 153, 0.4)',
                            borderRadius: 999,
                            top: '15%',
                            left: '10%',
                            transform: [
                                { rotate: pinkSpin },
                                { translateY: pinkFloatY }
                            ],
                            opacity: 0.6
                        }} />

                        {/* Blue swirl */}
                        <Animated.View style={{
                            position: 'absolute',
                            width: '70%',
                            height: '70%',
                            backgroundColor: 'rgba(59, 130, 246, 0.3)',
                            borderRadius: 999,
                            bottom: '10%',
                            right: '5%',
                            transform: [
                                { rotate: blueSpin },
                                { translateY: blueFloatY }
                            ],
                            opacity: 0.5
                        }} />

                        {/* Yellow swirl */}
                        <Animated.View style={{
                            position: 'absolute',
                            width: '50%',
                            height: '50%',
                            backgroundColor: 'rgba(234, 179, 8, 0.4)',
                            borderRadius: 999,
                            top: '25%',
                            right: '20%',
                            transform: [
                                { rotate: yellowSpin },
                                { translateY: yellowFloatY }
                            ],
                            opacity: 0.5
                        }} />

                        {/* Green swirl */}
                        <Animated.View style={{
                            position: 'absolute',
                            width: '55%',
                            height: '55%',
                            backgroundColor: 'rgba(34, 197, 94, 0.3)',
                            borderRadius: 999,
                            bottom: '25%',
                            left: '15%',
                            transform: [
                                { rotate: greenSpin },
                                { translateY: greenFloatY }
                            ],
                            opacity: 0.4
                        }} />

                        {/* Inner glow effect */}
                        <View style={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            right: 16,
                            bottom: 16,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: 80
                        }} />
                        <View style={{
                            position: 'absolute',
                            top: 32,
                            left: 32,
                            right: 32,
                            bottom: 32,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 64
                        }} />
                    </View>

                    {/* How can I help you text */}
                    <Text style={{
                        color: '#374151',
                        fontSize: 18,
                        fontWeight: '500',
                        textAlign: 'center',
                        marginBottom: 48,
                        maxWidth: 300
                    }}>
                        How can I help you today?
                    </Text>

                    {/* Welcome text */}
                    <View style={{ alignItems: 'center', marginBottom: 64 }}>
                        <Text style={{
                            fontSize: 20,
                            color: '#7c3aed',
                            fontWeight: '500'
                        }}>
                            Ready to explore?
                        </Text>
                    </View>

                    {/* Continue button */}
                    <TouchableOpacity
                        onPress={() => {
                            AsyncStorage.setItem('authorized', 'true')
                            router.push('/(tabs)/home')
                        }}
                        style={{
                            backgroundColor: '#7c3aed',
                            borderRadius: 16,
                            paddingHorizontal: 32,
                            paddingVertical: 16,
                            shadowColor: '#7c3aed',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 5
                        }}
                        activeOpacity={0.8}
                    >
                        <Text style={{
                            color: 'white',
                            fontSize: 18,
                            fontWeight: '600',
                            textAlign: 'center'
                        }}>
                            Continue
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
}