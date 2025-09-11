import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { Alert, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface AppSettings {
    defaultModel: string;
    responseStyle: string;
    conversationLength: string;
}

export default function Preferences() {
    const [settings, setSettings] = useState<AppSettings>({
        defaultModel: 'gpt-3.5-turbo',
        responseStyle: 'Friendly',
        conversationLength: 'Medium'
    })

    const models = [
        { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
        { label: 'GPT-4', value: 'gpt-4' },
        { label: 'GPT-4o-mini', value: 'gpt-4o-mini' }
    ]

    const responseStyles = [
        { label: 'Friendly', value: 'Friendly' },
        { label: 'Concise', value: 'Concise' },
        { label: 'Detailed', value: 'Detailed' }
    ]

    const conversationLengths = [
        { label: 'Short', value: 'Short' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Long', value: 'Long' }
    ]

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            const savedSettings = await SecureStore.getItemAsync('app_settings')
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings))
            }
        } catch (error) {
            console.error('Error loading settings:', error)
        }
    }

    const saveSettings = async (newSettings: AppSettings) => {
        try {
            await SecureStore.setItemAsync('app_settings', JSON.stringify(newSettings))
            setSettings(newSettings)
        } catch (error) {
            console.error('Error saving settings:', error)
        }
    }

    const clearAllData = async () => {
        Alert.alert(
            'Clear All Data',
            'This will permanently delete all your conversations, user information, and settings. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All Data',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Clear all stored data
                            await SecureStore.deleteItemAsync('conversations')
                            await SecureStore.deleteItemAsync('userInfo')
                            await SecureStore.deleteItemAsync('hasCompletedOnboarding')
                            await SecureStore.deleteItemAsync('openai_api_key')
                            await SecureStore.deleteItemAsync('app_settings')
                            await AsyncStorage.removeItem('authorized')

                            Alert.alert(
                                'Data Cleared',
                                'All your data has been successfully cleared. The app will restart with default settings.',
                                [{ text: 'OK' }]
                            )
                            router.replace('/')
                        } catch (error) {
                            console.error('Error clearing data:', error)
                            Alert.alert('Error', 'Failed to clear data. Please try again.')
                        }
                    }
                }
            ]
        )
    }

    const openPrivacyPolicy = () => {
        // Replace with your actual privacy policy URL
        Linking.openURL('https://www.conversky.com/privacy-policy')
    }

    const openTermsOfUse = () => {
        // Replace with your actual terms of use URL
        Linking.openURL('https://www.conversky.com/terms-condition')
    }

    const renderSettingItem = (
        title: string,
        subtitle: string,
        value: string,
        options: { label: string; value: string }[],
        onSelect: (value: string) => void
    ) => (
        <View style={styles.settingItem}>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.settingSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.selectContainer}>
                <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => {
                        Alert.alert(
                            title,
                            'Choose an option:',
                            options.map(option => ({
                                text: option.label,
                                onPress: () => onSelect(option.value)
                            }))
                        )
                    }}
                >
                    <Text style={styles.selectText}>
                        {options.find(opt => opt.value === value)?.label || 'Select'}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#6B6B6B" />
                </TouchableOpacity>
            </View>
        </View>
    )

    const renderActionItem = (
        title: string,
        subtitle: string,
        icon: string,
        onPress: () => void,
        destructive = false
    ) => (
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
            <View style={styles.actionIcon}>
                <Ionicons
                    name={icon as any}
                    size={20}
                    color={destructive ? '#FF3B30' : '#2D8CFF'}
                />
            </View>
            <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, destructive && styles.destructiveText]}>
                    {title}
                </Text>
                <Text style={styles.actionSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
    )

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Preferences</Text>
                    <Text style={styles.headerSubtitle}>Customize your AI assistant experience</Text>
                </View>

                {/* App Settings */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="settings-outline" size={24} color="#2D8CFF" />
                        <Text style={styles.sectionTitle}>App Settings</Text>
                    </View>

                    {renderSettingItem(
                        'Default Model',
                        'Choose your preferred AI model',
                        settings.defaultModel,
                        models,
                        (value) => saveSettings({ ...settings, defaultModel: value })
                    )}

                    {renderSettingItem(
                        'Response Style',
                        'How should the AI respond to you?',
                        settings.responseStyle,
                        responseStyles,
                        (value) => saveSettings({ ...settings, responseStyle: value })
                    )}

                    {renderSettingItem(
                        'Conversation Length',
                        'Preferred length of AI responses',
                        settings.conversationLength,
                        conversationLengths,
                        (value) => saveSettings({ ...settings, conversationLength: value })
                    )}
                </View>

                {/* Privacy & Data */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="shield-checkmark-outline" size={24} color="#2D8CFF" />
                        <Text style={styles.sectionTitle}>Privacy & Data</Text>
                    </View>

                    {renderActionItem(
                        'Clear All Data',
                        'Delete all conversations and user information',
                        'trash-outline',
                        clearAllData,
                        true
                    )}

                    {renderActionItem(
                        'Privacy Policy',
                        'Read our privacy policy',
                        'document-text-outline',
                        openPrivacyPolicy
                    )}

                    {renderActionItem(
                        'Terms of Use',
                        'Read our terms of service',
                        'document-outline',
                        openTermsOfUse
                    )}
                </View>

                {/* App Info */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="information-circle-outline" size={24} color="#2D8CFF" />
                        <Text style={styles.sectionTitle}>App Information</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Version</Text>
                        <Text style={styles.infoValue}>1.0.0</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Build</Text>
                        <Text style={styles.infoValue}>2024.1</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        paddingVertical: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111111',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#6B6B6B',
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111111',
    },
    settingItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111111',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 14,
        fontWeight: '400',
        color: '#6B6B6B',
    },
    selectContainer: {
        marginLeft: 16,
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        gap: 8,
    },
    selectText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111111',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111111',
        marginBottom: 2,
    },
    actionSubtitle: {
        fontSize: 14,
        fontWeight: '400',
        color: '#6B6B6B',
    },
    destructiveText: {
        color: '#FF3B30',
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111111',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '400',
        color: '#6B6B6B',
    },
})