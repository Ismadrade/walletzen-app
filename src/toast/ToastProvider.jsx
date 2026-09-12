import { useCallback, useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { CheckCircleOutline } from "@mui/icons-material";

import { ToastContext } from "./ToastContext";

const AUTO_HIDE_MS = 4000;

/**
 * Aviso de sucesso no canto superior direito, em indigo. Um aviso novo substitui o anterior.
 *
 * Erros de propósito não passam por aqui: aparecem dentro do modal ou da tela onde aconteceram,
 * para a pessoa corrigir e tentar de novo sem perder o que digitou — um toast some sozinho
 * e pode passar despercebido.
 */
export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ open: false, key: 0, message: "" });

  const success = useCallback((message) => {
    setToast((current) => ({ open: true, key: current.key + 1, message }));
  }, []);

  const value = useMemo(() => ({ success }), [success]);

  const close = (_event, reason) => {
    if (reason === "clickaway") return;
    setToast((current) => ({ ...current, open: false }));
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        key={toast.key}
        open={toast.open}
        autoHideDuration={AUTO_HIDE_MS}
        onClose={close}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        // abaixo da navbar
        sx={{ top: { xs: 72, sm: 72 } }}
      >
        <Alert
          role="status"
          variant="filled"
          icon={<CheckCircleOutline fontSize="inherit" />}
          onClose={close}
          sx={{
            bgcolor: "primary.main",
            color: "common.white",
            alignItems: "center",
            boxShadow: 6,
            "& .MuiAlert-icon, & .MuiAlert-action": { color: "common.white" },
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}
