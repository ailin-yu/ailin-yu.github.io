import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import App from './App'
import { ThemeProvider } from '@/components/portfolio/ThemeProvider'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ThemeProvider><App /></ThemeProvider>
    </MotionConfig>
  </StrictMode>,
)
