import { Alert, AlertButton } from 'react-native';
import { ERROR_MESSAGES } from '../constants';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import { setError } from '../store/slices/uiSlice';
import { getErrorMessage, isNetworkError } from '../utils';

export interface ErrorContext {
  action?: string;
  screen?: string;
  userId?: string;
  additionalInfo?: Record<string, any>;
}

class ErrorService {
  // Handle API errors
  handleApiError(error: any, context?: ErrorContext) {
    const errorMessage = getErrorMessage(error);

    // Log error for debugging
    this.logError(error, context);

    // Handle specific error types
    if (error?.response?.status === 401) {
      this.handleAuthError();
      return;
    }

    if (error?.response?.status === 403) {
      this.handleForbiddenError();
      return;
    }

    if (error?.response?.status >= 500) {
      this.handleServerError(errorMessage);
      return;
    }

    if (isNetworkError(error)) {
      this.handleNetworkError();
      return;
    }

    // Default error handling
    this.showError(errorMessage);
  }

  // Handle authentication errors
  private handleAuthError() {
    store.dispatch(logout());
    this.showError(ERROR_MESSAGES.INVALID_TOKEN);
  }

  // Handle forbidden errors
  private handleForbiddenError() {
    this.showError(
      "Access denied. You don't have permission to perform this action.",
    );
  }

  // Handle server errors
  private handleServerError(message: string) {
    this.showError(`Server error: ${message}`);
  }

  // Handle network errors
  private handleNetworkError() {
    this.showError(ERROR_MESSAGES.NETWORK_ERROR);
  }

  // Show error to user
  private showError(message: string) {
    store.dispatch(setError(message));
  }

  // Show critical error with alert
  showCriticalError(title: string, message: string, onRetry?: () => void) {
    const buttons: AlertButton[] = [{ text: 'OK' }];

    if (onRetry) {
      buttons.unshift({
        text: 'Retry',
        onPress: onRetry,
      });
    }

    Alert.alert(title, message, buttons);
  }

  // Log error for debugging and analytics
  private logError(error: any, context?: ErrorContext) {
    const errorInfo = {
      message: getErrorMessage(error),
      stack: error?.stack,
      status: error?.response?.status,
      url: error?.config?.url,
      method: error?.config?.method,
      timestamp: new Date().toISOString(),
      context,
    };

    console.error('Error logged:', errorInfo);

    // In production, you might want to send this to a logging service
    // like Sentry, Bugsnag, or Firebase Crashlytics
    if (!__DEV__) {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  // Handle React component errors
  handleComponentError(error: Error, errorInfo: any) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    };

    console.error('Component error:', errorData);

    // Log to external service in production
    if (!__DEV__) {
      // Example: Sentry.captureException(error, { extra: errorData });
    }
  }

  // Handle async operation errors with retry
  async handleAsyncError<T>(
    operation: () => Promise<T>,
    context?: ErrorContext,
    maxRetries: number = 3,
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry on auth errors or client errors
        if (
          (error as any)?.response?.status === 401 ||
          (error as any)?.response?.status === 403 ||
          ((error as any)?.response?.status >= 400 &&
            (error as any)?.response?.status < 500)
        ) {
          break;
        }

        // Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise<void>(resolve => setTimeout(resolve, delay));
      }
    }

    // Handle the final error
    this.handleApiError(lastError, context);
    throw lastError;
  }

  // Validate and handle form errors
  handleFormError(errors: Record<string, string>) {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      this.showError(firstError);
    }
  }

  // Handle validation errors
  handleValidationError(field: string, message: string) {
    this.showError(`${field}: ${message}`);
  }
}

// Create and export singleton instance
export const errorService = new ErrorService();
export default errorService;
