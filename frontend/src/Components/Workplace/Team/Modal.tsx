import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    children: ReactNode;
  }


  const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, children }) => {
    return isOpen ? (
      <div className="team_modal">
        <h1>Team Modal</h1>
        <p onClick={closeModal}>Close</p>
        <div>{children}</div>
      </div>
    ) : null;
  };
  
  export default Modal;