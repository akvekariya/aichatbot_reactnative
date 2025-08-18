import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../../types';

const initialState: UIState = {
  isLoading: false,
  theme: 'light',
  activeScreen: '',
  error: null,
  success: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showLoader: state => {
      state.isLoading = true;
    },
    hideLoader: state => {
      state.isLoading = false;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setActiveScreen: (state, action: PayloadAction<string>) => {
      state.activeScreen = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.success = null;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
      state.error = null;
    },
    clearMessages: state => {
      state.error = null;
      state.success = null;
    },
    resetUI: () => initialState,
  },
});

export const {
  showLoader,
  hideLoader,
  setTheme,
  setActiveScreen,
  setError,
  setSuccess,
  clearMessages,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
