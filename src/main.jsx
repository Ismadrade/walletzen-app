import { createRoot } from 'react-dom/client'
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR as pickersPtBR } from "@mui/x-date-pickers/locales";
import "dayjs/locale/pt-br";
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "./context/ThemeProvider";
import { AppMuiTheme } from "./theme/AppMuiTheme";
import { AuthProvider } from "./auth/AuthProvider";
import { MeProvider } from "./user/MeProvider";
import { ToastProvider } from "./toast/ToastProvider";

const pickersLocale = pickersPtBR.components.MuiLocalizationProvider.defaultProps.localeText;

createRoot(document.getElementById('root')).render(
  // tema primeiro: os loaders de login/cadastro já saem no visual certo
  <ThemeProvider>
    <AppMuiTheme>
      {/* seletores de data em pt-BR: dd/mm/aaaa, meses e dias da semana em português */}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br" localeText={pickersLocale}>
        <AuthProvider>
          <MeProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </MeProvider>
        </AuthProvider>
      </LocalizationProvider>
    </AppMuiTheme>
  </ThemeProvider>,
)
