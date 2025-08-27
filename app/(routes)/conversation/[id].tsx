import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { router, useLocalSearchParams } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Conversation {
  id: string;
  title: string;
  type: string;
  context: string;
  createdAt: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [appSettings, setAppSettings] = useState({
    defaultModel: 'gpt-3.5-turbo',
    responseStyle: 'Friendly',
    conversationLength: 'Medium'
  })

  useEffect(() => {
    if (id) {
      loadConversation()
      checkApiKey()
      loadAppSettings()
    }
  }, [id])

  const loadConversation = async () => {
    try {
      const conversationsJson = await SecureStore.getItemAsync('conversations')
      if (conversationsJson) {
        const conversations: Conversation[] = JSON.parse(conversationsJson)
        const foundConversation = conversations.find(conv => conv.id === id)
        if (foundConversation) {
          setConversation(foundConversation)
          // Initialize messages after conversation is loaded
          initializeMessages(foundConversation)
        } else {
          Alert.alert('Error', 'Conversation not found')
          router.back()
        }
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const checkApiKey = async () => {
    try {
      const savedApiKey = await SecureStore.getItemAsync('openai_api_key')
      if (!savedApiKey) {
        setShowApiKeyModal(true)
      } else {
        setApiKey(savedApiKey)
      }
    } catch (error) {
      console.error('Error checking API key:', error)
      setShowApiKeyModal(true)
    }
  }

  const loadAppSettings = async () => {
    try {
      const savedSettings = await SecureStore.getItemAsync('app_settings')
      if (savedSettings) {
        setAppSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error('Error loading app settings:', error)
    }
  }

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter your OpenAI API key')
      return
    }

    try {
      await SecureStore.setItemAsync('openai_api_key', apiKey.trim())
      setShowApiKeyModal(false)
      Alert.alert('Success', 'API key saved successfully!')
    } catch (error) {
      console.error('Error saving API key:', error)
      Alert.alert('Error', 'Failed to save API key. Please try again.')
    }
  }

  const initializeMessages = (conversationData: Conversation) => {
    // Create initial AI message
    const initialMessage: Message = {
      id: Date.now().toString(),
      text: `Hi! I'm here to help you with "${conversationData.title}". How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
    setMessages([initialMessage])
  }

  const callOpenAI = async (userMessage: string) => {
    try {
      if (!apiKey) {
        throw new Error('API key not found. Please add your OpenAI API key.')
      }

      // Build system message based on app settings
      let systemMessage = `You are a helpful AI assistant. Context: ${conversation?.context}`
      
      // Add response style instruction
      switch (appSettings.responseStyle) {
        case 'Friendly':
          systemMessage += '\n\nPlease respond in a friendly, warm, and approachable manner.'
          break
        case 'Concise':
          systemMessage += '\n\nPlease provide concise, to-the-point responses.'
          break
        case 'Detailed':
          systemMessage += '\n\nPlease provide detailed, comprehensive responses with explanations.'
          break
      }

      // Add conversation length instruction
      switch (appSettings.conversationLength) {
        case 'Short':
          systemMessage += '\n\nKeep your responses brief and focused.'
          break
        case 'Medium':
          systemMessage += '\n\nProvide balanced responses with moderate detail.'
          break
        case 'Long':
          systemMessage += '\n\nProvide thorough, detailed responses with comprehensive explanations.'
          break
      }

      // Determine max tokens based on conversation length
      let maxTokens = 500
      switch (appSettings.conversationLength) {
        case 'Short':
          maxTokens = 200
          break
        case 'Medium':
          maxTokens = 500
          break
        case 'Long':
          maxTokens = 1000
          break
      }
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: appSettings.defaultModel,
          messages: [
            {
              role: 'system',
              content: systemMessage
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0]) {
        return data.choices[0].message.content
      } else {
        throw new Error('No response from OpenAI')
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      if (error instanceof Error && error.message === 'API key not found. Please add your OpenAI API key.') {
        setShowApiKeyModal(true)
        return 'Please add your OpenAI API key to continue.'
      }
      return 'Sorry, I encountered an error. Please try again.'
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setNewMessage('')
    setIsLoading(true)

    try {
      const aiResponse = await callOpenAI(newMessage.trim())
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString()
      }

      const finalMessages = [...updatedMessages, aiMessage]
      setMessages(finalMessages)
    } catch (error) {
      console.error('Error getting AI response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyMessage = async (text: string, messageId: string) => {
    try {
      await Clipboard.setStringAsync(text)
      setCopiedMessageId(messageId)
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null)
      }, 2000)
    } catch (error) {
      console.error('Error copying message:', error)
    }
  }

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      <TouchableOpacity
        style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userBubble : styles.aiBubble
        ]}
        onLongPress={() => copyMessage(item.text, item.id)}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userMessageText : styles.aiMessageText
        ]}>
          {item.text}
        </Text>
        {copiedMessageId === item.id && (
          <View style={styles.copyIndicator}>
            <Ionicons name="checkmark-circle" size={16} color="#2D8CFF" />
            <Text style={styles.copyText}>Copied</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  )

  if (!conversation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111111" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{conversation.title}</Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.messagesContainer} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Loading indicator */}
        {isLoading && (
          <View style={styles.loadingMessage}>
            <Text style={styles.loadingText}>AI is typing...</Text>
          </View>
        )}
      </KeyboardAvoidingView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#6B6B6B"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!newMessage.trim() || isLoading) && styles.sendButtonDisabled
          ]}
          onPress={sendMessage}
          disabled={!newMessage.trim() || isLoading}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={newMessage.trim() && !isLoading ? '#FFFFFF' : '#6B6B6B'} 
          />
        </TouchableOpacity>
      </View>

      {/* API Key Modal */}
      <Modal
        visible={showApiKeyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>OpenAI API Key</Text>
            </View>

            {/* Content */}
            <View style={styles.modalBody}>
              <Text style={styles.modalSubtitle}>
                To use this AI assistant, you need to provide your OpenAI API key.
              </Text>
              
              <Text style={styles.modalInstructions}>
                1. Go to{' '}
                <Text style={styles.link}>https://platform.openai.com/api-keys</Text>
                {'\n'}
                2. Create a new API key or copy an existing one
                {'\n'}
                3. Paste it below
              </Text>

              <TextInput
                style={styles.apiKeyInput}
                placeholder="sk-..."
                placeholderTextColor="#6B6B6B"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.modalNote}>
                Your API key is stored securely on this device and is never shared.
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.saveApiKeyButton,
                  !apiKey.trim() && styles.saveApiKeyButtonDisabled
                ]}
                onPress={saveApiKey}
                disabled={!apiKey.trim()}
              >
                <Text style={styles.saveApiKeyButtonText}>Save API Key</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B6B6B',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111111',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#2D8CFF',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#F9F9FB',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#111111',
  },
  loadingMessage: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#F9F9FB',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D8CFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5E7',
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
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111111',
  },
  modalBody: {
    flex: 1,
    paddingTop: 24,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#111111',
    marginBottom: 16,
    lineHeight: 24,
  },
  modalInstructions: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B6B6B',
    marginBottom: 24,
    lineHeight: 20,
  },
  link: {
    color: '#2D8CFF',
    textDecorationLine: 'underline',
  },
  apiKeyInput: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: '400',
    color: '#111111',
    backgroundColor: '#F9F9FB',
    marginBottom: 16,
  },
  modalNote: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B6B6B',
    fontStyle: 'italic',
  },
  modalButtons: {
    paddingVertical: 20,
  },
  saveApiKeyButton: {
    backgroundColor: '#2D8CFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#2D8CFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  saveApiKeyButtonDisabled: {
    backgroundColor: '#E5E5E7',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveApiKeyButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  copyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  copyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2D8CFF',
  },
})