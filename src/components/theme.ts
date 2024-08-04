import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E3A8A', // Dark Blue
    },
    secondary: {
      main: '#F97316', // Orange
    },
    background: {
      default: '#F3F4F6', // Light Gray
    },
    text: {
      primary: '#1E3A8A', // Dark Blue for text
      secondary: '#4B5563', // Dark Gray for secondary text
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#1E3A8A',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#1E3A8A',
    },
    body1: {
      fontSize: '1rem',
      color: '#4B5563',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded corners
        },
      },
    },
  },
});

export default theme;
