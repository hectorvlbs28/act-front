import toast from 'react-hot-toast';
import { useCallback } from 'react';

const useToast = () => {
  const toastError = useCallback((message) => {
    toast.error(message);
  }, []);

  const toastSuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  return { toastError, toastSuccess };
};

export default useToast;
