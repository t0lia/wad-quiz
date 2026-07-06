import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { hydroMachine } from './App'
import DebugApp from './DebugApp'
import './debug.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DebugApp hydroMachine={hydroMachine} />
  </StrictMode>,
)
