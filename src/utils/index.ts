import { APP_CONSTANTS } from '../constants';

export const validateName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Name is required';
  }
  if (name.trim().length > APP_CONSTANTS.VALIDATION.MAX_NAME_LENGTH) {
    return `Name must be less than ${APP_CONSTANTS.VALIDATION.MAX_NAME_LENGTH} characters`;
  }
  return null;
};

export const validateAge = (age: number): string | null => {
  if (!age || age < APP_CONSTANTS.VALIDATION.MIN_AGE) {
    return `Age must be at least ${APP_CONSTANTS.VALIDATION.MIN_AGE} years`;
  }
  if (age > 120) {
    return 'Please enter a valid age';
  }
  return null;
};

export const validateMessage = (message: string): string | null => {
  if (!message || message.trim().length === 0) {
    return 'Message cannot be empty';
  }
  if (message.length > APP_CONSTANTS.VALIDATION.MAX_MESSAGE_LENGTH) {
    return `Message must be less than ${APP_CONSTANTS.VALIDATION.MAX_MESSAGE_LENGTH} characters`;
  }
  return null;
};

// Date and time utilities
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// String utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Error handling utilities
export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  if (error?.message) {
    return error.message;
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: any): boolean => {
  return (
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('Network') ||
    error?.message?.includes('timeout') ||
    !error?.response
  );
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
