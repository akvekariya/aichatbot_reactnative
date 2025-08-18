import React, { memo } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../hooks/useTheme';
import { IconProps } from '../../types';

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  library = 'MaterialIcons',
}) => {
  const { colors } = useTheme();
  const iconColor = color || colors.text;

  if (library === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={name} size={size} color={iconColor} />;
  }

  return <MaterialIcons name={name} size={size} color={iconColor} />;
};

export default memo(Icon);
