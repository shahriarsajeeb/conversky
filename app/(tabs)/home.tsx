import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Conversation {
  id: string;
  title: string;
  type: string;
  context: string;
  createdAt: string;
  lastMessage?: string;
}

export default function Home() {
  const [showOnboardingModal, setShowOnboardingModal] = useState(false)
  const [showNewConversationModal, setShowNewConversationModal] = useState(false)
  const [showEditConversationModal, setShowEditConversationModal] = useState(false)
  const [editingConversation, setEditingConversation] = useState<Conversation | null>(null)
  const [userInfo, setUserInfo] = useState<{
    name: string;
    profession: string;
    interests: string;
    goals: string;
  }>({
    name: '',
    profession: '',
    interests: '',
    goals: ''
  });
  const [currentStep, setCurrentStep] = useState(0)
  const [newConversation, setNewConversation] = useState({
    title: '',
    type: '',
    context: ''
  })
  const [conversations, setConversations] = useState<Conversation[]>([])

  const memoryItems = [
    { label: "About Me", status: "✓" },
    { label: "Profession", status: "✓" },
    { label: "Interests", status: "✓" },
    { label: "Goals", status: "✓" }
  ]

  const conversationTypes = [
    { label: "General Chat", value: "general", icon: "chatbubble-outline" },
    { label: "Work & Business", value: "work", icon: "briefcase-outline" },
    { label: "Creative Writing", value: "creative", icon: "create-outline" },
    { label: "Learning & Study", value: "learning", icon: "school-outline" },
    { label: "Problem Solving", value: "problem-solving", icon: "bulb-outline" },
    { label: "Personal", value: "personal", icon: "person-outline" }
  ]

  const defaultContexts = [
    "Help me with general questions and tasks",
    "Assist with work-related projects and communication",
    "Support creative writing and brainstorming",
    "Help with learning new topics and concepts",
    "Guide me through problem-solving processes",
    "Provide personal advice and support"
  ]

  useEffect(() => {
    checkFirstTimeUser()
    loadConversations()
    loadUserInfo()
  }, [])

  const checkFirstTimeUser = async () => {
    try {
      const hasCompletedOnboarding = await SecureStore.getItemAsync('hasCompletedOnboarding')
      if (!hasCompletedOnboarding) {
        setShowOnboardingModal(true)
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
    }
  }

  const loadConversations = async () => {
    try {
      const conversationsJson = await SecureStore.getItemAsync('conversations')
      if (conversationsJson) {
        const loadedConversations: Conversation[] = JSON.parse(conversationsJson)
        setConversations(loadedConversations)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  const loadUserInfo = async () => {
    try {
      const userInfoJson = await SecureStore.getItemAsync('userInfo')
      if (userInfoJson) {
        const loadedUserInfo = JSON.parse(userInfoJson)
        setUserInfo(loadedUserInfo)
      }
    } catch (error) {
      console.error('Error loading user info:', error)
    }
  }

  const formatTimeAgo = (createdAt: string) => {
    const now = new Date()
    const created = new Date(createdAt)
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'Just now'
    } else if (diffInSeconds < 3600) {
      const diffInMinutes = Math.floor(diffInSeconds / 60)
      return `${diffInMinutes}m ago`
    } else if (diffInSeconds < 86400) {
      const diffInHours = Math.floor(diffInSeconds / 3600)
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInSeconds / 86400)
      return `${diffInDays}d ago`
    }
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      saveUserInfo()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const saveUserInfo = async () => {
    try {
      await SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo))
      await SecureStore.setItemAsync('hasCompletedOnboarding', 'true')
      setShowOnboardingModal(false)
      // Update local state to reflect the saved user info
      setUserInfo(userInfo)
      Alert.alert('Welcome!', `Nice to meet you, ${userInfo.name}! Your information has been saved securely.`)
    } catch (error) {
      console.error('Error saving user info:', error)
      Alert.alert('Error', 'Failed to save your information. Please try again.')
    }
  }

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const handleCreateConversation = async () => {
    if (!newConversation.title.trim() || !newConversation.type || !newConversation.context.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields to create a conversation.')
      return
    }

    try {
      const conversation: Conversation = {
        id: generateUniqueId(),
        title: newConversation.title.trim(),
        type: newConversation.type,
        context: newConversation.context.trim(),
        createdAt: new Date().toISOString(),
      }

      // Get existing conversations
      const existingConversationsJson = await SecureStore.getItemAsync('conversations')
      const existingConversations: Conversation[] = existingConversationsJson ? JSON.parse(existingConversationsJson) : []

      // Add new conversation
      const updatedConversations = [conversation, ...existingConversations]

      // Save to secure store
      await SecureStore.setItemAsync('conversations', JSON.stringify(updatedConversations))

      // Update local state
      setConversations(updatedConversations)

      // Reset form and close modal
      setNewConversation({ title: '', type: '', context: '' })
      setShowNewConversationModal(false)

      Alert.alert('Success!', 'New conversation created successfully!')
    } catch (error) {
      console.error('Error creating conversation:', error)
      Alert.alert('Error', 'Failed to create conversation. Please try again.')
    }
  }

  const handleTypeSelect = (type: string) => {
    setNewConversation(prev => ({ 
      ...prev, 
      type,
      context: defaultContexts[conversationTypes.findIndex(t => t.value === type)] || ''
    }))
  }

  const handleEditConversation = (conversation: Conversation) => {
    setEditingConversation(conversation)
    setNewConversation({
      title: conversation.title,
      type: conversation.type,
      context: conversation.context
    })
    setShowEditConversationModal(true)
  }

  const handleDeleteConversation = async (conversationId: string) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedConversations = conversations.filter(conv => conv.id !== conversationId)
              await SecureStore.setItemAsync('conversations', JSON.stringify(updatedConversations))
              setConversations(updatedConversations)
            } catch (error) {
              console.error('Error deleting conversation:', error)
              Alert.alert('Error', 'Failed to delete conversation. Please try again.')
            }
          }
        }
      ]
    )
  }

  const handleUpdateConversation = async () => {
    if (!editingConversation || !newConversation.title.trim() || !newConversation.type || !newConversation.context.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields to update the conversation.')
      return
    }

    try {
      const updatedConversation: Conversation = {
        ...editingConversation,
        title: newConversation.title.trim(),
        type: newConversation.type,
        context: newConversation.context.trim(),
      }

      const updatedConversations = conversations.map(conv => 
        conv.id === editingConversation.id ? updatedConversation : conv
      )

      await SecureStore.setItemAsync('conversations', JSON.stringify(updatedConversations))
      setConversations(updatedConversations)
      setShowEditConversationModal(false)
      setEditingConversation(null)
      setNewConversation({ title: '', type: '', context: '' })

      Alert.alert('Success!', 'Conversation updated successfully!')
    } catch (error) {
      console.error('Error updating conversation:', error)
      Alert.alert('Error', 'Failed to update conversation. Please try again.')
    }
  }

  const onboardingSteps = [
    {
      title: "What's your name?",
      subtitle: "I'd love to know what to call you",
      placeholder: "Enter your name",
      key: 'name'
    },
    {
      title: "What do you do?",
      subtitle: "Your profession helps me provide better assistance",
      placeholder: "e.g., Developer, Designer, Manager",
      key: 'profession'
    },
    {
      title: "What interests you?",
      subtitle: "This helps me understand your context better",
      placeholder: "e.g., Technology, Design, Business, Science",
      key: 'interests'
    },
    {
      title: "What are your goals?",
      subtitle: "How can I help you achieve them?",
      placeholder: "e.g., Improve productivity, Learn new skills",
      key: 'goals'
    }
  ]

  const getTime = () => {
    const hours = new Date().getHours()
    if (hours < 12) {
      return "Morning"
    } else if (hours < 18) {
      return "Afternoon"
    } else {
      return "Evening"
    }
  }

  const currentStepData = onboardingSteps[currentStep]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Conversky</Text>
          <Text style={styles.headerSubtitle}>Good {getTime()} {userInfo.name || "there"} 👋</Text>
        </View>

        {/* Primary Button */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => setShowNewConversationModal(true)}
        >
          <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>New Conversation</Text>
        </TouchableOpacity>



        {/* Memory Card */}
        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>My Memory</Text>
            <Text style={styles.cardSubtitle}>Stored securely on this device</Text>
            <View style={styles.memoryItems}>
              {memoryItems.map((item, index) => (
                <View key={index} style={styles.memoryItem}>
                  <Text style={styles.memoryStatus}>{item.status}</Text>
                  <Text style={styles.memoryLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Recent Conversations */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recent Conversations</Text>
          {conversations.length > 0 ? (
            <View style={styles.conversationsList}>
              {conversations.slice(0, 3).map((conversation) => (
                <TouchableOpacity 
                  key={conversation.id} 
                  style={styles.conversationItem}
                  onPress={() => router.push(`/conversation/${conversation.id}`)}
                  onLongPress={() => {
                    Alert.alert(
                      conversation.title,
                      'What would you like to do?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Edit', 
                          onPress: () => handleEditConversation(conversation)
                        },
                        { 
                          text: 'Delete', 
                          style: 'destructive',
                          onPress: () => handleDeleteConversation(conversation.id)
                        }
                      ]
                    )
                  }}
                >
                  <View style={styles.conversationContent}>
                    <Text style={styles.conversationTitle}>{conversation.title}</Text>
                    <Text style={styles.conversationPreview}>
                      {conversation.context.length > 50 
                        ? `${conversation.context.substring(0, 50)}...` 
                        : conversation.context
                      }
                    </Text>
                  </View>
                  <Text style={styles.conversationTime}>{formatTimeAgo(conversation.createdAt)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-outline" size={48} color="#E5E5E7" />
              <Text style={styles.emptyStateTitle}>No conversations yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                Start your first conversation to begin chatting with your AI assistant
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setShowNewConversationModal(true)}
              >
                <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.emptyStateButtonText}>Create First Conversation</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* New Conversation Modal */}
      <Modal
        visible={showNewConversationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowNewConversationModal(false)
                  setNewConversation({ title: '', type: '', context: '' })
                }}
              >
                <Ionicons name="close" size={24} color="#6B6B6B" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Conversation</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Title Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Conversation Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter a title for your conversation"
                  placeholderTextColor="#6B6B6B"
                  value={newConversation.title}
                  onChangeText={(text) => setNewConversation(prev => ({ ...prev, title: text }))}
                />
              </View>

              {/* Type Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Conversation Type</Text>
                <View style={styles.typeGrid}>
                  {conversationTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeOption,
                        newConversation.type === type.value && styles.typeOptionSelected
                      ]}
                      onPress={() => handleTypeSelect(type.value)}
                    >
                      <Ionicons 
                        name={type.icon as any} 
                        size={20} 
                        color={newConversation.type === type.value ? '#FFFFFF' : '#6B6B6B'} 
                      />
                      <Text style={[
                        styles.typeOptionText,
                        newConversation.type === type.value && styles.typeOptionTextSelected
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Context Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Conversation Context</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe what you want to discuss or achieve"
                  placeholderTextColor="#6B6B6B"
                  value={newConversation.context}
                  onChangeText={(text) => setNewConversation(prev => ({ ...prev, context: text }))}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Create Button */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  (!newConversation.title.trim() || !newConversation.type || !newConversation.context.trim()) && 
                  styles.createButtonDisabled
                ]}
                onPress={handleCreateConversation}
                disabled={!newConversation.title.trim() || !newConversation.type || !newConversation.context.trim()}
              >
                <Text style={styles.createButtonText}>Create Conversation</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Conversation Modal */}
      <Modal
        visible={showEditConversationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  setShowEditConversationModal(false)
                  setEditingConversation(null)
                  setNewConversation({ title: '', type: '', context: '' })
                }}
              >
                <Ionicons name="close" size={24} color="#6B6B6B" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Edit Conversation</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              {/* Title Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Conversation Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter a title for your conversation"
                  placeholderTextColor="#6B6B6B"
                  value={newConversation.title}
                  onChangeText={(text) => setNewConversation(prev => ({ ...prev, title: text }))}
                />
              </View>

              {/* Type Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Conversation Type</Text>
                <View style={styles.typeGrid}>
                  {conversationTypes.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeOption,
                        newConversation.type === type.value && styles.typeOptionSelected
                      ]}
                      onPress={() => handleTypeSelect(type.value)}
                    >
                      <Ionicons 
                        name={type.icon as any} 
                        size={20} 
                        color={newConversation.type === type.value ? '#FFFFFF' : '#6B6B6B'} 
                      />
                      <Text style={[
                        styles.typeOptionText,
                        newConversation.type === type.value && styles.typeOptionTextSelected
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Context Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Conversation Context</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe what you want to discuss or achieve"
                  placeholderTextColor="#6B6B6B"
                  value={newConversation.context}
                  onChangeText={(text) => setNewConversation(prev => ({ ...prev, context: text }))}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Update Button */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  (!newConversation.title.trim() || !newConversation.type || !newConversation.context.trim()) && 
                  styles.createButtonDisabled
                ]}
                onPress={handleUpdateConversation}
                disabled={!newConversation.title.trim() || !newConversation.type || !newConversation.context.trim()}
              >
                <Text style={styles.createButtonText}>Update Conversation</Text>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Onboarding Modal */}
      <Modal
        visible={showOnboardingModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{currentStep + 1} of {onboardingSteps.length}</Text>
            </View>

            {/* Step Content */}
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{currentStepData.title}</Text>
              <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>

              <TextInput
                style={styles.input}
                placeholder={currentStepData.placeholder}
                placeholderTextColor="#6B6B6B"
                value={userInfo[currentStepData.key as keyof typeof userInfo]}
                onChangeText={(text) => setUserInfo(prev => ({ ...prev, [currentStepData.key]: text }))}
                multiline={currentStepData.key === 'interests' || currentStepData.key === 'goals'}
                numberOfLines={currentStepData.key === 'interests' || currentStepData.key === 'goals' ? 3 : 1}
              />
            </View>

            {/* Navigation Buttons */}
            <View style={styles.modalButtons}>
              {currentStep > 0 && (
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !userInfo[currentStepData.key as keyof typeof userInfo] && styles.nextButtonDisabled
                ]}
                onPress={handleNext}
                disabled={!userInfo[currentStepData.key as keyof typeof userInfo]}
              >
                <Text style={styles.nextButtonText}>
                  {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                </Text>
                <Ionicons
                  name={currentStep === onboardingSteps.length - 1 ? "checkmark" : "arrow-forward"}
                  size={20}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111111',
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B6B6B',
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: '#2D8CFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#2D8CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111111',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111111',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6B6B6B',
    marginBottom: 16,
  },
  memoryItems: {
    gap: 12,
  },
  memoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memoryStatus: {
    fontSize: 16,
    color: '#2D8CFF',
    marginRight: 12,
    fontWeight: '500',
  },
  memoryLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: '#111111',
  },
  conversationsList: {
    gap: 12,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F9F9FB',
    borderRadius: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
    marginBottom: 2,
  },
  conversationPreview: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B6B6B',
  },
  conversationTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B6B6B',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111111',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#2D8CFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#2D8CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  closeButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
  },
  formContainer: {
    flex: 1,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: '400',
    color: '#111111',
    backgroundColor: '#F9F9FB',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    backgroundColor: '#F9F9FB',
    gap: 6,
  },
  typeOptionSelected: {
    backgroundColor: '#2D8CFF',
    borderColor: '#2D8CFF',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B6B6B',
  },
  typeOptionTextSelected: {
    color: '#FFFFFF',
  },
  modalButtons: {
    paddingVertical: 20,
  },
  createButton: {
    backgroundColor: '#2D8CFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#2D8CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  createButtonDisabled: {
    backgroundColor: '#E5E5E7',
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  // Onboarding Modal Styles
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E5E7',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2D8CFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B6B6B',
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B6B6B',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B6B6B',
  },
  nextButton: {
    backgroundColor: '#2D8CFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#2D8CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E5E7',
    shadowOpacity: 0,
    elevation: 0,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
})
