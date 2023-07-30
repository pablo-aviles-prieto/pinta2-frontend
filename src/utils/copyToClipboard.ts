export const copyToClipboard = async ({
  isCopied,
  setIsCopied,
  roomNumber,
  roomPassword,
}: {
  isCopied: boolean;
  setIsCopied: (value: React.SetStateAction<boolean>) => void;
  roomNumber: number;
  roomPassword: string;
}) => {
  if (isCopied) return;
  try {
    const URL_BASE = import.meta.env.VITE_APP_BASE_URL;
    navigator.clipboard.writeText(
      `${URL_BASE}/room/${roomNumber}?pw=${roomPassword.trim()}`
    );
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  } catch (e) {
    console.error('failed to copy data', e);
  }
};
