// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  additionalInfo?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  profile: Profile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface GoogleAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
    expiresIn: string;
  };
}

// Chat Types
export interface Message {
  messageId: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  aiModel?: string;
}

export interface Chat {
  id: string;
  title: string;
  topics: string[];
  messages: Message[];
  messageCount: number;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
  lastMessage?: {
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
  };
}

export interface ChatState {
  currentChat: Chat | null;
  chatList: Chat[];
  isLoading: boolean;
  isConnected: boolean;
  isAiThinking: boolean;
  isTyping: boolean;
  error: string | null;
}

// UI Types
export interface UIState {
  isLoading: boolean;
  theme: 'light' | 'dark' | 'system';
  activeScreen: string;
  error: string | null;
  success: string | null;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
}

// Form Types
export interface LoginFormData {
  idToken: string;
}

export interface ProfileFormData {
  name: string;
  age: number;
  additionalInfo?: string;
}

export interface ChatFormData {
  topics: string[];
  title?: string;
}

// Socket Types
export interface SocketMessage {
  text: string;
  chatId: string;
}

export interface SocketTyping {
  chatId: string;
  isTyping: boolean;
}

export interface SocketJoinChat {
  chatId: string;
}

export interface SocketError {
  message: string;
  code: string;
}

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
}

export interface ThemeTypography {
  h1: {
    fontSize: number;
    fontWeight:
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900'
      | 'normal'
      | 'bold';
    lineHeight: number;
  };
  h2: {
    fontSize: number;
    fontWeight:
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900'
      | 'normal'
      | 'bold';
    lineHeight: number;
  };
  h3: {
    fontSize: number;
    fontWeight:
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900'
      | 'normal'
      | 'bold';
    lineHeight: number;
  };
  body1: {
    fontSize: number;
    fontWeight:
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900'
      | 'normal'
      | 'bold';
    lineHeight: number;
  };
  body2: {
    fontSize: number;
    fontWeight:
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900'
      | 'normal'
      | 'bold';
    lineHeight: number;
  };
  caption: {
    fontSize: number;
    fontWeight:
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900'
      | 'normal'
      | 'bold';
    lineHeight: number;
  };
}

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// Component Props Types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  library?: 'MaterialIcons' | 'MaterialCommunityIcons';
}

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  error?: string;
  label?: string;
  disabled?: boolean;
}

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  library?: 'MaterialIcons' | 'MaterialCommunityIcons';
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  ProfileSetup: undefined;
  Chat: { chatId?: string };
  ChatHistory: undefined;
  Profile: undefined;
};

// Hook Types
export interface UseSocketReturn {
  socket: any;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (message: SocketMessage) => void;
  sendTyping: (typing: SocketTyping) => void;
  loadHistory: (chatId: string, limit?: number) => void;
}

export interface UseLoaderReturn {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
}
