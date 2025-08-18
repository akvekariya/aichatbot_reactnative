import React, { memo, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Input } from '../../components';
import { ChatHeader, ChatItem, EmptyState } from '../../components/chat';
import { useLoader, useTheme } from '../../hooks';
import { AppDispatch, RootState } from '../../store';
import {
  deleteChat,
  getChatList,
  startNewChat,
  updateChatTitle,
} from '../../store/slices/chatSlice';
import { setSuccess } from '../../store/slices/uiSlice';
import { Chat } from '../../types';

import { APP_CONSTANTS, SUCCESS_MESSAGES } from '../../constants';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { logout } from '../../store/slices/authSlice';
import { RootStackParamList } from '../../types';

type ChatHistoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChatHistory'
>;

interface ChatHistoryScreenProps {
  navigation: ChatHistoryScreenNavigationProp;
}

const ChatHistoryScreen: React.FC<ChatHistoryScreenProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useTheme();

  const { chatList, isLoading, error } = useSelector(
    (state: RootState) => state.chat,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { showLoader, hideLoader } = useLoader();
  useEffect(() => {
    loadChatList();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const loadChatList = async () => {
    try {
      showLoader();
      await dispatch(getChatList({ limit: 50, search: searchQuery }));
      hideLoader();
    } catch (error) {
      console.error('Failed to load chat list:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadChatList();
    setRefreshing(false);
  };

  const handleChatPress = (chat: Chat) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Chat', params: { chatId: chat.id } }],
      }),
    );
  };

  const handleDeleteChat = (chatId: string, chatTitle: string) => {
    Alert.alert(
      'Delete Chat',
      `Are you sure you want to delete "${chatTitle}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteChat(chatId));
              dispatch(setSuccess(SUCCESS_MESSAGES.CHAT_DELETED));
            } catch (error) {
              console.error('Failed to delete chat:', error);
            }
          },
        },
      ],
    );
  };

  const handleEditTitle = (chat: Chat) => {
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveTitle = async () => {
    if (!editingChatId || !editTitle.trim()) {
      return;
    }

    try {
      await dispatch(
        updateChatTitle({
          chatId: editingChatId,
          title: editTitle.trim(),
        }),
      );
      setEditingChatId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Failed to update chat title:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditTitle('');
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
  const handleNewChat = async () => {
    try {
      const result = await dispatch(
        startNewChat({
          topics: [APP_CONSTANTS.TOPICS.HEALTH],
          title: 'New Chat',
        }),
      );

      if (startNewChat.fulfilled.match(result)) {
        navigation.navigate('Chat', { chatId: result.payload.data.id });
      }
    } catch (error) {
      console.error('Failed to start new chat:', error);
    }
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <ChatItem
      item={item}
      isEditing={editingChatId === item.id}
      editTitle={editTitle}
      onPress={handleChatPress}
      onEditTitle={handleEditTitle}
      onDeleteChat={handleDeleteChat}
      onSaveTitle={handleSaveTitle}
      onCancelEdit={handleCancelEdit}
      onEditTitleChange={setEditTitle}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      title="No Chat History"
      subtitle="Start your first conversation to see it here"
      buttonTitle="Start New Chat"
      onButtonPress={handleNewChat}
    />
  );

  const renderHeader = () => (
    <ChatHeader
      title="Chat History"
      onActionPress={handleNewChat}
      actionIcon="add"
      onLogoutPress={handleLogout}
    />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {renderHeader()}

      <View style={styles.searchContainer}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search chats..."
        />
      </View>

      <FlatList
        data={chatList}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
});

export default memo(ChatHistoryScreen);
