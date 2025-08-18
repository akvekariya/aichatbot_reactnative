import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Logo } from '../../assets/images';
import { useTheme } from '../../hooks';

interface LoginHeaderProps {
  title: string;
  subtitle: string;
}

const LoginHeader: React.FC<LoginHeaderProps> = ({ title, subtitle }) => {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={[styles.title, { color: colors.text, ...typography.h1 }]}>
        {title}
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: colors.textSecondary, ...typography.body1 },
        ]}
      >
        {subtitle}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    marginTop: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default memo(LoginHeader);
