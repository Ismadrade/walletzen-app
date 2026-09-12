import { useContext } from "react";
import { ToastContext } from "./ToastContext";

/** `toast.success(mensagem)` mostra o aviso de sucesso no canto superior direito. */
export function useToast() {
  return useContext(ToastContext);
}
