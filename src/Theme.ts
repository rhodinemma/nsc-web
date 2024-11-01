'use client'

import { createTheme } from '@mui/material/styles';

export const PrimaryTheme = createTheme({
  palette: {
    primary: {
      main: '#0A1045',
    },
    secondary: {
      main: '#363636',
    },
    background: {
      paper: "#E9EAEE",
      default: "#E9EAEE",
    },
    action: {
      active: "#590925",

      focus: "#590925",

      selected: "#590925",

    }
  },
  typography: {
    fontFamily: 'Teachers, sans-serif',
    fontSize: 16,
  },

});