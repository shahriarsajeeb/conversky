import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Conversation {
  id: string;
  title: string;
  type: string;
  context: string;
  createdAt: string;
}

export default function Conversations() {
  const [searchQuery, setSearchQuery] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const conversationsJson = await SecureStore.getItemAsync('conversations')
      if (conversationsJson) {
        const loadedConversations: Conversation[] = JSON.parse(conversationsJson)
        setConversations(loadedConversations)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
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

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'general':
        return 'chatbubble-outline'
      case 'work':
        return 'briefcase-outline'
      case 'creative':
        return 'create-outline'
      case 'learning':
        return 'school-outline'
      case 'problem-solving':
        return 'bulb-outline'
      case 'personal':
        return 'person-outline'
      default:
        return 'chatbubble-outline'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'general':
        return '#2D8CFF'
      case 'work':
        return '#FF9500'
      case 'creative':
        return '#AF52DE'
      case 'learning':
        return '#34C759'
      case 'problem-solving':
        return '#FF3B30'
      case 'personal':
        return '#5856D6'
      default:
        return '#2D8CFF'
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conversations</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/')}
          >
            <Ionicons name="add-circle-outline" size={24} color="#2D8CFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color="#6B6B6B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#6B6B6B"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color="#6B6B6B" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          /* Loading State */
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Loading conversations...</Text>
          </View>
        ) : filteredConversations.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-outline" size={64} color="#E5E5E7" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </Text>
            <Text style={styles.emptyStateSubtitle}>
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Start your first conversation from the Home tab'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => router.push('/')}
              >
                <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.emptyStateButtonText}>Create Conversation</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* Conversations List */
          <View style={styles.conversationsList}>
            {filteredConversations.map((conversation) => (
              <TouchableOpacity 
                key={conversation.id} 
                style={styles.conversationItem}
                onPress={() => router.push(`/conversation/${conversation.id}`)}
                onLongPress={() => handleDeleteConversation(conversation.id)}
              >
                <View style={styles.conversationIcon}>
                  <Ionicons 
                    name={getTypeIcon(conversation.type) as any} 
                    size={20} 
                    color={getTypeColor(conversation.type)} 
                  />
                </View>
                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.conversationTitle}>{conversation.title}</Text>
                    <Text style={styles.conversationTime}>
                      {formatTimeAgo(conversation.createdAt)}
                    </Text>
                  </View>
                  <Text style={styles.conversationPreview}>
                    {conversation.context.length > 80 
                      ? `${conversation.context.substring(0, 80)}...` 
                      : conversation.context
                    }
                  </Text>
                  <View style={styles.badgesContainer}>
                    <View style={[styles.badge, { backgroundColor: getTypeColor(conversation.type) + '20' }]}>
                      <Text style={[styles.badgeText, { color: getTypeColor(conversation.type) }]}>
                        {conversation.type.charAt(0).toUpperCase() + conversation.type.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111111',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9F9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#111111',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  conversationsList: {
    gap: 12,
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  conversationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111111',
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B6B6B',
  },
  conversationPreview: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B6B6B',
    marginBottom: 8,
    lineHeight: 20,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
  },
})