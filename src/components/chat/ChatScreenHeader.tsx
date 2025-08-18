import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../ui';

interface ChatScreenHeaderProps {
  title: string;
  isConnected: boolean;
  onHistoryPress: () => void;
  onNewChatPress: () => void;
  onLogoutPress: () => void;
}

const ChatScreenHeader: React.FC<ChatScreenHeaderProps> = ({
  title,
  isConnected,
  onHistoryPress,
  onNewChatPress,
  onLogoutPress,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.left}>
        <Text style={[styles.title, { color: colors.text, ...typography.h3 }]}>
          {title}
        </Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isConnected ? colors.success : colors.error },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: colors.textSecondary, ...typography.caption },
            ]}
          >
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <TouchableOpacity style={styles.button} onPress={onHistoryPress}>
          <Icon name="history" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onNewChatPress}>
          <Icon name="add" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onLogoutPress}>
          <Icon name="logout" size={24} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  left: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    marginLeft: 8,
  },
});

export default memo(ChatScreenHeader);
