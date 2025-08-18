import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../ui';

interface ChatHeaderProps {
  title: string;
  onActionPress?: () => void;
  actionIcon?: string;
  actionIconLibrary?: 'MaterialIcons' | 'MaterialCommunityIcons';
  showAction?: boolean;
  onLogoutPress: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  onActionPress,
  actionIcon = 'add',
  actionIconLibrary = 'MaterialIcons',
  showAction = true,
  onLogoutPress,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text, ...typography.h2 }]}>
        {title}
      </Text>
      <View style={styles.right}>
        {showAction && onActionPress && (
          <TouchableOpacity style={styles.actionButton} onPress={onActionPress}>
            <Icon
              name={actionIcon}
              library={actionIconLibrary}
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionButton} onPress={onLogoutPress}>
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
    paddingVertical: 16,
  },
  title: {
    fontWeight: '600',
  },
  actionButton: {
    padding: 8,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default memo(ChatHeader);
