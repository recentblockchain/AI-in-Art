import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AITextbook from '../AITextbook.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AITextbook />
  </StrictMode>,
)
