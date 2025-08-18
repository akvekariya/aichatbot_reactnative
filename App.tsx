/**
 * AI Chatbot React Native App
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  AppLoader,
  ErrorBoundary,
  NetworkStatus,
  Toast,
} from './src/components/common';
import { useTheme } from './src/hooks';
import AppNavigator from './src/navigation/AppNavigator';
import { persistor, store } from './src/store';

// App Content Component
const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <NetworkStatus />
      <AppNavigator />
      <AppLoader />
      <Toast />
    </>
  );
};

// Main App Component
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
