import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Icon } from '../ui';

interface Feature {
  icon: string;
  text: string;
  library?: 'MaterialIcons' | 'MaterialCommunityIcons';
}

interface FeaturesListProps {
  features: Feature[];
}

const FeaturesList: React.FC<FeaturesListProps> = ({ features }) => {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      {features.map((feature, index) => (
        <View key={index} style={styles.feature}>
          <Icon
            name={feature.icon}
            library={feature.library || 'MaterialIcons'}
            size={24}
            color={colors.primary}
          />
          <Text
            style={[
              styles.featureText,
              { color: colors.text, ...typography.body2 },
            ]}
          >
            {feature.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
});

export default memo(FeaturesList);
