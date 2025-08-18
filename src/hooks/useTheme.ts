import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from '../constants/theme';
import { RootState } from '../store';
import { setTheme } from '../store/slices/uiSlice';
import { Theme } from '../types';

export const useTheme = () => {
  const dispatch = useDispatch();
  const systemColorScheme = useColorScheme();
  const themeMode = useSelector((state: RootState) => state.ui.theme);

  // Determine if dark mode should be used
  const isDarkMode =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemColorScheme === 'dark');

  // Get the current theme
  const theme: Theme = getTheme(isDarkMode);

  // Theme switching functions
  const setLightTheme = () => dispatch(setTheme('light'));
  const setDarkTheme = () => dispatch(setTheme('dark'));
  const setSystemTheme = () => dispatch(setTheme('system'));

  return {
    theme,
    isDarkMode,
    themeMode,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    colors: theme.colors,
    typography: theme.typography,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
  };
};
