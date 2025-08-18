import { AxiosResponse } from 'axios';
import { API_CONFIG } from '../constants';
import { ApiResponse, Chat } from '../types';
import { apiService } from './apiService';

class ChatService {
  // Start a new chat session
  async startNewChat(chatData: {
    topics: string[];
    title?: string;
  }): Promise<AxiosResponse<ApiResponse<Chat>>> {
    return apiService.post(API_CONFIG.ENDPOINTS.CHATS.START, chatData);
  }

  // Get list of user's chats
  async getChatList(params?: {
    limit?: number;
    search?: string;
  }): Promise<
    AxiosResponse<
      ApiResponse<{ chats: Chat[]; total: number; hasMore: boolean }>
    >
  > {
    const queryParams = new URLSearchParams();

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const url = `${API_CONFIG.ENDPOINTS.CHATS.LIST}${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;
    return apiService.get(url);
  }

  // Get a specific chat with full message history
  async getChat(chatId: string): Promise<AxiosResponse<ApiResponse<Chat>>> {
    return apiService.get(`${API_CONFIG.ENDPOINTS.CHATS.GET}/${chatId}`);
  }

  // Delete a specific chat
  async deleteChat(
    chatId: string,
  ): Promise<
    AxiosResponse<
      ApiResponse<{ deleted: boolean; chatId: string; timestamp: string }>
    >
  > {
    return apiService.delete(`${API_CONFIG.ENDPOINTS.CHATS.DELETE}/${chatId}`);
  }

  // Update chat title
  async updateChatTitle(
    chatId: string,
    title: string,
  ): Promise<
    AxiosResponse<ApiResponse<{ id: string; title: string; updatedAt: string }>>
  > {
    return apiService.put(
      `${API_CONFIG.ENDPOINTS.CHATS.UPDATE_TITLE}/${chatId}/title`,
      { title },
    );
  }
}

// Create and export a singleton instance
export const chatService = new ChatService();
export default chatService;
