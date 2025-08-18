import React, { memo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Message } from '../../types';
import { formatTime } from '../../utils';
import { Icon } from '../ui';

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isTyping = false,
}) => {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const isUser = message.sender === 'user';

  const bubbleStyle = [
    styles.bubble,
    {
      backgroundColor: isUser ? colors.primary : colors.surface,
      borderRadius: borderRadius.md,
      marginLeft: isUser ? spacing.xl : 0,
      marginRight: isUser ? 0 : spacing.xl,
      alignSelf: (isUser ? 'flex-end' : 'flex-start') as
        | 'flex-end'
        | 'flex-start',
      maxWidth: '80%' as const,
    },
  ];

  const textStyle = [
    styles.messageText,
    {
      color: isUser ? colors.background : colors.text,
      ...typography.body1,
    },
  ];

  const timeStyle = [
    styles.timeText,
    {
      color: isUser ? colors.background : colors.textSecondary,
      ...typography.caption,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={bubbleStyle}>
        {/* AI Model indicator */}
        {!isUser && message.aiModel && (
          <View style={styles.aiModelContainer}>
            <Icon
              name="smart-toy"
              library="MaterialIcons"
              size={12}
              color={colors.textSecondary}
            />
            <Text
              style={[
                styles.aiModelText,
                { color: colors.textSecondary, ...typography.caption },
              ]}
            >
              {message.aiModel.toUpperCase()}
            </Text>
          </View>
        )}

        {/* Message content */}
        {isTyping ? (
          <View style={styles.typingContainer}>
            <View style={styles.typingDots}>
              <Animated.View
                style={[styles.dot, { backgroundColor: colors.textSecondary }]}
              />
              <Animated.View
                style={[styles.dot, { backgroundColor: colors.textSecondary }]}
              />
              <Animated.View
                style={[styles.dot, { backgroundColor: colors.textSecondary }]}
              />
            </View>
          </View>
        ) : (
          <>
            <Text style={textStyle}>{message.text}</Text>
            <Text style={timeStyle}>{formatTime(message.timestamp)}</Text>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  bubble: {
    padding: 12,
    minWidth: 60,
  },
  messageText: {
    lineHeight: 20,
    marginBottom: 4,
  },
  timeText: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  aiModelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiModelText: {
    marginLeft: 4,
    fontSize: 10,
    fontWeight: '500',
  },
  typingContainer: {
    paddingVertical: 8,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
});

export default memo(MessageBubble);
