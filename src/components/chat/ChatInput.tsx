import React, { memo, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { APP_CONSTANTS } from '../../constants';
import { useTheme } from '../../hooks';
import { debounce, validateMessage } from '../../utils';
import { Icon } from '../ui';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onTyping,
  disabled = false,
  placeholder = 'Type your message...',
}) => {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Debounced typing indicator
  const debouncedTyping = useRef(
    debounce((isTyping: boolean) => {
      onTyping?.(isTyping);
    }, 300),
  ).current;

  const handleTextChange = (text: string) => {
    setMessage(text);

    // Send typing indicator
    if (text.length > 0) {
      debouncedTyping(true);
    } else {
      debouncedTyping(false);
    }
  };

  const handleSend = () => {
    const trimmedMessage = message.trim();
    const validationError = validateMessage(trimmedMessage);

    if (validationError) {
      // Could show error toast here
      return;
    }

    onSendMessage(trimmedMessage);
    setMessage('');
    debouncedTyping(false);

    // Animate send button
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const canSend = message.trim().length > 0 && !disabled;

  const containerStyle = [
    styles.container,
    {
      backgroundColor: colors.surface,
      borderTopColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
  ];

  const inputContainerStyle = [
    styles.inputContainer,
    {
      backgroundColor: colors.background,
      borderColor: isFocused ? colors.primary : colors.border,
      borderRadius: borderRadius.lg,
    },
  ];

  const inputStyle = [
    styles.input,
    {
      color: colors.text,
      fontSize: typography.body1.fontSize,
      lineHeight: typography.body1.lineHeight,
    },
  ];

  const sendButtonStyle = [
    styles.sendButton,
    {
      backgroundColor: canSend ? colors.primary : colors.border,
      borderRadius: borderRadius.md,
    },
  ];

  return (
    <View style={containerStyle}>
      <View style={inputContainerStyle}>
        <TextInput
          ref={inputRef}
          style={inputStyle}
          value={message}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={APP_CONSTANTS.VALIDATION.MAX_MESSAGE_LENGTH}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            debouncedTyping(false);
          }}
          textAlignVertical="center"
        />

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={sendButtonStyle}
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.7}
          >
            <Icon
              name="send"
              library="MaterialIcons"
              size={20}
              color={canSend ? colors.background : colors.textSecondary}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default memo(ChatInput);
