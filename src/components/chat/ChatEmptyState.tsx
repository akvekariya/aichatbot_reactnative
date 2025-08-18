import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../ui';

interface ChatEmptyStateProps {
  title?: string;
  subtitle?: string;
  iconName?: string;
  iconLibrary?: 'MaterialIcons' | 'MaterialCommunityIcons';
}

const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  title = 'Start a Conversation',
  subtitle = 'Ask me anything about health or education topics!',
  iconName = 'chat-bubble-outline',
  iconLibrary = 'MaterialIcons',
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Icon
        name={iconName}
        library={iconLibrary}
        size={64}
        color={colors.textSecondary}
      />
      <Text style={[styles.title, { color: colors.text, ...typography.h3 }]}>
        {title}
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary, ...typography.body2 },
        ]}
      >
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default memo(ChatEmptyState);
