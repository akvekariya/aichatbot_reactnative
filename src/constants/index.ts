// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://137.184.186.12:3000',
  ENDPOINTS: {
    AUTH: {
      GOOGLE: '/api/auth/google',
      ME: '/api/auth/me',
      REFRESH: '/api/auth/refresh',
    },
    PROFILE: {
      CREATE: '/api/profile',
      GET: '/api/profile',
      UPDATE: '/api/profile',
      DELETE: '/api/profile',
    },
    CHATS: {
      START: '/api/chats/start',
      LIST: '/api/chats',
      GET: '/api/chats',
      DELETE: '/api/chats',
      UPDATE_TITLE: '/api/chats',
    },
    HEALTH: '/api/health',
  },
};

// Socket.IO Configuration
export const SOCKET_CONFIG = {
  URL: API_CONFIG.BASE_URL,
  OPTIONS: {
    transports: ['websocket'],
    timeout: 20000,
  },
};

// Socket Events
export const SOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',

  // Chat Management
  JOIN_CHAT: 'join_chat',
  LEAVE_CHAT: 'leave_chat',
  JOINED_CHAT: 'joined_chat',
  LEFT_CHAT: 'left_chat',

  // Messaging
  MESSAGE: 'message',
  TYPING: 'typing',
  USER_TYPING: 'user_typing',
  AI_THINKING: 'ai_thinking',

  // History
  HISTORY: 'history',
};

// App Constants
export const APP_CONSTANTS = {
  TOPICS: {
    HEALTH: 'health',
    EDUCATION: 'education',
  },
  MESSAGE_TYPES: {
    USER: 'user',
    AI: 'ai',
  },
  AI_MODELS: {
    GPT4: 'gpt-4',
  },
  VALIDATION: {
    MIN_AGE: 13,
    MAX_NAME_LENGTH: 50,
    MAX_MESSAGE_LENGTH: 5000,
    MAX_CHAT_TITLE_LENGTH: 100,
    MAX_ADDITIONAL_INFO_LENGTH: 500,
  },
};

// Storage Keys
export const STORAGE_KEYS = {
  JWT_TOKEN: 'jwt_token',
  USER_DATA: 'user_data',
  THEME_MODE: 'theme_mode',
  CHAT_HISTORY: 'chat_history',
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Screen Names for Navigation
export const SCREEN_NAMES = {
  AUTH: {
    LOGIN: 'Login',
    PROFILE_SETUP: 'ProfileSetup',
  },
  MAIN: {
    CHAT: 'Chat',
    CHAT_HISTORY: 'ChatHistory',
    PROFILE: 'Profile',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'Network connection failed. Please check your internet connection.',
  AUTH_FAILED: 'Authentication failed. Please try again.',
  INVALID_TOKEN: 'Session expired. Please login again.',
  CHAT_NOT_FOUND: 'Chat not found or access denied.',
  MESSAGE_TOO_LONG:
    'Message is too long. Please keep it under 5000 characters.',
  INVALID_MESSAGE: 'Please enter a valid message.',
  AI_ERROR: 'AI response generation failed. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  AUTH_SUCCESS: 'Successfully logged in!',
  PROFILE_CREATED: 'Profile created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  CHAT_CREATED: 'New chat started!',
  CHAT_DELETED: 'Chat deleted successfully!',
  MESSAGE_SENT: 'Message sent!',
};
