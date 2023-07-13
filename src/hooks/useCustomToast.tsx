import {
  ToastContent,
  ToastOptions,
  TypeOptions,
  toast,
  Id,
} from 'react-toastify';

interface IToast {
  content?: ToastContent<JSX.Element>;
  msg?: string;
  options?: ToastOptions;
}

interface IUpdateToast {
  toastId: Id;
  content: ToastContent;
  type: TypeOptions;
  otherOpts?: ToastOptions;
}

export const useCustomToast = () => {
  const defaultOptions: ToastOptions = {
    position: 'top-center',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    type: 'default',
  };

  const showToast = ({ content, msg = '', options = {} }: IToast) => {
    toast(msg || content, { ...defaultOptions, ...options });
  };

  const showLoadingToast = ({ content, msg = '', options = {} }: IToast) => {
    const toastId = toast.loading(msg || content, {
      ...defaultOptions,
      ...options,
    });
    return toastId;
  };

  const updateToast = ({ toastId, content, type, otherOpts }: IUpdateToast) => {
    toast.update(toastId, {
      autoClose: 2000,
      render: content,
      type,
      isLoading: false,
      ...otherOpts,
    });
  };

  return { showToast, showLoadingToast, updateToast };
};
