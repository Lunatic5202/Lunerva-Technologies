import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/manrope/wght.css'
import '@fontsource-variable/dm-sans/wght.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ErrorBoundary
        fallback={
          <p style={{ padding: '48px 24px', color: '#d7dbde', fontFamily: 'sans-serif' }}>
            Something went wrong loading LUNEVRA Technologies. Please reload the page.
          </p>
        }
      >
        <App />
      </ErrorBoundary>
    </MotionConfig>
  </StrictMode>,
)
