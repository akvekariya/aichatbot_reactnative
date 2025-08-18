import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks';
import { Button } from '../ui';

interface LoginActionsProps {
  onGoogleSignIn: () => void;
  isLoading: boolean;
  disclaimerText?: string;
}

const LoginActions: React.FC<LoginActionsProps> = ({
  onGoogleSignIn,
  isLoading,
  disclaimerText = 'By signing in, you agree to our Terms of Service and Privacy Policy',
}) => {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.container}>
      <Button
        title="Sign in with Google"
        onPress={onGoogleSignIn}
        variant="primary"
        size="large"
        icon="google"
        library="MaterialCommunityIcons"
        loading={isLoading}
        disabled={isLoading}
      />

      <Text
        style={[
          styles.disclaimer,
          { color: colors.textSecondary, ...typography.caption },
        ]}
      >
        {disclaimerText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
});

export default memo(LoginActions);
