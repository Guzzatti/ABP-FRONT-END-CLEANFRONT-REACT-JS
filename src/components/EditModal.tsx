// src/components/EditModal.tsx
import React from 'react';
import './EditModal.css';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  editedTask: Task | null;
  onEditTask: (editedTask: Task) => void;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, editedTask, onEditTask }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editedTask) return;

    const { name, value } = e.target;
    const updatedTask = { ...editedTask, [name]: value };
    onEditTask(updatedTask);
  };

  if (!isOpen || !editedTask) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <span className="edit-modal-close" onClick={onClose}>&times;</span>
        <h2>Editar Tarefa</h2>
        <form>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleInputChange}
            placeholder="Título"
            required
          />
          <input
            type="text"
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
            placeholder="Descrição"
            required
          />
          <input
            type="date"
            name="dueDate"
            value={editedTask.dueDate}
            onChange={handleInputChange}
            placeholder="Data de Vencimento"
            required
          />
          <select
            name="priority"
            value={editedTask.priority}
            onChange={handleInputChange}
            required
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
          <button type="button" onClick={onClose}>Cancelar</button>
          <button type="submit" onClick={() => onEditTask(editedTask)}>Salvar</button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
