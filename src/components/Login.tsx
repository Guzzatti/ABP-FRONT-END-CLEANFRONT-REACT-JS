import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface InitialData {
  tasks: { [key: string]: Task };
  columns: { [key: string]: Column };
  columnOrder: string[];
}

const initialData: InitialData = {
  tasks: {},
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: [],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: [],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState(initialData);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'low' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleCreateTask = () => {
    const id = uuidv4();
    const newTaskObject = {
      id,
      ...newTask,
    };

    setData((prevData) => {
      const newTasks = {
        ...prevData.tasks,
        [id]: newTaskObject,
      };

      const newColumn = {
        ...prevData.columns['column-1'],
        taskIds: [...prevData.columns['column-1'].taskIds, id],
      };

      return {
        ...prevData,
        tasks: newTasks,
        columns: {
          ...prevData.columns,
          ['column-1']: newColumn,
        },
      };
    });

    setNewTask({ title: '', description: '', dueDate: '', priority: 'low' });
  };

  const handleEditTask = (taskId: string) => {
    const task = data.tasks[task
