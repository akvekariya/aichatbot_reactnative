import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import TopicCard from './TopicCard';

interface TopicsSectionProps {
  title: string;
  subtitle: string;
  topics: Array<{
    key: string;
    label: string;
    icon: string;
    description: string;
  }>;
  selectedTopics: string[];
  onTopicToggle: (topicKey: string) => void;
}

const TopicsSection: React.FC<TopicsSectionProps> = ({
  title,
  subtitle,
  topics,
  selectedTopics,
  onTopicToggle,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
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

      <View style={styles.topicsContainer}>
        {topics.map(topic => (
          <TopicCard
            key={topic.key}
            topic={topic}
            isSelected={selectedTopics.includes(topic.key)}
            onPress={onTopicToggle}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  topicsContainer: {
    // Topics will be arranged vertically
  },
});

export default memo(TopicsSection);
