import { useState, useCallback, FC } from 'react';

interface ModalI {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element;
}

const Modal: FC<ModalI> = ({ isOpen, children, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-70'>
      <div className='relative w-[600px] bg-white p-5'>
        {children}
        {/* TODO: Change this button to be a X SVG */}
        <button onClick={onClose} className='absolute top-2 right-2'>
          Close
        </button>
      </div>
    </div>
  );
};

// Create another function that handles the JSX and set as children ?
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const RenderModal = ({ children }: { children: JSX.Element }) => (
    <Modal isOpen={isOpen} onClose={closeModal}>
      {children}
    </Modal>
  );

  return { openModal, closeModal, RenderModal };
}
