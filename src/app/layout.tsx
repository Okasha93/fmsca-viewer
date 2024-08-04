import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CssBaseline, Container } from '@mui/material';
import ThemeProvider  from "../components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'FMCSA Viewer',
  description: 'View FMCSA records with pagination and filtering',
  keywords: 'FMCSA, Trucking, Records, Next.js, React',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
      <title>FMCSA Viewer</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body className={inter.className}>
    <ThemeProvider>
      <CssBaseline />
      <Container maxWidth="xl" className="pt-5 mt-4">
        {children}
      </Container>
      </ThemeProvider>
    </body>
  </html>
  );
}
