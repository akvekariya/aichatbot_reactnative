import React, { memo, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ANIMATION_DURATION } from '../../constants';
import { useLoader } from '../../hooks/useLoader';
import { useTheme } from '../../hooks/useTheme';

interface AppLoaderProps {
  message?: string;
}

const AppLoader: React.FC<AppLoaderProps> = ({ message = 'Loading...' }) => {
  const { colors, typography, spacing } = useTheme();
  const { isLoading } = useLoader();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isLoading) {
      // Fade in and scale up animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION.NORMAL,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out and scale down animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: ANIMATION_DURATION.FAST,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isLoading, fadeAnim, scaleAnim]);

  if (!isLoading) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={isLoading}
      animationType="none"
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: spacing.xl,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.spinner}
          />
          <Text
            style={[
              styles.message,
              {
                color: colors.text,
                fontSize: typography.body1.fontSize,
                fontWeight: typography.body1.fontWeight,
                marginTop: spacing.md,
              },
            ]}
          >
            {message}
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    maxWidth: 200,
  },
  spinner: {
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
  },
});

export default memo(AppLoader);
