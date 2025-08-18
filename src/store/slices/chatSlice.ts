import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { chatService } from '../../services';
import { Chat, ChatState, Message } from '../../types';

const initialState: ChatState = {
  currentChat: null,
  chatList: [],
  isLoading: false,
  isConnected: false,
  isAiThinking: false,
  isTyping: false,
  error: null,
};

// Async thunks
export const startNewChat = createAsyncThunk(
  'chat/startNewChat',
  async (
    chatData: { topics: string[]; title?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await chatService.startNewChat(chatData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to start chat',
      );
    }
  },
);

export const getChatList = createAsyncThunk(
  'chat/getChatList',
  async (
    params: { limit?: number; search?: string } | undefined,
    { rejectWithValue },
  ) => {
    try {
      const response = await chatService.getChatList(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get chat list',
      );
    }
  },
);

export const getChat = createAsyncThunk(
  'chat/getChat',
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await chatService.getChat(chatId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get chat',
      );
    }
  },
);

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (chatId: string, { rejectWithValue }) => {
    try {
      await chatService.deleteChat(chatId);
      return chatId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete chat',
      );
    }
  },
);

export const updateChatTitle = createAsyncThunk(
  'chat/updateChatTitle',
  async (
    { chatId, title }: { chatId: string; title: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await chatService.updateChatTitle(chatId, title);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update chat title',
      );
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      if (state.currentChat) {
        state.currentChat.messages.push(action.payload);
        state.currentChat.messageCount += 1;
        state.currentChat.lastMessageAt = action.payload.timestamp;
      }
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      if (state.currentChat) {
        state.currentChat.messages = action.payload;
      }
    },
    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setAiThinking: (state, action: PayloadAction<boolean>) => {
      state.isAiThinking = action.payload;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    clearCurrentChat: state => {
      state.currentChat = null;
    },
    clearError: state => {
      state.error = null;
    },
    resetChat: () => initialState,
  },
  extraReducers: builder => {
    // Start new chat
    builder
      .addCase(startNewChat.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startNewChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentChat = action.payload.data;
        // Add to chat list if not already there
        const existingIndex = state.chatList.findIndex(
          chat => chat.id === action.payload.data.id,
        );
        if (existingIndex === -1) {
          state.chatList.unshift(action.payload.data);
        }
      })
      .addCase(startNewChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get chat list
    builder
      .addCase(getChatList.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChatList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chatList = action.payload.data.chats;
      })
      .addCase(getChatList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get specific chat
    builder
      .addCase(getChat.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentChat = action.payload.data;
      })
      .addCase(getChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete chat
    builder
      .addCase(deleteChat.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chatList = state.chatList.filter(
          chat => chat.id !== action.payload,
        );
        if (state.currentChat?.id === action.payload) {
          state.currentChat = null;
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update chat title
    builder.addCase(updateChatTitle.fulfilled, (state, action) => {
      const chatIndex = state.chatList.findIndex(
        chat => chat.id === action.payload.data.id,
      );
      if (chatIndex !== -1) {
        state.chatList[chatIndex] = {
          ...state.chatList[chatIndex],
          ...action.payload.data,
        };
      }
      if (state.currentChat?.id === action.payload.data.id) {
        state.currentChat = { ...state.currentChat, ...action.payload.data };
      }
    });
  },
});

export const {
  setCurrentChat,
  addMessage,
  setMessages,
  setConnectionStatus,
  setAiThinking,
  setTyping,
  clearCurrentChat,
  clearError,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
