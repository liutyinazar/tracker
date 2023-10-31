import React from "react";
import "./Modal.scss";

const Modal = ({ isOpen, closeModal, children }) => {
  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h1>Notifications</h1>
          <p onClick={closeModal}>Close</p>
        </div>
        {children}
      </div>
    </div>
  ) : null;
};

export default Modal;
