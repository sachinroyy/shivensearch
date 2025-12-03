'use client';

import { createTheme } from '@mui/material/styles';

export const themeConfig = {
  backgroundColor: '#FFFFFF',
  textColor: '#383d35',
  
  primaryColor: '#0CB8B6', // Changed to red as requested
  secondaryColor: '#dc004e',
  fontFamily: 'Poppins',
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: themeConfig.primaryColor,
    },
    secondary: {
      main: themeConfig.secondaryColor,
    },
    background: {
      default: themeConfig.backgroundColor,
      paper: themeConfig.backgroundColor,
    },
    text: {
      primary: themeConfig.textColor,
    },
  },
  typography: {
    fontFamily: themeConfig.fontFamily,
    allVariants: {
      color: themeConfig.textColor,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: themeConfig.backgroundColor,
          color: themeConfig.textColor,
        },
      },
    },
  },
});

export default theme;
