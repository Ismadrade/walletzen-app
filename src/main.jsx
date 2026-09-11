import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "./context/ThemeProvider";
import { AppMuiTheme } from "./theme/AppMuiTheme";
import { AuthProvider } from "./auth/AuthProvider";
import { MeProvider } from "./user/MeProvider";

createRoot(document.getElementById('root')).render(
  // tema primeiro: os loaders de login/cadastro já saem no visual certo
  <ThemeProvider>
    <AppMuiTheme>
      <AuthProvider>
        <MeProvider>
          <App />
        </MeProvider>
      </AuthProvider>
    </AppMuiTheme>
  </ThemeProvider>,
)
