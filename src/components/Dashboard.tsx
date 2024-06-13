// src/components/Dashboard.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'low',
  });

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/');
  };

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
    const task = data.tasks[taskId];
    const updatedTitle = prompt('Edit Title', task.title);
    const updatedDescription = prompt('Edit Description', task.description);
    const updatedDueDate = prompt('Edit Due Date', task.dueDate);
    const updatedPriority = prompt('Edit Priority', task.priority);

    if (updatedTitle && updatedDescription && updatedDueDate && updatedPriority) {
      const updatedTask = {
        ...task,
        title: updatedTitle,
        description: updatedDescription,
        dueDate: updatedDueDate,
        priority: updatedPriority,
      };

      setData((prevData) => ({
        ...prevData,
        tasks: {
          ...prevData.tasks,
          [taskId]: updatedTask,
        },
      }));
    }
  };

  const handleDeleteTask = (taskId: string, columnId: string) => {
    setData((prevData) => {
      const newTasks = { ...prevData.tasks };
      delete newTasks[taskId];

      const newTaskIds = prevData.columns[columnId].taskIds.filter((id) => id !== taskId);

      const newColumn = {
        ...prevData.columns[columnId],
        taskIds: newTaskIds,
      };

      return {
        ...prevData,
        tasks: newTasks,
        columns: {
          ...prevData.columns,
          [columnId]: newColumn,
        },
      };
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });

      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  return (
    <div>
      <div>
        <h3>Criar Tarefa</h3>
        <input
          type="text"
          name="title"
          placeholder="Título"
          value={newTask.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Descrição"
          value={newTask.description}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="dueDate"
          value={newTask.dueDate}
          onChange={handleInputChange}
        />
        <select
          name="priority"
          value={newTask.priority}
          onChange={handleInputChange}
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>
        <button onClick={handleCreateTask}>Criar Tarefa</button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <div key={column.id} className="list">
                <h3>{column.title}</h3>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="task-list"
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="task"
                            >
                              <h4>{task.title}</h4>
                              <p>{task.description}</p>
                              <p>Due: {task.dueDate}</p>
                              <p>Priority: {task.priority}</p>
                              <button onClick={() => handleEditTask(task.id)}>Edit</button>
                              <button onClick={() => handleDeleteTask(task.id, column.id)}>Delete</button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
