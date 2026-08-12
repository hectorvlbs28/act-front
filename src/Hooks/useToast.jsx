import toast from 'react-hot-toast';
import { useCallback } from 'react';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const DURATION = {
  short: 2000,
  default: 4000,
  long: 6000,
};

const POSITION = 'bottom-right';

const useToast = () => {
  const toastError = useCallback((message, duration = DURATION.default) => {
    if (!message) return;
    toast.error(message, { duration, position: POSITION });
  }, []);

  const toastSuccess = useCallback((message, duration = DURATION.default) => {
    if (!message) return;
    toast.success(message, { duration, position: POSITION });
  }, []);

  const toastInfo = useCallback((message, duration = DURATION.default) => {
    if (!message) return;
    toast(message, { duration, position: POSITION });
  }, []);

  const toastEmpty = useCallback((message, duration = DURATION.short) => {
    if (!message) return;
    toast(message, { duration, position: POSITION, icon: <SearchOffIcon /> });
  }, []);

  return { toastError, toastSuccess, toastInfo, toastEmpty };
};

export default useToast;
