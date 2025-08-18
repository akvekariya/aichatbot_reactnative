import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../hooks';
import { RootState } from '../store';
import { RootStackParamList } from '../types';

// Import screens
import { LoginScreen, ProfileSetupScreen } from '../screens/auth';
import { ChatHistoryScreen, ChatScreen } from '../screens/chat';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { isAuthenticated, profile } = useSelector(
    (state: RootState) => state.auth,
  );

  const screenOptions = {
    headerStyle: {
      backgroundColor: colors.surface,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontWeight: '600' as const,
    },
    headerShadowVisible: false,
    headerShown: false,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName={
          isAuthenticated ? (profile ? 'Chat' : 'ProfileSetup') : 'Login'
        }
      >
        {!isAuthenticated ? (
          // Auth Stack
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : !profile ? (
          // Profile Setup Stack
          <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        ) : (
          // Main App Stack
          <>
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="ChatHistory" component={ChatHistoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(AppNavigator);
