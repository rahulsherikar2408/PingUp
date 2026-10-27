import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from "@clerk/react";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from './context/ThemeContext'
import { WallpaperProvider } from './context/WallpaperContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider>
      <ThemeProvider>
        <WallpaperProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WallpaperProvider>
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>,
)
