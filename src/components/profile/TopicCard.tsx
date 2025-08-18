import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../ui';

interface TopicCardProps {
  topic: {
    key: string;
    label: string;
    icon: string;
    description: string;
  };
  isSelected: boolean;
  onPress: (topicKey: string) => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isSelected,
  onPress,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
          borderRadius: borderRadius.md,
        },
      ]}
      onPress={() => onPress(topic.key)}
      activeOpacity={0.7}
    >
      <Icon
        name={topic.icon}
        size={32}
        color={isSelected ? colors.background : colors.primary}
      />
      <Text
        style={[
          styles.label,
          {
            color: isSelected ? colors.background : colors.text,
            ...typography.body1,
          },
        ]}
      >
        {topic.label}
      </Text>
      <Text
        style={[
          styles.description,
          {
            color: isSelected ? colors.background : colors.textSecondary,
            ...typography.caption,
          },
        ]}
      >
        {topic.description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
  },
});

export default memo(TopicCard);
