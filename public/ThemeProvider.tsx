"use client";

import React from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
