import toast from 'react-hot-toast';
import { useCallback } from 'react';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const DURATION = {
  short: 2000,
  default: 4000,
  long: 6000,
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

  const toastEmpty = useCallback((message, duration = DURATION.default) => {
    if (!message) return;
    toast(message, { duration, icon: <SearchOffIcon /> });
  }, []);

  return { toastError, toastSuccess, toastInfo, toastEmpty };
};

export default useToast;
