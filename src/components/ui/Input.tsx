import React, { memo, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { InputProps } from '../../types';
import Icon from './Icon';

const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  keyboardType = 'default',
  secureTextEntry = false,
  error,
  label,
  disabled = false,
}) => {
  const { colors, typography, spacing, borderRadius } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const containerStyle = [
    styles.container,
    {
      borderColor: error
        ? colors.error
        : isFocused
        ? colors.primary
        : colors.border,
      backgroundColor: disabled ? colors.surface : colors.background,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: multiline ? spacing.md : spacing.sm,
    },
  ];

  const inputStyle = [
    styles.input,
    {
      color: disabled ? colors.textSecondary : colors.text,
      fontSize: typography.body1.fontSize,
      lineHeight: typography.body1.lineHeight,
      minHeight: multiline ? numberOfLines * 20 : undefined,
    },
  ];

  const labelStyle = [
    styles.label,
    {
      color: colors.text,
      fontSize: typography.body2.fontSize,
      fontWeight: typography.body2.fontWeight,
      marginBottom: spacing.xs,
    },
  ];

  const errorStyle = [
    styles.error,
    {
      color: colors.error,
      fontSize: typography.caption.fontSize,
      marginTop: spacing.xs,
    },
  ];

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.wrapper}>
      {label && <Text style={labelStyle}>{label}</Text>}

      <View style={containerStyle}>
        <TextInput
          style={inputStyle}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
          >
            <Icon
              name={isPasswordVisible ? 'visibility-off' : 'visibility'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={errorStyle}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  container: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
  },
  label: {
    fontWeight: '500',
  },
  error: {
    fontWeight: '400',
  },
  passwordToggle: {
    padding: 4,
    marginLeft: 8,
  },
});

export default memo(Input);
