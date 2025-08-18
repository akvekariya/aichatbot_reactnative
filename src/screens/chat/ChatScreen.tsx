import React, { memo, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChatEmptyState,
  ChatInput,
  ChatScreenHeader,
  MessageBubble,
  TypingIndicator,
} from '../../components/chat';
import { APP_CONSTANTS, SUCCESS_MESSAGES } from '../../constants';
import { useLoader, useSocket, useTheme } from '../../hooks';
import { AppDispatch, RootState } from '../../store';
import {
  clearCurrentChat,
  setTyping,
  startNewChat,
} from '../../store/slices/chatSlice';
import { setError, setSuccess } from '../../store/slices/uiSlice';
import { Message } from '../../types';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logout } from '../../store/slices/authSlice';
import { RootStackParamList } from '../../types';

type ChatScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Chat'
>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface ChatScreenProps {
  navigation: ChatScreenNavigationProp;
  route?: ChatScreenRouteProp;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { showLoader, hideLoader } = useLoader();

  const { currentChat, isLoading, isAiThinking, error } = useSelector(
    (state: RootState) => state.chat,
  );

  const {
    joinChat,
    isConnected,
    leaveChat,
    sendMessage,
    sendTyping,
    loadHistory,
  } = useSocket();

  // Initialize chat
  useEffect(() => {
    if (isConnected) {
      const chatId = route?.params?.chatId;
      if (chatId) {
        // Load existing chat
        joinChat(chatId);
        loadHistory(chatId);
      } else if (!currentChat && !isInitialized) {
        // Start new chat
        handleStartNewChat();
      }
      hideLoader();
      setIsInitialized(true);
    } else {
      showLoader();
    }
  }, [route?.params?.chatId, isConnected, currentChat?.id]);

  // Handle socket connection
  useEffect(() => {
    if (currentChat?.id && isConnected) {
      joinChat(currentChat.id);
    }

    return () => {
      if (currentChat?.id) {
        leaveChat(currentChat.id);
      }
    };
  }, [currentChat?.id, isConnected]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (currentChat?.messages.length) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentChat?.messages.length]);

  // Handle errors
  useEffect(() => {
    if (error) {
      Alert.alert('Chat Error', error);
    }
  }, [error]);

  const handleStartNewChat = async () => {
    try {
      const result = await dispatch(
        startNewChat({
          topics: [APP_CONSTANTS.TOPICS.HEALTH], // Default topic
          title: 'New Chat',
        }),
      );

      if (startNewChat.fulfilled.match(result)) {
        dispatch(setSuccess(SUCCESS_MESSAGES.CHAT_CREATED));
      }
    } catch (error) {
      console.error('Failed to start new chat:', error);
    }
  };
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => onLogout(),
      },
    ]);
  };

  const onLogout = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.log('error:', error);
    } finally {
      dispatch(logout());
      dispatch(setSuccess('Logged out successfully'));
    }
  };

  const handleSendMessage = (messageText: string) => {
    if (!currentChat?.id || !isConnected) {
      dispatch(setError('Not connected to chat. Please try again.'));
      return;
    }

    // Send via socket
    sendMessage({
      text: messageText,
      chatId: currentChat.id,
    });
  };

  const handleTyping = (typing: boolean) => {
    if (currentChat?.id && isConnected) {
      sendTyping({
        chatId: currentChat.id,
        isTyping: typing,
      });
      dispatch(setTyping(typing));
    }
  };

  const handleNewChat = () => {
    Alert.alert('New Chat', 'Start a new conversation?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Start New Chat',
        onPress: () => {
          dispatch(clearCurrentChat());
          handleStartNewChat();
        },
      },
    ]);
  };

  const handleChatHistory = () => {
    navigation.navigate('ChatHistory');
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} />
  );

  const renderTypingIndicator = () => (
    <TypingIndicator isVisible={isAiThinking} />
  );

  const renderEmptyState = () => <ChatEmptyState />;

  const renderHeader = () => (
    <ChatScreenHeader
      title={currentChat?.title || 'AI Chat'}
      isConnected={isConnected}
      onHistoryPress={handleChatHistory}
      onNewChatPress={handleNewChat}
      onLogoutPress={handleLogout}
    />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {renderHeader()}

      <View style={styles.chatContainer}>
        {currentChat?.messages.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            ref={flatListRef}
            data={currentChat?.messages || []}
            renderItem={renderMessage}
            keyExtractor={item => item.messageId}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderTypingIndicator}
          />
        )}
      </View>

      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        disabled={!isConnected || isLoading}
        placeholder={isConnected ? 'Type your message...' : 'Connecting...'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
  },
});

export default memo(ChatScreen);
