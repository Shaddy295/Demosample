// src/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

const commonSettings: ThemeOptions = {
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
};

const lightTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'light',
    primary: {
      main: 'rgb(14, 58, 35)',  // Specific green for light mode
    },
    secondary: {
      main: '#2196f3',  // Blue, unused for now
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
    },
  },
});

const darkTheme = createTheme({
  ...commonSettings,
  palette: {
    mode: 'dark',
    primary: {
      main: '#212529',  // Dark gray for navbar
    },
    secondary: {
      main: '#212529',  // Same dark gray, unused for now
    },
    background: {
      default: '#1e293b', // Slate-900
      paper: '#1e293b',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

export { lightTheme, darkTheme };
