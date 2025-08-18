import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import React, { memo, useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { FeaturesList, LoginActions, LoginHeader } from '../../components/auth';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants';
import { useLoader, useTheme } from '../../hooks';
import { AppDispatch, RootState } from '../../store';
import { loginWithGoogle } from '../../store/slices/authSlice';
import { setError, setSuccess } from '../../store/slices/uiSlice';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { colors } = useTheme();
  const { showLoader, hideLoader } = useLoader();

  const { isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId:
        '585739500634-ef0cs9g3knsuqudi1d77fi5g94cedu9l.apps.googleusercontent.com',

      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Navigate to profile setup or main app
      navigation.replace('ProfileSetup');
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        'Login Error',
        error + '\n Are you want to login with test data',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: () => {
              testLogin();
            },
          },
        ],
      );
      dispatch(setError(null));
    }
  }, [error, dispatch]);

  const handleGoogleSignIn = async () => {
    try {
      showLoader();

      // Uncomment this for actual Google Sign-In implementation:

      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices();

      // Get user info from Google
      const userInfo = await GoogleSignin.signIn();

      // Get the ID token from the user object
      const idToken = userInfo.data?.idToken;

      if (idToken) {
        // Dispatch login action with ID token
        const result = await dispatch(loginWithGoogle(idToken));

        if (loginWithGoogle.fulfilled.match(result)) {
          dispatch(setSuccess(SUCCESS_MESSAGES.AUTH_SUCCESS));
        }
      } else {
        throw new Error('No ID token received from Google');
      }
    } catch (signInError: any) {
      console.error('Google Sign-In Error:', signInError);

      let errorMessage = ERROR_MESSAGES.AUTH_FAILED;

      if (signInError.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Sign-in was cancelled';
      } else if (signInError.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign-in is already in progress';
      } else if (signInError.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services not available';
      }
      Alert.alert('Login Error', 'Are you want to login with test data', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'yes',
          style: 'destructive',
          onPress: () => {
            testLogin();
          },
        },
      ]);
      dispatch(setError(errorMessage));
    } finally {
      hideLoader();
    }
  };

  const testLogin = async () => {
    // For development/demo purposes, use a mock ID token
    // In production, replace this with actual Google Sign-In implementation
    const mockIdToken = 'TestToken';

    // Dispatch login action with ID token
    const result = await dispatch(loginWithGoogle(mockIdToken));

    if (loginWithGoogle.fulfilled.match(result)) {
      dispatch(setSuccess(SUCCESS_MESSAGES.AUTH_SUCCESS));
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        {/* Header */}
        <LoginHeader
          title="Chat Buddy"
          subtitle="Your intelligent conversation partner"
        />

        {/* Features */}
        <FeaturesList
          features={[
            {
              icon: 'health-and-safety',
              text: 'Health & Education Topics',
            },
            {
              icon: 'chat-bubble-outline',
              text: 'Real-time AI Conversations',
            },
            {
              icon: 'history',
              text: 'Chat History & Management',
            },
          ]}
        />

        {/* Sign In Button */}
        <LoginActions
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
});

export default memo(LoginScreen);
