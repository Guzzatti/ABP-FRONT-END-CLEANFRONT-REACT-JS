// src/components/EditModal.tsx
import React from 'react';
import './EditModal.css';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <span className="edit-modal-close" onClick={onClose}>&times;</span>
        <h2>Editar Item</h2>
        <p>Conteúdo do formulário de edição...</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
};

export default EditModal;
