import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_CONSTANTS } from '../../constants';
import { useTheme } from '../../hooks';
import { Chat } from '../../types';
import { formatDate, truncateText } from '../../utils';
import { Icon, Input } from '../ui';

interface ChatItemProps {
  item: Chat;
  isEditing: boolean;
  editTitle: string;
  onPress: (chat: Chat) => void;
  onEditTitle: (chat: Chat) => void;
  onDeleteChat: (chatId: string, chatTitle: string) => void;
  onSaveTitle: () => void;
  onCancelEdit: () => void;
  onEditTitleChange: (title: string) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  item,
  isEditing,
  editTitle,
  onPress,
  onEditTitle,
  onDeleteChat,
  onSaveTitle,
  onCancelEdit,
  onEditTitleChange,
}) => {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.chatItem,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          marginBottom: spacing.sm,
        },
      ]}
      onPress={() => !isEditing && onPress(item)}
      activeOpacity={0.7}
      disabled={isEditing}
    >
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          {isEditing ? (
            <View style={styles.editContainer}>
              <Input
                value={editTitle}
                onChangeText={onEditTitleChange}
                placeholder="Chat title"
                maxLength={APP_CONSTANTS.VALIDATION.MAX_CHAT_TITLE_LENGTH}
              />
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    { backgroundColor: colors.success },
                  ]}
                  onPress={onSaveTitle}
                >
                  <Icon name="check" size={16} color={colors.background} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: colors.error }]}
                  onPress={onCancelEdit}
                >
                  <Icon name="close" size={16} color={colors.background} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text
                style={[
                  styles.chatTitle,
                  { color: colors.text, ...typography.body1 },
                ]}
              >
                {item.title}
              </Text>
              <View style={styles.chatActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onEditTitle(item)}
                >
                  <Icon name="edit" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => onDeleteChat(item.id, item.title)}
                >
                  <Icon name="delete" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {!isEditing && (
          <>
            <View style={styles.chatMeta}>
              <Text
                style={[
                  styles.messageCount,
                  { color: colors.textSecondary, ...typography.caption },
                ]}
              >
                {item.messageCount} messages
              </Text>
              <Text
                style={[
                  styles.chatDate,
                  { color: colors.textSecondary, ...typography.caption },
                ]}
              >
                {formatDate(item.lastMessageAt || item.createdAt)}
              </Text>
            </View>

            {item.lastMessage && (
              <Text
                style={[
                  styles.lastMessage,
                  { color: colors.textSecondary, ...typography.body2 },
                ]}
              >
                {item.lastMessage.sender === 'user' ? 'You: ' : 'AI: '}
                {truncateText(item.lastMessage.text, 100)}
              </Text>
            )}

            <View style={styles.topicsContainer}>
              {item.topics.map(topic => (
                <View
                  key={topic}
                  style={[
                    styles.topicTag,
                    {
                      backgroundColor: colors.primary,
                      borderRadius: borderRadius.sm,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.topicText,
                      { color: colors.background, ...typography.caption },
                    ]}
                  >
                    {topic}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    padding: 16,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chatTitle: {
    flex: 1,
    fontWeight: '600',
  },
  chatActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  editContainer: {
    flex: 1,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  chatMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageCount: {
    fontWeight: '500',
  },
  chatDate: {},
  lastMessage: {
    marginBottom: 12,
    lineHeight: 18,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topicTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  topicText: {
    fontWeight: '500',
  },
});

export default memo(ChatItem);
