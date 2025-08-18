import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Button, Icon } from '../ui';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  buttonTitle: string;
  onButtonPress: () => void;
  iconName?: string;
  iconLibrary?: 'MaterialIcons' | 'MaterialCommunityIcons';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  buttonTitle,
  onButtonPress,
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
      <Button
        title={buttonTitle}
        onPress={onButtonPress}
        variant="primary"
        size="medium"
        icon="add"
      />
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
    marginBottom: 24,
    lineHeight: 20,
  },
});

export default memo(EmptyState);
