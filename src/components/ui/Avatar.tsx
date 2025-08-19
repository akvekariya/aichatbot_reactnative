import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface AvatarProps {
  name: string;
  imageUri?: string;
  size?: 'small' | 'medium' | 'large';
  showBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUri,
  size = 'medium',
  showBorder = false,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 32, height: 32, borderRadius: borderRadius.full };
      case 'large':
        return { width: 80, height: 80, borderRadius: borderRadius.full };
      default:
        return { width: 48, height: 48, borderRadius: borderRadius.full };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return { ...typography.caption, fontSize: 12 };
      case 'large':
        return { ...typography.h3, fontSize: 28 };
      default:
        return { ...typography.body1, fontSize: 18 };
    }
  };

  const containerStyle = [
    styles.container,
    getSizeStyles(),
    {
      backgroundColor: colors.primary,
      borderWidth: showBorder ? 2 : 0,
      borderColor: colors.background,
    },
  ];

  if (imageUri) {
    return (
      <View style={containerStyle}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text style={[styles.initials, getTextSize(), { color: colors.background }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: '600',
  },
});

export default memo(Avatar);
