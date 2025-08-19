import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { User } from '../../types';
import { Avatar } from '../ui';

interface UserProfileCardProps {
  user: User;
  showTitle?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  showTitle = true,
}) => {
  const { colors, typography, spacing, borderRadius } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
        },
      ]}
    >
      {showTitle && (
        <Text
          style={[
            styles.title,
            { color: colors.text, ...typography.h3, marginBottom: spacing.md },
          ]}
        >
          Logged in as
        </Text>
      )}

      <View style={styles.userInfo}>
        <Avatar
          name={user.name}
          imageUri={user.picture}
          size="large"
          showBorder
        />

        <View style={styles.userDetails}>
          <Text
            style={[styles.userName, { color: colors.text, ...typography.h3 }]}
          >
            {user.name}
          </Text>
          <Text
            style={[
              styles.userEmail,
              { color: colors.textSecondary, ...typography.body2 },
            ]}
          >
            {user.email}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    lineHeight: 20,
  },
});

export default memo(UserProfileCard);
