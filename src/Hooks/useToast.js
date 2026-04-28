import toast from "react-hot-toast";
import { useCallback } from "react";

const DURATION = {
  short:   2000,
  default: 4000,
  long:    6000,
};

const useToast = () => {
  const toastError = useCallback((message, duration = DURATION.default) => {
    if (!message) return;
    toast.error(message, { duration });
  }, []);

  const toastSuccess = useCallback((message, duration = DURATION.default) => {
    if (!message) return;
    toast.success(message, { duration });
  }, []);

  const toastInfo = useCallback((message, duration = DURATION.default) => {
    if (!message) return;
    toast(message, { duration });
  }, []);

  return { toastError, toastSuccess, toastInfo };
};

export default useToast;
