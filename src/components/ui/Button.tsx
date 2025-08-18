import React, { memo } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { shadowStyles } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { ButtonProps } from '../../types';
import Icon from './Icon';

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  library = 'MaterialIcons',
}) => {
  const { colors, typography, spacing, borderRadius } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: borderRadius.md,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      ...shadowStyles.small,
    };

    // Size styles
    const sizeStyles = {
      small: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: disabled ? colors.border : colors.primary,
      },
      secondary: {
        backgroundColor: disabled ? colors.border : colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? colors.border : colors.primary,
      },
    };

    return [baseStyle, sizeStyles[size], variantStyles[variant]];
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontWeight: typography.body1.fontWeight,
    };

    // Size text styles
    const sizeTextStyles = {
      small: {
        fontSize: typography.body2.fontSize,
      },
      medium: {
        fontSize: typography.body1.fontSize,
      },
      large: {
        fontSize: typography.h3.fontSize,
      },
    };

    // Variant text styles
    const variantTextStyles = {
      primary: {
        color: disabled ? colors.textSecondary : colors.background,
      },
      secondary: {
        color: disabled ? colors.textSecondary : colors.background,
      },
      outline: {
        color: disabled ? colors.textSecondary : colors.primary,
      },
    };

    return [baseTextStyle, sizeTextStyles[size], variantTextStyles[variant]];
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? colors.primary : colors.background}
        />
      ) : (
        <View style={styles.content}>
          {icon && (
            <View style={styles.icon}>
              <Icon
                name={icon}
                library={library}
                size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                color={
                  variant === 'outline'
                    ? disabled
                      ? colors.textSecondary
                      : colors.primary
                    : disabled
                    ? colors.textSecondary
                    : colors.background
                }
              />
            </View>
          )}
          <Text style={getTextStyle()}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
});

export default memo(Button);
