import { useState, useCallback, FC } from 'react';
import { CloseSquare } from '../components/Icons';

interface ModalI {
  isOpen: boolean;
  onClose: () => void;
  children?: JSX.Element;
  content?: JSX.Element;
  forbidClose?: boolean;
}

const Modal: FC<ModalI> = ({ isOpen, children, onClose, content }) => {

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black backdrop-blur-[2px] bg-opacity-100'>
      {content && content}
      {children}
    </div>
  );
};

// Create another function that handles the JSX and set as children ??
export function useTransparentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<JSX.Element | undefined>(undefined);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const RenderModal = ({
    children,
    forbidClose = false,
  }: {
    children?: JSX.Element;
    forbidClose?: boolean;
  }) => (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      content={content}
      forbidClose={forbidClose}
    >
      {children && children}
    </Modal>
  );

  return { openModal, closeModal, RenderModal, setContent };
}
