import React, { memo, useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ANIMATION_DURATION } from '../../constants';
import { useTheme } from '../../hooks';
import { RootState } from '../../store';
import { clearMessages } from '../../store/slices/uiSlice';
import { Icon } from '../ui';

interface ToastProps {
  autoHide?: boolean;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ autoHide = true, duration = 4000 }) => {
  const dispatch = useDispatch();
  const { colors, typography, borderRadius } = useTheme();
  const { error, success } = useSelector((state: RootState) => state.ui);

  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const message = error || success;
  const isError = !!error;
  const isVisible = !!message;

  const showToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIMATION_DURATION.NORMAL,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_DURATION.NORMAL,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: ANIMATION_DURATION.FAST,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATION_DURATION.FAST,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(clearMessages());
    });
  }, [translateY, opacity, dispatch]);

  useEffect(() => {
    if (isVisible) {
      showToast();

      if (autoHide) {
        timeoutRef.current = setTimeout(() => {
          hideToast();
        }, duration);
      }
    } else {
      hideToast();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, autoHide, duration, showToast, hideToast]);

  const handlePress = () => {
    hideToast();
  };

  if (!message) {
    return null;
  }

  const backgroundColor = isError ? colors.error : colors.success;
  const iconName = isError ? 'error' : 'check-circle';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          borderRadius: borderRadius.md,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Icon
          name={iconName}
          library="MaterialIcons"
          size={20}
          color={colors.background}
        />
        <Text
          style={[
            styles.message,
            {
              color: colors.background,
              ...typography.body2,
            },
          ]}
          numberOfLines={3}
        >
          {message}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={handlePress}>
          <Icon
            name="close"
            library="MaterialIcons"
            size={16}
            color={colors.background}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  message: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
});

export default memo(Toast);
