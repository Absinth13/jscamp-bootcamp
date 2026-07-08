import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'; // <- La importación debe ser de 'react-router'
import App from './App.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
