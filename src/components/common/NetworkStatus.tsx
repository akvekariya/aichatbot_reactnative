import NetInfo from '@react-native-community/netinfo';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { ANIMATION_DURATION } from '../../constants';
import { useTheme } from '../../hooks';
import { Icon } from '../ui';

const NetworkStatus: React.FC = () => {
  const { colors, typography } = useTheme();
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [showBanner, setShowBanner] = useState(false);
  const translateY = new Animated.Value(-50);

  const showBannerAnimation = useCallback(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: ANIMATION_DURATION.NORMAL,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const hideBannerAnimation = useCallback(() => {
    Animated.timing(translateY, {
      toValue: -50,
      duration: ANIMATION_DURATION.NORMAL,
      useNativeDriver: true,
    }).start(() => {
      setShowBanner(false);
    });
  }, [translateY]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;
      setIsConnected(connected);

      // Show banner when disconnected or when reconnected after being disconnected
      if (
        connected === false ||
        (connected === true && isConnected === false)
      ) {
        setShowBanner(true);
        showBannerAnimation();

        // Auto-hide success banner after 3 seconds
        if (connected === true) {
          setTimeout(() => {
            hideBannerAnimation();
          }, 3000);
        }
      }
    });

    return () => unsubscribe();
  }, [isConnected, showBannerAnimation, hideBannerAnimation]);

  if (!showBanner || isConnected === null) {
    return null;
  }

  const backgroundColor = isConnected ? colors.success : colors.error;
  const iconName = isConnected ? 'wifi' : 'wifi-off';
  const message = isConnected
    ? 'Connection restored'
    : 'No internet connection';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.content}>
        <Icon
          name={iconName}
          library="MaterialIcons"
          size={16}
          color={colors.background}
        />
        <Text
          style={[
            styles.message,
            {
              color: colors.background,
              ...typography.caption,
            },
          ]}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9998,
    elevation: 9,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingTop: 44, // Account for status bar
  },
  message: {
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default memo(NetworkStatus);
