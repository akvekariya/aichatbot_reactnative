import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';
import { SOCKET_CONFIG, SOCKET_EVENTS } from '../constants';
import { RootState } from '../store';
import {
  addMessage,
  setAiThinking,
  setConnectionStatus,
  setMessages,
} from '../store/slices/chatSlice';
import { setError } from '../store/slices/uiSlice';
import {
  Message,
  SocketMessage,
  SocketTyping,
  UseSocketReturn,
} from '../types';

export const useSocket = (): UseSocketReturn => {
  const dispatch = useDispatch();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    socketRef.current = io(SOCKET_CONFIG.URL, {
      ...SOCKET_CONFIG.OPTIONS,
      auth: {
        token: token,
      },
    });

    // Remove any existing listeners to prevent duplicates
    socketRef.current.removeAllListeners();

    // Connection events
    socketRef.current.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('Socket connected:', socketRef.current?.id);
      setIsConnected(true);
      dispatch(setConnectionStatus(true));
    });

    socketRef.current.on(SOCKET_EVENTS.DISCONNECT, reason => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
      dispatch(setConnectionStatus(false));
    });

    socketRef.current.on(SOCKET_EVENTS.ERROR, error => {
      console.error('Socket error:', error);
      dispatch(setError(error.message || 'Socket connection error'));
      setIsConnected(false);
      dispatch(setConnectionStatus(false));
    });

    // Chat events
    socketRef.current.on(SOCKET_EVENTS.MESSAGE, data => {
      console.log('New message received:', {
        messageId: data.message?.messageId,
        sender: data.message?.sender,
        text: data.message?.text?.substring(0, 50) + '...',
        timestamp: data.message?.timestamp,
      });

      // Validate message data before dispatching
      if (data.message && data.message.messageId && data.message.text) {
        dispatch(addMessage(data.message));

        // Stop AI thinking indicator when AI responds
        if (data.message.sender === 'ai') {
          dispatch(setAiThinking(false));
        }
      } else {
        console.warn('Invalid message data received:', data);
      }
    });

    socketRef.current.on(SOCKET_EVENTS.AI_THINKING, data => {
      console.log('AI is thinking:', data);
      dispatch(setAiThinking(true));
    });

    socketRef.current.on(SOCKET_EVENTS.HISTORY, data => {
      console.log('Chat history received:', data);
      dispatch(setMessages(data.messages));
    });

    socketRef.current.on(SOCKET_EVENTS.JOINED_CHAT, data => {
      console.log('Joined chat:', data);
    });

    socketRef.current.on(SOCKET_EVENTS.LEFT_CHAT, data => {
      console.log('Left chat:', data);
    });

    socketRef.current.on(SOCKET_EVENTS.USER_TYPING, data => {
      console.log('User typing:', data);
      // Handle typing indicator for other users if needed
    });
  }, [token, dispatch]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      dispatch(setConnectionStatus(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && token) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, token, connect, disconnect]);

  const joinChat = useCallback((chatId: string) => {
    console.log('🚀 ~ useSocket ~ chatId:', chatId);
    if (socketRef.current?.connected) {
      socketRef.current.emit(SOCKET_EVENTS.JOIN_CHAT, { chatId });
    }
  }, []);

  const leaveChat = useCallback((chatId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(SOCKET_EVENTS.LEAVE_CHAT, { chatId });
    }
  }, []);

  const sendMessage = useCallback(
    (message: SocketMessage) => {
      if (socketRef.current?.connected) {
        // Immediately add user message to the chat
        const userMessage: Message = {
          messageId: `user_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          text: message.text,
          sender: 'user',
          timestamp: new Date().toISOString(),
        };

        // Add user message to Redux store immediately
        dispatch(addMessage(userMessage));

        // Show AI thinking indicator
        dispatch(setAiThinking(true));

        // Send message to server
        socketRef.current.emit(SOCKET_EVENTS.MESSAGE, message);
      }
    },
    [dispatch],
  );

  const sendTyping = useCallback((typing: SocketTyping) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(SOCKET_EVENTS.TYPING, typing);
    }
  }, []);

  const loadHistory = useCallback((chatId: string, limit: number = 50) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(SOCKET_EVENTS.HISTORY, { chatId, limit });
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    connect,
    disconnect,
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    loadHistory,
  };
};
